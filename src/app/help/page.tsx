import * as React from "react";
import type { Metadata } from "next";
import { SiteContainer } from "@/components/ui/site-container";
import { HelpHero } from "@/components/help/help-hero";
import { FAQSearchFilter } from "@/components/help/faq-search-filter";
import { HelpGuidanceSections } from "@/components/help/help-guidance-sections";
import { HelpTransparencyBanner } from "@/components/help/help-transparency-banner";
import { HelpContactCTA } from "@/components/help/help-contact-cta";
import { getCanonicalUrl } from "@/config/seo";
import { JsonLd, generateBreadcrumbSchema } from "@/lib/seo-structured-data";

export const metadata: Metadata = {
  title: "Help Center, FAQ & Customer Guidance",
  description:
    "Verified customer guidance, searchable FAQ knowledge base, and step-by-step feature walkthroughs for the NEXORA electronics storefront.",
  alternates: {
    canonical: getCanonicalUrl("/help"),
  },
  openGraph: {
    title: "Help Center, FAQ & Customer Guidance | NEXORA",
    description:
      "Searchable FAQ knowledge base, 3D viewer tutorials, comparison walkthroughs, and operational disclosures for NEXORA.",
    url: getCanonicalUrl("/help"),
    type: "website",
  },
};

/**
 * HelpPage:
 * Production Next.js server page hosting the complete Help Center,
 * searchable FAQ repository, interactive feature tutorials, and operational disclosures.
 */
export default function HelpPage() {
  return (
    <div className="py-8 sm:py-12 md:py-16">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Help Center", path: "/help" },
        ])}
      />
      <SiteContainer size="xl" className="space-y-12 sm:space-y-16">
        {/* Section A: Help Center Hero */}
        <HelpHero />

        {/* Sections B, C, D: Search, Categories, and Accordion Questions */}
        <React.Suspense
          fallback={
            <div className="p-12 text-center text-sm text-slate-400 animate-pulse">
              Loading Knowledge Base...
            </div>
          }
        >
          <FAQSearchFilter />
        </React.Suspense>

        {/* Sections E, F, G, H: Practical Customer Guidance Tutorials */}
        <HelpGuidanceSections />

        {/* Section 10: Store Transparency & Demonstration Scope */}
        <HelpTransparencyBanner />

        {/* Section I: Contact Support Call-To-Action */}
        <HelpContactCTA />
      </SiteContainer>
    </div>
  );
}
