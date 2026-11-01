import type { Metadata } from "next";
import Link from "next/link";
import { SiteContainer } from "@/components/ui/site-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PremiumButton } from "@/components/ui/premium-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";
import { getAllBrands } from "@/data/brands";
import { ArrowLeft, ArrowRight, ShieldCheck, Tag, Building2, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCanonicalUrl } from "@/config/seo";
import { JsonLd, generateBreadcrumbSchema } from "@/lib/seo-structured-data";

export const metadata: Metadata = {
  title: "Artisan Brands & Partner Laboratories",
  description:
    "Explore precision electronics laboratories and artisan hardware manufacturers collaborating with NEXORA across spatial computing, optics, and acoustic physics.",
  alternates: {
    canonical: getCanonicalUrl("/brands"),
  },
  openGraph: {
    title: "Artisan Brands & Partner Laboratories | NEXORA",
    description:
      "Explore precision electronics laboratories and artisan hardware manufacturers collaborating with NEXORA across spatial computing, optics, and acoustic physics.",
    url: getCanonicalUrl("/brands"),
  },
};

export default function BrandsPage() {
  const brands = getAllBrands(products);

  return (
    <div className="py-10 sm:py-16 md:py-20">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Brands", path: "/brands" },
        ])}
      />
      <SiteContainer size="xl" className="space-y-10 sm:space-y-12">
        {/* Navigation Breadcrumb & Back Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <Breadcrumbs items={[{ label: "Brands", current: true }]} />

          <Link href="/">
            <PremiumButton variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4 text-[#2563EB]" />} className="bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50">
              Back to Home
            </PremiumButton>
          </Link>
        </div>

        {/* Section Heading & Laboratory Metric */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <SectionHeading
            badge="Engineering Ecosystem"
            badgeVariant="violet"
            title="Artisan Hardware Laboratories"
            description="We collaborate exclusively with verified precision engineering laboratories worldwide to synthesize specialized flagships without compromise."
          />

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#EAF2FF] border border-blue-200 text-xs font-mono self-start lg:self-auto shadow-xs">
            <div className="px-3 py-1 rounded-xl bg-white border border-blue-200 text-purple-700 flex items-center gap-1.5 font-bold shadow-xs">
              <Building2 className="h-3.5 w-3.5 text-purple-600" />
              <span>{brands.length} Independent Labs</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-white border border-blue-200 text-[#475569] shadow-xs">
              <strong className="text-[#0F172A]">{products.length}</strong> Total Specimens
            </div>
          </div>
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {brands.map((brand) => (
            <Card
              key={brand.slug}
              variant="solid"
              className="p-6 flex flex-col justify-between space-y-5 bg-white border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="space-y-4 flex-1">
                {/* Header: Monogram Emblem & Item Count */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Typographic Monogram Emblem */}
                    <div
                      className={cn(
                        "h-12 w-12 rounded-xl border flex items-center justify-center font-mono font-black text-lg tracking-wider shadow-inner",
                        brand.accentBorder,
                        "bg-[#09152B] text-white"
                      )}
                    >
                      <span>{brand.insignia}</span>
                    </div>

                    <div>
                      <h2 className="font-extrabold text-[#0F172A] text-lg tracking-wide group-hover:text-[#2563EB] transition-colors">
                        {brand.name}
                      </h2>
                      <span className="text-[11px] font-mono text-[#64748B] flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#94A3B8]" />
                        {brand.origin}
                      </span>
                    </div>
                  </div>

                  <Badge variant="electric" size="sm" dot>
                    {brand.itemCount} Units
                  </Badge>
                </div>

                {/* Tagline & Description */}
                <div className="space-y-2">
                  <p className={cn("text-xs font-mono font-semibold", brand.accentText)}>
                    {brand.tagline}
                  </p>
                  <p className="text-xs text-[#475569] leading-relaxed text-pretty">
                    {brand.description}
                  </p>
                </div>

                {/* Laboratory Specialization Meta */}
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-mono space-y-1">
                  <span className="text-[#64748B] block">Core Architecture:</span>
                  <span className="text-[#0F172A] font-semibold">{brand.focus}</span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3 text-xs">
                <Link
                  href={`/brands/${brand.slug}`}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#2563EB] hover:text-blue-700 transition-colors group/link focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded px-1 -mx-1"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1 text-[#2563EB]" />
                </Link>

                <Link
                  href={`/products?brand=${brand.slug}`}
                  className="font-mono text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1"
                >
                  <Tag className="h-3 w-3" />
                  <span>Filter ({brand.itemCount})</span>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Direct Warranty & Sourcing Disclosure */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#EAF2FF] border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-[#0F172A] shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="text-[#475569]">
              Direct laboratory provenance: each brand partners exclusively under NEXORA Master Calibration standards with verified 3-year warranties.
            </span>
          </div>

          <Link
            href="/about"
            className="text-[#2563EB] hover:text-blue-700 font-semibold inline-flex items-center gap-1 shrink-0"
          >
            <span>Learn About Our Labs</span>
            <Sparkles className="h-3.5 w-3.5" />
          </Link>
        </div>
      </SiteContainer>
    </div>
  );
}
