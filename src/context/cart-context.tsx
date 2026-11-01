"use client";

import * as React from "react";
import type { Product, ProductVariant } from "@/types";
import type { CartItem, CartContextType, CartState } from "@/types/cart";
import {
  CART_STORAGE_KEY,
  CART_SCHEMA_VERSION,
  validateAndHydrateStorage,
  hydrateCartLines,
  calculateCartTotals,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
} from "@/lib/cart-state";
import { getProductById } from "@/data/products";

const CartContext = React.createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Hydrate cart from localStorage on mount (eliminates SSR hydration mismatches)
  React.useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY);
        if (raw) {
          const validated = validateAndHydrateStorage(raw);
          if (validated.length > 0) {
            setTimeout(() => {
              setItems(validated);
            }, 0);
          }
        }
      }
    } catch {
      // Storage access blocked or unavailable in private browsing
    } finally {
      setTimeout(() => {
        setIsHydrated(true);
      }, 0);
    }
  }, []);

  // Synchronize state changes to localStorage (only after initial hydration)
  React.useEffect(() => {
    if (!isHydrated) return;
    try {
      if (typeof window !== "undefined") {
        const payload: CartState = {
          items,
          version: CART_SCHEMA_VERSION,
        };
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
      }
    } catch {
      // Storage write error handling (e.g. quota exceeded)
    }
  }, [items, isHydrated]);

  // Multi-tab synchronization: listen for external localStorage changes from other tabs
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) {
        if (e.newValue) {
          const validated = validateAndHydrateStorage(e.newValue);
          setItems(validated);
        } else {
          setItems([]);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Derive live hydrated lines and financial totals
  const cartLines = React.useMemo(() => hydrateCartLines(items), [items]);
  const totals = React.useMemo(() => calculateCartTotals(cartLines), [cartLines]);

  const addToCart = React.useCallback(
    (
      product: Product,
      variant?: ProductVariant,
      quantity = 1,
      openDrawer = true
    ): boolean => {
      if (!product || !product.id) return false;

      const canonical = getProductById(product.id);
      if (!canonical) return false;

      if (variant && canonical.variants && !canonical.variants.some((v) => v.id === variant.id)) {
        return false;
      }

      setItems((prev) => addItemToCart(prev, canonical, variant, quantity));
      if (openDrawer) {
        setIsDrawerOpen(true);
      }
      return true;
    },
    []
  );

  const updateQuantity = React.useCallback(
    (productId: string, variantId: string | undefined, quantity: number) => {
      setItems((prev) => updateItemQuantity(prev, productId, variantId, quantity));
    },
    []
  );

  const removeFromCart = React.useCallback((productId: string, variantId?: string) => {
    setItems((prev) => removeItemFromCart(prev, productId, variantId));
  }, []);

  const clearCart = React.useCallback(() => {
    setItems([]);
  }, []);

  const openDrawer = React.useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = React.useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = React.useCallback(() => setIsDrawerOpen((prev) => !prev), []);

  const value = React.useMemo<CartContextType>(
    () => ({
      items,
      cartLines,
      totals,
      isHydrated,
      isDrawerOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    }),
    [
      items,
      cartLines,
      totals,
      isHydrated,
      isDrawerOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useOptionalCart(): CartContextType | null {
  return React.useContext(CartContext);
}

export function useCart(): CartContextType {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
