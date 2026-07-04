"use client";

import { useGamification } from "@/hooks/useGamification";
import { Trophy } from "lucide-react";

export default function BadgePanel() {
  const { earnedBadges, allBadges, points, level, title, progress } = useGamification();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-yellow-500" />
          <span className="text-xs font-bold text-slate-600">
            Lv.{level} {title} · {points}P
          </span>
        </div>
        <span className="text-[10px] font-bold text-slate-400">{progress}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex gap-2 flex-wrap">
        {allBadges.map((badge) => {
          const earned = (earnedBadges || []).includes(badge.id);
          return (
            <div
              key={badge.id}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                earned
                  ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                  : "bg-slate-50 border-slate-100 text-slate-400 opacity-60"
              }`}
              title={badge.condition}
            >
              <span>{badge.icon}</span>
              <span>{badge.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
