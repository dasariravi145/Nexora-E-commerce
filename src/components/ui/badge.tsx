import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "electric" | "violet" | "subtle" | "outline" | "success" | "gold" | "dark";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "electric",
  size = "md",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    electric:
      "bg-[#EAF2FF] text-[#1D4ED8] border border-[#2563EB]/30 shadow-xs",
    gold:
      "bg-[#FEF7EC] text-[#9A6208] border border-[#F2B95C]/60 shadow-xs",
    violet:
      "bg-purple-50 text-purple-700 border border-purple-200 shadow-xs",
    subtle:
      "bg-slate-100 text-slate-700 border border-slate-200",
    outline:
      "bg-transparent text-slate-700 border border-slate-300",
    success:
      "bg-emerald-50 text-emerald-700 border border-emerald-300",
    dark:
      "bg-[#09152B]/90 text-blue-300 border border-blue-500/30",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-medium tracking-wide",
    md: "px-2.5 py-1 text-xs font-semibold tracking-wider uppercase",
  };

  const dotColors = {
    electric: "bg-blue-600 animate-pulse",
    gold: "bg-[#F2B95C] animate-pulse",
    violet: "bg-purple-600 animate-pulse",
    subtle: "bg-slate-400",
    outline: "bg-slate-400",
    success: "bg-emerald-600 animate-pulse",
    dark: "bg-blue-400 animate-pulse",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
