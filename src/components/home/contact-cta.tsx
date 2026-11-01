import Link from "next/link";
import { SiteContainer } from "@/components/ui/site-container";
import { PremiumButton } from "@/components/ui/premium-button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ArrowRight, Mail, Compass } from "lucide-react";

export function ContactCTA() {
  return (
    <section
      aria-labelledby="contact-cta-heading"
      className="py-16 sm:py-24 border-t border-[#E2E8F0] bg-gradient-to-b from-white via-[#F8FAFC] to-[#09152B]/10 relative overflow-hidden"
    >
      {/* Background Subtle Gradient */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-t from-blue-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <SiteContainer size="lg">
        <ScrollReveal direction="up" distance={24} duration={650}>
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-[#2563EB]/30 via-[#F2B95C]/20 to-[#09152B]/40 shadow-2xl">
            <div className="rounded-[22px] bg-[#09152B] border border-white/10 backdrop-blur-xl p-5 sm:p-10 md:p-16 text-center space-y-5 sm:space-y-6">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant="gold" size="md" dot>
                  Technical Advisory Concierge
                </Badge>
                <Badge variant="dark" size="md">
                  Demo Consultation Channel
                </Badge>
              </div>

              <h2
                id="contact-cta-heading"
                className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight max-w-2xl mx-auto"
              >
                Have Inquiries Regarding Hardware Configurations or Custom Spatial Rigs?
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed text-pretty">
                Connect with our client services desk to discuss spatial computing requirements, custom acoustic tuning, or portfolio architectural reviews.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                <Link href="/contact" className="w-full sm:w-auto">
                  <PremiumButton
                    variant="gold"
                    size="lg"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    className="w-full sm:w-auto font-semibold"
                  >
                    Contact Concierge
                  </PremiumButton>
                </Link>
                <Link href="/products" className="w-full sm:w-auto">
                  <PremiumButton
                    variant="outline"
                    size="lg"
                    leftIcon={<Compass className="h-4 w-4 text-[#F2B95C]" />}
                    className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
                  >
                    Explore Hardware
                  </PremiumButton>
                </Link>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#F2B95C]" />
                  Demo Channel: concierge@nexora-store.demo
                </span>
                <span>•</span>
                <span>Portfolio Website 01 of 10</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </SiteContainer>
    </section>
  );
}
