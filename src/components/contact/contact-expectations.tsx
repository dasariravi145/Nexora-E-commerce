import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { contactConfig } from "@/config/contact";
import { Clock, Shield, Users, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContactExpectationsProps {
  className?: string;
}

/**
 * ContactExpectations:
 * Section E: Response Expectations & Advisory Commitments.
 * Communicates response turnaround, consultation scope, and the guarantee of
 * human engineering oversight without automated chatbot deflection.
 */
export function ContactExpectations({ className }: ContactExpectationsProps) {
  return (
    <section
      id="contact-expectations"
      aria-labelledby="contact-expectations-heading"
      className={cn("space-y-6 sm:space-y-8", className)}
    >
      <div className="space-y-2">
        <Badge variant="violet" size="sm">
          Advisory Information
        </Badge>
        <h2
          id="contact-expectations-heading"
          className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight"
        >
          Demonstration Consultation Disclosures
        </h2>
        <p className="text-xs sm:text-sm text-[#475569] max-w-xl">
          Operational details regarding our client inquiry flow and evaluation procedures.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card variant="solid" className="p-5 sm:p-6 space-y-3 bg-white border-[#E2E8F0] shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] border border-blue-200 text-[#2563EB]">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-[#0F172A]">Review Timeframe</h3>
          <p className="text-xs text-[#475569] leading-relaxed text-pretty">
            {contactConfig.responseExpectations.timeframe}
          </p>
        </Card>

        <Card variant="solid" className="p-5 sm:p-6 space-y-3 bg-white border-[#E2E8F0] shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 border border-purple-200 text-purple-600">
            <Compass className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-[#0F172A]">Advisory Scope</h3>
          <p className="text-xs text-[#475569] leading-relaxed text-pretty">
            {contactConfig.responseExpectations.scope}
          </p>
        </Card>

        <Card variant="solid" className="p-5 sm:p-6 space-y-3 bg-white border-[#E2E8F0] shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-[#0F172A]">Zero Automated Bots</h3>
          <p className="text-xs text-[#475569] leading-relaxed text-pretty">
            {contactConfig.responseExpectations.reviewType}
          </p>
        </Card>

        <Card variant="solid" className="p-5 sm:p-6 space-y-3 bg-white border-[#E2E8F0] shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-[#0F172A]">Data Discretion</h3>
          <p className="text-xs text-[#475569] leading-relaxed text-pretty">
            No contact records are stored in remote databases or shared with third parties.
            Client inquiries remain in your email app.
          </p>
        </Card>
      </div>
    </section>
  );
}
