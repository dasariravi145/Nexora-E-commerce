import { SiteContainer } from "@/components/ui/site-container";

export default function ProductsLoading() {
  return (
    <div className="py-12 sm:py-20 animate-pulse">
      <SiteContainer size="xl" className="space-y-12">
        {/* Header Skeleton */}
        <div className="space-y-3 max-w-xl">
          <div className="h-6 w-36 rounded-full bg-slate-800" />
          <div className="h-10 w-80 rounded-xl bg-slate-800" />
          <div className="h-4 w-96 rounded bg-slate-850" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-8 w-28 rounded-xl bg-slate-800/80 shrink-0" />
          ))}
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#091124] border border-white/[0.06] space-y-4"
            >
              <div className="h-48 rounded-xl bg-slate-800/60" />
              <div className="space-y-2">
                <div className="h-3 w-20 rounded bg-slate-800" />
                <div className="h-5 w-48 rounded bg-slate-800" />
                <div className="h-3 w-full rounded bg-slate-850" />
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex justify-between items-center">
                <div className="h-5 w-24 rounded bg-slate-800" />
                <div className="h-8 w-24 rounded-lg bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </SiteContainer>
    </div>
  );
}
