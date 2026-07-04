"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Place } from "@/data/places";
import { getDistance } from "@/lib/utils";

interface Props {
  places: Place[];
  userLat?: number;
  userLng?: number;
  onSelect: (place: Place) => void;
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  const idx = t.indexOf(q);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchBox({ places, userLat, userLng, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentSearches(JSON.parse(localStorage.getItem("recentSearches") || "[]"));
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const saveSearch = (q: string) => {
    if (!q.trim()) return;
    const prev = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    const next = [q, ...prev.filter((s: string) => s !== q)].slice(0, 8);
    localStorage.setItem("recentSearches", JSON.stringify(next));
    setRecentSearches(next);
  };

  const results = query.length >= 2
    ? places
        .filter((p) => {
          const q = query.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            (p.nameKo && p.nameKo.toLowerCase().includes(q)) ||
            (p.address && p.address.toLowerCase().includes(q)) ||
            (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
          );
        })
        .slice(0, 10)
        .map((p) => ({
          ...p,
          _dist: userLat && userLng ? getDistance(userLat, userLng, p.lat, p.lng) : undefined,
        }))
        .sort((a, b) => (a._dist ?? 999) - (b._dist ?? 999))
    : [];

  return (
    <div ref={containerRef} className="relative z-30">
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
        <Search size={16} className="text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="장소 검색..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="flex-1 text-sm outline-none bg-transparent"
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }}>
            <X size={14} className="text-slate-400" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-lg max-h-72 overflow-y-auto">
          {query.length < 2 && recentSearches.length > 0 && (
            <div className="px-3 py-2 text-xs font-bold text-slate-400 border-b border-slate-50">최근 검색</div>
          )}
          {query.length < 2 && recentSearches.map((term) => (
            <button
              key={term}
              onClick={() => { setQuery(term); }}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 border-b border-slate-50 last:border-0 text-sm text-slate-600"
            >
              {term}
            </button>
          ))}
          {results.map((place) => (
            <button
              key={place.id}
              onClick={() => { saveSearch(query); onSelect(place); setOpen(false); setQuery(""); }}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 border-b border-slate-50 last:border-0"
            >
              <div className="text-sm font-bold text-slate-800"><HighlightText text={place.name} query={query} /></div>
              <div className="text-xs text-slate-500 flex gap-2">
                <span>{place.category}</span>
                {place._dist !== undefined && <span>{place._dist.toFixed(1)}km</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
