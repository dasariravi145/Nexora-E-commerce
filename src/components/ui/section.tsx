import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  spacing?: "sm" | "md" | "lg" | "xl";
}

export function Section({
  as: Component = "section",
  spacing = "lg",
  className,
  children,
  ...props
}: SectionProps) {
  const spacingStyles = {
    sm: "py-8 sm:py-12",
    md: "py-12 sm:py-16",
    lg: "py-16 sm:py-24",
    xl: "py-20 sm:py-32",
  };

  return (
    <Component
      className={cn("w-full relative", spacingStyles[spacing], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
