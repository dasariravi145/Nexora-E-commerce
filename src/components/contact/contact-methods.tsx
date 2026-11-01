import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getContactMethods } from "@/config/contact";
import {
  Mail,
  Phone,
  FileText,
  Code2,
  ExternalLink,
  ArrowRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContactMethodsProps {
  className?: string;
}

const METHOD_ICONS = {
  email: Mail,
  phone: Phone,
  form: FileText,
  repository: Code2,
};

/**
 * ContactMethods:
 * Section D: Contact Method Cards.
 * Presents only configured, functional contact channels: Email consultation,
 * telephone advisory (by request/configured), digital advisory form, and GitHub repository.
 * Strictly avoids dead links or simulated social channels.
 */
export function ContactMethods({ className }: ContactMethodsProps) {
  const methods = getContactMethods();

  return (
    <section
      id="contact-methods"
      aria-labelledby="contact-methods-heading"
      className={cn("space-y-6 sm:space-y-8", className)}
    >
      <div className="space-y-2">
        <Badge variant="electric" size="sm">
          Channel Directory
        </Badge>
        <h2
          id="contact-methods-heading"
          className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight"
        >
          Direct Communication Pathways
        </h2>
        <p className="text-xs sm:text-sm text-[#475569] max-w-xl">
          Choose your preferred method to consult with the client engineering desk. All
          channels connect to direct technical oversight.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {methods.map((method) => {
          const Icon = METHOD_ICONS[method.type] || Mail;

          return (
            <Card
              key={method.id}
              variant="interactive"
              className="p-5 sm:p-6 flex flex-col justify-between space-y-4 bg-white border-[#E2E8F0] shadow-sm group hover:border-blue-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] border border-blue-200 text-[#2563EB] group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  {method.badge && (
                    <Badge
                      variant={method.isConfigured ? "electric" : "outline"}
                      size="sm"
                    >
                      {method.badge}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed text-pretty">
                    {method.description}
                  </p>
                </div>

                {method.value && (
                  <p className="text-xs font-mono text-[#2563EB] truncate font-semibold">
                    {method.value}
                  </p>
                )}

                {method.unconfiguredNotice && (
                  <p className="text-[11px] font-mono text-[#64748B] leading-relaxed pt-1 flex items-start gap-1">
                    <Info className="h-3 w-3 shrink-0 text-[#64748B] mt-0.5" />
                    <span>{method.unconfiguredNotice}</span>
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#E2E8F0]">
                {method.actionHref ? (
                  <a
                    href={method.actionHref}
                    target={method.type === "repository" ? "_blank" : undefined}
                    rel={method.type === "repository" ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded p-1 -m-1"
                  >
                    <span>{method.actionLabel}</span>
                    {method.type === "repository" ? (
                      <ExternalLink className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    )}
                  </a>
                ) : (
                  <span className="text-xs font-mono text-[#64748B] select-none">
                    {method.actionLabel}
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
