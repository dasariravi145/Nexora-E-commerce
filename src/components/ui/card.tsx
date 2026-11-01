import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "solid" | "interactive" | "dark";
  glow?: "none" | "electric" | "violet" | "gold";
}

export function Card({
  className,
  variant = "glass",
  glow = "none",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    glass: "glass-panel rounded-2xl",
    solid: "bg-white border border-[#E2E8F0] rounded-2xl shadow-xs text-[#0F172A]",
    interactive: "glass-panel-interactive rounded-2xl cursor-pointer",
    dark: "bg-[#09152B] border border-slate-800 text-white rounded-2xl shadow-md",
  };

  const glowStyles = {
    none: "",
    electric:
      "shadow-md shadow-blue-500/10 border-blue-500/30 hover:border-blue-500/50",
    violet:
      "shadow-md shadow-purple-500/10 border-purple-500/30 hover:border-purple-500/50",
    gold:
      "shadow-md shadow-[#F2B95C]/15 border-[#F2B95C]/40 hover:border-[#F2B95C]/60",
  };

  return (
    <div
      className={cn(
        "p-6 transition-all duration-300",
        variantStyles[variant],
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold tracking-tight text-[#0F172A]", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-[#475569]", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-0", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center pt-4 border-t border-[#E2E8F0]", className)} {...props} />
  );
}
