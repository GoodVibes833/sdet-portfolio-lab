"use client";

import { useEffect, useState, useCallback } from "react";

interface ServiceWorkerState {
  isInstalled: boolean;
  isOffline: boolean;
  updateAvailable: boolean;
  install: () => Promise<void>;
}

export function useServiceWorker(): ServiceWorkerState {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Install service worker
  const install = useCallback(async () => {
    if (!("serviceWorker" in navigator)) {
      console.warn("Service Worker not supported");
      return;
    }

    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      setRegistration(reg);
      console.log("[SW] Registered successfully:", reg.scope);

      // Check if already installed
      if (reg.active) {
        setIsInstalled(true);
      }

      // Listen for updates
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        }
      });
    } catch (error) {
      console.error("[SW] Registration failed:", error);
    }
  }, []);

  useEffect(() => {
    // Register service worker on mount
    if (typeof window !== "undefined") {
      install();
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOffline(false);
      console.log("[SW] Back online");
    };

    const handleOffline = () => {
      setIsOffline(true);
      console.log("[SW] Gone offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial state
    setIsOffline(!navigator.onLine);

    // Listen for messages from service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "SW_UPDATE") {
        setUpdateAvailable(true);
      }
    };
    navigator.serviceWorker?.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      navigator.serviceWorker?.removeEventListener("message", handleMessage);
    };
  }, [install]);

  return {
    isInstalled,
    isOffline,
    updateAvailable,
    install,
  };
}

/**
 * Request background sync for offline operations
 */
export async function requestBackgroundSync(tag: string): Promise<void> {
  if (!("serviceWorker" in navigator) || !("SyncManager" in window)) {
    console.warn("Background Sync not supported");
    return;
  }

  const reg = await navigator.serviceWorker.ready;
  try {
    await (reg as ServiceWorkerRegistration & { sync: { register(tag: string): Promise<void> } }).sync.register(tag);
    console.log(`[SW] Background sync registered: ${tag}`);
  } catch (error) {
    console.error("[SW] Background sync registration failed:", error);
  }
}
