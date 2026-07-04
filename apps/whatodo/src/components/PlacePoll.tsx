"use client";

import { useState } from "react";
import { Vote, BarChart3 } from "lucide-react";

interface Props {
  placeId: string;
  placeName: string;
  opponentPlace?: { id: string; name: string };
}

export default function PlacePoll({ placeId, placeName, opponentPlace }: Props) {
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(localStorage.getItem("placeVotes") || "{}"); } catch { return {}; }
  });
  const [userVotes, setUserVotes] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(localStorage.getItem("userVotes") || "{}"); } catch { return {}; }
  });

  const opponent = opponentPlace;
  const pollId = opponent ? `${placeId}_vs_${opponent.id}` : placeId;
  const userChoice = userVotes[pollId];

  const castVote = (id: string) => {
    if (userChoice) return;
    const nextVotes = { ...votes, [id]: (votes[id] || 0) + 1 };
    const nextUserVotes = { ...userVotes, [pollId]: id };
    setVotes(nextVotes);
    setUserVotes(nextUserVotes);
    localStorage.setItem("placeVotes", JSON.stringify(nextVotes));
    localStorage.setItem("userVotes", JSON.stringify(nextUserVotes));
  };

  const totalA = votes[placeId] || 0;
  const totalB = opponent ? (votes[opponent.id] || 0) : 0;
  const total = totalA + totalB;
  const pctA = total > 0 ? Math.round((totalA / total) * 100) : 50;
  const pctB = total > 0 ? Math.round((totalB / total) * 100) : 50;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Vote size={18} className="text-purple-500" />
        <h3 className="font-black text-slate-900 text-base">어디 갈래요?</h3>
      </div>
      {opponent ? (
        <div className="space-y-3">
          <div className="flex gap-3">
            <button
              onClick={() => castVote(placeId)}
              className={`flex-1 p-3 rounded-xl text-sm font-bold transition-all border-2 ${
                userChoice === placeId
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-slate-100 hover:border-purple-200 text-slate-700"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span>{placeName}</span>
                <span className="text-xs font-medium">{totalA}표</span>
              </div>
            </button>
            <button
              onClick={() => castVote(opponent.id)}
              className={`flex-1 p-3 rounded-xl text-sm font-bold transition-all border-2 ${
                userChoice === opponent.id
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-slate-100 hover:border-purple-200 text-slate-700"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span>{opponent.name}</span>
                <span className="text-xs font-medium">{totalB}표</span>
              </div>
            </button>
          </div>
          {total > 0 && (
            <div>
              <div className="flex h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-purple-500 transition-all" style={{ width: `${pctA}%` }} />
                <div className="bg-purple-300 transition-all" style={{ width: `${pctB}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>{pctA}%</span>
                <span>{pctB}%</span>
              </div>
            </div>
          )}
          {userChoice && (
            <p className="text-xs text-slate-500 text-center">
              투표 완료! 감사합니다
            </p>
          )}
        </div>
      ) : (
        <div className="text-sm text-slate-500">
          비슷한 장소가 2개 이상일 때 투표가 열려요.
        </div>
      )}
    </div>
  );
}
