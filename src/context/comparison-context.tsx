"use client";

import * as React from "react";
import type { Product } from "@/types";
import { getProductById } from "@/data/products";
import {
  MAX_COMPARISON_PRODUCTS,
  MIN_COMPARISON_PRODUCTS,
  validateComparisonAddition,
} from "@/lib/product-comparison";

const STORAGE_KEY = "nexora_comparison_product_ids_v1";

export interface ComparisonContextType {
  items: Product[];
  count: number;
  canCompare: boolean;
  activeCategorySlug: string | null;
  activeCategoryName: string | null;
  incompatibilityNotice: string | null;
  isCompared: (productId: string) => boolean;
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
  dismissNotice: () => void;
}

const ComparisonContext = React.createContext<ComparisonContextType | null>(null);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<Product[]>([]);
  const [incompatibilityNotice, setIncompatibilityNotice] = React.useState<string | null>(null);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Auto-dismiss notice timer ref
  const noticeTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const showNotice = React.useCallback((message: string) => {
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
    }
    setIncompatibilityNotice(message);
    noticeTimerRef.current = setTimeout(() => {
      setIncompatibilityNotice(null);
    }, 6000);
  }, []);

  const dismissNotice = React.useCallback(() => {
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
    }
    setIncompatibilityNotice(null);
  }, []);

  // Hydrate safely from storage after mount (guarantees zero SSR hydration mismatch)
  React.useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsedIds = JSON.parse(raw);
          if (Array.isArray(parsedIds)) {
            const validProducts: Product[] = [];
            for (const id of parsedIds) {
              if (typeof id === "string") {
                const p = getProductById(id);
                if (p) {
                  // Ensure category consistency
                  if (validProducts.length === 0 || validProducts[0].categorySlug === p.categorySlug) {
                    if (validProducts.length < MAX_COMPARISON_PRODUCTS && !validProducts.some((x) => x.id === p.id)) {
                      validProducts.push(p);
                    }
                  }
                }
              }
            }
            if (validProducts.length > 0) {
              setTimeout(() => {
                setItems(validProducts);
              }, 0);
            }
          }
        }
      }
    } catch {
      // Storage unavailable or disabled
    } finally {
      setTimeout(() => {
        setIsHydrated(true);
      }, 0);
    }
  }, []);

  // Sync to localStorage whenever items change (only after initial hydration)
  React.useEffect(() => {
    if (!isHydrated) return;
    try {
      if (typeof window !== "undefined") {
        const ids = items.map((p) => p.id);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      }
    } catch {
      // Storage write error handling
    }
  }, [items, isHydrated]);

  const isCompared = React.useCallback(
    (productId: string) => items.some((p) => p.id === productId),
    [items]
  );

  const addToCompare = React.useCallback(
    (product: Product): boolean => {
      const validation = validateComparisonAddition(items, product);
      if (!validation.allowed) {
        if (validation.reason) {
          showNotice(validation.reason);
        }
        return false;
      }

      setItems((prev) => [...prev, product]);
      dismissNotice();
      return true;
    },
    [items, showNotice, dismissNotice]
  );

  const removeFromCompare = React.useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const toggleCompare = React.useCallback(
    (product: Product) => {
      if (isCompared(product.id)) {
        removeFromCompare(product.id);
      } else {
        addToCompare(product);
      }
    },
    [isCompared, removeFromCompare, addToCompare]
  );

  const clearCompare = React.useCallback(() => {
    setItems([]);
    dismissNotice();
  }, [dismissNotice]);

  const activeCategorySlug = items.length > 0 ? items[0].categorySlug : null;
  const activeCategoryName = items.length > 0 ? items[0].category : null;
  const canCompare = items.length >= MIN_COMPARISON_PRODUCTS;

  const value = React.useMemo<ComparisonContextType>(
    () => ({
      items,
      count: items.length,
      canCompare,
      activeCategorySlug,
      activeCategoryName,
      incompatibilityNotice,
      isCompared,
      addToCompare,
      removeFromCompare,
      toggleCompare,
      clearCompare,
      dismissNotice,
    }),
    [
      items,
      canCompare,
      activeCategorySlug,
      activeCategoryName,
      incompatibilityNotice,
      isCompared,
      addToCompare,
      removeFromCompare,
      toggleCompare,
      clearCompare,
      dismissNotice,
    ]
  );

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison(): ComparisonContextType {
  const context = React.useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
