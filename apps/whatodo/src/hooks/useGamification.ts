"use client";

import { useState, useCallback } from "react";

export interface Badge {
  id: string;
  name: string;
  icon: string;
  condition: string;
}

const BADGES: Badge[] = [
  { id: "first_visit", name: "첫 방문자", icon: "🚶", condition: "장소 1회 방문" },
  { id: "explorer_5", name: "탐험가", icon: "🗺️", condition: "장소 5회 방문" },
  { id: "explorer_20", name: "모험가", icon: "🌍", condition: "장소 20회 방문" },
  { id: "reviewer", name: "리뷰어", icon: "✍️", condition: "리뷰 1회 작성" },
  { id: "collector", name: "수집가", icon: "❤️", condition: "찜 10개 이상" },
  { id: "tag_master", name: "태그 마스터", icon: "🏷️", condition: "태그 5개 이상 추가" },
  { id: "memo_writer", name: "기록가", icon: "📝", condition: "메모 3회 작성" },
  { id: "social", name: "소셜 스타", icon: "📢", condition: "공유 1회" },
  { id: "night_owl", name: "올빼미", icon: "🦉", condition: "밤 10시 이후 방문" },
  { id: "weekend", name: "주말 여행자", icon: "🎡", condition: "주말 방문" },
];

export function getLevel(points: number) {
  if (points >= 500) return { level: 5, title: "마스터", next: null };
  if (points >= 300) return { level: 4, title: "엘리트", next: 500 };
  if (points >= 150) return { level: 3, title: "베테랑", next: 300 };
  if (points >= 50) return { level: 2, title: "숙련자", next: 150 };
  return { level: 1, title: "초보자", next: 50 };
}

export interface GamificationData {
  points: number;
  earnedBadges: string[];
  unlockedAt: Record<string, string>;
}

export function useGamification() {
  const [data, setData] = useState<GamificationData>(() => {
    const fallback = { points: 0, earnedBadges: [], unlockedAt: {} };
    if (typeof window === "undefined") return fallback;
    try {
      const parsed = JSON.parse(localStorage.getItem("gamification") || "{}") || {};
      return {
        points: typeof parsed.points === "number" ? parsed.points : 0,
        earnedBadges: Array.isArray(parsed.earnedBadges) ? parsed.earnedBadges : [],
        unlockedAt: typeof parsed.unlockedAt === "object" && parsed.unlockedAt ? parsed.unlockedAt : {},
      };
    } catch {
      return fallback;
    }
  });

  const save = useCallback((next: GamificationData) => {
    setData(next);
    localStorage.setItem("gamification", JSON.stringify(next));
  }, []);

  const addPoints = useCallback((amount: number, reason?: string) => {
    setData((prev) => {
      const next = { ...prev, points: prev.points + amount };
      save(next);
      return next;
    });
  }, [save]);

  const awardBadge = useCallback((badgeId: string) => {
    setData((prev) => {
      const earnedBadges = Array.isArray(prev.earnedBadges) ? prev.earnedBadges : [];
      if (earnedBadges.includes(badgeId)) return prev;
      const next = {
        ...prev,
        earnedBadges: [...earnedBadges, badgeId],
        unlockedAt: { ...prev.unlockedAt, [badgeId]: new Date().toISOString() },
      };
      save(next);
      return next;
    });
  }, [save]);

  const checkBadges = useCallback((visited: string[], reviews: number, favorites: number, tags: number, memos: number) => {
    const checks: Record<string, boolean> = {
      first_visit: visited.length >= 1,
      explorer_5: visited.length >= 5,
      explorer_20: visited.length >= 20,
      reviewer: reviews >= 1,
      collector: favorites >= 10,
      tag_master: tags >= 5,
      memo_writer: memos >= 3,
    };
    Object.entries(checks).forEach(([id, met]) => {
      if (met) awardBadge(id);
    });
  }, [awardBadge]);

  const { level, title, next } = getLevel(data.points);
  const progress = next ? Math.min(100, Math.round((data.points / next) * 100)) : 100;

  return {
    ...data,
    level,
    title,
    nextLevelPoints: next,
    progress,
    addPoints,
    awardBadge,
    checkBadges,
    allBadges: BADGES,
  };
}
