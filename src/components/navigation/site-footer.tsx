import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SiteContainer } from "@/components/ui/site-container";
import { ShieldCheck, Truck, RotateCcw, Cpu, Mail, MapPin, Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer
      role="contentinfo"
      className="mt-auto border-t border-slate-800 bg-[#09152B] text-slate-300"
    >
      {/* Trust & Engineering Assurance Banner */}
      <div className="border-b border-slate-800/80 bg-[#0B1A36] py-8">
        <SiteContainer size="xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-950/60 border border-blue-500/20 text-blue-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">3-Year Precision Warranty</h4>
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
                <p className="text-xs text-slate-400 mt-0.5">Tracked, temperature-controlled delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-950/60 border border-purple-500/20 text-purple-400">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">30-Day Evaluation</h4>
                <p className="text-xs text-slate-400 mt-0.5">Hassle-free return window</p>
              </div>
            </div>
          </div>
        </SiteContainer>
      </div>

      {/* Main Footer Links */}
      <div className="py-12 sm:py-16">
        <SiteContainer size="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand Intro Column */}
            <div className="lg:col-span-2 space-y-4">
              <Link
                href="/"
                className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-base shadow-md shadow-blue-500/20">
                  N
                </div>
                <span className="font-extrabold text-xl tracking-wider text-white">
                  NEXORA
                </span>
              </Link>

              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Next-generation electronics retail destination designed for spatial computing, high-fidelity acoustics, and futuristic desktop hardware.
              </p>

              {/* Demo Contact Details */}
              <div className="space-y-2 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span>Demo Concierge: <code className="text-slate-300">concierge@nexora-store.demo</code></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span>Virtual Lab: Portfolio Showcase Hub (Demo Experience)</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F1D38] border border-slate-700/60 text-xs text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-[#F2B95C] animate-pulse" />
                  <span>Phase 2 Architecture Active (Website 01/10)</span>
                </span>
              </div>
            </div>

            {/* Hardware Category Navigation */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                Hardware
              </h4>
              <ul className="space-y-2.5 text-sm">
                {siteConfig.footerNav.shop.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Experience / Features Navigation */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                Experience
              </h4>
              <ul className="space-y-2.5 text-sm">
                {siteConfig.footerNav.experience.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Contact Navigation */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                Support
              </h4>
              <ul className="space-y-2.5 text-sm">
                {siteConfig.footerNav.support.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SiteContainer>
      </div>

      {/* Sub-footer Copyright */}
      <div className="border-t border-slate-800 py-6">
        <SiteContainer size="xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              &copy; 2026 NEXORA Technologies Inc. Demo Portfolio Showcase.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/faq" className="hover:text-slate-200 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/faq" className="hover:text-slate-200 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-slate-200 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </SiteContainer>
      </div>
    </footer>
  );
}
