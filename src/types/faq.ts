/**
 * Centralized TypeScript Models for NEXORA Help Center & FAQ System.
 * Defines the single source of truth for Help Center categories,
 * searchable FAQ entries, customer guidance topics, and operational disclosures.
 */

export type FAQCategory =
  | "getting-started"
  | "product-browsing"
  | "search-filters"
  | "product-comparison"
  | "3d-viewer"
  | "demo-offers"
  | "contact-enquiry"
  | "about-nexora";

export interface FAQCategoryMeta {
  id: FAQCategory;
  name: string;
  description: string;
  iconName: string;
}

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  keywords: string[];
  displayOrder: number;
}

export interface CustomerGuideStep {
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
}

export interface CustomerGuideTopic {
  id: string;
  title: string;
  summary: string;
  iconName: string;
  badge: string;
  steps: CustomerGuideStep[];
}
