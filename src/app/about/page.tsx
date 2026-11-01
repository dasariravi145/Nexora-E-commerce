import type { Metadata } from "next";
import { SiteContainer } from "@/components/ui/site-container";
import { siteConfig } from "@/config/site";
import { AboutHero } from "@/components/about/about-hero";
import { AboutBrandConcept } from "@/components/about/about-brand-concept";
import { AboutPhilosophy } from "@/components/about/about-philosophy";
import { AboutCoreValues } from "@/components/about/about-core-values";
import { AboutExperiencePrinciples } from "@/components/about/about-experience-principles";
import { AboutTechShowcase } from "@/components/about/about-tech-showcase";
import { AboutFutureVision } from "@/components/about/about-future-vision";
import { AboutTrustSection } from "@/components/about/about-trust-section";
import { AboutCTASection } from "@/components/about/about-cta-section";
import { getCanonicalUrl } from "@/config/seo";
import { JsonLd, generateBreadcrumbSchema } from "@/lib/seo-structured-data";

export const metadata: Metadata = {
  title: "Brand Story, Engineering Philosophy & Spatial Vision",
  description:
    "Explore the engineering philosophy, acoustic mastery, spatial computing architecture, and transparent demonstration principles behind NEXORA's luxury electronics storefront.",
  alternates: {
    canonical: getCanonicalUrl("/about"),
  },
  openGraph: {
    title: "About NEXORA | Brand Story, Engineering Philosophy & Spatial Vision",
    description:
      "Explore the engineering philosophy, acoustic mastery, spatial computing architecture, and transparent demonstration principles behind NEXORA's luxury electronics storefront.",
    url: getCanonicalUrl("/about"),
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "NEXORA Brand Story & Engineering Vision",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About NEXORA | Brand Story, Engineering Philosophy & Spatial Vision",
    description:
      "Explore the engineering philosophy, acoustic mastery, spatial computing architecture, and transparent demonstration principles behind NEXORA.",
    images: [siteConfig.ogImage],
  },
};

/**
 * AboutPage:
 * Premium, responsive, and accessible About Us experience for NEXORA (Phase 4).
 *
 * Architecture:
 * - Section A: Cinematic Brand Introduction & Procedural 3D Geometric Nexus (AboutHero)
 * - Section B: NEXORA Brand Concept & Demonstration Storefront Disclosure (AboutBrandConcept)
 * - Section C: Technology and Design Philosophy Pillars (AboutPhilosophy)
 * - Section D: Four Core Brand Values with Premium Editorial Composition (AboutCoreValues)
 * - Section E: Customer Experience Principles (AboutExperiencePrinciples)
 * - Section F: Product Discovery Experience & Live Demonstration Showcase (AboutTechShowcase)
 * - Section G: Future-Facing Technology Vision & Conceptual Research Horizons (AboutFutureVision)
 * - Section 8: Trust-Building Through Commercial Transparency (AboutTrustSection)
 * - Sections H & I: Explore Products CTA & Engineering Concierge Contact CTA (AboutCTASection)
 */
export default function AboutPage() {
  return (
    <main className="py-8 sm:py-14 md:py-16">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <SiteContainer size="xl" className="space-y-16 sm:space-y-24">
        {/* Section A: Cinematic Brand Hero & 3D Nexus */}
        <AboutHero />

        {/* Section B: Brand Storytelling & Commercial Honesty Notice */}
        <AboutBrandConcept />

        {/* Section C: Technology & Design Philosophy */}
        <AboutPhilosophy />

        {/* Section D: Four Core Brand Values */}
        <AboutCoreValues />

        {/* Section E: Customer Experience Principles */}
        <AboutExperiencePrinciples />

        {/* Section F: Live Product Discovery Technology Showcase */}
        <AboutTechShowcase />

        {/* Section G: Future-Facing Technology Vision */}
        <AboutFutureVision />

        {/* Section 8: Trust-Building Through Commercial Transparency */}
        <AboutTrustSection />

        {/* Sections H & I: Explore Products & Contact CTAs */}
        <AboutCTASection />
      </SiteContainer>
    </main>
  );
}
