import { SiteContainer } from "@/components/ui/site-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Search, Sliders, Smartphone, CheckCircle2 } from "lucide-react";

export function ShoppingBenefits() {
  const benefits = [
    {
      icon: Search,
      title: "Intuitive Product Discovery",
      tagline: "Instant Keyboard & Filter Access",
      desc: "Fast interactive search index with global Ctrl+K shortcut, category filters, and curated hardware tags designed for frictionless exploration.",
      highlight: "Sub-50ms Index Lookup",
    },
    {
      icon: Sliders,
      title: "Transparent Technical Specs",
      tagline: "Authentic Hardware Telemetry",
      desc: "Every product includes detailed engineering datasheets, frequency response curves, thermal envelopes, and material metallurgical specifications.",
      highlight: "Lab-Verified Metrics",
    },
    {
      icon: Smartphone,
      title: "Responsive Store Architecture",
      tagline: "Fluid Across 320px to 1440px+",
      desc: "Zero horizontal overflow, accessible touch targets, and optimized assets ensuring a fast, cinematic experience on every device.",
      highlight: "Mobile-First Engine",
    },
  ];

  return (
    <section
      aria-labelledby="benefits-heading"
      className="py-16 sm:py-20 border-t border-[#E2E8F0] bg-white relative"
    >
      <SiteContainer size="xl" className="space-y-10 sm:space-y-12">
        <ScrollReveal direction="up" distance={20} duration={600}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <SectionHeading
              badge="Store Experience"
              badgeVariant="electric"
              title="Portfolio Platform Architecture"
              description="Built to demonstrate high-performance retail engineering, accessibility standards, and clean component isolation."
              id="benefits-heading"
            />

            <Badge variant="subtle" size="md" className="border-[#E2E8F0] bg-[#F8FAFC] text-[#475569]">
              Demo Platform Capabilities
            </Badge>
          </div>
        </ScrollReveal>

        {/* 3 Benefits Cards with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((b, index) => {
            const Icon = b.icon;
            return (
              <ScrollReveal
                key={b.title}
                direction="up"
                distance={24}
                duration={600}
                delay={index * 120}
              >
                <Card
                  variant="solid"
                  className="p-5 sm:p-7 h-full space-y-3.5 sm:space-y-4 bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#2563EB]/40 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group hover:-translate-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF2FF] border border-[#2563EB]/20 text-[#2563EB] group-hover:scale-105 group-hover:text-blue-700 transition-all duration-300 shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 flex items-center gap-1 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      {b.highlight}
                    </span>
                  </div>

                    <div className="space-y-1">
                    <span className="text-[11px] font-mono tracking-wider uppercase text-[#2563EB] font-semibold">
                      {b.tagline}
                    </span>
                    <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {b.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {b.desc}
                  </p>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </SiteContainer>
    </section>
  );
}
