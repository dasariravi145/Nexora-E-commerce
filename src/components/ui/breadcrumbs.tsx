"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
}

/**
 * Breadcrumbs: Semantic, accessible, and responsive breadcrumb navigation.
 * Complies with WAI-ARIA breadcrumb pattern using <nav>, <ol>, <li>, and aria-current="page".
 */
export function Breadcrumbs({
  items,
  className,
  showHomeIcon = true,
}: BreadcrumbsProps) {
  // Prepend Home if not already the first item
  const allItems: BreadcrumbItem[] =
    items.length > 0 && items[0].href === "/"
      ? items
      : [{ label: "Home", href: "/" }, ...items];

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("overflow-x-auto scrollbar-none py-1 select-none", className)}
    >
      <ol className="flex items-center gap-1.5 text-xs font-mono text-[#475569] flex-nowrap sm:flex-wrap min-w-max sm:min-w-0">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1 || item.current;
          const isHome = index === 0;

          return (
            <React.Fragment key={item.label + index}>
              {index > 0 && (
                <li aria-hidden="true" className="text-[#94A3B8] shrink-0">
                  <ChevronRight className="h-3 w-3" />
                </li>
              )}

              <li className="shrink-0 flex items-center">
                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-semibold text-[#2563EB] truncate max-w-[200px] sm:max-w-xs md:max-w-sm"
                    title={item.label}
                  >
                    {item.label}
                  </span>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-[#0F172A] transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded px-1 -mx-1"
                  >
                    {isHome && showHomeIcon && (
                      <Home className="h-3 w-3 text-[#64748B] shrink-0" aria-hidden="true" />
                    )}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="text-[#475569]">{item.label}</span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
