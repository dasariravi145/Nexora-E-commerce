import Link from "next/link";
import { SiteContainer } from "@/components/ui/site-container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PremiumButton } from "@/components/ui/premium-button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Shield, Layers, Compass, ArrowRight } from "lucide-react";

export function BrandExperience() {
  const pillars = [
    {
      icon: Shield,
      title: "Material Purity",
      subtitle: "Aerospace-Grade Metallurgy",
      desc: "Chassis forged from CNC-machined titanium alloys and bead-blasted aluminum, eliminating structural resonance and thermal fatigue.",
    },
    {
      icon: Layers,
      title: "Zero-Latency Architecture",
      subtitle: "Sub-Millisecond Synapse",
      desc: "Custom silicon pipelines engineered specifically for real-time spatial computing, dual 8K panel syncing, and gesture telemetry.",
    },
    {
      icon: Compass,
      title: "Acoustic Neutrality",
      subtitle: "Uncompromising Planar Precision",
      desc: "Custom beryllium planar diaphragms produce a flat, uncolored frequency curve from 5Hz to 45kHz with zero harmonic distortion.",
    },
  ];

  return (
    <section
      aria-labelledby="brand-experience-heading"
      className="py-16 sm:py-24 bg-[#EAF2FF] border-b border-[#E2E8F0] relative overflow-hidden"
    >
      {/* Subtle Ambient Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <SiteContainer size="xl" className="space-y-12 sm:space-y-16 relative z-10">
        <ScrollReveal direction="up" distance={20} duration={600}>
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Badge variant="electric" size="md" dot>
              Design Philosophy
            </Badge>
            <h2
              id="brand-experience-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-[1.15]"
            >
              Form Follows Frequency. <br />
              <span className="text-[#2563EB]">
                Precision Without Compromise.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl mx-auto text-pretty">
              NEXORA does not manufacture mass-market commodity consumer gadgets. Every instrument in our catalogue is born in collaborative research laboratories to push human perception into the spatial era.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Pillars of Engineering with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <ScrollReveal
                key={pillar.title}
                direction="up"
                distance={24}
                duration={600}
                delay={index * 120}
              >
                <Card
                  variant="solid"
                  className="p-5 sm:p-8 h-full space-y-3.5 sm:space-y-4 bg-white border border-[#E2E8F0] shadow-xs hover:border-blue-400 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1.5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF2FF] border border-[#2563EB]/25 text-[#2563EB] group-hover:scale-105 group-hover:text-blue-700 transition-all duration-300 shadow-xs">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono tracking-wider uppercase text-[#2563EB] font-bold">
                      {pillar.subtitle}
                    </span>
                    <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {pillar.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {pillar.desc}
                  </p>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Philosophy CTA */}
        <ScrollReveal direction="up" distance={16} duration={500} delay={250}>
          <div className="text-center pt-2">
            <Link href="/about">
              <PremiumButton
                variant="outline"
                size="md"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Read Our Engineering Story
              </PremiumButton>
            </Link>
          </div>
        </ScrollReveal>
      </SiteContainer>
    </section>
  );
}
