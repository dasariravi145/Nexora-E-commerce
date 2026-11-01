import * as React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ui/product-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { getRelatedProducts } from "@/data/products";
import type { Product } from "@/types";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RelatedProductsProps {
  currentProduct: Product;
  className?: string;
}

/**
 * RelatedProducts: Deterministic recommendation grid from the centralized catalogue.
 * - Strictly excludes current product.
 * - Prioritizes units within the same engineering division.
 * - Zero AI or non-deterministic algorithms.
 * - Reuses verified ProductCard components.
 */
export function RelatedProducts({
  currentProduct,
  className,
}: RelatedProductsProps) {
  const related = getRelatedProducts(currentProduct, 4);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className={cn("space-y-6 pt-6 border-t border-[#E2E8F0]", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#2563EB]" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
              Related Hardware Specimens
            </h2>
          </div>
          <p className="text-xs text-[#475569]">
            Precision engineering units complementing the {currentProduct.name} within {currentProduct.category}.
          </p>
        </div>

        <Link href={`/categories/${currentProduct.categorySlug}`}>
          <PremiumButton
            variant="outline"
            size="sm"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50"
          >
            All {currentProduct.category}
          </PremiumButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {related.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  );
}
