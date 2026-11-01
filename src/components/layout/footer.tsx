import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { ShieldCheck, Truck, RotateCcw, Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="mt-auto border-t border-white/[0.08] bg-[#040814] text-slate-400"
    >
      {/* Trust & Engineering Assurance Strip */}
      <div className="border-b border-white/[0.06] bg-[#060B1A]/60 py-8">
        <Container size="xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-950/60 border border-blue-500/20 text-blue-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">3-Year Nexus Warranty</h4>
                <p className="text-xs text-slate-400 mt-0.5">Comprehensive hardware protection</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-950/60 border border-purple-500/20 text-purple-400">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Verified Silicon</h4>
                <p className="text-xs text-slate-400 mt-0.5">100% authentic premium components</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-950/60 border border-blue-500/20 text-blue-400">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Global Express</h4>
                <p className="text-xs text-slate-400 mt-0.5">Tracked, temperature-controlled transit</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-950/60 border border-purple-500/20 text-purple-400">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">30-Day Return Window</h4>
                <p className="text-xs text-slate-400 mt-0.5">Hassle-free evaluation period</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer Navigation */}
      <div className="py-12 sm:py-16">
        <Container size="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand Intro Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-extrabold text-base shadow-md shadow-blue-500/20">
                  N
                </div>
                <span className="font-extrabold text-xl tracking-wider text-white">
                  NEXORA
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Next-generation electronics retail destination designed for spatial computing, high-fidelity acoustics, and futuristic desktop hardware.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/[0.08] text-xs text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Phase 1 Architecture Active</span>
                </span>
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                Hardware
              </h4>
              <ul className="space-y-2.5 text-sm">
                {siteConfig.footerNav.shop.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Experience Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                Experience
              </h4>
              <ul className="space-y-2.5 text-sm">
                {siteConfig.footerNav.experience.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Company Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                Support
              </h4>
              <ul className="space-y-2.5 text-sm">
                {siteConfig.footerNav.support.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Sub-footer Copyright */}
      <div className="border-t border-white/[0.06] py-6">
        <Container size="xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              &copy; 2026 NEXORA Technologies Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/faq" className="hover:text-slate-200 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/faq" className="hover:text-slate-200 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-slate-200 transition-colors">
                Security
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
