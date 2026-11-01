import type { ReactNode } from "react";

export type Variant = "primary" | "secondary" | "outline" | "ghost" | "glass";
export type Size = "sm" | "md" | "lg" | "xl";

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface MetricItem {
  label: string;
  value: string;
  unit?: string;
  description?: string;
}

export interface CategorySummary {
  id: string;
  slug: string;
  name: string;
  headline: string;
  itemCount: number;
  featuredProductCount: number;
}

// Re-export all centralized product catalogue, promotion, and about types
export * from "./product";
export * from "./promotion";
export * from "./about";
export * from "./contact";
export * from "./faq";
export * from "./cart";
export * from "./ai";
