"use client";

import { useEffect, useState } from "react";
import { MapPin, Navigation, X } from "lucide-react";
import { useGeoContext } from "@/context/GeolocationContext";

export default function LocationPermissionModal() {
  const { permissionStatus, requestLocation, lat } = useGeoContext();
  const [open, setOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Show modal when status is "prompt" (not yet asked) or "unknown"
    if (permissionStatus === "prompt" || permissionStatus === "unknown") {
      const dismissed = sessionStorage.getItem("location_modal_dismissed");
      if (!dismissed) {
        // Small delay so it doesn't flash immediately on load
        const t = setTimeout(() => setOpen(true), 800);
        return () => clearTimeout(t);
      }
    }
  }, [permissionStatus]);

  // Close when location granted
  useEffect(() => {
    if (lat !== null) setOpen(false);
  }, [lat]);

  const handleAllow = () => {
    setRequesting(true);
    requestLocation();
    setOpen(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("location_modal_dismissed", "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleDismiss} />
      <div className="relative w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
        {/* Header gradient */}
        <div className="h-32 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1e3a5f,#2d5a8e)" }}>
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <MapPin size={32} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center">
              <Navigation size={12} className="text-white" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={16} className="text-white" />
          </button>

          <h2 className="text-xl font-black text-slate-900 mb-2 text-center">
            📍 내 주변 핫플 찾기
          </h2>
          <p className="text-sm text-slate-500 text-center leading-relaxed mb-6">
            현재 위치를 공유하면 가장 가까운 맛집, 카페, 액티비티를 거리순으로 바로 찾아줘요.
          </p>

          <div className="space-y-2.5 mb-6">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl">
              <span className="text-xl">🗺️</span>
              <p className="text-sm text-slate-700 font-medium">지도에서 내 위치 실시간 표시</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl">
              <span className="text-xl">📏</span>
              <p className="text-sm text-slate-700 font-medium">장소까지 거리를 m/km로 표시</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-2xl">
              <span className="text-xl">🔒</span>
              <p className="text-sm text-slate-700 font-medium">위치 정보는 이 기기에서만 사용돼요</p>
            </div>
          </div>

          <button
            onClick={handleAllow}
            disabled={requesting}
            className="w-full py-3.5 rounded-2xl font-black text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#4285F4,#1a73e8)" }}
          >
            <Navigation size={18} />
            {requesting ? "위치 확인 중..." : "현재 위치 공유하기"}
          </button>
          <button
            onClick={handleDismiss}
            className="w-full mt-2 py-2.5 text-sm text-slate-400 hover:text-slate-600 transition-colors font-medium"
          >
            나중에 할게요
          </button>
        </div>
      </div>
    </div>
  );
}
