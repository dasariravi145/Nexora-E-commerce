"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { About3DFallback } from "@/components/about/about-3d-fallback";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Sparkles,
  Layers,
  Box,
  Compass,
  Cpu,
  Coins,
} from "lucide-react";

// Dynamically import interactive 3D procedural nexus scene to isolate WebGL bundle
const DynamicAbout3DScene = dynamic(
  () => import("@/components/about/about-3d-scene").then((mod) => mod.About3DScene),
  {
    ssr: false,
    loading: () => <About3DFallback message="Initializing Nexus Procedural Matrix..." />,
  }
);

export interface AboutHeroProps {
  className?: string;
}

/**
 * AboutHero:
 * Cinematic Brand Introduction Section (Section A).
 * Combines midnight navy, electric blue and violet aesthetics with semantic breadcrumbs,
 * high-impact typography, quick jump actions, hardware telemetry indicators, and
 * the procedural 3D geometric nexus inspection canvas.
 */
export function AboutHero({ className }: AboutHeroProps) {
  const breadcrumbs = [{ label: "About NEXORA", current: true }];

  return (
    <section
      aria-labelledby="about-hero-heading"
      className={cn("relative space-y-8 sm:space-y-12", className)}
    >
      {/* Semantic Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono text-slate-400">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Architectural Studio Active</span>
        </div>
      </div>

      {/* Hero Content & Visual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Editorial Headline & Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="electric" size="md" dot>
                Brand Story &amp; Philosophy
              </Badge>
              <span className="text-xs font-mono text-slate-400">
                Phase 4 Architecture
              </span>
            </div>

            <h1
              id="about-hero-heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl/tight font-extrabold tracking-tight text-white"
            >
              Precision Engineering for the{" "}
              <span className="gradient-text-hero">Spatial Era</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl text-pretty font-normal">
              NEXORA is an avant-garde digital storefront and architectural case study
              in luxury electronics—unifying industrial minimalism, tactile digital
              inspection, and single-source-of-truth telemetry.
            </p>
          </div>

          {/* Quick Action Navigation CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/30 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>Explore Products</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#technology-showcase"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-slate-200 bg-[#101A30] hover:bg-[#162240] border border-white/[0.08] hover:border-blue-500/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Cpu className="h-4 w-4 text-blue-400" />
              <span>Technology Showcase</span>
            </a>

            <a
              href="#core-values"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-slate-300 hover:text-white bg-transparent hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Compass className="h-4 w-4 text-purple-400" />
              <span>Core Values</span>
            </a>
          </div>

          {/* Architectural Telemetry Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#080E1E] border border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-xs font-mono text-blue-400 mb-0.5">
                <Layers className="h-3.5 w-3.5" />
                <span>Divisions</span>
              </div>
              <div className="text-lg font-bold text-white">6 Disciplines</div>
              <p className="text-[11px] text-slate-400">Mobile to Spatial</p>
            </div>

            <div className="p-3 rounded-xl bg-[#080E1E] border border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-xs font-mono text-purple-400 mb-0.5">
                <Box className="h-3.5 w-3.5" />
                <span>Specimens</span>
              </div>
              <div className="text-lg font-bold text-white">30 Verified</div>
              <p className="text-[11px] text-slate-400">Centralized catalogue</p>
            </div>

            <div className="p-3 rounded-xl bg-[#080E1E] border border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 mb-0.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Inspection</span>
              </div>
              <div className="text-lg font-bold text-white">WebGL 3D</div>
              <p className="text-[11px] text-slate-400">Three.js orbital</p>
            </div>

            <div className="p-3 rounded-xl bg-[#080E1E] border border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-0.5">
                <Coins className="h-3.5 w-3.5" />
                <span>Economics</span>
              </div>
              <div className="text-lg font-bold text-white">INR Base</div>
              <p className="text-[11px] text-slate-400">Transparent pricing</p>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Procedural Geometric Nexus Scene */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-600/20 via-purple-600/10 to-transparent blur-xl pointer-events-none" />
          <DynamicAbout3DScene />
        </div>
      </div>
    </section>
  );
}
