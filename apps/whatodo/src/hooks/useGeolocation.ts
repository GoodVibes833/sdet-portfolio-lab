"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type PermissionStatus = "unknown" | "prompt" | "granted" | "denied";

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
  permissionStatus: PermissionStatus;
  requestLocation: () => void;
}

const STORAGE_KEY = "geo_permission_asked";

function safeGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<Omit<GeolocationState, "requestLocation">>({
    lat: null,
    lng: null,
    error: null,
    loading: false,
    permissionStatus: "unknown",
  });
  const watchIdRef = useRef<number | null>(null);

  const clearWatch = useCallback(() => {
    if (watchIdRef.current !== null && typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const fetchLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setState((s) => ({
        ...s,
        error: "위치 정보를 지원하지 않는 브라우저예요",
        loading: false,
        permissionStatus: "denied",
      }));
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        safeSet(STORAGE_KEY, "granted");
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
          permissionStatus: "granted",
        });
      },
      (err) => {
        const isDenied = err.code === 1; // GeolocationPositionError.PERMISSION_DENIED
        setState((s) => ({
          ...s,
          lat: null,
          lng: null,
          error: isDenied
            ? "위치 권한이 거부됐어요. 브라우저 설정에서 허용해주세요."
            : "위치를 가져올 수 없어요. 잠시 후 다시 시도해주세요.",
          loading: false,
          permissionStatus: isDenied ? "denied" : "prompt",
        }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, []);

  const startWatching = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;
    clearWatch();
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        safeSet(STORAGE_KEY, "granted");
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
          permissionStatus: "granted",
        });
      },
      () => {
        // Silent fail on watch errors — getCurrentPosition handles main flow
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 }
    );
  }, [clearWatch]);

  // On mount: try to get permission status, then fetch location if possible
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          const status = result.state as PermissionStatus;
          setState((s) => {
            const definitive = s.permissionStatus === "granted" || s.permissionStatus === "denied";
            return { ...s, permissionStatus: definitive ? s.permissionStatus : status };
          });
          if (status === "granted") {
            fetchLocation();
            startWatching();
          }
          result.onchange = () => {
            const newStatus = result.state as PermissionStatus;
            setState((s) => ({ ...s, permissionStatus: newStatus }));
            if (newStatus === "granted") {
              fetchLocation();
              startWatching();
            }
          };
        })
        .catch(() => {
          // permissions API not supported — try anyway
          const asked = safeGet(STORAGE_KEY);
          if (asked === "granted") {
            fetchLocation();
            startWatching();
          }
        });
    } else {
      // No permissions API — try anyway
      const asked = safeGet(STORAGE_KEY);
      if (asked === "granted") {
        fetchLocation();
        startWatching();
      }
    }

    return () => clearWatch();
  }, [fetchLocation, startWatching, clearWatch]);

  const requestLocation = useCallback(() => {
    fetchLocation();
    startWatching();
  }, [fetchLocation, startWatching]);

  return { ...state, requestLocation };
}
