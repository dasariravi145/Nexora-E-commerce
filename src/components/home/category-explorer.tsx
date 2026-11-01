import Link from "next/link";
import { SiteContainer } from "@/components/ui/site-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HardwareVisual } from "@/components/ui/hardware-visual";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { categories } from "@/data/categories";
import { ArrowRight } from "lucide-react";

export function CategoryExplorer() {
  return (
    <section
      aria-labelledby="category-explorer-heading"
      className="py-14 sm:py-20 bg-[#EAF2FF] border-b border-[#E2E8F0]"
    >
      <SiteContainer size="xl" className="space-y-10 sm:space-y-12">
        <ScrollReveal direction="up" distance={20} duration={550}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <SectionHeading
              badge="Catalogue Matrix"
              badgeVariant="electric"
              title="Explore Hardware Categories"
              description="Engineered across six distinct disciplines ranging from quantum-dot mobile displays to precision planar acoustics."
              id="category-explorer-heading"
            />

            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition-colors shrink-0 group self-start sm:self-auto"
            >
              <span>View All Categories</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        {/* 6 Category Responsive Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {categories.map((cat, index) => (
            <ScrollReveal
              key={cat.id}
              direction="up"
              distance={24}
              duration={600}
              delay={index * 75}
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-2xl block h-full active:scale-[0.99] transition-transform duration-150"
              >
                <Card
                  variant="interactive"
                  className="p-4 sm:p-5 h-full flex flex-col justify-between space-y-3.5 sm:space-y-4 bg-white border border-[#E2E8F0] shadow-xs hover:border-blue-400 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1.5"
                >
                  {/* Visual Illustration */}
                  <div className="overflow-hidden rounded-xl">
                    <HardwareVisual
                      categorySlug={cat.slug}
                      size="md"
                      className="w-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono tracking-wider uppercase text-[#2563EB] font-bold">
                        {cat.tagline}
                      </span>
                      <Badge variant="subtle" size="sm">
                        {cat.itemCount} Units
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {cat.name}
                    </h3>

                    <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  {/* Card Footer Link */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 group-hover:text-[#2563EB] transition-colors">
                    <span className="font-medium">Discover Division</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#2563EB] transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}
