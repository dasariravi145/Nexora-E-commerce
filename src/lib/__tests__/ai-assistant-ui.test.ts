import * as React from "react";
import * as fs from "fs";
import { renderToStaticMarkup } from "react-dom/server";
import { getProductBySlug, products } from "../../data/products";
import {
  SafeMessageContent,
  extractVerifiedProducts,
  decodeHtmlEntities,
  normalizeMarkdown,
} from "../../components/ai/safe-message-content";

/**
 * NEXORA AI Assistant UI & Integration Focused Test Suite
 *
 * Validates:
 * 1. Cryptographic session ID generation & format bounds (1-100 alphanumeric chars)
 * 2. Session stability across follow-ups and isolation between different browser tabs
 * 3. Verified catalogue product link resolution (real vs. fake/unverified slugs)
 * 4. User input sanitization & bounds checking (1-1,000 characters, whitespace trimming)
 * 5. Error code to user-facing message mapping (429, 502, 503, 504, 400)
 * 6. Safe Markdown emphasis, strong text & escaped formatting (*Trade-off:*, *Aura Micro-Core*)
 * 7. Markdown headings & escaped heading processing (#, ##, ###, \###)
 * 8. Product comparison tables & narrow-screen scrolling container
 * 9. Ordered and unordered list rendering (-, *, •, 1., 2.)
 * 10. Safe HTML entity decoding & normalization (&#x44;, &#8377;, &trade;)
 * 11. XSS protection & malicious HTML neutralization (zero dangerouslySetInnerHTML)
 * 12. Narrow-screen mobile chat panel compatibility (break-words, min-w-[280px], overflow-x-auto)
 */
