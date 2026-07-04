"use client";

import { useEffect, useState } from "react";
import { X, CalendarDays, Send, Check, Link2, Clock, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/database.types";

interface InviteModalProps {
  placeId: string;
  placeName: string;
  placeNeighborhood?: string;
  onClose: () => void;
}

function getNextSaturday() {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 6 ? 7 : 6 - day;
  const sat = new Date(today);
  sat.setDate(today.getDate() + diff);
  return sat.toISOString().split("T")[0];
}

function buildGcalUrl(title: string, date: string, time: string, location: string, msg: string) {
  if (!date) return "";
  const [h, m] = time.split(":").map(Number);
  const endH = String(h + 2).padStart(2, "0");
  const d = date.replace(/-/g, "");
  const t = time.replace(":", "");
  const endT = endH + String(m).padStart(2, "0");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`[캐나다가자] ${title}`)}&dates=${d}T${t}00/${d}T${endT}00&details=${encodeURIComponent(msg || `캐나다가자 앱 초대: ${title}`)}&location=${encodeURIComponent(location || title)}`;
}

export default function InviteModal({ placeId, placeName, placeNeighborhood, onClose }: InviteModalProps) {
  const [myId, setMyId] = useState<string | null>(null);
  const [myNickname, setMyNickname] = useState<string>("");
  const [friends, setFriends] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [proposedDate, setProposedDate] = useState(getNextSaturday());
  const [proposedTime, setProposedTime] = useState("14:00");
  const [message, setMessage] = useState(`${placeName} 같이 가요! 🎉`);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) { setLoading(false); return; }
      setMyId(userId);

      const { data: myProfile } = await (supabase.from("profiles") as any).select("nickname").eq("id", userId).single();
      setMyNickname(myProfile?.nickname ?? "친구");

      const { data: rawFriendships } = await (supabase.from("friendships") as any)
        .select("*")
        .eq("status", "accepted")
        .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

      const friendIds = ((rawFriendships ?? []) as any[]).map((f: any) =>
        f.requester_id === userId ? f.receiver_id : f.requester_id
      );

      if (friendIds.length > 0) {
        const { data: profiles } = await (supabase.from("profiles") as any)
          .select("*")
          .in("id", friendIds);
        setFriends(((profiles ?? []) as unknown) as Profile[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const toggle = (id: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleSend = async () => {
    if (!myId || selected.size === 0 || !proposedDate) return;
    setSending(true);
    const rows = Array.from(selected).map((inviteeId) => ({
      inviter_id: myId,
      invitee_id: inviteeId,
      place_id: placeId,
      place_name: placeName,
      proposed_date: proposedDate,
      proposed_time: proposedTime,
      message: message.trim() || null,
    }));
    await (supabase.from("invites") as any).insert(rows);
    setSent(true);
    setSending(false);
  };

  const gcalUrl = buildGcalUrl(placeName, proposedDate, proposedTime, placeNeighborhood ?? placeName, message);
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/place/${placeId}?invite=1&date=${proposedDate}&time=${proposedTime}`
    : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailSend = async () => {
    if (!email.trim() || !proposedDate) return;
    setEmailSending(true);
    try {
      const res = await fetch("/api/invite-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email.trim(),
          placeName,
          placeUrl: shareUrl,
          proposedDate,
          proposedTime,
          message,
          inviterNickname: myNickname || "친구",
        }),
      });
      const result = await res.json();
      if (result.success) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 3000);
      } else {
        console.error("Email send failed:", result.error);
      }
    } catch (err) {
      console.error("Email send error:", err);
    }
    setEmailSending(false);
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="font-black text-slate-900 text-base">📅 같이 가자고 제안하기</h2>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[260px]">{placeName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all">
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4">
          {sent ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check size={28} className="text-emerald-500" />
              </div>
              <p className="font-black text-slate-800 text-lg">초대장 전송 완료! 🎉</p>
              <p className="text-sm text-slate-400 text-center">
                {selected.size}명에게 초대장을 보냈어요
              </p>
              <a
                href={gcalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg,#4285F4,#1a73e8)" }}
              >
                <CalendarDays size={15} /> 내 Google 캘린더에 추가
              </a>
              <button onClick={onClose} className="w-full py-2.5 text-sm text-slate-400 font-medium">
                닫기
              </button>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* 날짜 + 시간 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <CalendarDays size={11} /> 날짜
                  </p>
                  <input
                    type="date"
                    min={todayStr}
                    value={proposedDate}
                    onChange={(e) => setProposedDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#e85d26] transition-colors"
                  />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock size={11} /> 시간
                  </p>
                  <input
                    type="time"
                    value={proposedTime}
                    onChange={(e) => setProposedTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#e85d26] transition-colors"
                  />
                </div>
              </div>

              {/* 메시지 */}
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">메시지</p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#e85d26] transition-colors resize-none"
                />
              </div>

              {/* 친구 선택 (다중) */}
              {myId ? (
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Users size={11} /> 친구 선택 {selected.size > 0 && <span className="text-[#e85d26]">({selected.size}명)</span>}
                  </p>
                  {friends.length === 0 ? (
                    <div className="py-5 text-center text-sm text-slate-400 bg-slate-50 rounded-2xl">
                      친구가 없어요. 친구를 추가하고 같이 가요!
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {friends.map((f) => {
                        const sel = selected.has(f.id);
                        return (
                          <button
                            key={f.id}
                            onClick={() => toggle(f.id)}
                            className="flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left"
                            style={sel
                              ? { borderColor: "#e85d26", background: "rgba(232,93,38,0.06)" }
                              : { borderColor: "#f1f5f9", background: "white" }}
                          >
                            <span className="text-xl">{f.avatar_emoji}</span>
                            <div className="flex-1">
                              <p className={`text-sm font-bold ${sel ? "text-[#e85d26]" : "text-slate-800"}`}>{f.nickname}</p>
                              <p className="text-xs text-slate-400">{f.visit_count}곳 방문</p>
                            </div>
                            {sel && <Check size={16} className="text-[#e85d26] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
                  <p className="text-sm font-bold text-amber-700">로그인하면 친구에게 직접 보낼 수 있어요</p>
                  <p className="text-xs text-amber-500 mt-1">아래 링크 복사로도 공유 가능해요</p>
                </div>
              )}
            </div>
          )}
        </div>

        {!sent && !loading && (
          <div className="px-5 pb-6 pt-3 border-t border-slate-100 space-y-2 shrink-0">
            <a
              href={gcalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors"
            >
              <CalendarDays size={14} /> 내 캘린더에만 추가
            </a>
            {/* 이메일 초대 */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#e85d26] transition-colors"
              />
              <button
                onClick={handleEmailSend}
                disabled={!email.trim() || emailSending || emailSent}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 shrink-0"
                style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}
              >
                {emailSending ? "전송 중..." : emailSent ? "발송 완료!" : "메일 보내기"}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Link2 size={14} />}
                {copied ? "복사됨!" : "링크 복사"}
              </button>
              {myId && (
                <button
                  onClick={handleSend}
                  disabled={selected.size === 0 || !proposedDate || sending}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-black text-white transition-all disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg,#e85d26,#f5a623)" }}
                >
                  <Send size={14} />
                  {sending ? "전송 중..." : `${selected.size > 0 ? `${selected.size}명에게 ` : ""}보내기`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
