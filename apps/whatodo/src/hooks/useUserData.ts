"use client";

import { useState, useEffect, useCallback } from "react";

export interface VisitRecord {
  placeId: string;
  visitedAt: string; // ISO date
}

export interface Review {
  placeId: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  placeIds: string[];
  createdAt: string;
}

export interface UserMemo {
  placeId: string;
  text: string;
  updatedAt: string;
}

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function useUserData() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [visited, setVisited] = useState<VisitRecord[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [memos, setMemos] = useState<Record<string, UserMemo>>({});
  const [tags, setTags] = useState<Record<string, string[]>>({});
  const [collections, setCollections] = useState<Collection[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    setFavorites(new Set(getStorage<string[]>("whatodo:favorites", [])));
    setVisited(getStorage<VisitRecord[]>("whatodo:visited", []));
    setReviews(getStorage<Review[]>("whatodo:reviews", []));
    setMemos(getStorage<Record<string, UserMemo>>("whatodo:memos", {}));
    setTags(getStorage<Record<string, string[]>>("whatodo:tags", {}));
    setCollections(getStorage<Collection[]>("whatodo:collections", []));
  }, []);

  // --- Favorites ---
  const toggleFavorite = useCallback((placeId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) next.delete(placeId);
      else next.add(placeId);
      setStorage("whatodo:favorites", Array.from(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((placeId: string) => favorites.has(placeId), [favorites]);

  // --- Visits ---
  const checkIn = useCallback((placeId: string) => {
    setVisited((prev) => {
      if (prev.some((v) => v.placeId === placeId)) return prev;
      const next = [...prev, { placeId, visitedAt: new Date().toISOString() }];
      setStorage("whatodo:visited", next);
      return next;
    });
  }, []);

  const uncheckIn = useCallback((placeId: string) => {
    setVisited((prev) => {
      const next = prev.filter((v) => v.placeId !== placeId);
      setStorage("whatodo:visited", next);
      return next;
    });
  }, []);

  const hasVisited = useCallback((placeId: string) => visited.some((v) => v.placeId === placeId), [visited]);

  const visitCount = visited.length;

  const visitStats = useCallback((places: { id: string; category?: string }[]) => {
    const categories: Record<string, number> = {};
    visited.forEach((v) => {
      const place = places.find((p) => p.id === v.placeId);
      if (place?.category) {
        categories[place.category] = (categories[place.category] || 0) + 1;
      }
    });
    return { total: visited.length, categories };
  }, [visited]);

  // --- Reviews ---
  const addReview = useCallback((placeId: string, rating: number, text: string) => {
    setReviews((prev) => {
      const filtered = prev.filter((r) => !(r.placeId === placeId));
      const next = [...filtered, { placeId, rating, text, createdAt: new Date().toISOString() }];
      setStorage("whatodo:reviews", next);
      return next;
    });
  }, []);

  const deleteReview = useCallback((placeId: string) => {
    setReviews((prev) => {
      const next = prev.filter((r) => r.placeId !== placeId);
      setStorage("whatodo:reviews", next);
      return next;
    });
  }, []);

  const getReview = useCallback((placeId: string) => reviews.find((r) => r.placeId === placeId), [reviews]);

  const getPlaceRating = useCallback((placeId: string) => {
    const r = reviews.filter((rev) => rev.placeId === placeId);
    if (r.length === 0) return null;
    return r.reduce((sum, rev) => sum + rev.rating, 0) / r.length;
  }, [reviews]);

  // --- Memos ---
  const setMemo = useCallback((placeId: string, text: string) => {
    setMemos((prev) => {
      const next = { ...prev, [placeId]: { placeId, text, updatedAt: new Date().toISOString() } };
      setStorage("whatodo:memos", next);
      return next;
    });
  }, []);

  const getMemo = useCallback((placeId: string) => memos[placeId]?.text || "", [memos]);

  // --- Tags ---
  const addTag = useCallback((placeId: string, tag: string) => {
    setTags((prev) => {
      const existing = prev[placeId] || [];
      if (existing.includes(tag)) return prev;
      const next = { ...prev, [placeId]: [...existing, tag] };
      setStorage("whatodo:tags", next);
      return next;
    });
  }, []);

  const removeTag = useCallback((placeId: string, tag: string) => {
    setTags((prev) => {
      const next = { ...prev, [placeId]: (prev[placeId] || []).filter((t) => t !== tag) };
      setStorage("whatodo:tags", next);
      return next;
    });
  }, []);

  const getTags = useCallback((placeId: string) => tags[placeId] || [], [tags]);

  // --- Collections ---
  const createCollection = useCallback((name: string) => {
    setCollections((prev) => {
      const next = [...prev, { id: crypto.randomUUID(), name, placeIds: [], createdAt: new Date().toISOString() }];
      setStorage("whatodo:collections", next);
      return next;
    });
  }, []);

  const deleteCollection = useCallback((id: string) => {
    setCollections((prev) => {
      const next = prev.filter((c) => c.id !== id);
      setStorage("whatodo:collections", next);
      return next;
    });
  }, []);

  const addToCollection = useCallback((collectionId: string, placeId: string) => {
    setCollections((prev) => {
      const next = prev.map((c) =>
        c.id === collectionId && !c.placeIds?.includes(placeId)
          ? { ...c, placeIds: [...(c.placeIds || []), placeId] }
          : c
      );
      setStorage("whatodo:collections", next);
      return next;
    });
  }, []);

  const removeFromCollection = useCallback((collectionId: string, placeId: string) => {
    setCollections((prev) => {
      const next = prev.map((c) =>
        c.id === collectionId ? { ...c, placeIds: (c.placeIds || []).filter((id) => id !== placeId) } : c
      );
      setStorage("whatodo:collections", next);
      return next;
    });
  }, []);

  return {
    favorites, toggleFavorite, isFavorite,
    visited, checkIn, uncheckIn, hasVisited, visitCount, visitStats,
    reviews, addReview, deleteReview, getReview, getPlaceRating,
    memos, setMemo, getMemo,
    tags, addTag, removeTag, getTags,
    collections, createCollection, deleteCollection, addToCollection, removeFromCollection,
  };
}
