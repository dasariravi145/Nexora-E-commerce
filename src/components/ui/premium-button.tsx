import * as React from "react";
import { cn } from "@/lib/utils";

export interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass" | "gold";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  glow?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * PremiumButton provides interactive feedback, subtle lighting sheen,
 * and WCAG 2.1 AA focus rings with reduced-motion awareness.
 */
export const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      glow = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium rounded-xl select-none cursor-pointer overflow-hidden transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 border border-blue-600",
      gold:
        "bg-gradient-to-r from-[#F2B95C] to-[#E5A744] text-[#09152B] font-semibold shadow-md shadow-[#F2B95C]/25 hover:from-[#E5A744] hover:to-[#D99630] border border-[#F2B95C]",
      secondary:
        "bg-[#09152B] text-white hover:bg-[#132240] shadow-sm border border-slate-700",
      outline:
        "bg-white text-slate-800 border border-slate-300 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 shadow-xs",
      ghost:
        "bg-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100",
      glass:
        "bg-white/80 text-slate-800 backdrop-blur-md border border-slate-200 hover:border-blue-500 hover:bg-white shadow-xs",
    };

    const glowStyles = glow
      ? "after:absolute after:inset-0 after:rounded-xl after:bg-blue-500/10 after:blur-md after:-z-10"
      : "";

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      xl: "h-14 px-8 text-lg gap-3",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          glowStyles,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current motion-reduce:animate-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        ) : leftIcon ? (
          <span className="shrink-0 text-current" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}

        <span>{children}</span>

        {!isLoading && rightIcon && (
          <span className="shrink-0 text-current" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

PremiumButton.displayName = "PremiumButton";
