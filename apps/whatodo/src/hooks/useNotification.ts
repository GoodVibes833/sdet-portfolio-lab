"use client";

import { useState, useCallback, useEffect } from "react";

export type NotificationPermission = "default" | "granted" | "denied";

export interface UseNotificationReturn {
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  sendLocalNotification: (title: string, options?: NotificationOptions) => void;
  isSupported: boolean;
}

export function useNotification(): UseNotificationReturn {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const isSupported = typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator;

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission as NotificationPermission);
    }
  }, [isSupported]);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) return "denied";
    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermission);
      return result as NotificationPermission;
    } catch {
      return "denied";
    }
  }, [isSupported]);

  const sendLocalNotification = useCallback(
    async (title: string, options?: NotificationOptions) => {
      if (!isSupported || permission !== "granted") return;

      try {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(title, {
          icon: "/globe.svg",
          badge: "/globe.svg",
          ...options,
        });
      } catch {
        // Fallback
        try {
          new Notification(title, options);
        } catch {
          console.warn("[Notification] Failed to show notification");
        }
      }
    },
    [isSupported, permission]
  );

  return { permission, requestPermission, sendLocalNotification, isSupported };
}
