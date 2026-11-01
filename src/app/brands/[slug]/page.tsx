import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteContainer } from "@/components/ui/site-container";
import { PremiumButton } from "@/components/ui/premium-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { CatalogueExplorer } from "@/components/catalogue/catalogue-explorer";
import { products } from "@/data/products";
import { getAllBrands, getBrandBySlug } from "@/data/brands";
import { ArrowLeft, Grid, ShieldCheck, MapPin, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

import { getCanonicalUrl } from "@/config/seo";
import { JsonLd, generateBreadcrumbSchema } from "@/lib/seo-structured-data";

interface BrandPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const brands = getAllBrands(products);
  return brands.map((brand) => ({
    slug: brand.slug,
  }));
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug, products);

  if (!brand) {
    return {
      title: "Brand Laboratory Not Found | NEXORA",
      description: "The requested artisan hardware laboratory could not be located.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical = getCanonicalUrl(`/brands/${brand.slug}`);

  return {
    title: `${brand.name} Hardware Flagships`,
    description: `${brand.description} Explore precision engineering specimens from ${brand.origin}.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${brand.name} Hardware Flagships | NEXORA`,
      description: `${brand.description} Explore precision engineering specimens from ${brand.origin}.`,
      url: canonical,
    },
  };
}

export default async function BrandDetailPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug, products);

  // Return standard 404 for unknown brand slugs
  if (!brand) {
    notFound();
  }

  return (
    <div className="py-8 sm:py-14 md:py-20 space-y-10 sm:space-y-14">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Brands", path: "/brands" },
          { name: brand.name, path: `/brands/${brand.slug}` },
        ])}
      />
      <SiteContainer size="xl" className="space-y-8 sm:space-y-10">
        {/* Navigation Breadcrumb & Back Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <Breadcrumbs
            items={[
              { label: "Brands", href: "/brands" },
              { label: brand.name, current: true },
            ]}
          />

          <div className="flex items-center gap-3">
            <Link href="/brands">
              <PremiumButton
                variant="outline"
                size="sm"
                leftIcon={<ArrowLeft className="h-4 w-4 text-[#2563EB]" />}
                className="bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50"
              >
                All Brands
              </PremiumButton>
            </Link>

            <Link href={`/products?brand=${brand.slug}`}>
              <PremiumButton
                variant="outline"
                size="sm"
                leftIcon={<Grid className="h-4 w-4 text-[#2563EB]" />}
                className="bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50"
              >
                Global View
              </PremiumButton>
            </Link>
          </div>
        </div>

        {/* Brand Themed Hero Banner */}
        <div
          className={cn(
            "relative rounded-3xl p-6 sm:p-10 border border-blue-200 overflow-hidden shadow-sm bg-[#EAF2FF]"
          )}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: `radial-gradient(ellipse at 85% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 65%)`,
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Brand Laboratory Narrative */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Badge variant="electric" size="sm" dot>
                  Verified Laboratory
                </Badge>
                <span className={cn("text-xs font-mono font-semibold uppercase tracking-wider text-[#2563EB]")}>
                  {brand.tagline}
                </span>
                <Badge variant="outline" size="sm" className="bg-white border-blue-200 text-[#0F172A]">
                  {brand.itemCount} Engineered Units
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
                {brand.name}
              </h1>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl text-pretty">
                {brand.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-[#475569]">
                <span className="flex items-center gap-1.5 text-[#475569]">
                  <MapPin className="h-4 w-4 text-[#64748B]" />
                  <span>Headquarters: <strong className="text-[#0F172A]">{brand.origin}</strong></span>
                </span>
                <span>•</span>
                <span>Core Discipline: <strong className="text-[#0F172A]">{brand.focus}</strong></span>
              </div>
            </div>

            {/* Right: Typographic Insignia HUD Emblem */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-full max-w-xs p-6 rounded-2xl bg-white border border-blue-200 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
                <div
                  className={cn(
                    "h-20 w-20 rounded-2xl border border-slate-700/60 flex items-center justify-center font-mono font-black text-3xl tracking-widest text-white shadow-xs bg-[#09152B]"
                  )}
                >
                  <span>{brand.insignia}</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-sm font-mono tracking-wide">
                    {brand.name}
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-700 flex items-center justify-center gap-1 mt-1 font-semibold">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    Enclave Certified Partner
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Inventory Header */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#2563EB]" />
            <h2 className="text-sm font-mono uppercase tracking-wider text-[#0F172A] font-bold">
              {brand.name} Flagship Inventory
            </h2>
          </div>

          <span className="text-xs font-mono text-[#475569] hidden sm:inline-block">
            Scoped to laboratory: <strong className="text-[#2563EB]">{brand.name}</strong>
          </span>
        </div>

        {/* Reusable Catalogue Search, Filter & Sort Explorer Scoped to This Brand */}
        <React.Suspense
          fallback={
            <div className="p-12 text-center text-xs font-mono text-slate-400 animate-pulse">
              Calibrating {brand.name} discovery telemetry...
            </div>
          }
        >
          <CatalogueExplorer
            initialProducts={products}
            fixedBrand={brand.slug}
            hideBrandFilter
            emptyHeading={`No ${brand.name} Specimens Found`}
            emptySubtext={`No hardware specimens engineered by ${brand.name} matched your active search query, category selection, or price range. Adjust your parameters or reset filters to inspect all ${brand.itemCount} units.`}
          />
        </React.Suspense>
      </SiteContainer>
    </div>
  );
}