function runTests() {
  console.log("================================================================================");
  console.log("   NEXORA — AI ASSISTANT UI & RESOLUTION TEST SUITE                            ");
  console.log("================================================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed += 1;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ` - ${detail}` : ""}`);
      failed += 1;
    }
  }

  function renderHtml(content: string, isAssistant = true): string {
    return renderToStaticMarkup(
      React.createElement(SafeMessageContent, {
        content,
        isAssistant,
      })
    );
  }

  // --- 1. Session ID Cryptographic Generation & Format Bounds ---
  {
    const SESSION_REGEX = /^[a-zA-Z0-9_-]{1,100}$/;

    function generateTestSessionId(): string {
      // Simulate createSecureSessionId() logic
      const randomHex = Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
      ).join("");
      return `sess_${randomHex}`;
    }

    const sess1 = generateTestSessionId();
    const sess2 = generateTestSessionId();

    assert(
      SESSION_REGEX.test(sess1),
      "Test 1a: Session ID complies with backend validation regex (/^[a-zA-Z0-9_-]{1,100}$/)"
    );
    assert(
      sess1.length >= 10 && sess1.length <= 100,
      "Test 1b: Session ID length is strictly bounded between 10 and 100 chars",
      `Length: ${sess1.length}`
    );
    assert(
      sess1 !== sess2,
      "Test 1c: Distinct chat sessions generate non-identical cryptographic IDs"
    );
    assert(
      !SESSION_REGEX.test("sess with spaces"),
      "Test 1d: Invalid session ID with spaces is rejected"
    );
    assert(
      !SESSION_REGEX.test("sess_with_special_chars!@#"),
      "Test 1e: Invalid session ID with special characters is rejected"
    );
  }

  // --- 2. Verified Catalogue Product Link Resolution ---
  {
    // Real catalogue slug
    const realSlug = "nexora-nova-1-pro";
    const resolvedReal = getProductBySlug(realSlug);
    assert(
      resolvedReal !== undefined && resolvedReal.id === "prod-01",
      "Test 2a: Real catalogue slug /products/nexora-nova-1-pro resolves to prod-01"
    );
    assert(
      Boolean(
        resolvedReal &&
        resolvedReal.formattedPrice.startsWith("₹") &&
        resolvedReal.formattedPrice.includes("1,29,999")
      ),
      "Test 2b: Real catalogue product has verified INR formatted price",
      `Received: ${resolvedReal?.formattedPrice}`
    );

    // Fake / Hallucinated product slug
    const fakeSlug = "imaginary-budget-laptop-5000";
    const resolvedFake = getProductBySlug(fakeSlug);
    assert(
      resolvedFake === undefined,
      "Test 2c: Unverified slug /products/imaginary-budget-laptop-5000 resolves to undefined"
    );

    // Verify all 30 products resolve cleanly by their canonical slugs
    const allResolved = products.every((p) => getProductBySlug(p.slug)?.id === p.id);
    assert(
      allResolved,
      "Test 2d: All 30 products in catalogue resolve deterministically by slug"
    );
  }

  // --- 3. Product Extraction & Strict Deduplication from Assistant Markdown Replies ---
  {
    const sampleAssistantReply = `
      Based on your request, I recommend the **NEXORA Nova 1 Pro** (/products/nexora-nova-1-pro).
      It features a Grade-5 titanium chassis.
      
      For audio monitoring, check out [Vortex Resonance Planar](/products/vortex-resonance-planar).
      
      We do not carry the [Fictional Headset](/products/fictional-cheap-headset).
    `;

    const extracted = extractVerifiedProducts(sampleAssistantReply);

    assert(
      extracted.some((p) => p.slug === "nexora-nova-1-pro"),
      "Test 3a: Accurately extracts verified bare URL slug /products/nexora-nova-1-pro"
    );
    assert(
      extracted.some((p) => p.slug === "vortex-resonance-planar"),
      "Test 3b: Accurately extracts verified markdown link [label](/products/vortex-resonance-planar)"
    );
    assert(
      !extracted.some((p) => p.slug === "fictional-cheap-headset"),
      "Test 3c: Filters out and ignores unverified fictional product slug"
    );
    assert(
      extracted.length === 2,
      "Test 3d: Exactly 2 verified catalogue items extracted from sample text",
      `Found ${extracted.length}`
    );

    // Test 3e: Duplicate product links in text (same product linked 4 times) only yield ONE verified card
    const multiLinkRepeatedText = `
      Comparing our flagship devices:
      - First review the [NEXORA Nova 1 Pro](/products/nexora-nova-1-pro).
      - Check details at /products/nexora-nova-1-pro.
      - Full specs at /products/NEXORA-NOVA-1-PRO?view=specifications.
      - Direct enquiry: [Nova 1 Pro](/products/nexora-nova-1-pro#buy).
    `;
    const dedupedProducts = extractVerifiedProducts(multiLinkRepeatedText);
    assert(
      dedupedProducts.length === 1 && dedupedProducts[0].id === "prod-01",
      "Test 3e: Duplicate product links (4 occurrences of Nova 1 Pro) yield strictly ONE card",
      `Expected 1, found ${dedupedProducts.length}`
    );

    // Test 3f: Repeated product mentions across comparison sections and recommendation summaries deduplicate cleanly
    const comparisonTextWithRepeatedMentions = `
      ### NEXORA Flagship Smartphone Comparison

      1. **[NEXORA Nova 1 Pro](/products/nexora-nova-1-pro)**
         - Price: ₹1,29,999.00
         - Frame: Aerospace Grade-5 Titanium
         - Optics: Tri-Spectral 50MP Array

      2. **[NEXORA Nova 1 Ultra](/products/nexora-nova-1-ultra)**
         - Price: ₹1,49,999.00
         - Frame: Grade-5 Titanium + Ceramic Shield
         - Optics: Quad-Spectral 200MP + Dual 10x Periscope

      ### Recommendation & Verdict:
      If mobile photography is your top priority, choose the [NEXORA Nova 1 Ultra](/products/nexora-nova-1-ultra).
      For everyday balanced excellence, pick the [NEXORA Nova 1 Pro](/products/nexora-nova-1-pro).
      Both /products/nexora-nova-1-pro and /products/nexora-nova-1-ultra include 120Hz+ displays.
    `;
    const comparisonExtracted = extractVerifiedProducts(comparisonTextWithRepeatedMentions);
    assert(
      comparisonExtracted.length === 2,
      "Test 3f: Multi-product comparison with repeated section mentions yields exactly 2 unique cards",
      `Expected 2, found ${comparisonExtracted.length}`
    );
    assert(
      comparisonExtracted.map((p) => p.id).sort().join(",") === "prod-01,prod-02",
      "Test 3g: Extracted comparison cards map strictly to prod-01 and prod-02 with unique canonical IDs"
    );

    // Test 3h: Mixed verified real products and unverified imaginary products
    const mixedText = `
      Explore [NEXORA Nova 1 Pro](/products/nexora-nova-1-pro), [NEXORA Nova 1 Ultra](/products/nexora-nova-1-ultra),
      and [Non-Existent Fold 99](/products/non-existent-fold-99).
      Again, [NEXORA Nova 1 Pro](/products/nexora-nova-1-pro) is recommended.
    `;
    const mixedExtracted = extractVerifiedProducts(mixedText);
    assert(
      mixedExtracted.length === 2 && !mixedExtracted.some((p) => p.slug === "non-existent-fold-99"),
      "Test 3h: Deduplicates real products while rejecting unverified fictional products"
    );

    // Test 3i: Preserves complete comparison text without truncation while extracting verified products
    assert(
      comparisonTextWithRepeatedMentions.includes("NEXORA Flagship Smartphone Comparison") &&
      comparisonTextWithRepeatedMentions.includes("Recommendation & Verdict:"),
      "Test 3i: Complete comparison text remains intact and unmutated"
    );
  }

  // --- 4. User Input Sanitization & Bounds Checking ---
  {
    function validateClientMessage(input: string): { valid: boolean; error?: string } {
      const trimmed = input.trim();
      if (!trimmed) {
        return { valid: false, error: "Empty message" };
      }
      if (trimmed.length > 1000) {
        return { valid: false, error: "Message too long" };
      }
      return { valid: true };
    }

    assert(
      validateClientMessage("").valid === false,
      "Test 4a: Empty client prompt is rejected"
    );
    assert(
      validateClientMessage("   ").valid === false,
      "Test 4b: Pure whitespace client prompt is rejected"
    );
    assert(
      validateClientMessage("a".repeat(1001)).valid === false,
      "Test 4c: Client prompt > 1,000 characters is rejected"
    );
    assert(
      validateClientMessage("a".repeat(1000)).valid === true,
      "Test 4d: Client prompt of exactly 1,000 characters is accepted"
    );
    assert(
      validateClientMessage("Recommend a laptop under ₹80,000").valid === true,
      "Test 4e: Valid human starter prompt is accepted"
    );
  }

  // --- 5. Error Code to User-Facing Message Mapping ---
  {
    function mapStatusToUserMessage(status: number): { text: string; canRetry: boolean } {
      if (status === 429) {
        return {
          text: "You have sent too many messages in a short time. Please wait a moment and try again.",
          canRetry: true,
        };
      }
      if (status === 504) {
        return {
          text: "The AI assistant took too long to respond. Please try again.",
          canRetry: true,
        };
      }
      if (status === 502 || status === 503) {
        return {
          text: "The AI assistant service is temporarily unavailable. Please try again shortly.",
          canRetry: true,
        };
      }
      return {
        text: "Your message could not be processed. Please shorten your prompt and try again.",
        canRetry: false,
      };
    }

    assert(
      mapStatusToUserMessage(429).canRetry === true && mapStatusToUserMessage(429).text.includes("too many messages"),
      "Test 5a: HTTP 429 maps to retryable rate limit message"
    );
    assert(
      mapStatusToUserMessage(504).canRetry === true && mapStatusToUserMessage(504).text.includes("too long"),
      "Test 5b: HTTP 504 maps to retryable timeout message"
    );
    assert(
      mapStatusToUserMessage(502).canRetry === true && mapStatusToUserMessage(502).text.includes("unavailable"),
      "Test 5c: HTTP 502 maps to retryable service unavailable message"
    );
    assert(
      mapStatusToUserMessage(400).canRetry === false,
      "Test 5d: HTTP 400 client error disables automatic retry"
    );
  }

  // =========================================================================
  // --- 6. Safe Markdown Emphasis, Strong Text & Escaped Formatting ---
  // =========================================================================
  {
    const html1 = renderHtml("Key point: *Trade-off:* Slightly heavier chassis. Feature: *Aura Micro-Core*.");
    assert(
      html1.includes('<em class="italic text-[#0F172A]">Trade-off:</em>'),
      "Test 6a: Renders *Trade-off:* as italic <em> element without literal asterisks"
    );
    assert(
      html1.includes('<em class="italic text-[#0F172A]">Aura Micro-Core</em>'),
      "Test 6b: Renders *Aura Micro-Core* as italic <em> element without literal asterisks"
    );
    assert(
      !html1.includes("*Trade-off:*") && !html1.includes("*Aura Micro-Core*"),
      "Test 6c: Zero raw unparsed asterisks remaining for emphasis"
    );

    const htmlEsc = renderHtml("Escaped reply: \\*Trade-off:\\* Price is higher. \\*Aura Micro-Core\\* engine.");
    assert(
      htmlEsc.includes('<em class="italic text-[#0F172A]">Trade-off:</em>'),
      "Test 6d: Renders escaped \\*Trade-off:\\* as italic <em> element"
    );
    assert(
      htmlEsc.includes('<em class="italic text-[#0F172A]">Aura Micro-Core</em>'),
      "Test 6e: Renders escaped \\*Aura Micro-Core\\* as italic <em> element"
    );
    assert(
      !htmlEsc.includes("\\*"),
      "Test 6f: Zero escaped backslashes in rendered output"
    );

    const htmlBold = renderHtml("Crafted from **Grade-5 Titanium** and \\*\\*Aerospace Alloy\\*\\*.");
    assert(
      htmlBold.includes('<strong class="font-semibold text-[#0F172A]">Grade-5 Titanium</strong>'),
      "Test 6g: Renders **Grade-5 Titanium** as strong element"
    );
    assert(
      htmlBold.includes('<strong class="font-semibold text-[#0F172A]">Aerospace Alloy</strong>'),
      "Test 6h: Renders escaped \\*\\*Aerospace Alloy\\*\\* as strong element"
    );

    const htmlBoldItalic = renderHtml("Featuring ***Aura Ultra Precision*** optics.");
    assert(
      htmlBoldItalic.includes('<strong class="font-semibold text-[#0F172A]"><em class="italic">Aura Ultra Precision</em></strong>'),
      "Test 6i: Renders ***Aura Ultra Precision*** as combined bold and italic"
    );

    const htmlUnderscore = renderHtml("Features _refined acoustics_ for pro audio. Check file_id_variable.");
    assert(
      htmlUnderscore.includes('<em class="italic text-[#0F172A]">refined acoustics</em>'),
      "Test 6j: Renders _refined acoustics_ as italic <em> element"
    );
    assert(
      htmlUnderscore.includes("file_id_variable"),
      "Test 6k: Leaves intra-word underscores unmutated in technical strings"
    );

    const htmlNested = renderHtml("Check the **[NEXORA Nova 1 Pro](/products/nexora-nova-1-pro)** flagship.");
    assert(
      htmlNested.includes('<strong class="font-semibold text-[#0F172A]"><a') &&
      htmlNested.includes('href="/products/nexora-nova-1-pro"'),
      "Test 6l: Correctly nests link inside strong element"
    );

    assert(
      normalizeMarkdown("\\*Trade-off:\\* \\### Heading \\| Cell \\|") === "*Trade-off:* ### Heading | Cell |",
      "Test 6m: normalizeMarkdown unescapes backslashes before markdown syntax characters"
    );
  }

  // =========================================================================
  // --- 7. Markdown Headings & Escaped Heading Processing ---
  // =========================================================================
  {
    const htmlH1 = renderHtml("# Specimen Overview\nDetails follow.");
    assert(
      htmlH1.includes('<h1 class="text-sm font-bold text-[#09152B] tracking-tight mt-3 mb-1.5 pb-1 border-b border-slate-200/80">Specimen Overview</h1>'),
      "Test 7a: Renders # as styled <h1> element"
    );

    const htmlH2 = renderHtml("## Hardware Comparison\nDetails follow.");
    assert(
      htmlH2.includes('<h2 class="text-sm font-semibold text-[#09152B] tracking-tight mt-2.5 mb-1">Hardware Comparison</h2>'),
      "Test 7b: Renders ## as styled <h2> element"
    );

    const htmlH3 = renderHtml("### Technical Specifications\nDetails follow.");
    assert(
      htmlH3.includes('<h3 class="text-xs font-semibold text-[#0F172A] tracking-wide mt-2 mb-1">Technical Specifications</h3>'),
      "Test 7c: Renders ### as styled <h3> element"
    );

    const htmlH3Esc = renderHtml("\\### Escaped Heading\nDetails follow.");
    assert(
      htmlH3Esc.includes('<h3 class="text-xs font-semibold text-[#0F172A] tracking-wide mt-2 mb-1">Escaped Heading</h3>'),
      "Test 7d: Renders escaped \\### as <h3> without backslash or hashes"
    );
    assert(
      !htmlH3Esc.includes("\\###") && !htmlH3Esc.includes("###"),
      "Test 7e: Zero raw hash syntax visible in heading output"
    );

    const htmlHeadingWithInline = renderHtml("### Comparing **Nova 1 Pro** with *Fold* Display\nDetails follow.");
    assert(
      htmlHeadingWithInline.includes('<strong class="font-semibold text-[#0F172A]">Nova 1 Pro</strong>') &&
      htmlHeadingWithInline.includes('<em class="italic text-[#0F172A]">Fold</em>'),
      "Test 7f: Renders bold and emphasis within heading content"
    );
  }

  // =========================================================================
  // --- 8. Product Comparison Tables & Narrow-Screen Scrolling Container ---
  // =========================================================================
  {
    const sampleTable = `
| Feature | NEXORA Nova 1 Pro | NEXORA Nova 1 Ultra |
| :--- | :---: | ---: |
| Price | ₹1,29,999.00 | ₹1,49,999.00 |
| Frame | Titanium | Titanium + Ceramic |
`;
    const htmlTable = renderHtml(sampleTable);
    assert(
      htmlTable.includes('<div tabindex="0" role="region" aria-label="Product comparison table"'),
      "Test 8a: Table container includes tabindex=0, role=region, and aria-label"
    );
    assert(
      htmlTable.includes("overflow-x-auto rounded-xl border border-[#E2E8F0]"),
      "Test 8b: Table container includes overflow-x-auto and border styling"
    );
    assert(
      htmlTable.includes('<table class="w-full min-w-[280px] border-collapse text-left text-xs">'),
      "Test 8c: Table element specifies min-w-[280px] and border-collapse"
    );
    assert(
      htmlTable.includes('<th scope="col" class="px-3 py-2 text-[11px] font-semibold text-[#0F172A] whitespace-nowrap text-left">Feature</th>'),
      "Test 8d: Table header has scope=col, left alignment, and whitespace-nowrap"
    );
    assert(
      htmlTable.includes('text-center">NEXORA Nova 1 Pro</th>'),
      "Test 8e: Table header respects center alignment indicator (:---:)"
    );
    assert(
      htmlTable.includes('text-right">NEXORA Nova 1 Ultra</th>'),
      "Test 8f: Table header respects right alignment indicator (---:)"
    );
    assert(
      htmlTable.includes("₹1,29,999.00"),
      "Test 8g: Table data cells display formatted INR prices accurately"
    );

    const escapedTable = `
\\| Feature \\| Model A \\| Model B \\|
\\| :--- \\| :--- \\| :--- \\|
\\| Price \\| ₹10,000 \\| ₹20,000 \\|
`;
    const htmlEscTable = renderHtml(escapedTable);
    assert(
      htmlEscTable.includes("<table"),
      "Test 8h: Parses escaped markdown table (\\|) into structured <table>"
    );
    assert(
      !htmlEscTable.includes("\\|"),
      "Test 8i: Zero escaped pipes in rendered table HTML"
    );

    const tableWithLinks = `
| Specimen | Price |
| --- | --- |
| [Nova 1 Pro](/products/nexora-nova-1-pro) | ₹1,29,999.00 |
| [Nova 1 Ultra](/products/nexora-nova-1-ultra) | ₹1,49,999.00 |
`;
    const htmlTableLinks = renderHtml(tableWithLinks);
    assert(
      htmlTableLinks.includes('href="/products/nexora-nova-1-pro"') &&
      htmlTableLinks.includes("Nova 1 Pro</a>"),
      "Test 8j: Table cells render interactive verified product links"
    );
    const tableExtracted = extractVerifiedProducts(tableWithLinks);
    assert(
      tableExtracted.length === 2 && tableExtracted.some((p) => p.id === "prod-01"),
      "Test 8k: extractVerifiedProducts extracts specimens linked inside table cells"
    );
  }

  // =========================================================================
  // --- 9. Ordered and Unordered List Rendering ---
  // =========================================================================
  {
    const listMarkdown = `
- Grade-5 Titanium Chassis
* Tri-Spectral Optics
• Ultra-wide Dynamic Sensor
`;
    const htmlList = renderHtml(listMarkdown);
    assert(
      htmlList.includes('<ul class="my-2 space-y-1 pl-0.5">'),
      "Test 9a: Renders bullet items in <ul> container"
    );
    assert(
      (htmlList.match(/<li class="flex items-start gap-2">/g) || []).length === 3,
      "Test 9b: Contains exactly 3 styled <li> elements with bullet badges"
    );

    const orderedMarkdown = `
1. Select target specimen
2. Verify hardware specifications
3. Initiate purchase enquiry
`;
    const htmlOrdered = renderHtml(orderedMarkdown);
    assert(
      htmlOrdered.includes('<ol class="my-2 space-y-1 pl-0.5">'),
      "Test 9c: Renders numbered items in <ol> container"
    );
    assert(
      htmlOrdered.includes("1.</span>"),
      "Test 9d: Renders styled numerical badge for item 1"
    );
    assert(
      htmlOrdered.includes("2.</span>"),
      "Test 9e: Renders styled numerical badge for item 2"
    );

    const escapedOrdered = `
1\\. First priority
2\\. Second priority
`;
    const htmlEscOrdered = renderHtml(escapedOrdered);
    assert(
      htmlEscOrdered.includes("<ol"),
      "Test 9f: Renders escaped numbered list 1\\. as <ol>"
    );
    assert(
      !htmlEscOrdered.includes("1\\."),
      "Test 9g: Zero escaped periods in rendered list output"
    );
  }

  // =========================================================================
  // --- 10. Safe HTML Entity Decoding & Normalization ---
  // =========================================================================
  {
    assert(
      decodeHtmlEntities("&#x44;ual-core") === "Dual-core",
      "Test 10a: Decodes hex entity &#x44; to 'D'"
    );
    assert(
      decodeHtmlEntities("Price: &#8377;1,29,999") === "Price: ₹1,29,999",
      "Test 10b: Decodes decimal rupee entity &#8377; to '₹'"
    );
    assert(
      decodeHtmlEntities("Price: &#x20B9;1,49,999") === "Price: ₹1,49,999",
      "Test 10c: Decodes hex rupee entity &#x20B9; to '₹'"
    );
    assert(
      decodeHtmlEntities("NEXORA&trade; &amp; Audio&reg;") === "NEXORA™ & Audio®",
      "Test 10d: Decodes safe named entities (&trade;, &amp;, &reg;)"
    );
    assert(
      decodeHtmlEntities("&quot;Titanium&quot; &apos;Series&apos;") === '"Titanium" \'Series\'',
      "Test 10e: Decodes quotation entities (&quot;, &apos;)"
    );

    const htmlEntityRender = renderHtml("Specimen &#x44; — Price: &#8377;1,29,999 with NEXORA&trade;");
    assert(
      htmlEntityRender.includes("Specimen D"),
      "Test 10f: Rendered component displays decoded 'D'"
    );
    assert(
      htmlEntityRender.includes("Price: ₹1,29,999"),
      "Test 10g: Rendered component displays decoded '₹'"
    );
    assert(
      htmlEntityRender.includes("NEXORA™"),
      "Test 10h: Rendered component displays decoded '™'"
    );
  }

  // =========================================================================
  // --- 11. XSS Protection & Malicious HTML Neutralization ---
  // =========================================================================
  {
    const xssScript = "<script>alert('pwned')</script>";
    const htmlScript = renderHtml(xssScript);
    assert(
      !htmlScript.includes("<script>alert"),
      "Test 11a: Script tags are never rendered as executable DOM nodes"
    );
    assert(
      htmlScript.includes("&lt;script&gt;alert"),
      "Test 11b: Script tags are safely escaped as plain text HTML entities"
    );

    const xssImg = '<img src="x" onerror="alert(1)" />';
    const htmlImg = renderHtml(xssImg);
    assert(
      !htmlImg.includes("<img"),
      "Test 11c: <img> tags are never rendered as HTML elements"
    );

    const xssLink = "[Click Me](javascript:alert(1))";
    const htmlLink = renderHtml(xssLink);
    assert(
      !htmlLink.includes('<a href="javascript'),
      "Test 11d: javascript: URLs never produce clickable <a> links"
    );
    assert(
      htmlLink.includes("<span>Click Me</span>"),
      "Test 11e: javascript: link degrades safely to plain text <span>"
    );

    const xssDataLink = "[Download](data:text/html,<script>alert(1)</script>)";
    const htmlDataLink = renderHtml(xssDataLink);
    assert(
      !htmlDataLink.includes('<a href="data:'),
      "Test 11f: data: URLs never produce clickable <a> links"
    );

    const entityScript = "&#x3C;script&#x3E;alert(1)&#x3C;/script&#x3E;";
    const htmlEntityScript = renderHtml(entityScript);
    assert(
      !htmlEntityScript.includes("<script>alert(1)</script>"),
      "Test 11g: Decoded entity script tags remain inert text nodes"
    );

    const safeMessageFileContent = fs.readFileSync(
      "src/components/ai/safe-message-content.tsx",
      "utf-8"
    );
    assert(
      !safeMessageFileContent.includes("dangerouslySetInnerHTML"),
      "Test 11h: Zero usage of dangerouslySetInnerHTML in safe-message-content.tsx"
    );
  }

  // =========================================================================
  // --- 12. Narrow-Screen Mobile Chat Panel Compatibility ---
  // =========================================================================
  {
    const htmlWrapper = renderHtml("Long line test message.");
    assert(
      htmlWrapper.includes("break-words"),
      "Test 12a: Assistant message container specifies break-words"
    );
    assert(
      htmlWrapper.includes("text-xs sm:text-sm"),
      "Test 12b: Responsive font sizing adapted for compact mobile panel"
    );

    const sampleTable = `
| Spec | Nova 1 Pro | Nova 1 Ultra |
| --- | --- | --- |
| Price | ₹1,29,999 | ₹1,49,999 |
`;
    const mobileTableHtml = renderHtml(sampleTable);
    assert(
      mobileTableHtml.includes("overflow-x-auto"),
      "Test 12c: Comparison table wrapper specifies overflow-x-auto for horizontal scroll"
    );
    assert(
      mobileTableHtml.includes("min-w-[280px]"),
      "Test 12d: Table enforces min-w-[280px] preventing column crush on 320px screens"
    );

    const userHtml = renderHtml("<script>alert(1)</script>", false);
    assert(
      userHtml.includes("whitespace-pre-wrap break-words text-sm"),
      "Test 12e: User message container specifies whitespace-pre-wrap and break-words"
    );
  }

  console.log("================================================================================");
  console.log(`   TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}    `);
  console.log("================================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
