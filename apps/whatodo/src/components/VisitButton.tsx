"use client";

import { CheckCircle2, Circle } from "lucide-react";

interface Props {
  placeId: string;
  hasVisited: boolean;
  onCheckIn: () => void;
  onUncheck: () => void;
}

export default function VisitButton({ placeId, hasVisited, onCheckIn, onUncheck }: Props) {
  return (
    <button
      onClick={() => hasVisited ? onUncheck() : onCheckIn()}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all"
      style={hasVisited
        ? { background: "#f0fdf4", color: "#16a34a", border: "1.5px solid #86efac" }
        : { background: "#f1f5f9", color: "#64748b" }}
    >
      {hasVisited ? <CheckCircle2 size={14} /> : <Circle size={14} />}
      {hasVisited ? "갔었음 ✓" : "갔었음"}
    </button>
  );
}
