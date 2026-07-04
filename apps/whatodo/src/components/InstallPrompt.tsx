"use client";

import { Download, X, Share, PlusSquare } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export default function InstallPrompt() {
  const { canInstall, isInstalled, isIOS, prompt, dismiss, dismissed } = usePWAInstall();

  if (isInstalled || dismissed) return null;

  // iOS Safari: show manual instructions
  if (isIOS) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 max-w-lg mx-auto animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Share size={18} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 text-sm">홈 화면에 추가하기</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              <span className="inline-flex items-center gap-0.5 font-medium"><Share size={10} /> 공유</span> 버튼을 누르고
              <span className="inline-flex items-center gap-0.5 font-medium"><PlusSquare size={10} /> 홈 화면에 추가</span>를 선택하세요
            </p>
          </div>
          <button onClick={dismiss} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors shrink-0">
            <X size={16} className="text-slate-400" />
          </button>
        </div>
      </div>
    );
  }

  // Android/Chrome: show install button
  if (canInstall) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] rounded-2xl shadow-xl p-4 max-w-lg mx-auto animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Download size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm">앱 설치하기</p>
            <p className="text-xs text-blue-200 mt-0.5">홈 화면에 바로가기를 추가하면 더 빠르게 사용할 수 있어요</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={prompt}
              className="px-4 py-2 rounded-xl bg-white text-[#1e3a5f] text-xs font-black hover:bg-blue-50 transition-colors"
            >
              설치
            </button>
            <button onClick={dismiss} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X size={16} className="text-blue-200" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
