import * as React from "react";
import type { Metadata } from "next";
import { SiteContainer } from "@/components/ui/site-container";
import { siteConfig } from "@/config/site";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactIntroduction } from "@/components/contact/contact-introduction";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactMethods } from "@/components/contact/contact-methods";
import { ContactExpectations } from "@/components/contact/contact-expectations";
import { ContactFAQs } from "@/components/contact/contact-faqs";
import { ContactCTA } from "@/components/contact/contact-cta";
import { getCanonicalUrl } from "@/config/seo";
import { JsonLd, generateBreadcrumbSchema } from "@/lib/seo-structured-data";

export const metadata: Metadata = {
  title: "Contact Advisory Concierge | Hardware Consultations",
  description:
    "Connect with the NEXORA engineering advisory desk for technical hardware consultations, spatial rig evaluations, acoustic driver matching, and demonstration feedback.",
  alternates: {
    canonical: getCanonicalUrl("/contact"),
  },
  openGraph: {
    title: "Contact Advisory Concierge | NEXORA Electronics",
    description:
      "Connect with the NEXORA engineering advisory desk for technical hardware consultations, spatial rig evaluations, acoustic driver matching, and demonstration feedback.",
    url: getCanonicalUrl("/contact"),
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "NEXORA Engineering Advisory Desk & Concierge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Advisory Concierge | NEXORA Electronics",
    description:
      "Connect with the NEXORA engineering advisory desk for technical hardware consultations, spatial rig evaluations, and acoustic driver matching.",
    images: [siteConfig.ogImage],
  },
};

/**
 * ContactPage:
 * Premium, accessible, and genuinely functional Contact Us experience for NEXORA (Phase 4).
 *
 * Architecture:
 * - Section A: Premium Contact Hero with Semantic Breadcrumbs & Operational Status (ContactHero)
 * - Section B: Contact Introduction & Advisory Scope with Demonstration Disclosure (ContactIntroduction)
 * - Section C: Functional Enquiry Form with Validation & Mailto Draft Handoff (ContactForm in Suspense)
 * - Section D: Direct Communication Pathway Cards (ContactMethods)
 * - Section E: Response Expectations & Human Review Commitments (ContactExpectations)
 * - Section F: Frequently Asked Consultation Questions (ContactFAQs)
 * - Section G: Explore Products & Hardware Suite Call-To-Action (ContactCTA)
 */
export default function ContactPage() {
  return (
    <main className="py-8 sm:py-14 md:py-16">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <SiteContainer size="xl" className="space-y-14 sm:space-y-20">
        {/* Section A: Premium Contact Hero */}
        <ContactHero />

        {/* Section B: Contact Introduction & Advisory Scope */}
        <ContactIntroduction />

        {/* Section C: Functional Enquiry Form with URL Parameter Prefill */}
        <React.Suspense
          fallback={
            <div className="p-12 rounded-2xl bg-[#080E1E] border border-white/[0.08] text-center text-xs font-mono text-slate-400 animate-pulse">
              Initializing client consultation interface...
            </div>
          }
        >
          <ContactForm />
        </React.Suspense>

        {/* Section D: Direct Communication Pathways */}
        <ContactMethods />

        {/* Section E: Response & Consultation Commitments */}
        <ContactExpectations />

        {/* Section F: Frequently Asked Consultation Questions */}
        <ContactFAQs />

        {/* Section G: Explore Products Call-To-Action */}
        <ContactCTA />
      </SiteContainer>
    </main>
  );
}
