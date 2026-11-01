"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { SiteContainer } from "@/components/ui/site-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { PremiumButton } from "@/components/ui/premium-button";
import { FeatureHighlight } from "@/components/ui/feature-highlight";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SpotlightFallback } from "@/components/3d/spotlight-fallback";
import { products } from "@/data/products";
import { ArrowRight, Eye, ShieldCheck, Sparkles } from "lucide-react";

// Dynamically import interactive 3D spotlight viewer to isolate WebGL bundle below fold
const DynamicSpotlightViewer = dynamic(
  () => import("@/components/3d/spotlight-viewer").then((mod) => mod.SpotlightViewer),
  {
    ssr: false,
    loading: () => <SpotlightFallback message="Initializing flagship inspection stage..." />,
  }
);

export function ProductSpotlight() {
  // Pull flagship smartphone item from centralized demo dataset
  const flagship = products.find((p) => p.id === "prod-01") || products[0];

  return (
    <section
      aria-labelledby="product-spotlight-heading"
      className="py-16 sm:py-24 border-y border-slate-800 bg-[#09152B] relative overflow-hidden"
    >
      {/* Background Lighting Bloom */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-[#F2B95C]/10 blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      <SiteContainer size="xl" className="space-y-12 sm:space-y-16">
        <ScrollReveal direction="up" distance={20} duration={550}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionHeading
              badge="Hardware Spotlight"
              badgeVariant="gold"
              title="Flagship Architectural Spotlight"
              description="An interactive inspection of our premier mobile communicator, milled from aerospace titanium with integrated spatial neural telemetry."
              id="product-spotlight-heading"
              isDark={true}
            />
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Badge variant="dark" size="sm">
                Spotlight 01 of 08
              </Badge>
            </div>
          </div>
        </ScrollReveal>

        {/* Spotlight Showcase Grid: 3D Stage on Left, Narrative & Specs on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Interactive 3D Turntable Stage */}
          <div className="lg:col-span-7 order-1">
            <ScrollReveal direction="left" distance={24} duration={650}>
              <div className="relative">
                <DynamicSpotlightViewer />
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                    Procedural MeshPhysical Material
                  </span>
                  <span>100% Original Nexora IP</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Editorial Narrative, Feature Highlights, and CTAs */}
          <div className="lg:col-span-5 order-2 space-y-6">
            <ScrollReveal direction="right" distance={24} duration={650}>
              <div className="space-y-5">
                {/* Product Identity Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="gold" size="sm" dot>
                      Flagship Mobile
                    </Badge>
                    <span className="text-xs font-mono text-slate-400">
                      {flagship.category}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                    {flagship.name}
                  </h3>

                  <p className="text-sm font-semibold text-blue-300 font-mono">
                    {flagship.tagline}
                  </p>
                </div>

                {/* Editorial Feature Narrative */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-pretty">
                  Milled from a solid billet of Grade-5 aerospace titanium with an
                  integrated cryogenic vapor chamber. Powered by our custom Neural
                  Silicon X2, delivering uncompromised 120Hz quantum fidelity in an
                  ultra-slim 7.8mm chassis.
                </p>

                {/* Three Concise Feature Highlights */}
                <div className="space-y-2.5 pt-1">
                  <FeatureHighlight
                    type="display"
                    label="Quantum Micro-OLED"
                    value="6.8-inch • 120Hz LTPO • 3,000 Nits"
                    description="Color-calibrated DCI-P3 with sub-pixel micro-lens arrays."
                    variant="electric"
                    isDark={true}
                  />

                  <FeatureHighlight
                    type="performance"
                    label="Neural Coprocessor"
                    value="Neural Silicon X2 • 32-Core NPU"
                    description="Sub-millisecond on-device spatial tracking and encryption."
                    variant="violet"
                    isDark={true}
                  />

                  <FeatureHighlight
                    type="chassis"
                    label="Aerospace Architecture"
                    value="Grade-5 Titanium • 5,400mAh Cell"
                    description="Cryogenic heatpipe with 80W wireless inductive charging."
                    variant="emerald"
                    isDark={true}
                  />
                </div>

                {/* Pricing and Action CTAs */}
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-mono uppercase text-slate-400">
                        Demo Retail Price
                      </span>
                      <span className="text-xl sm:text-2xl font-extrabold text-white">
                        {flagship.formattedPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Ready for Demo Inspection</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Link
                      href={`/products/${flagship.slug}`}
                      className="w-full sm:w-auto flex-1"
                    >
                      <PremiumButton
                        variant="primary"
                        size="md"
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                        className="w-full"
                      >
                        Explore {flagship.name}
                      </PremiumButton>
                    </Link>

                    <Link
                      href="/products?category=smartphones"
                      className="w-full sm:w-auto"
                    >
                      <PremiumButton
                        variant="outline"
                        size="md"
                        rightIcon={<Eye className="h-4 w-4" />}
                        className="w-full sm:w-auto bg-slate-900/60 border-slate-700 text-white hover:bg-white/10 hover:border-slate-500"
                      >
                        View Specifications
                      </PremiumButton>
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
