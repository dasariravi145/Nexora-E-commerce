import type { Metadata } from "next";
import Link from "next/link";
import { SiteContainer } from "@/components/ui/site-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PremiumButton } from "@/components/ui/premium-button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { HardwareVisual } from "@/components/ui/hardware-visual";
import { categories, CATEGORY_THEMES, getCategoryItemCount } from "@/data/categories";
import { products } from "@/data/products";
import { ArrowLeft, ArrowRight, Layers, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCanonicalUrl } from "@/config/seo";
import { JsonLd, generateBreadcrumbSchema } from "@/lib/seo-structured-data";

export const metadata: Metadata = {
  title: "Engineering Divisions & Categories",
  description:
    "Explore NEXORA's 6 precision hardware engineering divisions: Smartphones, Laptops, Audio, Gaming, Wearables, and Accessories.",
  alternates: {
    canonical: getCanonicalUrl("/categories"),
  },
  openGraph: {
    title: "Engineering Divisions & Categories | NEXORA",
    description:
      "Explore NEXORA's 6 precision hardware engineering divisions: Smartphones, Laptops, Audio, Gaming, Wearables, and Accessories.",
    url: getCanonicalUrl("/categories"),
  },
};

export default function CategoriesPage() {
  const totalUnits = products.length;

  return (
    <div className="py-10 sm:py-16 md:py-20">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
        ])}
      />
      <SiteContainer size="xl" className="space-y-10 sm:space-y-12">
        {/* Breadcrumb Navigation & Back Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <Breadcrumbs items={[{ label: "Categories", current: true }]} />

          <Link href="/">
            <PremiumButton variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4 text-[#2563EB]" />} className="bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50">
              Back to Home
            </PremiumButton>
          </Link>
        </div>

        {/* Section Hero Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <SectionHeading
            badge="Catalogue Directory"
            badgeVariant="electric"
            title="NEXORA Hardware Categories"
            description="Six specialized engineering disciplines spanning quantum-dot mobile communicators, dual-touch spatial workstations, planar driver physics, and biometric peripherals."
          />

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#EAF2FF] border border-blue-200 text-xs font-mono self-start lg:self-auto shadow-xs">
            <div className="px-3 py-1 rounded-xl bg-white border border-blue-200 text-[#2563EB] flex items-center gap-1.5 font-bold shadow-xs">
              <Layers className="h-3.5 w-3.5 text-[#2563EB]" />
              <span>6 Categories</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-white border border-blue-200 text-[#475569] shadow-xs">
              <strong className="text-[#0F172A]">{totalUnits}</strong> Verified Specimens
            </div>
          </div>
        </div>

        {/* 6 Category Discovery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => {
            const count = getCategoryItemCount(cat.slug, products);
            const theme = CATEGORY_THEMES[cat.slug] || CATEGORY_THEMES.accessories;
            const flagship = products.find((p) => p.categorySlug.toLowerCase() === cat.slug.toLowerCase());

            return (
              <Card
                key={cat.id}
                variant="solid"
                className="p-5 sm:p-6 flex flex-col justify-between space-y-5 bg-white border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                {/* Visual Canvas Representation */}
                <div className="relative overflow-hidden rounded-xl border border-slate-700/60 bg-[#09152B]">
                  <HardwareVisual
                    categorySlug={cat.slug}
                    size="md"
                    className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${theme.glowColor} 0%, transparent 70%)`,
                    }}
                    aria-hidden="true"
                  />
                </div>

                {/* Content Area */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("text-[11px] font-mono tracking-wider uppercase font-semibold", theme.accentText)}>
                      {cat.tagline}
                    </span>
                    <Badge variant={theme.badgeVariant} size="sm">
                      {count} Units
                    </Badge>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                    {cat.name}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed text-pretty">
                    {cat.description}
                  </p>

                  <div className="pt-2 space-y-1">
                    <span className="text-[11px] font-mono text-[#64748B] block">
                      Discipline: <strong className="text-[#0F172A]">{theme.discipline}</strong>
                    </span>
                    {flagship && (
                      <span className="text-[11px] font-mono text-[#64748B] block truncate">
                        Flagship: <strong className="text-[#2563EB]">{flagship.name}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition-colors group/link focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded px-1 -mx-1"
                  >
                    <span>Explore Category</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1 text-[#2563EB]" />
                  </Link>

                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-xs font-mono text-[#64748B] hover:text-[#0F172A] transition-colors"
                  >
                    Filter {count} Units
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Engineering Certification Assurance Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#EAF2FF] border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-[#0F172A] shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="text-[#475569]">
              All 6 divisions adhere to NEXORA Master Engineering Enclave specs with 3-year warranty and cryo-thermal validation.
            </span>
          </div>

          <Link
            href="/products"
            className="text-[#2563EB] hover:text-blue-700 font-semibold inline-flex items-center gap-1 shrink-0"
          >
            <span>Open Global Catalogue</span>
            <Sparkles className="h-3.5 w-3.5" />
          </Link>
        </div>
      </SiteContainer>
    </div>
  );
}
