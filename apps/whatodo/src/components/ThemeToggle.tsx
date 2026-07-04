"use client";

import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-lg transition-all ${theme === "light" ? "bg-white shadow-sm text-orange-500" : "text-slate-400 hover:text-slate-600"}`}
        title="밝은 모드"
      >
        <Sun size={14} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-lg transition-all ${theme === "dark" ? "bg-white shadow-sm text-indigo-500" : "text-slate-400 hover:text-slate-600"}`}
        title="어두운 모드"
      >
        <Moon size={14} />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-lg transition-all ${theme === "system" ? "bg-white shadow-sm text-emerald-500" : "text-slate-400 hover:text-slate-600"}`}
        title="시스템 설정"
      >
        <Monitor size={14} />
      </button>
    </div>
  );
}
