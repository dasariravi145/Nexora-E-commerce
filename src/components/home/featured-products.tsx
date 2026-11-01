import Link from "next/link";
import { SiteContainer } from "@/components/ui/site-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PremiumButton } from "@/components/ui/premium-button";
import { HardwareVisual } from "@/components/ui/hardware-visual";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { products } from "@/data/products";
import { getProductStartingPrice } from "@/lib/format";
import { ArrowRight, Eye, Tag } from "lucide-react";

export function FeaturedProducts() {
  const featuredList = products.filter((p) => p.featured);

  return (
    <section
      aria-labelledby="featured-products-heading"
      className="py-14 sm:py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]"
    >
      <SiteContainer size="xl" className="space-y-10 sm:space-y-12">
        <ScrollReveal direction="up" distance={20} duration={550}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <SectionHeading
              badge="Curated Hardware"
              badgeVariant="violet"
              title="Featured Electronics"
              description="Precision-engineered flagships currently showcased in our physical and spatial design laboratories."
              id="featured-products-heading"
            />

            <div className="flex flex-wrap items-center gap-3 shrink-0 self-start sm:self-auto">
              <Link
                href="/offers"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAF2FF] border border-[#2563EB]/25 text-xs font-semibold text-[#1D4ED8] hover:bg-blue-100 hover:border-blue-400 transition-colors group shadow-xs"
              >
                <Tag className="h-3.5 w-3.5 text-[#2563EB]" />
                <span>Demo Offers &amp; Tiers</span>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition-colors group"
              >
                <span>View Full Catalogue ({products.length} Units)</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Responsive Product Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredList.map((product, index) => (
            <ScrollReveal
              key={product.id}
              direction="up"
              distance={24}
              duration={600}
              delay={index * 120}
            >
              <Card
                variant="interactive"
                className="p-4 sm:p-5 h-full flex flex-col justify-between space-y-3.5 sm:space-y-4 group hover:-translate-y-1.5 transition-all duration-300 bg-white border border-[#E2E8F0] shadow-xs hover:border-blue-400 hover:shadow-xl active:scale-[0.99]"
              >
                {/* Product Visual with Controlled Image Movement */}
                <div className="relative overflow-hidden rounded-xl">
                  <HardwareVisual
                    categorySlug={product.categorySlug}
                    productSlug={product.slug}
                    size="md"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.highlightBadge && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge
                        variant={product.badgeVariant || "electric"}
                        size="sm"
                      >
                        {product.highlightBadge}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono tracking-wider uppercase text-[#2563EB] font-bold">
                      {product.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      DEMO SPEC
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                    {product.tagline}
                  </p>

                  {/* Micro Specs List */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {product.specs.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] text-slate-700 font-mono"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & Navigation Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 sm:gap-3">
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-slate-500">
                      {getProductStartingPrice(product).hasPriceRange ? "Starting Demo Price" : "Demo Price"}
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-[#0F172A]">
                      {getProductStartingPrice(product).displayPrice}
                    </span>
                  </div>

                  <Link href={`/products/${product.slug}`}>
                    <PremiumButton
                      variant="outline"
                      size="sm"
                      rightIcon={<Eye className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />}
                      className="group-hover:border-blue-500"
                    >
                      View Specs
                    </PremiumButton>
                  </Link>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}
