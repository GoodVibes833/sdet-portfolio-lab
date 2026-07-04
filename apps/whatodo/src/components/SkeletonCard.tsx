"use client";

export function SkeletonCard({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-24 bg-slate-200 rounded" />
              <div className="h-2.5 w-16 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-200 rounded" />
            <div className="h-3 w-3/4 bg-slate-200 rounded" />
          </div>
          <div className="mt-3 h-32 bg-slate-200 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonMessage({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3 px-4 py-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`flex items-end gap-2 ${i % 2 === 0 ? "flex-row-reverse" : "flex-row"} animate-pulse`}>
          <div className={`h-10 w-20 rounded-2xl ${i % 2 === 0 ? "bg-orange-200" : "bg-slate-200"}`} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonRanking({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 animate-pulse">
          <div className="w-6 h-6 rounded-full bg-slate-200" />
          <div className="w-10 h-10 rounded-full bg-slate-200" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-24 bg-slate-200 rounded" />
            <div className="h-2.5 w-16 bg-slate-200 rounded" />
          </div>
          <div className="h-5 w-12 bg-slate-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}
