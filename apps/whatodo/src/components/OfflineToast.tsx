"use client";

import { useEffect, useState } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { WifiOff, Wifi, RotateCcw } from "lucide-react";

export default function OfflineToast() {
  const { online, wasOffline } = useOnlineStatus();
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    if (!online) setShowRetry(true);
  }, [online]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (online && !wasOffline) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-[60] flex justify-center pointer-events-none px-4">
      {!online ? (
        <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-3 pointer-events-auto animate-in slide-in-from-top-2 fade-in duration-300">
          <WifiOff size={16} className="text-red-400 shrink-0" />
          <span className="text-sm font-bold">오프라인 상태예요</span>
          <button
            onClick={handleRetry}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold transition-colors"
          >
            <RotateCcw size={12} />
            새로고침
          </button>
        </div>
      ) : wasOffline ? (
        <div className="bg-emerald-500/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 pointer-events-auto animate-in slide-in-from-top-2 fade-in duration-300">
          <Wifi size={14} className="shrink-0" />
          <span className="text-sm font-bold">연결되었어요!</span>
        </div>
      ) : null}
    </div>
  );
}
