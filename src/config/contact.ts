import type { ContactCategoryOption, ContactFAQ, ContactMethod } from "@/types/contact";
import { siteConfig } from "@/config/site";

export interface ContactConfiguration {
  publicEmail: string;
  publicPhone: string;
  businessLocation: string;
  demoDisclaimer: string;
  responseExpectations: {
    timeframe: string;
    scope: string;
    reviewType: string;
  };
  categories: ContactCategoryOption[];
  faqs: ContactFAQ[];
}

/**
 * Centralized Contact Configuration for NEXORA Storefront.
 * Strictly avoids invented real-world company addresses, phone numbers, or physical offices.
 * Reads public contact email from NEXT_PUBLIC_CONTACT_EMAIL if configured by the site owner.
 */
export const contactConfig: ContactConfiguration = {
  publicEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  publicPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  businessLocation: process.env.NEXT_PUBLIC_CONTACT_LOCATION || "",
  demoDisclaimer:
    "NEXORA is a fictional luxury electronics demonstration storefront. Contact submissions do not create backend database records or trigger automated delivery; they format an email draft for your default email client. No third-party marketing trackers or automated chatbots are employed.",
  responseExpectations: {
    timeframe: "Evaluated on a portfolio demonstration basis when a recipient email is configured.",
    scope: "Technical hardware specs, spatial display parameters, planar acoustics, and demo architecture.",
    reviewType: "Authentic client-side draft preparation with zero automated deflection chatbots.",
  },
  categories: [
    {
      id: "product-info",
      label: "Product Information",
      description: "Technical specifications, materials, acoustic drivers, and display telemetry.",
    },
    {
      id: "comparison-help",
      label: "Product Comparison Help",
      description: "Guidance evaluating trade-offs between catalogued hardware specimens.",
    },
    {
      id: "general-enquiry",
      label: "General Enquiry",
      description: "Questions regarding the NEXORA demonstration architecture and design systems.",
    },
    {
      id: "website-feedback",
      label: "Website Feedback",
      description: "Observations on 3D performance, responsive layouts, accessibility, and UX.",
    },
  ],
  faqs: [
    {
      id: "faq-commercial-status",
      question: "Is NEXORA an active commercial store with physical inventory?",
      answer:
        "No. NEXORA is an avant-garde architectural portfolio demonstration showcasing Next.js, Three.js spatial inspection, and luxury electronics UX. All products and prices are illustrative demo models.",
      category: "general",
    },
    {
      id: "faq-purchases",
      question: "Can I place orders or purchase hardware through this form?",
      answer:
        "Commercial ordering, payments, and checkout processing are intentionally disabled across this demo. This advisory desk is designed for technical inquiries, specification consultations, and portfolio evaluation.",
      category: "general",
    },
    {
      id: "faq-email-handoff",
      question: "How does the email consultation submission work?",
      answer:
        "Submitting the form formats your parameters into a structured plain-text message and launches your system's default email client via the mailto protocol. You can inspect the complete draft before sending.",
      category: "advisory",
    },
    {
      id: "faq-custom-specs",
      question: "Can I request custom hardware specifications or 3D asset telemetry?",
      answer:
        "Yes. We welcome technical inquiries regarding WebGL2 performance, GLB model topology, high-DPI rendering optimization, and hardware taxonomy structure.",
      category: "advisory",
    },
    {
      id: "faq-privacy",
      question: "What happens to the personal information entered into this form?",
      answer:
        "No inquiry information is stored in any remote database, localStorage, or third-party CRM. The form generates an email draft directly in your browser. If no recipient is configured, you can copy the text manually.",
      category: "privacy",
    },
  ],
};

/**
 * Returns available contact methods based on real configuration.
 * Avoids dead buttons or fabricated telephone numbers.
 */
export function getContactMethods(): ContactMethod[] {
  const hasEmail = Boolean(contactConfig.publicEmail.trim());
  const hasPhone = Boolean(contactConfig.publicPhone.trim());

  return [
    {
      id: "method-email",
      title: "Email Consultation",
      description: "Direct correspondence for hardware inquiries and technical architecture.",
      value: hasEmail ? contactConfig.publicEmail : undefined,
      type: "email",
      actionHref: hasEmail ? `mailto:${contactConfig.publicEmail}` : undefined,
      actionLabel: hasEmail ? "Compose Email" : "Recipient Unconfigured",
      badge: hasEmail ? "Configured" : "Demo Mode",
      isConfigured: hasEmail,
      unconfiguredNotice:
        "Set NEXT_PUBLIC_CONTACT_EMAIL in environment variables to enable direct one-click email composition.",
    },
    {
      id: "method-phone",
      title: "Telephone Advisory",
      description: "Direct telephone consultations for enterprise and spatial computing evaluations.",
      value: hasPhone ? contactConfig.publicPhone : undefined,
      type: "phone",
      actionHref: hasPhone ? `tel:${contactConfig.publicPhone}` : undefined,
      actionLabel: hasPhone ? "Initiate Call" : "Available Upon Inquiry",
      badge: hasPhone ? "Configured" : "By Request",
      isConfigured: hasPhone,
      unconfiguredNotice: "Set NEXT_PUBLIC_CONTACT_PHONE in environment variables to configure a direct telephone channel.",
    },
    {
      id: "method-form",
      title: "On-Page Advisory Form",
      description: "Structured enquiry generator with specimen selection and character validation.",
      type: "form",
      actionHref: "#enquiry-form",
      actionLabel: "Scroll to Form",
      badge: "Interactive",
      isConfigured: true,
    },
    {
      id: "method-repository",
      title: "Project Repository",
      description: "Inspect architectural documentation, test suites, and frontend source code.",
      value: siteConfig.links.github,
      type: "repository",
      actionHref: siteConfig.links.github || "https://github.com/nexora-store",
      actionLabel: "View GitHub Source",
      badge: "Open Source",
      isConfigured: Boolean(siteConfig.links.github),
    },
  ];
}
