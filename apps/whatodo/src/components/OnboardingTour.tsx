"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, MapPin, Search, Heart, Share2 } from "lucide-react";

const STEPS = [
  {
    title: "지도 탐색",
    description: "지도를 움직이며 캐나다 워홀 핫플을 찾아보세요. 마커를 클릭하면 상세 정보가 나타나요.",
    icon: MapPin,
  },
  {
    title: "검색 & 필터",
    description: "검색창에서 장소를 검색하고, 카테고리와 반경 필터로 원하는 장소만 찾아보세요.",
    icon: Search,
  },
  {
    title: "찜 & 방문 체크",
    description: "마음에 드는 장소는 하트를 눌러 찜하고, 방문한 곳은 체크인 해보세요.",
    icon: Heart,
  },
  {
    title: "공유 & 소셜",
    description: "QR코드나 공유 템플릿으로 친구에게 장소를 공유하고, 투표도 참여해보세요.",
    icon: Share2,
  },
];

export default function OnboardingTour() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem("onboarding-done");
    if (!done) setShow(true);
  }, []);

  const close = () => {
    setShow(false);
    localStorage.setItem("onboarding-done", "true");
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else close();
  };

  if (!show) return null;

  const Icon = STEPS[step].icon;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">{step + 1} / {STEPS.length}</span>
          <button onClick={close} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-slate-700 flex items-center justify-center">
            <Icon size={24} className="text-blue-500" />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">{STEPS[step].title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{STEPS[step].description}</p>
        </div>
        <div className="flex gap-2 pt-2">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i === step ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-700"}`} />
          ))}
        </div>
        <button
          onClick={next}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-colors"
        >
          {step < STEPS.length - 1 ? "다음" : "시작하기"}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
