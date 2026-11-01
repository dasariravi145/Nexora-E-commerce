import * as React from "react";
import type { ProductSpecification } from "@/types";
import {
  Cpu,
  Monitor,
  Layers,
  Zap,
  Volume2,
  Wifi,
  Maximize2,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductSpecificationsProps {
  specifications: ProductSpecification[];
  category?: string;
  className?: string;
}

const groupIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Display: Monitor,
  Performance: Cpu,
  Materials: Layers,
  Battery: Zap,
  Acoustics: Volume2,
  Connectivity: Wifi,
  Dimensions: Maximize2,
};

/**
 * ProductSpecifications: Dynamic, category-agnostic technical specification matrix.
 * - Dynamically groups specifications when group data is present.
 * - Adapts cleanly across smartphones, laptops, audio, gaming, and wearables without hardcoding.
 * - High-contrast readable typography with monospace engineering keys.
 */
export function ProductSpecifications({
  specifications,
  category,
  className,
}: ProductSpecificationsProps) {
  if (!specifications || specifications.length === 0) {
    return null;
  }

  // Check if specifications have group definitions
  const hasGroups = specifications.some((s) => s.group);

  if (hasGroups) {
    // Group specifications by group name preserving insertion order
    const groups: Record<string, ProductSpecification[]> = {};
    for (const spec of specifications) {
      const g = spec.group || "Technical Parameters";
      if (!groups[g]) {
        groups[g] = [];
      }
      groups[g].push(spec);
    }

    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-[#2563EB]" />
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] font-mono uppercase tracking-wider">
              Technical Specifications Matrix
            </h2>
          </div>
          {category && (
            <span className="text-xs font-mono text-[#475569]">
              Division: {category}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(groups).map(([groupName, specs]) => {
            const GroupIcon = groupIconMap[groupName] || Activity;

            return (
              <div
                key={groupName}
                className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
                  <GroupIcon className="h-3.5 w-3.5 text-[#2563EB]" />
                  <span>{groupName}</span>
                </div>

                <div className="space-y-2">
                  {specs.map((spec) => (
                    <div
                      key={spec.name}
                      className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs"
                    >
                      <span className="font-mono text-[#475569] shrink-0">
                        {spec.name}
                      </span>
                      <span className="font-semibold text-[#0F172A] text-left sm:text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Fallback flat grid if specifications have no group categorization
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
        <Cpu className="h-5 w-5 text-[#2563EB]" />
        <h2 className="text-base sm:text-lg font-bold text-[#0F172A] font-mono uppercase tracking-wider">
          Technical Specifications
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {specifications.map((spec) => (
          <div
            key={spec.name}
            className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-1"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] block font-medium">
              {spec.name}
            </span>
            <span className="text-xs font-semibold text-[#0F172A] block">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
