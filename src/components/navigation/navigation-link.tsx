"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface NavigationLinkProps {
  href: string;
  title: string;
  badge?: string;
  onClick?: () => void;
  className?: string;
  variant?: "desktop" | "mobile";
}

/**
 * NavigationLink provides active state awareness using usePathname(),
 * smooth hover indicator animation, and accessible aria-current="page".
 */
export function NavigationLink({
  href,
  title,
  badge,
  onClick,
  className,
  variant = "desktop",
}: NavigationLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);

  if (variant === "mobile") {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex items-center justify-between min-h-[48px] px-4 py-3 rounded-xl font-medium text-base transition-colors",
          isActive
            ? "bg-blue-600/15 text-blue-400 font-semibold border-l-2 border-blue-500 pl-3.5"
            : "text-slate-200 hover:text-white hover:bg-white/[0.05]",
          className
        )}
      >
        <span>{title}</span>
        {badge && (
          <Badge
            variant={badge === "Exclusive" ? "violet" : "electric"}
            size="sm"
          >
            {badge}
          </Badge>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative px-3 py-2 text-sm font-medium transition-colors rounded-lg inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        isActive
          ? "text-white font-semibold"
          : "text-slate-300 hover:text-white hover:bg-white/[0.04]",
        className
      )}
    >
      <span>{title}</span>
      {badge && (
        <Badge
          variant={badge === "Exclusive" ? "violet" : "electric"}
          size="sm"
        >
          {badge}
        </Badge>
      )}

      {/* Active Indicator Underline */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-0 left-3 right-3 h-[2px] rounded-full transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm shadow-blue-500/50 opacity-100"
            : "bg-transparent opacity-0 group-hover:bg-slate-600/50 group-hover:opacity-100"
        )}
      />
    </Link>
  );
}
