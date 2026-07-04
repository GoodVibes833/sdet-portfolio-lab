"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface Props {
  placeId: string;
  placeName: string;
  currentAddress?: string;
}

export default function ReportLocationButton({ placeId, placeName, currentAddress }: Props) {
  const [reported, setReported] = useState(false);

  const handleReport = () => {
    try {
      const reports = JSON.parse(localStorage.getItem("wrong-location-reports") || "[]");
      reports.push({
        placeId,
        placeName,
        currentAddress,
        reportedAt: new Date().toISOString(),
      });
      localStorage.setItem("wrong-location-reports", JSON.stringify(reports));
      setReported(true);
    } catch {
      setReported(true);
    }
  };

  if (reported) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm font-semibold bg-green-50 px-3 py-2 rounded-xl border border-green-100">
        <CheckCircle2 size={14} />
        신고 완료 — 감사합니다!
      </div>
    );
  }

  return (
    <button
      onClick={handleReport}
      className="flex items-center gap-2 text-slate-400 text-xs font-medium hover:text-orange-500 transition-colors"
    >
      <AlertTriangle size={12} />
      위치가 틀려요
    </button>
  );
}
