"use client";

import { useState } from "react";
import { HelpCircle, X, Keyboard, Eye, Volume2 } from "lucide-react";

export default function GuidePanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-16 z-[999] w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center backdrop-blur-sm"
        title="도움말"
      >
        <HelpCircle size={18} className="text-slate-600 dark:text-slate-300" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">도움말</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex gap-3">
                <Keyboard size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p><strong>키보드 단축키</strong><br/>ESC: 상세 패널 닫기<br/>+/–: 지도 확대/축소</p>
              </div>
              <div className="flex gap-3">
                <Eye size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p><strong>접근성</strong><br/>모든 버튼에 aria-label이 있습니다. 고대비 모드는 설정에서 켤 수 있어요.</p>
              </div>
              <div className="flex gap-3">
                <Volume2 size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p><strong>알림</strong><br/>포인트 획득 시 알림이 표시됩니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
