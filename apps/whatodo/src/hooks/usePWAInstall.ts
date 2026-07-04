"use client";

import { useState, useEffect, useCallback } from "react";

export interface UsePWAInstallReturn {
  canInstall: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  prompt: () => void;
  dismiss: () => void;
  dismissed: boolean;
}

export function usePWAInstall(): UsePWAInstallReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already installed
    const checkInstalled = () => {
      const standalone = (window.navigator as any).standalone;
      const displayMode = (window.matchMedia("(display-mode: standalone)").matches);
      setIsInstalled(!!standalone || displayMode);
    };
    checkInstalled();

    // Detect iOS Safari
    const ua = window.navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream);

    // Listen for beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Listen for appinstalled
    const handleInstalled = () => {
      setDeferredPrompt(null);
      setCanInstall(false);
      setIsInstalled(true);
    };
    window.addEventListener("appinstalled", handleInstalled);

    // Check localStorage for dismissed state
    try {
      if (localStorage.getItem("pwa-prompt-dismissed") === "1") {
        setDismissed(true);
      }
    } catch {}

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const prompt = useCallback(() => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice: { outcome: string }) => {
        if (choice.outcome === "accepted") {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
        setCanInstall(false);
      });
    }
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem("pwa-prompt-dismissed", "1");
    } catch {}
  }, []);

  return { canInstall, isInstalled, isIOS, prompt, dismiss, dismissed };
}
