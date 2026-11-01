import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Tag,
  ShieldCheck,
  Info,
  CheckCircle2,
  FileText,
  Layers,
} from "lucide-react";
import { SiteContainer } from "@/components/ui/site-container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PremiumButton } from "@/components/ui/premium-button";
import { ProductCard } from "@/components/ui/product-card";
import { getPromotionBySlug, getActivePromotions } from "@/data/promotions";
import { getPromotionEligibleProducts } from "@/lib/promotion-eligibility";
import { products } from "@/data/products";

import { getCanonicalUrl } from "@/config/seo";
import { JsonLd, generateBreadcrumbSchema } from "@/lib/seo-structured-data";

interface OfferDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const activePromos = getActivePromotions();
  return activePromos.map((promo) => ({
    slug: promo.slug,
  }));
}

export async function generateMetadata({
  params,
}: OfferDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const promo = getPromotionBySlug(slug);

  if (!promo || !promo.enabled) {
    return {
      title: "Promotion Not Found | NEXORA",
      description: "The requested demonstration offer could not be located.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical = getCanonicalUrl(`/offers/${promo.slug}`);

  return {
    title: `${promo.title} — Demonstration Allocation`,
    description: promo.description,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${promo.title} | NEXORA Demonstrations`,
      description: promo.description,
      url: canonical,
    },
  };
}

export default async function OfferDetailPage({
  params,
}: OfferDetailPageProps) {
  const { slug } = await params;
  const promo = getPromotionBySlug(slug);

  // Unknown or disabled promotion returns 404 per Prompt 15 specification
  if (!promo || !promo.enabled) {
    notFound();
  }

  const eligibleProducts = getPromotionEligibleProducts(promo, products);
  const primaryProduct = eligibleProducts[0];

  const breadcrumbs = [
    { label: "Exclusive Offers", href: "/offers" },
    { label: promo.title, current: true },
  ];

  return (
    <div className="py-8 sm:py-14 md:py-16">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Offers", path: "/offers" },
          { name: promo.title, path: `/offers/${promo.slug}` },
        ])}
      />
      <SiteContainer size="xl" className="space-y-8 sm:space-y-12">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumbs items={breadcrumbs} />
          <Link href="/offers">
            <PremiumButton
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to All Offers
            </PremiumButton>
          </Link>
        </div>

        {/* Promotion Header Hero */}
        <div className="rounded-3xl p-6 sm:p-10 md:p-12 bg-gradient-to-br from-[#0B1532]/95 via-[#081024]/90 to-[#040814]/95 border border-white/[0.08] shadow-2xl relative overflow-hidden space-y-6">
          {/* Ambient Lighting Background */}
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant={promo.badgeVariant || "electric"} size="md" dot>
                {promo.badgeText}
              </Badge>
              <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                <Tag className="h-3 w-3" />
                <span>Save {promo.savingsPercent}% ({promo.formattedSavingsAmount})</span>
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                {promo.categoryName} Division
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {promo.title}
            </h1>

            <p className="text-base sm:text-lg text-blue-300 font-medium">
              {promo.tagline}
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              {promo.description}
            </p>
          </div>

          {/* Demonstration Notice Strip */}
          <div className="relative z-10 p-3.5 sm:p-4 rounded-xl bg-black/40 border border-blue-500/20 text-xs text-blue-200/90 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Demonstration Price Notice:</strong> This allocation reflects an illustrative laboratory test incentive calculated against base catalogue prices in Indian Rupees (INR). NEXORA is currently a portfolio demonstration storefront; no real financial transactions can be executed.
            </p>
          </div>
        </div>

        {/* Two-Column Grid: Pricing Breakdown & Eligibility */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Demo Pricing Economics */}
          <div className="lg:col-span-5 space-y-6">
            <Card variant="glass" className="p-6 sm:p-8 space-y-6 bg-[#091124]/90 border-blue-500/30">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-400" />
                  <span>Demonstration Pricing Breakdown</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Calculated against single-source-of-truth catalogue values.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {/* Original Catalogue Price */}
                <div className="flex items-center justify-between text-sm py-2 border-b border-white/[0.06]">
                  <span className="text-slate-400">Catalogue Baseline Price</span>
                  <span className="font-mono text-slate-300 line-through">
                    {promo.formattedOriginalPrice}
                  </span>
                </div>

                {/* Promotional Incentive Savings */}
                <div className="flex items-center justify-between text-sm py-2 border-b border-white/[0.06] text-emerald-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Tag className="h-3.5 w-3.5" />
                    <span>Incentive Reduction ({promo.savingsPercent}%)</span>
                  </span>
                  <span className="font-mono font-bold">
                    -{promo.formattedSavingsAmount}
                  </span>
                </div>

                {/* Final Demo Price */}
                <div className="flex items-baseline justify-between pt-3 text-white">
                  <div>
                    <span className="block text-xs uppercase font-mono tracking-wider text-blue-400">
                      Illustrative Demo Price
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
                      {promo.formattedPromotionalPrice}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    INR Currency
                  </span>
                </div>
              </div>

              {promo.applicableVariantsNote && (
                <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <p>{promo.applicableVariantsNote}</p>
                </div>
              )}

              {primaryProduct && (
                <Link href={`/products/${primaryProduct.slug}`} className="block pt-2">
                  <PremiumButton
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    className="w-full justify-center"
                  >
                    Inspect {primaryProduct.name}
                  </PremiumButton>
                </Link>
              )}
            </Card>

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#080E22] border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Eligible Units
                </span>
                <span className="text-lg font-bold text-white">
                  {eligibleProducts.length} Specimen{eligibleProducts.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#080E22] border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Hardware Division
                </span>
                <span className="text-lg font-bold text-blue-400">
                  {promo.categoryName}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Eligibility Conditions & Terms */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eligibility Rules */}
            <Card variant="glass" className="p-6 sm:p-8 space-y-4 bg-[#091124]/90">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span>Allocation Eligibility Requirements</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Conditions required to qualify for this demonstration incentive tier.
                </p>
              </div>

              <ul className="space-y-2.5 pt-2">
                {promo.eligibilityRules.map((rule, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0 mt-2" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Full Terms & Conditions */}
            <Card variant="glass" className="p-6 sm:p-8 space-y-4 bg-[#091124]/90">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  <span>Governance Terms &amp; Commercial Disclaimers</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Architectural rules governing this promotional allocation.
                </p>
              </div>

              <ul className="space-y-2.5 pt-2">
                {promo.termsAndConditions.map((term, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-600 shrink-0 mt-1.5" />
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Eligible Hardware Products Section */}
        <section aria-labelledby="eligible-products-heading" className="space-y-6 pt-6">
          <div className="space-y-1">
            <h2
              id="eligible-products-heading"
              className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2"
            >
              <Layers className="h-5 w-5 text-blue-400" />
              <span>Eligible Hardware Specimens</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              The following precision hardware units qualify for this demonstration allocation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Bottom Back Button */}
        <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
          <Link href="/offers">
            <PremiumButton
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Return to All Offers
            </PremiumButton>
          </Link>

          <Link href="/products">
            <PremiumButton
              variant="secondary"
              size="md"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Browse Full Catalogue
            </PremiumButton>
          </Link>
        </div>
      </SiteContainer>
    </div>
  );
}
