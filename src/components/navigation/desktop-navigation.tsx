"use client";

import * as React from "react";
import { siteConfig } from "@/config/site";
import { NavigationLink } from "@/components/navigation/navigation-link";
import { cn } from "@/lib/utils";

export interface DesktopNavigationProps {
  className?: string;
}

/**
 * DesktopNavigation renders the primary horizontal navigation bar for viewports >= 1024px.
 */
export function DesktopNavigation({ className }: DesktopNavigationProps) {
  return (
    <nav
      aria-label="Primary Navigation"
      className={cn("hidden lg:flex items-center gap-1 xl:gap-2", className)}
    >
      {siteConfig.navItems.map((item) => (
        <NavigationLink
          key={item.href}
          href={item.href}
          title={item.title}
          badge={item.badge}
          variant="desktop"
        />
      ))}
    </nav>
  );
}
