"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { SiteContainer } from "@/components/ui/site-container";
import { PremiumButton } from "@/components/ui/premium-button";
import { Badge } from "@/components/ui/badge";
import { HeroFallback } from "@/components/3d/hero-fallback";
import { ArrowRight, Grid } from "lucide-react";

// Lazy-load the interactive 3D WebGL scene to maintain instant server rendering
const DynamicHeroScene = dynamic(
  () => import("@/components/3d/hero-scene").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => <HeroFallback />,
  }
);

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative bg-[#09152B] text-white pt-4 sm:pt-10 md:pt-16 pb-12 sm:pb-20 md:pb-24 overflow-hidden border-b border-slate-800/80"
    >
      {/* Background Ambient Lighting Halos */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] lg:w-[900px] h-[300px] sm:h-[450px] rounded-full bg-gradient-to-tr from-blue-600/15 via-[#F2B95C]/10 to-transparent blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <SiteContainer size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Copy (Left Column) */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 sm:space-y-6">
            <div className="hero-reveal-eyebrow flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <Badge variant="electric" size="md" dot>
                Spatial Era Hardware
              </Badge>
              <Badge variant="gold" size="md">
                NEXORA Portfolio 01
              </Badge>
            </div>

            <h1
              id="hero-heading"
              className="hero-reveal-headline text-[26px] xs:text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.14]"
            >
              Next-Generation <br className="hidden sm:inline" />
              <span className="gradient-text-hero">
                Electronics Engineered
              </span>{" "}
              for Spatial Precision
            </h1>

            <p className="hero-reveal-description text-xs sm:text-base text-slate-300 max-w-xl leading-relaxed text-pretty">
              Discover aerospace-grade mobile hardware, dual-panel micro-OLED workstations, and planar acoustic monitors engineered without compromise.
            </p>

            <div className="hero-reveal-ctas flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 sm:pt-2 w-full sm:w-auto">
              <Link href="/products" className="w-full sm:w-auto">
                <PremiumButton
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  className="w-full sm:w-auto"
                >
                  Explore Products
                </PremiumButton>
              </Link>
              <Link href="/categories" className="w-full sm:w-auto">
                <PremiumButton
                  variant="outline"
                  size="lg"
                  leftIcon={<Grid className="h-4 w-4 text-blue-400" />}
                  className="w-full sm:w-auto bg-slate-900/60 border-slate-700 text-white hover:bg-white/10 hover:border-slate-500"
                >
                  Browse Categories
                </PremiumButton>
              </Link>
            </div>

            {/* Micro Highlights Bar */}
            <div className="hero-reveal-highlights pt-4 border-t border-white/[0.08] grid grid-cols-3 gap-2 sm:gap-4 w-full text-center lg:text-left">
              <div>
                <p className="text-sm xs:text-base sm:text-lg font-bold text-white">8K</p>
                <p className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider">Spatial Panels</p>
              </div>
              <div>
                <p className="text-sm xs:text-base sm:text-lg font-bold text-white">&lt;1ms</p>
                <p className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider">Neural Latency</p>
              </div>
              <div>
                <p className="text-sm xs:text-base sm:text-lg font-bold text-white">100%</p>
                <p className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider">Verified Silicon</p>
              </div>
            </div>
          </div>

          {/* Interactive 3D Spatial Stage Showcase (Right Column) */}
          <div className="hero-reveal-stage lg:col-span-6 w-full max-w-lg lg:max-w-none mx-auto mt-2 lg:mt-0">
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-blue-500/25 via-purple-500/15 to-white/[0.04] shadow-2xl shadow-blue-500/10">
              <DynamicHeroScene />
            </div>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
