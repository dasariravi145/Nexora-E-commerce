import type { Product, ProductVariant } from "@/types";
import type { CartItem, CartState, HydratedCartLine, CartTotals } from "@/types/cart";
import { getProductById } from "@/data/products";
import { formatINR } from "@/lib/format";

export const CART_STORAGE_KEY = "nexora_cart_state_v1";
export const CART_SCHEMA_VERSION = 1;
export const MIN_CART_ITEM_QUANTITY = 1;
export const MAX_CART_ITEM_QUANTITY = 10;

/**
 * Generates a deterministic compound key for unique product + variant combinations.
 */
export function getCartLineKey(productId: string, variantId?: string): string {
  const cleanVariant = (variantId || "").trim();
  return cleanVariant ? `${productId}::${cleanVariant}` : productId;
}

/**
 * Sanitizes and bounds numeric quantity inputs.
 * Strictly prevents NaN, floating point values, zero, negative numbers, and runaway overflow.
 */
export function sanitizeQuantity(quantity: unknown): number {
  if (typeof quantity !== "number" || Number.isNaN(quantity) || !Number.isFinite(quantity)) {
    return MIN_CART_ITEM_QUANTITY;
  }
  const integer = Math.floor(quantity);
  if (integer < MIN_CART_ITEM_QUANTITY) {
    return MIN_CART_ITEM_QUANTITY;
  }
  if (integer > MAX_CART_ITEM_QUANTITY) {
    return MAX_CART_ITEM_QUANTITY;
  }
  return integer;
}

/**
 * Evaluates untrusted serialized JSON from localStorage against the centralized catalogue.
 * Rejects malformed structures, removes unknown products/variants, and clamps quantities.
 */
export function validateAndHydrateStorage(rawJson: string | null): CartItem[] {
  if (!rawJson || typeof rawJson !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(rawJson);
    let candidateItems: unknown[] = [];

    if (Array.isArray(parsed)) {
      candidateItems = parsed;
    } else if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray((parsed as CartState).items)
    ) {
      candidateItems = (parsed as CartState).items;
    } else {
      return [];
    }

    const validatedItems: CartItem[] = [];

    for (const raw of candidateItems) {
      if (!raw || typeof raw !== "object") continue;
      const item = raw as Partial<CartItem>;

      if (typeof item.productId !== "string" || !item.productId.trim()) {
        continue;
      }

      const product = getProductById(item.productId.trim());
      if (!product) {
        // Unknown or retired product - discard
        continue;
      }

      let validVariantId: string | undefined = undefined;
      if (item.variantId && typeof item.variantId === "string" && item.variantId.trim()) {
        const cleanVarId = item.variantId.trim();
        const hasVariant = product.variants?.some((v) => v.id === cleanVarId);
        if (hasVariant) {
          validVariantId = cleanVarId;
        } else {
          // If product specifies variants but the stored variant ID is nonexistent, discard invalid configuration
          continue;
        }
      }

      const safeQuantity = sanitizeQuantity(item.quantity);

      // Check if this line already exists in our validated accumulator to prevent duplicate lines
      const existingIndex = validatedItems.findIndex(
        (v) =>
          v.productId === product.id &&
          (v.variantId || undefined) === (validVariantId || undefined)
      );

      if (existingIndex >= 0) {
        validatedItems[existingIndex].quantity = sanitizeQuantity(
          validatedItems[existingIndex].quantity + safeQuantity
        );
      } else {
        validatedItems.push({
          productId: product.id,
          variantId: validVariantId,
          quantity: safeQuantity,
        });
      }
    }

    return validatedItems;
  } catch {
    // Corrupted JSON or parsing failure - fail-safe to empty cart
    return [];
  }
}

/**
 * Resolves live product and variant details from the centralized catalogue for each cart item.
 * Recalculates unit prices and line subtotals dynamically to avoid stale or manipulated price states.
 */
export function hydrateCartLines(items: CartItem[]): HydratedCartLine[] {
  if (!Array.isArray(items)) return [];
  const lines: HydratedCartLine[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object" || !item.productId) continue;
    const product = getProductById(item.productId);
    if (!product) continue;

    let variant: ProductVariant | undefined = undefined;
    if (item.variantId && product.variants) {
      variant = product.variants.find((v) => v.id === item.variantId);
    }

    const priceDelta = variant?.demoPriceDelta ?? 0;
    const unitPrice = product.demoPrice + priceDelta;
    const safeUnitPrice = !Number.isNaN(unitPrice) && unitPrice > 0 ? unitPrice : product.demoPrice;
    const safeQuantity = sanitizeQuantity(item.quantity);
    const lineSubtotal = safeUnitPrice * safeQuantity;

    lines.push({
      item: {
        ...item,
        quantity: safeQuantity,
      },
      product,
      variant,
      unitPrice: safeUnitPrice,
      lineSubtotal,
      formattedUnitPrice: formatINR(safeUnitPrice),
      formattedLineSubtotal: formatINR(lineSubtotal),
    });
  }

  return lines;
}

/**
 * Computes aggregated cart totals from hydrated lines.
 */
export function calculateCartTotals(lines: HydratedCartLine[]): CartTotals {
  const itemCount = lines.reduce((acc, line) => acc + line.item.quantity, 0);
  const lineCount = lines.length;
  const subtotal = lines.reduce((acc, line) => acc + line.lineSubtotal, 0);

  return {
    itemCount,
    lineCount,
    subtotal,
    formattedSubtotal: formatINR(subtotal),
  };
}

/**
 * Pure state reducer adding an item to the cart.
 * If the exact product and variant combination already exists, increments its quantity.
 * Different variants of the same product are preserved as distinct lines.
 */
export function addItemToCart(
  items: CartItem[],
  product: Product,
  variant?: ProductVariant,
  quantity = 1
): CartItem[] {
  if (!product || !product.id) return items;

  const validVariantId = variant?.id;
  const safeAddQty = sanitizeQuantity(quantity);

  const existingIndex = items.findIndex(
    (item) =>
      item.productId === product.id &&
      (item.variantId || undefined) === (validVariantId || undefined)
  );

  if (existingIndex >= 0) {
    return items.map((item, idx) => {
      if (idx === existingIndex) {
        return {
          ...item,
          quantity: sanitizeQuantity(item.quantity + safeAddQty),
        };
      }
      return item;
    });
  }

  return [
    ...items,
    {
      productId: product.id,
      variantId: validVariantId,
      quantity: safeAddQty,
    },
  ];
}

/**
 * Pure state reducer updating quantity of a line item.
 * If target quantity is <= 0, the item is removed.
 */
export function updateItemQuantity(
  items: CartItem[],
  productId: string,
  variantId: string | undefined,
  quantity: number
): CartItem[] {
  if (quantity <= 0) {
    return removeItemFromCart(items, productId, variantId);
  }

  const safeQty = sanitizeQuantity(quantity);

  return items.map((item) => {
    if (
      item.productId === productId &&
      (item.variantId || undefined) === (variantId || undefined)
    ) {
      return {
        ...item,
        quantity: safeQty,
      };
    }
    return item;
  });
}

/**
 * Pure state reducer removing an item from the cart.
 */
export function removeItemFromCart(
  items: CartItem[],
  productId: string,
  variantId?: string
): CartItem[] {
  return items.filter(
    (item) =>
      !(
        item.productId === productId &&
        (item.variantId || undefined) === (variantId || undefined)
      )
  );
}
