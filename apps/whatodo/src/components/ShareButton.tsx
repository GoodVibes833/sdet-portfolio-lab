"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Share2, Link2, MessageCircle, X, Copy, Check } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";

interface Props {
  title: string;
  url: string;
  address?: string;
  image?: string;
}

export default function ShareButton({ title, url, address, image }: Props) {
  const { awardBadge } = useGamification();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      awardBadge("social");
    } catch {
      alert("클립보드 복사 실패");
    }
  };

  const template = `${title}\n${address ? address + "\n" : ""}${url}`;

  const handleCopyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(template);
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2000);
    } catch {
      alert("템플릿 복사 실패");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url, text: address });
        return;
      } catch {
        // fallback
      }
    }
    handleCopyLink();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
      >
        <Share2 size={14} />
        공유
      </button>

      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">공유하기</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <QRCodeSVG value={url} size={160} level="M" includeMargin />
              </div>
              <p className="text-xs text-slate-500">QR 코드 스캔으로 바로 이동</p>
            </div>

            {/* Copy buttons */}
            <div className="space-y-2">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-700 transition-colors"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Link2 size={16} />}
                {copied ? "링크 복사됨" : "링크 복사"}
              </button>
              <button
                onClick={handleCopyTemplate}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-700 transition-colors"
              >
                {copiedTemplate ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copiedTemplate ? "템플릿 복사됨" : "공유 템플릿 복사"}
              </button>
            </div>

            {/* Social share */}
            <div className="flex gap-2">
              <a
                href={`https://share.naver.com/web/shareView?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#03C75A] text-white text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={14} />
                네이버
              </a>
              <button
                onClick={handleNativeShare}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition-colors"
              >
                <Share2 size={14} />
                기본 공유
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
