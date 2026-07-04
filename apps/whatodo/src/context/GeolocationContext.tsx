"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { PermissionStatus } from "@/hooks/useGeolocation";

export interface GeolocationContextValue {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
  permissionStatus: PermissionStatus;
  requestLocation: () => void;
}

const GeolocationContext = createContext<GeolocationContextValue | null>(null);

export function GeolocationProvider({ children }: { children: ReactNode }) {
  const geo = useGeolocation();
  return (
    <GeolocationContext.Provider value={geo}>
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeoContext(): GeolocationContextValue {
  const ctx = useContext(GeolocationContext);
  if (!ctx) throw new Error("useGeoContext must be inside GeolocationProvider");
  return ctx;
}
