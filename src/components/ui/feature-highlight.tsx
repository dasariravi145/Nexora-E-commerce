import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Monitor,
  BatteryCharging,
  Cpu,
  Camera,
  Headphones,
  Feather,
  ShieldCheck,
  Zap,
} from "lucide-react";

export type FeatureHighlightType =
  | "display"
  | "battery"
  | "performance"
  | "camera"
  | "audio"
  | "portability"
  | "chassis"
  | "neural";

export interface FeatureHighlightProps {
  type: FeatureHighlightType;
  label: string;
  value: string;
  description?: string;
  variant?: "electric" | "violet" | "emerald" | "slate";
  isDark?: boolean;
  className?: string;
}

const iconMap: Record<FeatureHighlightType, React.ElementType> = {
  display: Monitor,
  battery: BatteryCharging,
  performance: Cpu,
  camera: Camera,
  audio: Headphones,
  portability: Feather,
  chassis: ShieldCheck,
  neural: Zap,
};

const getVariantStyles = (variant: "electric" | "violet" | "emerald" | "slate", isDark: boolean) => {
  if (isDark) {
    return {
      electric: {
        badgeBg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
        glow: "group-hover:border-blue-500/40 group-hover:shadow-blue-500/10",
        accent: "text-blue-400",
      },
      violet: {
        badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
        glow: "group-hover:border-purple-500/40 group-hover:shadow-purple-500/10",
        accent: "text-purple-400",
      },
      emerald: {
        badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        glow: "group-hover:border-emerald-500/40 group-hover:shadow-emerald-500/10",
        accent: "text-emerald-400",
      },
      slate: {
        badgeBg: "bg-slate-500/10 border-slate-500/30 text-slate-400",
        glow: "group-hover:border-slate-500/40 group-hover:shadow-slate-500/10",
        accent: "text-slate-300",
      },
    }[variant];
  }

  return {
    electric: {
      badgeBg: "bg-[#EAF2FF] border-[#2563EB]/30 text-[#1D4ED8]",
      glow: "hover:border-blue-400 hover:shadow-xs",
      accent: "text-[#2563EB]",
    },
    violet: {
      badgeBg: "bg-purple-50 border-purple-200 text-purple-700",
      glow: "hover:border-purple-300 hover:shadow-xs",
      accent: "text-purple-700",
    },
    emerald: {
      badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
      glow: "hover:border-emerald-300 hover:shadow-xs",
      accent: "text-emerald-700",
    },
    slate: {
      badgeBg: "bg-slate-100 border-slate-200 text-slate-700",
      glow: "hover:border-slate-300 hover:shadow-xs",
      accent: "text-slate-700",
    },
  }[variant];
};

/**
 * FeatureHighlight displays concise, verified or labeled fictional demo hardware specifications.
 * Used across product spotlights, storytelling sections, and hardware detail cards.
 */
export function FeatureHighlight({
  type,
  label,
  value,
  description,
  variant = "electric",
  isDark = false,
  className,
}: FeatureHighlightProps) {
  const IconComponent = iconMap[type] || Cpu;
  const style = getVariantStyles(variant, isDark);

  return (
    <div
      className={cn(
        "group relative p-3 sm:p-4 rounded-xl transition-all duration-300",
        isDark
          ? "bg-[#091024]/80 border border-white/[0.08]"
          : "bg-white border border-[#E2E8F0] shadow-xs",
        style.glow,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-105",
            style.badgeBg
          )}
        >
          <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "text-[10px] sm:text-[11px] font-mono uppercase tracking-wider truncate",
                isDark ? "text-slate-400" : "text-[#475569]"
              )}
            >
              {label}
            </span>
            <span className="text-[9px] font-mono text-slate-400 shrink-0">
              DEMO SPEC
            </span>
          </div>

          <p
            className={cn(
              "text-xs sm:text-sm font-bold leading-snug transition-colors",
              isDark
                ? "text-white group-hover:text-blue-200"
                : "text-[#0F172A] group-hover:text-[#2563EB]"
            )}
          >
            {value}
          </p>

          {description && (
            <p
              className={cn(
                "text-[11px] leading-relaxed pt-0.5",
                isDark ? "text-slate-400" : "text-[#475569]"
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
