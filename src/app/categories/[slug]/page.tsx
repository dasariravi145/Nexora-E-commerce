import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteContainer } from "@/components/ui/site-container";
import { PremiumButton } from "@/components/ui/premium-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { HardwareVisual } from "@/components/ui/hardware-visual";
import { CatalogueExplorer } from "@/components/catalogue/catalogue-explorer";
import { categories, CATEGORY_THEMES, getCategoryBySlug, getCategoryItemCount } from "@/data/categories";
import { products } from "@/data/products";
import { ArrowLeft, Grid, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

import { getCanonicalUrl } from "@/config/seo";
import { JsonLd, generateBreadcrumbSchema } from "@/lib/seo-structured-data";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found | NEXORA",
      description: "The requested hardware engineering division could not be located.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const theme = CATEGORY_THEMES[category.slug] || CATEGORY_THEMES.accessories;
  const canonical = getCanonicalUrl(`/categories/${category.slug}`);

  return {
    title: `${category.name} Hardware Division`,
    description: `${category.description} Explore ${category.name} flagships featuring ${theme.discipline}.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${category.name} Hardware Division | NEXORA`,
      description: `${category.description} Explore ${category.name} flagships featuring ${theme.discipline}.`,
      url: canonical,
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  // Return standard 404 for unknown categories
  if (!category) {
    notFound();
  }

  const theme = CATEGORY_THEMES[category.slug] || CATEGORY_THEMES.accessories;
  const itemCount = getCategoryItemCount(category.slug, products);

  return (
    <div className="py-8 sm:py-14 md:py-20 space-y-10 sm:space-y-14">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          { name: category.name, path: `/categories/${category.slug}` },
        ])}
      />
      <SiteContainer size="xl" className="space-y-8 sm:space-y-10">
        {/* Navigation Breadcrumbs & Back Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <Breadcrumbs
            items={[
              { label: "Categories", href: "/categories" },
              { label: category.name, current: true },
            ]}
          />

          <div className="flex items-center gap-3">
            <Link href="/categories">
              <PremiumButton
                variant="outline"
                size="sm"
                leftIcon={<ArrowLeft className="h-4 w-4 text-[#2563EB]" />}
                className="bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50"
              >
                All Categories
              </PremiumButton>
            </Link>

            <Link href={`/products?category=${category.slug}`}>
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

        {/* Division Themed Hero Banner */}
        <div
          className={cn(
            "relative rounded-3xl p-6 sm:p-10 border border-blue-200 overflow-hidden shadow-sm bg-[#EAF2FF]"
          )}
        >
          {/* Subtle Division Radial Gradient */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: `radial-gradient(ellipse at 85% 20%, ${theme.glowColor} 0%, transparent 65%)`,
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Division Narrative */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Badge variant={theme.badgeVariant} size="sm" dot>
                  {category.name} Division
                </Badge>
                <span className={cn("text-xs font-mono font-semibold uppercase tracking-wider text-[#2563EB]")}>
                  {category.tagline}
                </span>
                <Badge variant="outline" size="sm" className="bg-white border-blue-200 text-[#0F172A]">
                  {itemCount} Engineered Specimens
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
                {category.name} Hardware Science
              </h1>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl text-pretty">
                {category.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-[#475569]">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verified Enclave Calibration</span>
                </span>
                <span>•</span>
                <span>Specialization: <strong className="text-[#0F172A]">{theme.discipline}</strong></span>
              </div>
            </div>

            {/* Right: Category Architectural Visual Artwork */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-full max-w-xs p-3 rounded-2xl bg-[#09152B] border border-slate-700/60 shadow-md">
                <HardwareVisual
                  categorySlug={category.slug}
                  size="md"
                  className="w-full border-none bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Division Filtering & Parametric Exploration Subheading */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#2563EB]" />
            <h2 className="text-sm font-mono uppercase tracking-wider text-[#0F172A] font-bold">
              {category.name} Specimen Inventory
            </h2>
          </div>

          <span className="text-xs font-mono text-[#475569] hidden sm:inline-block">
            Scoped to division: <strong className="text-[#2563EB]">{category.name}</strong>
          </span>
        </div>

        {/* Reusable Catalogue Search, Filter & Sort Explorer Scoped to This Division */}
        <React.Suspense
          fallback={
            <div className="p-12 text-center text-xs font-mono text-slate-400 animate-pulse">
              Calibrating {category.name} discovery telemetry...
            </div>
          }
        >
          <CatalogueExplorer
            initialProducts={products}
            fixedCategory={category.slug}
            hideCategoryFilter
            emptyHeading={`No ${category.name} Units Found`}
            emptySubtext={`No hardware specimens in the ${category.name} division matched your active search query, brand toggles, or price range. Adjust your parameters or reset filters to inspect all ${itemCount} units.`}
          />
        </React.Suspense>
      </SiteContainer>
    </div>
  );
}
