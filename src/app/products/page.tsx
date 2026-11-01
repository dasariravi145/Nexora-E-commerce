import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteContainer } from "@/components/ui/site-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PremiumButton } from "@/components/ui/premium-button";
import { CatalogueExplorer } from "@/components/catalogue/catalogue-explorer";
import { products } from "@/data/products";
import { ArrowLeft } from "lucide-react";
import { getCanonicalUrl } from "@/config/seo";
import { JsonLd, generateBreadcrumbSchema } from "@/lib/seo-structured-data";

export const metadata: Metadata = {
  title: "Hardware Catalogue & Search",
  description:
    "Explore, filter, and discover NEXORA's 30 precision spatial computing, acoustic, and personal hardware flagships with real-time parametric discovery.",
  alternates: {
    canonical: getCanonicalUrl("/products"),
  },
  openGraph: {
    title: "Hardware Catalogue & Search | NEXORA",
    description:
      "Explore, filter, and discover NEXORA's 30 precision spatial computing, acoustic, and personal hardware flagships with real-time parametric discovery.",
    url: getCanonicalUrl("/products"),
  },
};

export default function ProductsPage() {
  return (
    <div className="py-12 sm:py-20">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
        ])}
      />
      <SiteContainer size="xl" className="space-y-8 sm:space-y-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SectionHeading
            badge="Hardware Discovery"
            badgeVariant="electric"
            title="NEXORA Hardware Catalogue"
            description="Explore our complete line of 30 precision spatial headsets, planar acoustic monitors, and cryogenic workstations with multi-dimensional filtering and search."
          />
          <Link href="/">
            <PremiumButton
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Home
            </PremiumButton>
          </Link>
        </div>

        {/* Interactive Catalogue Discovery Engine wrapped in Suspense for Next.js App Router */}
        <React.Suspense
          fallback={
            <div className="p-12 text-center text-xs font-mono text-slate-400 animate-pulse">
              Initializing catalogue discovery engine...
            </div>
          }
        >
          <CatalogueExplorer initialProducts={products} />
        </React.Suspense>
      </SiteContainer>
    </div>
  );
}
