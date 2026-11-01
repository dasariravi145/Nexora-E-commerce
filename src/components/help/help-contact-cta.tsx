import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PremiumButton } from "@/components/ui/premium-button";
import { contactConfig } from "@/config/contact";
import { ArrowRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HelpContactCTAProps {
  className?: string;
}

/**
 * HelpContactCTA:
 * Section I: Contact Support Call-To-Action.
 * Seamlessly connects visitors to the `/contact` advisory desk.
 * Explicitly discloses the client-side `mailto:` handoff mechanism
 * and absence of fake delivery confirmations or automated bots.
 */
export function HelpContactCTA({ className }: HelpContactCTAProps) {
  const hasConfiguredEmail = Boolean(contactConfig.publicEmail.trim());

  return (
    <section
      id="help-contact-cta"
      aria-labelledby="help-contact-cta-heading"
      className={cn("pt-4", className)}
    >
      <Card
        variant="solid"
        className="relative overflow-hidden p-6 sm:p-10 border-blue-200 bg-[#EAF2FF] space-y-6 shadow-sm"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="electric" size="sm">
                Human Advisory Desk
              </Badge>
              <Badge variant="outline" size="sm" className="text-[#475569] border-[#E2E8F0] bg-white">
                {hasConfiguredEmail ? "Configured Recipient" : "Demonstration Mode"}
              </Badge>
            </div>

            <h2
              id="help-contact-cta-heading"
              className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight"
            >
              Have a Specific Technical Question?
            </h2>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed text-pretty">
              If your question isn&apos;t covered in our knowledge base, connect directly with our engineering
              consultation desk. The form prepares a structured inquiry draft in your email application.
            </p>

            {/* Submission Handoff Disclosure */}
            <div className="flex items-center gap-2 text-[11px] text-[#64748B] pt-1">
              <Info className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
              <span>
                Submission opens your local email application via <code>mailto:</code>. You must press Send in your email client.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link href="/contact">
              <PremiumButton
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="w-full sm:w-auto font-bold"
              >
                Open Advisory Form
              </PremiumButton>
            </Link>
            <Link href="/products">
              <PremiumButton
                variant="outline"
                size="md"
                className="w-full sm:w-auto bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50 shadow-xs"
              >
                Browse Catalogue
              </PremiumButton>
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}
