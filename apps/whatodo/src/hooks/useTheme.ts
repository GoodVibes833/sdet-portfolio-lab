"use client";

import { useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark" | "system";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem("theme") as Theme | null;
    return stored || "system";
  } catch {
    return "system";
  }
}

function applyTheme(theme: Theme) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const isDark = theme === "dark" || (theme === "system" && mq.matches);
  document.documentElement.classList.toggle("dark", isDark);
  return isDark ? "dark" : "light";
}

// Global store for cross-component sync
let currentTheme: Theme = "system";
const listeners = new Set<() => void>();

function setGlobalTheme(t: Theme) {
  currentTheme = t;
  try { localStorage.setItem("theme", t); } catch {}
  applyTheme(t);
  listeners.forEach((fn) => fn());
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      currentTheme = getStoredTheme();
      return currentTheme;
    }
    return "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Apply theme on mount
    const resolved = applyTheme(theme);
    setResolvedTheme(resolved);

    // Subscribe to system changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const resolved = applyTheme(currentTheme);
      setResolvedTheme(resolved);
    };
    mq.addEventListener("change", onChange);

    // Subscribe to global store changes
    const onStoreChange = () => {
      setThemeState(currentTheme);
      const resolved = applyTheme(currentTheme);
      setResolvedTheme(resolved);
    };
    listeners.add(onStoreChange);

    return () => {
      mq.removeEventListener("change", onChange);
      listeners.delete(onStoreChange);
    };
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setGlobalTheme(t);
    setThemeState(t);
    const resolved = applyTheme(t);
    setResolvedTheme(resolved);
  }, []);

  return { theme, resolvedTheme, setTheme };
}
