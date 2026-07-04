"use client";

import { useState, useRef } from "react";
import { Shuffle } from "lucide-react";

const PRIZES = [
  { label: "10P", points: 10, color: "#60a5fa" },
  { label: "50P", points: 50, color: "#34d399" },
  { label: "꽝", points: 0, color: "#f87171" },
  { label: "20P", points: 20, color: "#60a5fa" },
  { label: "100P", points: 100, color: "#fbbf24" },
  { label: "30P", points: 30, color: "#60a5fa" },
  { label: "꽝", points: 0, color: "#f87171" },
  { label: "5P", points: 5, color: "#60a5fa" },
];

export default function RouletteWheel({ onWin }: { onWin: (points: number) => void }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const lastSpin = useRef<string | null>(null);

  const spin = () => {
    if (spinning) return;
    // daily limit check
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem("rouletteDate");
    if (lastDate === today) {
      setResult("오늘은 이미 돌렸어요! 내일 다시 오세요 🎰");
      return;
    }

    setSpinning(true);
    setResult(null);
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const baseAngle = 360 * extraSpins;
    const randomOffset = Math.floor(Math.random() * 360);
    const total = baseAngle + randomOffset;
    setRotation((prev) => prev + total);

    const segmentAngle = 360 / PRIZES.length;
    const normalized = (360 - ((total % 360) + segmentAngle / 2) % 360) % 360;
    const index = Math.floor(normalized / segmentAngle) % PRIZES.length;
    const prize = PRIZES[index];

    setTimeout(() => {
      setSpinning(false);
      setResult(`${prize.label} 당첨!`);
      onWin(prize.points);
      localStorage.setItem("rouletteDate", today);
      lastSpin.current = today;
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="relative w-40 h-40">
        {/* Arrow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-slate-800" />
        </div>
        {/* Wheel */}
        <div
          className="w-full h-full rounded-full border-4 border-slate-200 relative overflow-hidden transition-transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: spinning ? "3s" : "0s",
            transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          {PRIZES.map((prize, i) => {
            const angle = (360 / PRIZES.length) * i;
            return (
              <div
                key={i}
                className="absolute w-full h-full flex items-center justify-center"
                style={{
                  transform: `rotate(${angle}deg)`,
                  clipPath: `polygon(50% 50%, 100% 0%, 100% 100%)`,
                  background: prize.color,
                }}
              />
            );
          })}
          {/* Labels */}
          {PRIZES.map((prize, i) => {
            const angle = (360 / PRIZES.length) * i + (360 / PRIZES.length) / 2;
            return (
              <div
                key={`label-${i}`}
                className="absolute w-full h-full flex items-start justify-center pt-3"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <span className="text-[10px] font-black text-white drop-shadow">{prize.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 text-white text-sm font-bold hover:bg-purple-600 disabled:opacity-50 transition-colors"
      >
        <Shuffle size={14} />
        {spinning ? "돌리는 중..." : "룰렛 돌리기"}
      </button>
      {result && (
        <p className={`text-xs font-bold ${result.includes("꽝") ? "text-red-500" : "text-green-600"}`}>
          {result}
        </p>
      )}
    </div>
  );
}
