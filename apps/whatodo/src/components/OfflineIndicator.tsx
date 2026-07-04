"use client";

import { useServiceWorker } from "@/hooks/useServiceWorker";
import { WifiOff, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OfflineIndicator() {
  const { isOffline, updateAvailable } = useServiceWorker();

  if (!isOffline && !updateAvailable) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all",
        isOffline
          ? "bg-amber-500 text-white"
          : "bg-blue-500 text-white"
      )}
    >
      <div className="flex items-center gap-2">
        {isOffline ? (
          <>
            <WifiOff size={16} />
            <span>오프라인 모드 - 캐시된 데이터 사용 중</span>
          </>
        ) : (
          <>
            <RefreshCw size={16} className="animate-spin" />
            <span>업데이트 사용 가능</span>
          </>
        )}
      </div>
    </div>
  );
}
