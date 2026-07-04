"use client";

import { useState, useEffect } from "react";
import { Settings, Type, Contrast, X } from "lucide-react";

const FONTS = [
  { label: "기본", value: "sans-serif", className: "font-sans" },
  { label: "세리프", value: "serif", className: "font-serif" },
  { label: "모노", value: "monospace", className: "font-mono" },
];

export default function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [font, setFont] = useState("sans-serif");
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("font-family");
    if (saved) setFont(saved);
    const hc = localStorage.getItem("high-contrast");
    if (hc) setHighContrast(hc === "true");
  }, []);

  useEffect(() => {
    document.documentElement.style.fontFamily = font === "serif" ? "serif" : font === "monospace" ? "monospace" : "";
    localStorage.setItem("font-family", font);
  }, [font]);

  useEffect(() => {
    if (highContrast) document.documentElement.classList.add("high-contrast");
    else document.documentElement.classList.remove("high-contrast");
    localStorage.setItem("high-contrast", String(highContrast));
  }, [highContrast]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-[999] w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center backdrop-blur-sm"
        title="설정"
      >
        <Settings size={18} className="text-slate-600 dark:text-slate-300" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">설정</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                <Type size={16} /> 폰트
              </div>
              <div className="flex gap-2">
                {FONTS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFont(f.value)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                      font === f.value
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <Contrast size={16} /> 고대비 모드
                </div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${highContrast ? "bg-blue-500" : "bg-slate-300"}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${highContrast ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
              <p className="text-xs text-slate-500">텍스트와 배경의 대비를 높여 가독성을 개선합니다.</p>
            </div>

            <button
              onClick={() => { localStorage.removeItem("onboarding-done"); alert("온보딩이 초기화되었습니다. 새로고침 후 다시 볼 수 있어요."); }}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              온보딩 다시 보기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
