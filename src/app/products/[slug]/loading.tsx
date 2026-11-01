import { SiteContainer } from "@/components/ui/site-container";

export default function ProductDetailLoading() {
  return (
    <div className="py-12 sm:py-20 animate-pulse">
      <SiteContainer size="xl" className="space-y-10 sm:space-y-12">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-64 rounded bg-slate-800" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Visual Skeleton */}
          <div className="lg:col-span-6 space-y-4">
            <div className="h-96 rounded-2xl bg-slate-800/80" />
            <div className="h-10 rounded-xl bg-slate-800/50" />
          </div>

          {/* Details Skeleton */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="h-5 w-28 rounded-full bg-slate-800" />
              <div className="h-10 w-3/4 rounded-xl bg-slate-800" />
              <div className="h-4 w-1/2 rounded bg-slate-800" />
            </div>

            <div className="h-24 rounded-2xl bg-slate-800/60" />

            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 rounded-lg bg-slate-800/50" />
              ))}
            </div>

            <div className="h-11 w-48 rounded-xl bg-slate-800" />
          </div>
        </div>
      </SiteContainer>
    </div>
  );
}
