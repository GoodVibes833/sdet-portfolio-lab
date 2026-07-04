"use client";

import { useEffect } from "react";
import { useServiceWorker } from "@/hooks/useServiceWorker";

export default function ServiceWorkerRegister() {
  const { install } = useServiceWorker();

  useEffect(() => {
    // Register service worker on mount
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      install();
    }
  }, [install]);

  return null;
}
