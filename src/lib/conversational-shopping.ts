/**
 * NEXORA AI Concierge — Conversational Voice Shopping Agent Logic
 *
 * Implements:
 * 1. Conversation turn product extraction from assistant messages.
 * 2. Cross-turn contextual reference resolution (e.g. "first one", "second one", "that phone").
 * 3. Ambiguity detection and customer clarification prompts.
 * 4. Voice shopping intent categorization (Cart opening, Add to Bag preparation, Comparisons, Price inquiries).
 * 5. Strict cart safety: Voice commands prepare Add to Bag for explicit UI confirmation; model text never directly mutates cart.
 * 6. Zero product data fabrication: All products, variants, and prices are resolved strictly from canonical catalogue.
 */

import type { Product, ProductVariant } from "@/types";
import { products, getProductBySlug } from "@/data/products";
import { normalizeMarkdown } from "@/components/ai/safe-message-content";
import type { ChatMessage } from "@/components/ai/chat-message-item";
import { formatINR } from "@/lib/format";
import type { SpeechLanguage } from "@/lib/speech-utils";

export type ProductReferenceStatus = "RESOLVED" | "AMBIGUOUS" | "NOT_FOUND" | "NONE";

export interface ProductReferenceResult {
  status: ProductReferenceStatus;
  product?: Product;
  candidates?: Product[];
  index?: number;
  reason?: string;
}

export type VoiceShoppingIntentType =
  | "OPEN_CART"
  | "ADD_TO_BAG_PREPARE"
  | "AMBIGUOUS_ADD_TO_BAG"
  | "COMPARE_PRODUCTS"
  | "PRICE_INQUIRY"
  | "DETAIL_INQUIRY"
  | "VARIANT_INQUIRY"
  | "GENERAL_CHAT";

export interface VoiceShoppingIntent {
  type: VoiceShoppingIntentType;
  rawText: string;
  targetProduct?: Product;
  targetVariant?: ProductVariant;
  targetQuantity?: number;
  comparisonProducts?: Product[];
  ambiguousCandidates?: Product[];
  clarificationPrompt?: string;
  localResponseText?: string;
  enrichedQuery?: string;
}

/**
 * Extracts verified catalogue products referenced across the current conversation history.
 * Scans assistant messages, extracting products in order of appearance, deduplicated by product.id.
 */
