import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { CategoryExplorer } from "@/components/home/category-explorer";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ProductSpotlight } from "@/components/home/product-spotlight";
import { BrandExperience } from "@/components/home/brand-experience";
import { TechnologyShowcase } from "@/components/home/technology-showcase";
import { ShoppingBenefits } from "@/components/home/shopping-benefits";
import { ContactCTA } from "@/components/home/contact-cta";
import { seoConfig, getCanonicalUrl } from "@/config/seo";
import { JsonLd, generateWebSiteSchema } from "@/lib/seo-structured-data";

export const metadata: Metadata = {
  title: seoConfig.defaultTitle,
  description:
    "Explore NEXORA's 30 flagship hardware specimens across spatial audio, neural computing, holographic displays, and cybernetic accessories in interactive 3D.",
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  openGraph: {
    title: seoConfig.defaultTitle,
    description:
      "Explore NEXORA's 30 flagship hardware specimens across spatial audio, neural computing, holographic displays, and cybernetic accessories in interactive 3D.",
    url: getCanonicalUrl("/"),
    siteName: seoConfig.siteName,
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="relative overflow-hidden flex flex-col">
      {/* Schema.org Truthful WebSite Metadata */}
      <JsonLd data={generateWebSiteSchema()} />

      {/* SECTION 01 — PREMIUM HERO */}
      <HeroSection />

      {/* SECTION 02 — CATEGORY EXPLORER */}
      <CategoryExplorer />

      {/* SECTION 03 — FEATURED PRODUCTS */}
      <FeaturedProducts />

      {/* SECTION 04 — FEATURED PRODUCT SPOTLIGHT (PROMPT 07) */}
      <ProductSpotlight />

      {/* SECTION 05 — BRAND EXPERIENCE */}
      <BrandExperience />

      {/* SECTION 06 — TECHNOLOGY SHOWCASE (PROMPT 07 ENHANCED) */}
      <TechnologyShowcase />

      {/* SECTION 07 — SHOPPING BENEFITS */}
      <ShoppingBenefits />

      {/* SECTION 08 — CONTACT / ENQUIRY CTA */}
      <ContactCTA />
    </div>
  );
}
