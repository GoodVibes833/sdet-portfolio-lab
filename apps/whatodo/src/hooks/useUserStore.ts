"use client";

import { useState, useEffect, useCallback } from "react";
import { missions, badges, type Mission, type Badge } from "@/data/missions";
import { places } from "@/data/places";

export interface Review {
  id: string;
  placeId: string;
  placeName: string;
  content: string;
  rating: number;
  date: string;
  nickname: string;
  imageUrl?: string;
}

export interface VisitEntry {
  placeId: string;
  category: string;
  timestamp: number;
}

export interface UserState {
  nickname: string;
  wishlist: string[];      // place IDs
  visited: string[];       // place IDs
  visitHistory: VisitEntry[]; // timestamped visit log
  completedMissions: string[];
  earnedBadges: string[];
  points: number;
  reviews: Review[];
}

const DEFAULT_STATE: UserState = {
  nickname: "",
  wishlist: [],
  visited: [],
  visitHistory: [],
  completedMissions: [],
  earnedBadges: [],
  points: 0,
  reviews: [],
};

function loadState(): UserState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem("cangaza_user");
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      nickname: typeof parsed.nickname === "string" ? parsed.nickname : "",
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
      visited: Array.isArray(parsed.visited) ? parsed.visited : [],
      visitHistory: Array.isArray(parsed.visitHistory) ? parsed.visitHistory : [],
      completedMissions: Array.isArray(parsed.completedMissions) ? parsed.completedMissions : [],
      earnedBadges: Array.isArray(parsed.earnedBadges) ? parsed.earnedBadges : [],
      points: typeof parsed.points === "number" ? parsed.points : 0,
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: UserState) {
  if (typeof window === "undefined") return;
  localStorage.setItem("cangaza_user", JSON.stringify(state));
}

export function useUserStore() {
  const [state, setState] = useState<UserState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const update = useCallback((updater: (prev: UserState) => UserState) => {
    setState((prev) => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  // ── Wishlist ──
  const toggleWishlist = useCallback((placeId: string) => {
    update((prev) => {
      const list = Array.isArray(prev.wishlist) ? prev.wishlist : [];
      return {
        ...prev,
        wishlist: list.includes(placeId)
          ? list.filter((id) => id !== placeId)
          : [...list, placeId],
      };
    });
  }, [update]);

  // ── Visited ──
  const toggleVisited = useCallback((placeId: string) => {
    update((prev) => {
      const prevVisited = Array.isArray(prev.visited) ? prev.visited : [];
      const alreadyVisited = prevVisited.includes(placeId);
      const nextVisited = alreadyVisited
        ? prevVisited.filter((id) => id !== placeId)
        : [...prevVisited, placeId];

      // Record visit history with timestamp
      const place = places.find((p) => p.id === placeId);
      const nextHistory = alreadyVisited
        ? prev.visitHistory
        : [...(prev.visitHistory ?? []), {
            placeId,
            category: place?.category ?? "",
            timestamp: Date.now(),
          }];

      // Check mission completion
      const { completedMissions, earnedBadges, points } = checkMissions(
        nextVisited,
        prev.reviews.length,
        prev.completedMissions,
        prev.earnedBadges,
        prev.points
      );

      return { ...prev, visited: nextVisited, visitHistory: nextHistory, completedMissions, earnedBadges, points };
    });
  }, [update]);

  // ── Reviews ──
  const addReview = useCallback((review: Omit<Review, "id" | "date">) => {
    update((prev) => {
      const newReview: Review = {
        ...review,
        id: `r_${Date.now()}`,
        date: new Date().toLocaleDateString("ko-KR"),
      };
      const nextReviews = [newReview, ...prev.reviews];

      // community mission check
      const { completedMissions, earnedBadges, points } = checkMissions(
        prev.visited,
        nextReviews.length,
        prev.completedMissions,
        prev.earnedBadges,
        prev.points
      );

      return { ...prev, reviews: nextReviews, completedMissions, earnedBadges, points };
    });
  }, [update]);

  const setNickname = useCallback((nickname: string) => {
    update((prev) => ({ ...prev, nickname }));
  }, [update]);

  return {
    ...state,
    hydrated,
    toggleWishlist,
    toggleVisited,
    addReview,
    setNickname,
  };
}

function checkMissions(
  visited: string[],
  reviewCount: number,
  prevCompleted: string[],
  prevBadges: string[],
  prevPoints: number
): { completedMissions: string[]; earnedBadges: string[]; points: number } {
  const safeVisited = Array.isArray(visited) ? visited : [];
  const safeCompleted = Array.isArray(prevCompleted) ? prevCompleted : [];
  const safeBadges = Array.isArray(prevBadges) ? prevBadges : [];
  let completedMissions = [...safeCompleted];
  let earnedBadges = [...safeBadges];
  let points = typeof prevPoints === "number" ? prevPoints : 0;

  for (const mission of missions) {
    if (completedMissions.includes(mission.id)) continue;

    let done = false;

    if (mission.id === "first-visit") {
      done = safeVisited.length >= 1;
    } else if (mission.id === "write-review-3") {
      done = reviewCount >= 3;
    } else if (mission.id === "korean-food-3") {
      const koreanIds = places.filter((p) => p.tags?.includes("한식") || p.tags?.includes("한인타운")).map((p) => p.id);
      done = safeVisited.filter((id) => koreanIds.includes(id)).length >= 3;
    } else if (mission.id === "foodie-5") {
      const foodIds = places.filter((p) => p.category === "맛집").map((p) => p.id);
      done = safeVisited.filter((id) => foodIds.includes(id)).length >= 5;
    } else if (mission.id === "nature-3") {
      const natureIds = places.filter((p) => p.category === "자연").map((p) => p.id);
      done = safeVisited.filter((id) => natureIds.includes(id)).length >= 3;
    } else if (mission.id === "toronto-master") {
      const featuredIds = places.filter((p) => p.featured).map((p) => p.id);
      done = featuredIds.every((id) => safeVisited.includes(id));
    } else if (mission.id === "activity-3") {
      const actIds = places.filter((p) => p.category === "액티비티").map((p) => p.id);
      done = safeVisited.filter((id) => actIds.includes(id)).length >= 3;
    } else if (mission.requiredPlaceIds) {
      done = mission.requiredPlaceIds.every((id) => safeVisited.includes(id));
    }

    if (done) {
      completedMissions = [...completedMissions, mission.id];
      points += mission.points;
      if (mission.badge && !earnedBadges.includes(mission.badge)) {
        earnedBadges = [...earnedBadges, mission.badge];
      }
    }
  }

  return { completedMissions, earnedBadges, points };
}
