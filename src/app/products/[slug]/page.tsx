import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteContainer } from "@/components/ui/site-container";
import { PremiumButton } from "@/components/ui/premium-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { products, getProductBySlug } from "@/data/products";
import { ProductDetailClient } from "@/components/product-detail/product-detail-client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductSpecifications } from "@/components/product-detail/product-specifications";
import { ProductHighlights } from "@/components/product-detail/product-highlights";
import { RelatedProducts } from "@/components/product-detail/related-products";
import { ArrowLeft, ArrowRight, Shield, Award, Terminal } from "lucide-react";

import { getCanonicalUrl } from "@/config/seo";
import {
  JsonLd,
  generateProductSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo-structured-data";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Hardware Specimen Not Found | NEXORA",
      description: "The requested hardware specimen does not exist in the NEXORA catalogue.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical = getCanonicalUrl(`/products/${product.slug}`);

  return {
    title: `${product.name} — ${product.tagline}`,
    description: product.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${product.name} | NEXORA Showroom`,
      description: product.description,
      url: canonical,
      images: product.images.map((img) => ({
        url: img.url,
        alt: img.alt,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${product.tagline}`,
      description: product.description,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  // Return standard 404 for unknown product slugs
  if (!product) {
    notFound();
  }

  return (
    <div className="py-8 sm:py-16">
      {/* Schema.org Truthful Product & Breadcrumb Structured Data */}
      <JsonLd data={generateProductSchema(product)} />
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: product.category, path: `/categories/${product.categorySlug}` },
          { name: product.name, path: `/products/${product.slug}` },
        ])}
      />
      <SiteContainer size="xl" className="space-y-12 sm:space-y-16">
        {/* Navigation Breadcrumbs & Back Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <Breadcrumbs
            items={[
              { label: "Categories", href: "/categories" },
              { label: product.category, href: `/categories/${product.categorySlug}` },
              { label: product.name, current: true },
            ]}
          />

          <Link href="/products">
            <PremiumButton
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Catalogue
            </PremiumButton>
          </Link>
        </div>

        {/* Primary Product Showcase: Interactive Gallery Left, Variant & Price Right */}
        <ProductDetailClient product={product} />

        {/* Architectural Highlights */}
        {product.features && product.features.length > 0 && (
          <ProductHighlights
            features={product.features}
            productName={product.name}
          />
        )}

        {/* Detailed Technical Specifications Matrix */}
        <ProductSpecifications
          specifications={product.specifications}
          category={product.category}
        />

        {/* Engineering Pedigree & Quality Assurance Card */}
        <Card variant="solid" className="p-6 sm:p-8 space-y-4 border-[#E2E8F0] bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#E2E8F0] pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] border border-[#2563EB]/20 text-[#2563EB]">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                Engineering Pedigree &amp; Factory Calibration
              </h3>
              <p className="text-xs text-[#475569]">
                All NEXORA specimens undergo 240-hour sub-zero stress validation and laser interferometer inspection.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-[#475569] pt-2">
            <div className="flex items-start gap-2.5">
              <Shield className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#0F172A] block">Hardware Security Enclave</span>
                <span className="text-[#64748B]">Hardware-isolated cryptographic processor with zero telemetry leakage.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Terminal className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#0F172A] block">Spatial Firmware Baseline</span>
                <span className="text-[#64748B]">Deterministic real-time operating micro-kernel with sub-millisecond interrupts.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Award className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#0F172A] block">3-Year Factory Warranty</span>
                <span className="text-[#64748B]">Global advance replacement guarantee directly from certified engineering labs.</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Related Hardware Units */}
        <RelatedProducts currentProduct={product} />

        {/* Bottom Return to Catalogue & Division CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E2E8F0]">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-[#0F172A]">
              Looking for other configurations?
            </h4>
            <p className="text-xs text-[#475569]">
              Explore our full 30-unit hardware catalogue or filter by engineering division.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href={`/categories/${product.categorySlug}`} className="w-full sm:w-auto">
              <PremiumButton variant="outline" size="sm" className="w-full">
                {product.category} Division
              </PremiumButton>
            </Link>

            <Link href="/products" className="w-full sm:w-auto">
              <PremiumButton variant="primary" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />} className="w-full">
                Full Catalogue
              </PremiumButton>
            </Link>
          </div>
        </div>

        {/* Showroom Status Notice */}
        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm text-xs text-[#475569] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
          <p>
            Phase 3 Showroom Active: High-precision gallery, dynamic variant selectors, and real-time INR pricing verified. 3D exploded turntable inspection will activate in Prompt 12.
          </p>
          <Badge variant="electric" size="sm" className="shrink-0 self-start sm:self-auto">
            Phase 3 • Unit Detail Active
          </Badge>
        </div>
      </SiteContainer>
    </div>
  );
}
