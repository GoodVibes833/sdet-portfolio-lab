"use client";

export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      {/* 헤더 스켈레톤 */}
      <div className="h-8 bg-slate-200 rounded-xl w-3/4" />
      
      {/* 카드 스켈레톤들 */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3">
          <div className="flex gap-3">
            <div className="h-16 w-16 bg-slate-200 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-slate-200 rounded-lg w-2/3" />
              <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
            </div>
          </div>
          <div className="h-3 bg-slate-200 rounded-lg w-full" />
          <div className="h-3 bg-slate-200 rounded-lg w-5/6" />
        </div>
      ))}
    </div>
  );
}
