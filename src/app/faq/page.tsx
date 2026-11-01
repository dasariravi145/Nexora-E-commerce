import * as React from "react";
import type { Metadata } from "next";
import HelpPage from "@/app/help/page";

import { getCanonicalUrl } from "@/config/seo";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Searchable FAQ knowledge base covering spatial hardware specifications, 3D inspection, comparisons, and storefront disclosures.",
  alternates: {
    canonical: getCanonicalUrl("/faq"),
  },
  openGraph: {
    title: "Frequently Asked Questions | NEXORA",
    description:
      "Searchable FAQ knowledge base and customer guidance for the NEXORA electronics storefront.",
    url: getCanonicalUrl("/faq"),
    type: "website",
  },
};

/**
 * FAQPage:
 * Preserves the `/faq` route for backwards compatibility while routing seamlessly
 * to the comprehensive Help Center & FAQ experience.
 */
export default function FAQPage() {
  return <HelpPage />;
}
