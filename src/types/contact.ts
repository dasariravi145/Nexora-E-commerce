export type EnquiryCategory =
  | "product-info"
  | "comparison-help"
  | "general-enquiry"
  | "website-feedback";

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  category: EnquiryCategory;
  productSlug?: string;
  message: string;
  consent: boolean;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

export interface ContactCategoryOption {
  id: EnquiryCategory;
  label: string;
  description: string;
}

export interface ContactMethod {
  id: string;
  title: string;
  description: string;
  value?: string;
  type: "email" | "phone" | "form" | "repository";
  actionHref?: string;
  actionLabel: string;
  badge?: string;
  isConfigured: boolean;
  unconfiguredNotice?: string;
}

export interface ContactFAQ {
  id: string;
  question: string;
  answer: string;
  category: "general" | "advisory" | "privacy";
}