export function extractConversationProducts(
  messages: (ChatMessage | { sender?: string; role?: string; text?: string; content?: string; isError?: boolean })[]
): Product[] {
  if (!messages || messages.length === 0) return [];

  const verifiedMap = new Map<string, Product>();

  // Iterate messages to maintain chronological discovery order
  for (const msg of messages) {
    const sender = (msg as { sender?: string }).sender || (msg as { role?: string }).role;
    if (sender !== "assistant" || msg.isError) continue;

    const rawText = (msg as { text?: string }).text || (msg as { content?: string }).content || "";
    const normalizedText = normalizeMarkdown(rawText);

    // 1. Extract from markdown product links: /products/[slug]
    const slugRegex = /(?:https?:\/\/[^\s/]+)?\/products\/([a-zA-Z0-9_-]+)/gi;
    let match: RegExpExecArray | null;

    while ((match = slugRegex.exec(normalizedText)) !== null) {
      const rawSlug = match[1];
      if (!rawSlug) continue;
      const normalizedSlug = rawSlug.toLowerCase().trim();
      const product =
        getProductBySlug(normalizedSlug) ||
        products.find((p) => p.slug.toLowerCase() === normalizedSlug);

      if (product && !verifiedMap.has(product.id)) {
        verifiedMap.set(product.id, product);
      }
    }

    // 2. Extract from exact product title mentions if link wasn't generated
    for (const p of products) {
      if (!verifiedMap.has(p.id)) {
        const regex = new RegExp(`\\b${p.name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
        if (regex.test(normalizedText)) {
          verifiedMap.set(p.id, p);
        }
      }
    }
  }

  return Array.from(verifiedMap.values());
}

/**
 * Resolves natural language references (e.g. "first one", "second phone", "that laptop")
 * against the verified products in the active conversation context.
 */
export function resolveProductReference(
  query: string,
  contextProducts: Product[]
): ProductReferenceResult {
  if (!query || query.trim().length === 0) {
    return { status: "NONE" };
  }

  const cleanQuery = query.toLowerCase().trim();

  // 1. Check for Ordinals (English & Telugu)
  let ordinalIndex: number | null = null;

  const numOrdinalMatch = cleanQuery.match(/\b([1-9]|10)(?:st|nd|rd|th)\b/i);
  if (numOrdinalMatch) {
    ordinalIndex = parseInt(numOrdinalMatch[1], 10) - 1;
  } else if (
    /\b(first|first\s*one|first\s*product|number\s*one|number\s*1)\b/i.test(cleanQuery) ||
    /(\u0C2E\u0C4A\u0C26\u0C1F\u0C3F|\u0C12\u0C15\u0C1F\u0C35)/i.test(cleanQuery) // మొదటి, ఒకటవ
  ) {
    ordinalIndex = 0;
  } else if (
    /\b(second|second\s*one|second\s*product|number\s*two|number\s*2)\b/i.test(cleanQuery) ||
    /(\u0C30\u0C46\u0C02\u0C21\u0C35)/i.test(cleanQuery) // రెండవ
  ) {
    ordinalIndex = 1;
  } else if (
    /\b(third|third\s*one|third\s*product|number\s*three|number\s*3)\b/i.test(cleanQuery) ||
    /(\u0C2E\u0C42\u0C21\u0C35)/i.test(cleanQuery) // మూడవ
  ) {
    ordinalIndex = 2;
  } else if (
    /\b(fourth|fourth\s*one|fourth\s*product|number\s*four|number\s*4)\b/i.test(cleanQuery) ||
    /(\u0C28\u0C3E\u0C32\u0C4D\u0C17\u0C35)/i.test(cleanQuery) // నాల్గవ
  ) {
    ordinalIndex = 3;
  } else if (
    /\b(fifth|fifth\s*one|fifth\s*product|number\s*five|number\s*5)\b/i.test(cleanQuery) ||
    /(\u0C10\u0C26\u0C35)/i.test(cleanQuery) // ఐదవ
  ) {
    ordinalIndex = 4;
  } else if (
    /\b(last|last\s*one|last\s*product)\b/i.test(cleanQuery) ||
    /(\u0C1A\u0C3F\u0C35\u0C30\u0C3F\u0C26\u0C3F)/i.test(cleanQuery) // చివరిది
  ) {
    if (contextProducts.length > 0) {
      ordinalIndex = contextProducts.length - 1;
    }
  }

  if (ordinalIndex !== null) {
    if (contextProducts[ordinalIndex]) {
      return {
        status: "RESOLVED",
        product: contextProducts[ordinalIndex],
        index: ordinalIndex,
      };
    }
    return {
      status: "NOT_FOUND",
      reason: `Ordinal index ${ordinalIndex + 1} requested, but only ${contextProducts.length} products discussed.`,
    };
  }

  // 2. Direct Name Match against active conversation context
  for (const product of contextProducts) {
    const nameMatch = cleanQuery.includes(product.name.toLowerCase());
    const slugMatch = cleanQuery.includes(product.slug.replace(/-/g, " "));
    if (nameMatch || slugMatch) {
      return {
        status: "RESOLVED",
        product,
      };
    }
  }

  // 3. Category / Generic Noun Reference matching (e.g. "the phone", "the headphones", "the laptop")
  const categoryKeywords: Record<string, string> = {
    phone: "smartphones",
    smartphone: "smartphones",
    "ఫోన్": "smartphones",
    laptop: "laptops",
    notebook: "laptops",
    "ల్యాప్‌టాప్": "laptops",
    audio: "audio",
    headphone: "audio",
    headphones: "audio",
    earphone: "audio",
    earphones: "audio",
    earbuds: "audio",
    soundbar: "audio",
    "హెడ్‌ఫోన్స్": "audio",
    wearable: "wearables",
    watch: "wearables",
    smartwatch: "wearables",
    "వాచ్": "wearables",
  };

  for (const [kw, cat] of Object.entries(categoryKeywords)) {
    const isMatched = /[\u0C00-\u0C7F]/.test(kw)
      ? cleanQuery.includes(kw)
      : new RegExp(`\\b${kw}s?\\b`, "i").test(cleanQuery);

    if (isMatched) {
      const matching = contextProducts.filter(
        (p) =>
          p.category.toLowerCase() === cat.toLowerCase() ||
          p.categorySlug.toLowerCase() === cat.toLowerCase()
      );
      if (matching.length === 1) {
        return {
          status: "RESOLVED",
          product: matching[0],
        };
      } else if (matching.length > 1) {
        return {
          status: "AMBIGUOUS",
          candidates: matching,
          reason: `Multiple ${cat} (${matching.length}) in conversation context.`,
        };
      }
    }
  }

  // 4. Demonstrative / Singular relative pronoun ("that one", "this one", "the product")
  if (/\b(that\s*one|this\s*one|the\s*product|the\s*device)\b/i.test(cleanQuery)) {
    if (contextProducts.length === 1) {
      return {
        status: "RESOLVED",
        product: contextProducts[0],
      };
    } else if (contextProducts.length > 1) {
      return {
        status: "AMBIGUOUS",
        candidates: contextProducts,
        reason: "Multiple products in context; ambiguous demonstrative reference.",
      };
    }
  }

  // 5. Fallback: Direct Name Match against canonical catalogue if mentioning a new product
  for (const product of products) {
    const nameMatch = cleanQuery.includes(product.name.toLowerCase());
    const slugMatch = cleanQuery.includes(product.slug.replace(/-/g, " "));
    if (nameMatch || slugMatch) {
      return {
        status: "RESOLVED",
        product,
      };
    }
  }

  return { status: "NONE" };
}

/**
 * Extracts matching product variant from query text if specified (e.g. "Titanium Blue", "1TB", "Matte Black").
 */
export function extractVariant(query: string, product: Product): ProductVariant | undefined {
  if (!product.variants || product.variants.length === 0) return undefined;

  const clean = query.toLowerCase();

  // 1. Check matching canonical variants
  for (const v of product.variants) {
    if (
      clean.includes(v.name.toLowerCase()) ||
      (v.colorName && clean.includes(v.colorName.toLowerCase())) ||
      (v.storage && clean.includes(v.storage.toLowerCase())) ||
      (v.configuration && clean.includes(v.configuration.toLowerCase()))
    ) {
      return v;
    }
  }

  // 2. Check if customer explicitly requested a color/edition not in catalogue
  if (/\b(in|color|colour|edition|finish|shade)\s+([a-zA-Z0-9_-]+)/i.test(clean)) {
    return undefined; // Rejected: invalid/unrecognized variant requested
  }

  // 3. Default to first variant if none was explicitly requested
  return product.variants[0];
}

/**
 * Extracts desired item quantity from natural voice commands (e.g. "two units", "3 of them", "1").
 * Clamped between 1 and 10. Default is 1.
 */
export function extractQuantity(query: string): number {
  const clean = query.toLowerCase();

  const wordsToNumbers: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    ఒకటి: 1,
    రెండు: 2,
    మూడు: 3,
  };

  for (const [word, num] of Object.entries(wordsToNumbers)) {
    const rx = new RegExp(`\\b${word}\\b`, "i");
    if (rx.test(clean)) {
      return num;
    }
  }

  const numMatch = clean.match(/\b([1-9]|10)\s*(?:units?|pieces?|items?|copies?)?\b/);
  if (numMatch) {
    const val = parseInt(numMatch[1], 10);
    if (!isNaN(val) && val >= 1 && val <= 10) {
      return val;
    }
  }

  return 1;
}

/**
 * Parses user voice text into structured shopping intents.
 * Distinguishes local storefront actions (Cart Drawer, Add-To-Bag staging) from AI advisory queries.
 */
export function parseVoiceShoppingIntent(
  text: string,
  contextProducts: Product[],
  language: SpeechLanguage = "en-IN"
): VoiceShoppingIntent {
  const cleanText = text.trim();
  const lower = cleanText.toLowerCase();

  // 1. OPEN CART INTENT
  // Checks for requests to inspect the shopping bag / cart
  const openCartKeywords = [
    "show my bag",
    "open my bag",
    "open the bag",
    "view my bag",
    "view bag",
    "open cart",
    "show cart",
    "show my cart",
    "view cart",
    "check my cart",
    "go to bag",
    "go to cart",
    "నా బ్యాగ్ చూపించు",
    "కార్ట్ చూపించు",
    "కార్ట్ తెరవండి",
  ];

  if (openCartKeywords.some((phrase) => lower.includes(phrase))) {
    const localResponse =
      language === "te-IN"
        ? "మీ షాపింగ్ బ్యాగ్‌ని తెరుస్తున్నాను. మీరు వస్తువులను సమీక్షించవచ్చు."
        : "Opening your shopping bag. You can review your items, adjust quantities, or close the bag when you're ready.";

    return {
      type: "OPEN_CART",
      rawText: cleanText,
      localResponseText: localResponse,
    };
  }

  // 2. ADD TO BAG PREPARATION INTENT
  // Checks for requests to add an item to the cart
  const isAddRequest =
    /\b(add|put|place|stage)\b/i.test(lower) &&
    /\b(bag|cart|basket)\b/i.test(lower);

  const isTeluguAdd =
    lower.includes("జోడించు") || lower.includes("కార్ట్‌కి") || lower.includes("బ్యాగ్‌కి");

  if (isAddRequest || isTeluguAdd) {
    const refResult = resolveProductReference(cleanText, contextProducts);

    if (refResult.status === "AMBIGUOUS" && refResult.candidates) {
      const candidateNames = refResult.candidates
        .map((c, i) => `${i === 0 ? "first" : "second"} [${c.name}](/products/${c.slug})`)
        .join(" and the ");

      const clarification =
        language === "te-IN"
          ? `మీరు ఏ ఉత్పత్తిని జోడించాలనుకుంటున్నారు? దయచేసి మొదటి లేదా రెండవ ఉత్పత్తిని పేర్కొనండి.`
          : `Which product would you like to add? We discussed the ${candidateNames}. Please say the first or second product.`;

      return {
        type: "AMBIGUOUS_ADD_TO_BAG",
        rawText: cleanText,
        ambiguousCandidates: refResult.candidates,
        clarificationPrompt: clarification,
        localResponseText: clarification,
      };
    }

    if (refResult.status === "RESOLVED" && refResult.product) {
      const targetProduct = refResult.product;
      const targetVariant = extractVariant(cleanText, targetProduct);
      const targetQuantity = extractQuantity(cleanText);

      const price = targetProduct.demoPrice + (targetVariant?.demoPriceDelta || 0);
      const formattedPrice = formatINR(price);

      const localResponse =
        language === "te-IN"
          ? `నేను [${targetProduct.name}](/products/${targetProduct.slug}) ను మీ బ్యాగ్ కోసం సిద్ధం చేసాను (${formattedPrice}). దయచేసి క్రింద ఉన్న నిర్ధారణ బటన్‌ను క్లిక్ చేయండి.`
          : `I've prepared the [${targetProduct.name}](/products/${targetProduct.slug}) for your bag with the verified price of ${formattedPrice}. Please confirm the addition on the card below.`;

      return {
        type: "ADD_TO_BAG_PREPARE",
        rawText: cleanText,
        targetProduct,
        targetVariant,
        targetQuantity,
        localResponseText: localResponse,
      };
    }

    // Add requested, but no valid reference found
    const fallbackClarify =
      language === "te-IN"
        ? "మీరు ఏ వస్తువును బ్యాగ్‌కి జోడించాలనుకుంటున్నారు? దయచేసి ఉత్పత్తి పేరును లేదా మొదటి లేదా రెండవ ఉత్పత్తిని చెప్పండి."
        : "Which product would you like to add? Please specify the product name or say the first or second product.";

    return {
      type: "AMBIGUOUS_ADD_TO_BAG",
      rawText: cleanText,
      clarificationPrompt: fallbackClarify,
      localResponseText: fallbackClarify,
    };
  }

  // 3. COMPARISON INTENT
  // Checks for comparison requests across context products (e.g. "compare the first and second products")
  if (
    /\b(compare|comparison|difference|differences|versus|vs)\b/i.test(lower) &&
    (/\b(first|second|1st|2nd|both|two)\b/i.test(lower) || contextProducts.length >= 2)
  ) {
    if (contextProducts.length >= 2) {
      const p1 = contextProducts[0];
      const p2 = contextProducts[1];
      const enriched = `Compare the [${p1.name}](/products/${p1.slug}) and the [${p2.name}](/products/${p2.slug}) side by side with technical specifications and verified prices.`;

      return {
        type: "COMPARE_PRODUCTS",
        rawText: cleanText,
        comparisonProducts: [p1, p2],
        enrichedQuery: enriched,
      };
    }
  }

  // 4. PRICE / CHEAPER INQUIRY INTENT
  // Checks for questions comparing prices (e.g. "which one is cheaper?")
  if (
    /\b(cheaper|cheapest|least\s*expensive|costs\s*less|price\s*difference|affordab)\b/i.test(lower) ||
    lower.includes("తక్కువ ధర") ||
    lower.includes("ఏది చవక")
  ) {
    if (contextProducts.length >= 2) {
      const sorted = [...contextProducts].sort((a, b) => a.demoPrice - b.demoPrice);
      const cheapest = sorted[0];
      const other = sorted[1];
      const diff = other.demoPrice - cheapest.demoPrice;

      const localResponse =
        language === "te-IN"
          ? `[${cheapest.name}](/products/${cheapest.slug}) తక్కువ ధర వద్ద లభిస్తుంది (${formatINR(cheapest.demoPrice)}). ఇది [${other.name}](/products/${other.slug}) కంటే ${formatINR(diff)} తక్కువ.`
          : `The [${cheapest.name}](/products/${cheapest.slug}) is more affordable at ${formatINR(cheapest.demoPrice)}, which is ${formatINR(diff)} less than the [${other.name}](/products/${other.slug}) at ${formatINR(other.demoPrice)}.`;

      return {
        type: "PRICE_INQUIRY",
        rawText: cleanText,
        targetProduct: cheapest,
        localResponseText: localResponse,
      };
    }
  }

  // 5. DETAIL INQUIRY INTENT
  // Checks for requests like "tell me more about the second one"
  if (
    /\b(tell\s*me\s*more|more\s*details|specifications|specs|battery|camera|display)\b/i.test(lower)
  ) {
    const ref = resolveProductReference(cleanText, contextProducts);
    if (ref.status === "RESOLVED" && ref.product) {
      const enriched = `Tell me more about the specifications, display, and features of the [${ref.product.name}](/products/${ref.product.slug}).`;
      return {
        type: "DETAIL_INQUIRY",
        rawText: cleanText,
        targetProduct: ref.product,
        enrichedQuery: enriched,
      };
    }
  }

  // 6. VARIANT / COLOR INQUIRY INTENT
  // Checks for requests like "do you have another colour?"
  if (
    /\b(another\s*colou?r|other\s*colou?rs|available\s*colou?rs|variants|finishes|storage\s*options)\b/i.test(lower) ||
    lower.includes("రంగులు")
  ) {
    const ref = resolveProductReference(cleanText, contextProducts);
    const target = ref.product || contextProducts[0];

    if (target && target.variants && target.variants.length > 0) {
      const variantList = target.variants
        .map((v) => `${v.name} (${formatINR(target.demoPrice + (v.demoPriceDelta || 0))})`)
        .join(", ");

      const localResponse =
        language === "te-IN"
          ? `[${target.name}](/products/${target.slug}) ${target.variants.length} వేరియంట్లలో అందుబాటులో ఉంది: ${variantList}.`
          : `The [${target.name}](/products/${target.slug}) is available in ${target.variants.length} verified variants: ${variantList}.`;

      return {
        type: "VARIANT_INQUIRY",
        rawText: cleanText,
        targetProduct: target,
        localResponseText: localResponse,
      };
    }
  }

  // 7. GENERAL CHAT / FALLTHROUGH
  // Check if any ordinal reference in the text can be resolved to enrich the prompt for Gemini
  const ref = resolveProductReference(cleanText, contextProducts);
  let enrichedQuery = cleanText;

  if (ref.status === "RESOLVED" && ref.product) {
    // Replace ordinals with exact product name and verified link for unambiguous Gemini comprehension
    enrichedQuery = cleanText.replace(
      /\b(first\s*one|second\s*one|third\s*one|the\s*first\s*product|the\s*second\s*product|that\s*one)\b/gi,
      `[${ref.product.name}](/products/${ref.product.slug})`
    );
  }

  return {
    type: "GENERAL_CHAT",
    rawText: cleanText,
    enrichedQuery: enrichedQuery !== cleanText ? enrichedQuery : undefined,
  };
}
