import type { Metadata } from "next";
import { SiteContainer } from "@/components/ui/site-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { getActivePromotions } from "@/data/promotions";
import { products } from "@/data/products";
import { OffersClient } from "./offers-client";
import { getCanonicalUrl } from "@/config/seo";
import { JsonLd, generateBreadcrumbSchema } from "@/lib/seo-structured-data";

export const metadata: Metadata = {
  title: "Exclusive Offers & Laboratory Demonstrations",
  description:
    "Explore authentic demonstration incentives, prototype batch allocations, and laboratory tier pricing across NEXORA's spatial electronics portfolio.",
  alternates: {
    canonical: getCanonicalUrl("/offers"),
  },
  openGraph: {
    title: "Exclusive Offers & Laboratory Demonstrations | NEXORA",
    description:
      "Explore authentic demonstration incentives, prototype batch allocations, and laboratory tier pricing across NEXORA's spatial electronics portfolio.",
    url: getCanonicalUrl("/offers"),
  },
};

export default function OffersPage() {
  const activePromotions = getActivePromotions();

  const breadcrumbs = [
    { label: "Exclusive Offers", current: true },
  ];

  return (
    <div className="py-8 sm:py-14 md:py-16">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Exclusive Offers", path: "/offers" },
        ])}
      />
      <SiteContainer size="xl" className="space-y-8 sm:space-y-12">
        {/* Semantic Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} className="pb-2" />

        {/* Promotional Hero Header (Section A) */}
        <header className="space-y-4">
          <SectionHeading
            badge="Demonstration Allocations"
            badgeVariant="violet"
            title="Exclusive Offers &amp; Laboratory Demonstrations"
            description="Explore authentic illustrative demonstration incentives, prototype batch allocations, and laboratory tier pricing across NEXORA's spatial hardware divisions."
            id="offers-hero-heading"
          />
        </header>

        {/* Interactive Offers Experience */}
        <OffersClient
          initialPromotions={activePromotions}
          products={products}
        />
      </SiteContainer>
    </div>
  );
}
