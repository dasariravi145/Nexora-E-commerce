import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/badge";

export interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  badge?: string;
  badgeVariant?: BadgeProps["variant"];
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  align?: "left" | "center" | "right";
  headingLevel?: "h1" | "h2" | "h3";
  isDark?: boolean;
}

/**
 * Reusable SectionHeading component with typography hierarchy, badge indicators,
 * and balanced responsive layout.
 */
export function SectionHeading({
  badge,
  badgeVariant = "electric",
  title,
  description,
  align = "left",
  headingLevel: Heading = "h2",
  isDark = false,
  className,
  ...props
}: SectionHeadingProps) {
  const alignStyles = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  return (
    <div
      className={cn("flex flex-col space-y-3 max-w-3xl", alignStyles[align], className)}
      {...props}
    >
      {badge && (
        <div>
          <Badge variant={badgeVariant} size="md" dot>
            {badge}
          </Badge>
        </div>
      )}
      <Heading
        className={cn(
          "text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.15]",
          isDark ? "text-white" : "text-[#0F172A]"
        )}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            "text-sm sm:text-base leading-relaxed text-pretty",
            isDark ? "text-slate-300" : "text-[#475569]"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
