import Link from "next/link";
import { SiteContainer } from "@/components/ui/site-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { PremiumButton } from "@/components/ui/premium-button";
import { HardwareVisual } from "@/components/ui/hardware-visual";
import { FeatureHighlight } from "@/components/ui/feature-highlight";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import {
  ArrowRight,
  Activity,
  Cpu,
  Monitor,
} from "lucide-react";

export function TechnologyShowcase() {
  return (
    <section
      aria-labelledby="tech-showcase-heading"
      className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0] relative overflow-hidden"
    >
      {/* Background Radial Glow Elements */}
      <div
        className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-purple-600/5 blur-[130px] pointer-events-none"
        aria-hidden="true"
      />

      <SiteContainer size="xl" className="space-y-20 sm:space-y-28">
        <ScrollReveal direction="up" distance={20} duration={600}>
          <SectionHeading
            badge="Engineering Stories"
            badgeVariant="electric"
            title="Technological Breakthroughs"
            description="Explore our three flagship engineering pillars redefining mobile computing, desktop workstations, and acoustic reproduction."
            align="center"
            id="tech-showcase-heading"
          />
        </ScrollReveal>

        {/* =========================================================================
            STORY A — MOBILE INNOVATION: DESIGN, DISPLAY, CAMERA & PERFORMANCE
            Layout: Asymmetric Split with Macro Detail Callouts & Spec Matrix
           ========================================================================= */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual Column with Macro Focal Points */}
            <div className="lg:col-span-6 order-1 lg:order-1">
              <ScrollReveal direction="left" distance={24} duration={650}>
                <div className="relative rounded-2xl overflow-hidden group border border-[#E2E8F0] bg-white shadow-xs p-4 sm:p-6">
                  <HardwareVisual
                    categorySlug="smartphones"
                    size="lg"
                    className="border-blue-500/20 group-hover:border-blue-500/40 group-hover:shadow-xl group-hover:shadow-blue-500/10 transition-all duration-300"
                  />

                  {/* Holographic Hotspot Badges */}
                  <div className="absolute top-8 left-8 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A132C]/90 border border-blue-400/30 text-[10px] font-mono text-blue-300 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span>Grade-5 Titanium Chassis</span>
                  </div>

                  <div className="absolute bottom-8 right-8 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A132C]/90 border border-purple-400/30 text-[10px] font-mono text-purple-300 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
                    <span>Micro-Lens Quantum OLED</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Narrative & Highlights Column */}
            <div className="lg:col-span-6 order-2 lg:order-2 space-y-5">
              <ScrollReveal direction="right" distance={24} duration={650}>
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex items-center gap-2">
                    <Badge variant="electric" size="sm" dot>
                      Story A • Mobile Innovation
                    </Badge>
                    <span className="text-xs font-mono text-slate-500">
                      NEXORA Nova 1 Pro
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F172A] leading-tight">
                    Architectural Purity in Grade-5 Titanium
                  </h3>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed text-pretty">
                    The NEXORA Nova communicator abandons polymer frames in favor of
                    grade-5 aerospace titanium. Equipped with a custom neural coprocessor
                    capable of executing on-device spatial tracking, 120Hz quantum OLED
                    streaming, and quantum cryptographic security.
                  </p>

                  {/* Three Concise Feature Highlights for Mobile */}
                  <div className="space-y-2.5 pt-1">
                    <FeatureHighlight
                      type="chassis"
                      label="Design & Casing"
                      value="7.8mm Aerospace Titanium Monolith"
                      description="Precision-machined chassis with integrated vapor cooling heatpipes."
                      variant="electric"
                    />

                    <FeatureHighlight
                      type="display"
                      label="Quantum Display"
                      value="120Hz Micro-OLED • 3,000 Nits Peak"
                      description="Zero-motion-blur panel calibrated for true HDR spatial streaming."
                      variant="violet"
                    />

                    <FeatureHighlight
                      type="camera"
                      label="Optics & Performance"
                      value="Tri-Spectral 50MP Array • Neural X2"
                      description="Sub-millisecond computational depth mapping and raw photon synthesis."
                      variant="emerald"
                    />
                  </div>

                  <div className="pt-2">
                    <Link href="/products?category=smartphones">
                      <PremiumButton
                        variant="outline"
                        size="md"
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                        className="w-full sm:w-auto"
                      >
                        Explore Mobile Units
                      </PremiumButton>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STORY B — COMPUTING EXPERIENCE: PRODUCTIVITY, PORTABILITY, PERFORMANCE
            Layout: Panoramic Workstation Command Layout with Multi-Tasking Grid
           ========================================================================= */}
        <div className="space-y-6 pt-4 border-t border-[#E2E8F0]">
          <ScrollReveal direction="up" distance={20} duration={600}>
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-6">
              {/* Header Strip with Identity and Telemetry */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="violet" size="sm" dot>
                      Story B • Computing Experience
                    </Badge>
                    <span className="text-xs font-mono text-slate-500">
                      NEXORA Zephyr 16 Studio
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F172A]">
                    Dual-Touch Micro-OLED Workstation Engineering
                  </h3>
                </div>

                <Link href="/products?category=laptops" className="shrink-0">
                  <PremiumButton
                    variant="outline"
                    size="sm"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Explore Workstations
                  </PremiumButton>
                </Link>
              </div>

              {/* Narrative Text */}
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-3xl text-pretty">
                The Zephyr Studio is engineered for spatial authoring, 3D simulation,
                and neural compiling. By pairing dual 4K HDR touch surfaces with an
                advanced vapor-matrix cooling loop, computing workflows gain desktop-class
                power in a portable 1.84kg chassis.
              </p>

              {/* Workstation 3-Deck Feature Grid: Productivity, Portability, Performance */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <FeatureHighlight
                  type="display"
                  label="Productivity"
                  value="Dual 4K HDR Micro-OLED Surfaces"
                  description="Secondary touch canvas with zero-latency stylus spatial authoring."
                  variant="violet"
                />

                <FeatureHighlight
                  type="portability"
                  label="Portability"
                  value="1.84kg Magnesium Frame • 16h Cell"
                  description="Aerospace alloy milled with 99.8% structural rigidity and all-day endurance."
                  variant="slate"
                />

                <FeatureHighlight
                  type="performance"
                  label="Performance"
                  value="140W Cryo-Matrix • 64GB Unified RAM"
                  description="Whisper-quiet vapor loop delivering sustained multi-thread compilation."
                  variant="electric"
                />
              </div>

              {/* Live Technical Metrics Bar */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  0 dB Silent Idle Acoustic Profile
                </span>
                <span className="flex items-center gap-2">
                  <Cpu className="h-3.5 w-3.5 text-purple-600" />
                  140W Continuous Cryo-Dissipation
                </span>
                <span className="flex items-center gap-2">
                  <Monitor className="h-3.5 w-3.5 text-blue-600" />
                  99.8% DCI-P3 Color Gamut
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* =========================================================================
            STORY C — IMMERSIVE AUDIO: SOUND, COMFORT, EVERYDAY USE
            Layout: Acoustic Frequency Ribbon & Circular Planar Chamber Anatomy
           ========================================================================= */}
        <div className="space-y-6 pt-4 border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Acoustic Visual & Frequency Response Curve */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <ScrollReveal direction="right" distance={24} duration={650}>
                <div className="relative rounded-2xl overflow-hidden group border border-[#E2E8F0] bg-white shadow-xs p-4 sm:p-6 space-y-4">
                  <HardwareVisual
                    categorySlug="audio"
                    size="md"
                    className="border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300"
                  />

                  {/* Interactive Acoustic Spectrum Response Curve */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                      <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
                        <Activity className="h-3.5 w-3.5 text-blue-600" />
                        Planar Frequency Response
                      </span>
                      <span>10Hz – 48kHz ±0.5dB</span>
                    </div>

                    {/* SVG Acoustic Waveform */}
                    <svg
                      viewBox="0 0 360 60"
                      className="w-full h-12 text-blue-500 overflow-visible"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      {/* Grid Guide */}
                      <line x1="0" y1="30" x2="360" y2="30" stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
                      <line x1="120" y1="0" x2="120" y2="60" stroke="rgba(0,0,0,0.04)" />
                      <line x1="240" y1="0" x2="240" y2="60" stroke="rgba(0,0,0,0.04)" />

                      {/* Smooth Planar Response Line */}
                      <path
                        d="M 0 32 Q 40 28, 90 30 T 180 29 T 270 30 Q 320 28, 360 32"
                        stroke="url(#freqGrad)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="freqGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#2563EB" />
                          <stop offset="50%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#0EA5E9" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>Sub-Bass 10Hz</span>
                      <span>Midrange Reference 1kHz</span>
                      <span>Air Treble 48kHz</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Narrative & Audio Highlights */}
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-5">
              <ScrollReveal direction="left" distance={24} duration={650}>
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex items-center gap-2">
                    <Badge variant="electric" size="sm" dot>
                      Story C • Immersive Audio
                    </Badge>
                    <span className="text-xs font-mono text-slate-500">
                      Vortex Resonance Planar
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F172A] leading-tight">
                    Beryllium Diaphragms &amp; Acoustic Neutrality
                  </h3>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed text-pretty">
                    Conventional dynamic drivers flex under high volume, causing harmonic
                    phase distortion. Vortex Resonance planar monitors employ laser-etched
                    beryllium diaphragms suspended within neodymium magnetic flux to achieve
                    genuine transparency.
                  </p>

                  {/* Three Audio Highlights: Sound, Comfort, Everyday Use */}
                  <div className="space-y-2.5 pt-1">
                    <FeatureHighlight
                      type="audio"
                      label="Sound Fidelity"
                      value="Beryllium Planar Diaphragm • <0.002% THD"
                      description="Zero-distortion acoustic chamber with linear phase response."
                      variant="electric"
                    />

                    <FeatureHighlight
                      type="portability"
                      label="Ergonomic Comfort"
                      value="Lambskin Memory Foam • Carbon Arc"
                      description="Suspension tension band engineered for fatigue-free 8-hour mixing."
                      variant="slate"
                    />

                    <FeatureHighlight
                      type="neural"
                      label="Everyday Versatility"
                      value="Balanced 4.4mm DAC + Lossless 2.4GHz"
                      description="Instant switch between analog studio monitoring and wireless spatial audio."
                      variant="violet"
                    />
                  </div>

                  <div className="pt-2">
                    <Link href="/products?category=audio">
                      <PremiumButton
                        variant="outline"
                        size="md"
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                        className="w-full sm:w-auto"
                      >
                        Explore Acoustic Units
                      </PremiumButton>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
