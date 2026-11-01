import type { Product, ProductVariant } from "./product";

/**
 * Primitive, serializable representation of an item in the cart.
 * Only stores minimal references to prevent data duplication and stale state.
 */
export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

/**
 * Persisted cart state schema.
 */
export interface CartState {
  items: CartItem[];
  version: number;
}

/**
 * Hydrated line item containing resolved references from the centralized catalogue.
 * Evaluated on the fly to guarantee prices, variants, and product metadata remain fresh.
 */
export interface HydratedCartLine {
  item: CartItem;
  product: Product;
  variant?: ProductVariant;
  unitPrice: number;
  lineSubtotal: number;
  formattedUnitPrice: string;
  formattedLineSubtotal: string;
}

/**
 * Aggregated cart metrics and demo financial figures.
 */
export interface CartTotals {
  itemCount: number;      // Total quantity of products across all lines
  lineCount: number;      // Number of unique lines (product + variant combinations)
  subtotal: number;       // Integer subtotal in INR (minor/base units)
  formattedSubtotal: string;
}

/**
 * Public API of the Cart Context.
 */
export interface CartContextType {
  items: CartItem[];
  cartLines: HydratedCartLine[];
  totals: CartTotals;
  isHydrated: boolean;
  isDrawerOpen: boolean;
  addToCart: (
    product: Product,
    variant?: ProductVariant,
    quantity?: number,
    openDrawer?: boolean
  ) => boolean;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}
