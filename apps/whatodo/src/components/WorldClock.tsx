"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const ZONES = [
  { label: "밴쿠버", tz: "America/Vancouver" },
  { label: "토론토", tz: "America/Toronto" },
  { label: "서울", tz: "Asia/Seoul" },
];

export default function WorldClockWidget() {
  const [times, setTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const next: Record<string, string> = {};
      ZONES.forEach((z) => {
        next[z.label] = now.toLocaleTimeString("ko-KR", {
          timeZone: z.tz,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      });
      setTimes(next);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 px-3 py-2 shadow-sm">
      <Clock size={16} className="text-slate-400" />
      {ZONES.map((z) => (
        <div key={z.label} className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400">{z.label}</span>
          <span className="text-xs font-black text-slate-700 dark:text-slate-200">{times[z.label]}</span>
        </div>
      ))}
    </div>
  );
}
