"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { categories, subCategories, getSubCategories, matchesSubCategory, type Place } from "@/data/places";
import { usePlaces } from "@/context/PlacesContext";
import { useGeoContext } from "@/context/GeolocationContext";
import { X, MapPin, Star, Globe, ExternalLink, Navigation, SlidersHorizontal, CheckCircle2, Crosshair, Map, List, Filter, Plus, Minus, Ruler, Phone } from "lucide-react";
import Link from "next/link";
import { getPlaceImage } from "@/lib/utils";
import { isOpenNow } from "@/lib/openHours";
import { useUserData } from "@/hooks/useUserData";
import ShareButton from "@/components/ShareButton";
import ExportButtons from "@/components/ExportButtons";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import SettingsPanel from "@/components/SettingsPanel";
import GuidePanel from "@/components/GuidePanel";
import SearchBox from "@/components/SearchBox";
import FavoritesButton from "@/components/FavoritesButton";
import VisitButton from "@/components/VisitButton";

const categoryIcons: Record<string, string> = {
  "맛집": "🍽️", "관광": "🏛️", "액티비티": "🎯", "쇼핑": "🛍️",
  "자연": "🌿", "야경": "🌃", "카페": "☕", "스포츠": "⚽",
};

function getSubCategoryEmoji(place: Place): string | null {
  for (const sc of subCategories) {
    if (sc.parentCategory !== place.category) continue;
    if (place.tags.some((tag) =>
      sc.matchTags.some((mt) => tag.toLowerCase().includes(mt.toLowerCase()))
    )) {
      return sc.emoji;
    }
  }
  return null;
}

const priceLabels = ["무료", "$", "$$", "$$$"];

const CITY_CENTERS: Record<string, [number, number]> = {
  toronto: [43.6532, -79.3832],
  vancouver: [49.2827, -123.1207],
  montreal: [45.5017, -73.5673],
  calgary: [51.0447, -114.0719],
  edmonton: [53.5461, -113.4938],
  ottawa: [45.4215, -75.6972],
  victoria: [48.4284, -123.3656],
  winnipeg: [49.8951, -97.1384],
};

const DEFAULT_CENTER: [number, number] = [43.6532, -79.3832];

function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDist(km: number) {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
}

function formatWalkTime(km: number) {
  const min = Math.round(km / 5 * 60); // 5km/h average
  return min < 60 ? `${min}분` : `${Math.floor(min / 60)}시간 ${min % 60}분`;
}

function createMarkerIcon(emoji: string, checked = false, zoom = 13) {
  const border = checked ? "#22c55e" : "#e85d26";
  const bg = checked ? "#f0fdf4" : "white";
  // 줌 레벨에 따른 마커 크기 조정
  const size = zoom >= 15 ? 36 : zoom >= 12 ? 28 : 12;
  const fontSize = zoom >= 15 ? 18 : zoom >= 12 ? 14 : 0;
  const showEmoji = zoom >= 12;
  
  if (zoom < 10) {
    // 멀리 줌아웃 시 점으로 표시
    return L.divIcon({
      html: `<div style="width:${size}px;height:${size}px;background:${border};border-radius:50%;opacity:0.7;cursor:pointer;"></div>`,
      className: "",
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
    });
  }
  
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;background:${bg};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${fontSize}px;box-shadow:0 2px 8px rgba(0,0,0,0.2);border:2.5px solid ${border};cursor:pointer;">${showEmoji ? emoji : ''}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
}

export default function MapView() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);

  const { places: allPlaces, loading: placesLoading, selectedCity } = usePlaces();
  const { lat: userLat, lng: userLng, loading: geoLoading, requestLocation } = useGeoContext();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("맛집");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  // mobile only toggle
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const userData = useUserData();
  const { favorites, toggleFavorite: _toggleFavorite, isFavorite, visited, checkIn, uncheckIn, hasVisited, reviews, addReview, deleteReview, getReview, memos, setMemo, getMemo, tags, addTag, removeTag, getTags, collections, createCollection, deleteCollection, addToCollection, removeFromCollection } = userData;

  const toggleFavorite = useCallback((id: string) => {
    _toggleFavorite(id);
  }, [_toggleFavorite]);

  const [visibleBounds, setVisibleBounds] = useState<L.LatLngBounds | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(13);
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "reviews">("distance");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [measureMode, setMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
  const measureLineRef = useRef<L.Polyline | null>(null);
  const measureMarkersRef = useRef<any[]>([]);
  const [filterPresets, setFilterPresets] = useState<{ id: string; name: string; category: string | null; subCategory: string | null; price: number | null }[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("filterPresets") || "[]"); } catch { return []; }
  });
  const [presetName, setPresetName] = useState("");

  // GPS 위치로 지도 이동
  useEffect(() => {
    if (!userLat || !userLng || !mapRef.current) return;
    mapRef.current.flyTo([userLat, userLng], 13, { duration: 1 });
  }, [userLat, userLng]);

  // 선택된 도시 변경 시 지도 이동 (GPS 없을 때)
  useEffect(() => {
    if (!mapRef.current || (userLat && userLng)) return;
    const cityCenter = selectedCity ? CITY_CENTERS[selectedCity] : DEFAULT_CENTER;
    if (cityCenter) {
      mapRef.current.flyTo(cityCenter, 13, { duration: 0.8 });
    }
  }, [selectedCity]);


  const center: [number, number] = userLat && userLng
    ? [userLat, userLng]
    : selectedCity
      ? (CITY_CENTERS[selectedCity] ?? DEFAULT_CENTER)
      : DEFAULT_CENTER;

  const filtered = useMemo(() => {
    const favs = typeof window !== "undefined" ? new Set(JSON.parse(localStorage.getItem("favorites") || "[]")) : new Set();
    let base = allPlaces.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedSubCategory && !matchesSubCategory(p, selectedSubCategory)) return false;
      if (selectedPrice !== null && p.priceLevel !== selectedPrice) return false;
      if (showFavoritesOnly && !favs.has(p.id)) return false;
      return true;
    });
    let result = base;
    if (visibleBounds) {
      result = base
        .filter((p) => {
          if (typeof p.lat !== "number" || typeof p.lng !== "number" || isNaN(p.lat) || isNaN(p.lng)) return false;
          return visibleBounds.contains([p.lat, p.lng]);
        })
        .map((p) => ({ ...p, _dist: userLat && userLng ? calcDistance(userLat, userLng, p.lat, p.lng) : undefined }));
    } else {
      result = base.slice(0, 100).map((p) => ({ ...p, _dist: undefined as number | undefined }));
    }

    // 정렬
    if (sortBy === "distance" && userLat && userLng) {
      result = result.sort((a, b) => (a._dist ?? 999) - (b._dist ?? 999));
    } else if (sortBy === "rating") {
      result = result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "reviews") {
      result = result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }
    return result;
  }, [allPlaces, selectedCategory, selectedSubCategory, selectedPrice, showFavoritesOnly, userLat, userLng, visibleBounds, sortBy]);

  const toggleVisit = useCallback((id: string) => {
    if (hasVisited(id)) { uncheckIn(id); }
    else { checkIn(id); }
  }, [hasVisited, checkIn, uncheckIn]);

  const flyToPlace = useCallback((place: Place) => {
    if (!mapRef.current) return;
    if (typeof place.lat !== "number" || typeof place.lng !== "number" || isNaN(place.lat) || isNaN(place.lng)) return;
    mapRef.current.flyTo([place.lat, place.lng], 16, { duration: 0.6 });
    setSelectedPlace(place);
    setMobileView("map");
  }, []);

  const flyToUser = useCallback(() => {
    if (!mapRef.current) return;
    if (userLat && userLng) {
      mapRef.current.flyTo([userLat, userLng], 15, { duration: 0.8 });
      // Ensure user marker exists
      if (!userMarkerRef.current) {
        userMarkerRef.current = L.circleMarker([userLat, userLng], {
          radius: 8,
          fillColor: "#4285F4",
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(mapRef.current).bindPopup("<b>📍 현재 위치</b>");
      } else {
        userMarkerRef.current.setLatLng([userLat, userLng]);
      }
    } else {
      requestLocation();
    }
  }, [userLat, userLng, requestLocation]);

  const zoomIn = useCallback(() => { mapRef.current?.zoomIn(); }, []);
  const zoomOut = useCallback(() => { mapRef.current?.zoomOut(); }, []);

  // Init map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current, { center, zoom: 13, zoomControl: false, attributionControl: false });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { maxZoom: 19 }).addTo(map);
    mapRef.current = map;
    const updateBounds = () => { setVisibleBounds(map.getBounds()); setCurrentZoom(map.getZoom()); };
    map.on("moveend zoomend", updateBounds);
    updateBounds();
    return () => { map.off("moveend zoomend", updateBounds); map.remove(); mapRef.current = null; };
  }, []);

  // User GPS marker (stable circleMarker)
  useEffect(() => {
    if (!mapRef.current) return;
    if (userLat && userLng) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLat, userLng]);
      } else {
        userMarkerRef.current = L.circleMarker([userLat, userLng], {
          radius: 8,
          fillColor: "#4285F4",
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(mapRef.current).bindPopup("<b>📍 현재 위치</b>");
      }
    }
    return () => {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
    };
  }, [userLat, userLng]);

  // Distance measurement mode
  useEffect(() => {
    if (!mapRef.current) return;
    const handleClick = (e: L.LeafletMouseEvent) => {
      if (!measureMode) return;
      const pt: [number, number] = [e.latlng.lat, e.latlng.lng];
      setMeasurePoints((prev) => {
        const next = [...prev, pt];
        if (next.length > 2) return [pt];
        return next;
      });
    };
    mapRef.current.on("click", handleClick);
    return () => { mapRef.current?.off("click", handleClick); };
  }, [measureMode]);

  // Draw measurement line
  useEffect(() => {
    if (!mapRef.current) return;
    measureLineRef.current?.remove();
    measureMarkersRef.current.forEach((m) => m.remove());
    measureMarkersRef.current = [];
    if (measurePoints.length >= 2) {
      const line = L.polyline(measurePoints, { color: "#ef4444", weight: 3, dashArray: "5,8" }).addTo(mapRef.current);
      measureLineRef.current = line;
    }
    measurePoints.forEach((pt) => {
      const m = L.circleMarker(pt, { radius: 6, color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.8 }).addTo(mapRef.current!);
      measureMarkersRef.current.push(m);
    });
    return () => {
      measureLineRef.current?.remove();
      measureMarkersRef.current.forEach((m) => m.remove());
    };
  }, [measurePoints]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPlace(null);
        setShowFilters(false);
      }
      if (e.key === "/" || (e.key === "s" && !e.ctrlKey && !e.metaKey)) {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
      if (e.key === "m" && !e.ctrlKey && !e.metaKey) {
        setMobileListOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Place markers — viewport-based for performance
  useEffect(() => {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Only render markers within viewport; sample at low zoom
    let visible = filtered.filter((p) => {
      if (typeof p.lat !== "number" || typeof p.lng !== "number" || isNaN(p.lat) || isNaN(p.lng)) return false;
      return bounds.contains([p.lat, p.lng]);
    });
    if (currentZoom < 11) {
      visible = visible.slice(0, 50); // max 50 when zoomed out
    } else if (currentZoom < 13) {
      visible = visible.slice(0, 150); // max 150 at mid zoom
    }

    visible.forEach((place) => {
      if (typeof place.lat !== "number" || typeof place.lng !== "number" || isNaN(place.lat) || isNaN(place.lng)) return;
      const isSelected = selectedPlace?.id === place.id;
      const cat = categories.find((c) => c.id === place.category);
      const emoji = getSubCategoryEmoji(place) ?? cat?.emoji ?? "📍";
      const border = isSelected ? "#1e3a5f" : hasVisited(place.id) ? "#22c55e" : "#e85d26";
      const bg = isSelected ? "#1e3a5f" : hasVisited(place.id) ? "#f0fdf4" : "white";
      const color = isSelected ? "white" : "inherit";
      const size = currentZoom >= 15 ? 36 : currentZoom >= 10 ? 28 : 10;
      const fontSize = currentZoom >= 15 ? 17 : currentZoom >= 10 ? 14 : 0;

      const icon = L.divIcon({
        html: currentZoom < 10
          ? `<div style="width:${size}px;height:${size}px;background:${border};border-radius:50%;opacity:0.7;"></div>`
          : `<div style="width:${size}px;height:${size}px;background:${bg};color:${color};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${fontSize}px;box-shadow:${isSelected ? "0 0 0 3px #1e3a5f" : "0 2px 8px rgba(0,0,0,0.18)"};border:2.5px solid ${border};cursor:pointer;transition:all 0.15s;">${currentZoom >= 10 ? emoji : ""}</div>`,
        className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2],
      });
      const marker = L.marker([place.lat, place.lng], { icon })
        .addTo(mapRef.current!)
        .on("click", () => {
          setSelectedPlace(place);
          if (typeof window !== "undefined" && window.innerWidth < 768) {
            setMobileView("list");
          }
        });
      if (currentZoom >= 12) marker.bindTooltip(place.name, { offset: [0, -size / 2 - 4], direction: "top", opacity: 0.9 });
      markersRef.current.push(marker);
    });
  }, [filtered, visited, currentZoom, selectedPlace, visibleBounds]);

  // ── Filter bar (shared top) ──────────────────────────────────
  const filterBar = (
    <div className="bg-white border-b border-slate-100 shadow-sm z-20 relative">
      {/* Row 1: count + sort + mobile toggle */}
      <div className="flex items-center justify-between px-3 py-2 gap-2">
        <div className="min-w-0 flex items-center gap-2">
          <p className="text-xs text-slate-500 font-medium">
            {geoLoading ? "📡 위치 찾는 중..." : `📍 ${filtered.length}곳`}
          </p>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
            className="text-[11px] font-bold bg-slate-100 rounded-md px-1.5 py-0.5 cursor-pointer border-none">
            <option value="distance">거리순</option>
            <option value="rating">평점순</option>
            <option value="reviews">리뷰순</option>
          </select>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Mobile: map/list toggle */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 md:hidden">
            <button onClick={() => setMobileView("list")} className="flex items-center gap-0.5 px-2 py-1 rounded-md text-xs font-bold transition-all"
              style={mobileView === "list" ? { background: "white", color: "#1e293b", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } : { color: "#64748b" }}>
              <List size={11} /> 목록
            </button>
            <button onClick={() => setMobileView("map")} className="flex items-center gap-0.5 px-2 py-1 rounded-md text-xs font-bold transition-all"
              style={mobileView === "map" ? { background: "white", color: "#1e293b", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } : { color: "#64748b" }}>
              <Map size={11} /> 지도
            </button>
          </div>
        </div>
      </div>

      {/* Category chips + filter */}
      <div className="flex items-center gap-1 px-3 pb-1.5 overflow-x-auto scrollbar-hide">
        <button onClick={() => setShowFilters(!showFilters)}
          className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold border transition-all"
          style={showFilters ? { background: "#1e3a5f", color: "white", borderColor: "#1e3a5f" } : { background: "white", color: "#64748b", borderColor: "#e2e8f0" }}>
          <Filter size={11} />
        </button>
        {categories.map((cat) => (
          <button key={cat.id}
            onClick={() => {
              if (selectedCategory === cat.id) { setSelectedCategory(null); setSelectedSubCategory(null); }
              else { setSelectedCategory(cat.id); setSelectedSubCategory(null); }
            }}
            className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all"
            style={selectedCategory === cat.id
              ? { background: "linear-gradient(135deg,#e85d26,#f5a623)", color: "white" }
              : { background: "#f1f5f9", color: "#64748b" }}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>
      {/* Sub-category chips */}
      {selectedCategory && (() => {
        const subs = getSubCategories(selectedCategory as Parameters<typeof getSubCategories>[0]);
        if (!subs.length) return null;
        return (
          <div className="flex items-center gap-1 px-3 pb-1.5 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedSubCategory(null)}
              className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-all"
              style={!selectedSubCategory ? { background: "#1e3a5f", color: "white", borderColor: "#1e3a5f" } : { background: "white", color: "#64748b", borderColor: "#e2e8f0" }}>
              전체
            </button>
            {subs.map((sub) => (
              <button key={sub.id}
                onClick={() => setSelectedSubCategory(selectedSubCategory === sub.id ? null : sub.id)}
                className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-all"
                style={selectedSubCategory === sub.id
                  ? { background: "linear-gradient(135deg,#1e3a5f,#2d5a8e)", color: "white", borderColor: "transparent" }
                  : { background: "white", color: "#64748b", borderColor: "#e2e8f0" }}>
                {sub.emoji} {sub.label}
              </button>
            ))}
          </div>
        );
      })()}

      {/* Price filter expand */}
      {showFilters && (
        <>
          <div className="px-3 pb-3 flex gap-1.5 border-t border-slate-100 pt-2">
            <button onClick={() => setSelectedPrice(null)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={selectedPrice === null ? { background: "#1e3a5f", color: "white" } : { background: "#f1f5f9", color: "#64748b" }}>
              전체
            </button>
            {priceLabels.map((label, i) => (
              <button key={i} onClick={() => setSelectedPrice(selectedPrice === i ? null : i)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={selectedPrice === i ? { background: "#1e3a5f", color: "white" } : { background: "#f1f5f9", color: "#64748b" }}>
                {label}
              </button>
            ))}
          </div>
          <div className="px-3 pb-3 flex gap-1.5 border-t border-slate-100 pt-2">
            <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={showFavoritesOnly ? { background: "#ef4444", color: "white" } : { background: "#f1f5f9", color: "#64748b" }}>
              ❤️ 찜한 장소만
            </button>
          </div>
          <div className="px-3 pb-3 border-t border-slate-100 pt-2 flex gap-1.5">
            <button onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); setSelectedPrice(null); setShowFavoritesOnly(false); }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">
              필터 초기화
            </button>
          </div>
          {/* Filter Presets */}
          <div className="px-3 pb-3 border-t border-slate-50 pt-2 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <input value={presetName} onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && presetName.trim()) { const newPreset = { id: Date.now().toString(), name: presetName.trim(), category: selectedCategory, subCategory: selectedSubCategory, price: selectedPrice }; const next = [...filterPresets, newPreset]; setFilterPresets(next); localStorage.setItem("filterPresets", JSON.stringify(next)); setPresetName(""); } }}
                placeholder="프리셋 이름"
                className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-200" />
              <button onClick={() => { if (presetName.trim()) { const newPreset = { id: Date.now().toString(), name: presetName.trim(), category: selectedCategory, subCategory: selectedSubCategory, price: selectedPrice }; const next = [...filterPresets, newPreset]; setFilterPresets(next); localStorage.setItem("filterPresets", JSON.stringify(next)); setPresetName(""); } }}
                className="px-2.5 py-1 rounded-lg bg-orange-500 text-white text-xs font-bold">
                저장
              </button>
            </div>
            {filterPresets.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {filterPresets.map((p) => (
                  <button key={p.id} onClick={() => { setSelectedCategory(p.category); setSelectedSubCategory(p.subCategory); setSelectedPrice(p.price); }}
                    className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-1">
                    {p.name}
                    <span onClick={(e) => { e.stopPropagation(); const next = filterPresets.filter((x) => x.id !== p.id); setFilterPresets(next); localStorage.setItem("filterPresets", JSON.stringify(next)); }}
                      className="text-slate-400 hover:text-red-500 cursor-pointer">×</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  // ── Place detail panel (right side or bottom sheet) ──────────
  const detailPanel = selectedPlace && (
    <div className="bg-white border-l border-slate-100 overflow-y-auto flex flex-col w-full md:w-[340px] shrink-0 z-10">
      <div className="flex items-start justify-between p-4 gap-3 border-b border-slate-50">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{categoryIcons[selectedPlace.category] ?? "📍"}</span>
            <h3 className="font-black text-slate-900 text-base leading-tight">{selectedPlace.name}</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-slate-700">{selectedPlace.rating}</span>
            <span>·</span>
            <span>{priceLabels[selectedPlace.priceLevel]}</span>
            <span>·</span>
            <span>{selectedPlace.neighborhood}</span>
            {(selectedPlace as Place & { _dist?: number })._dist !== undefined && (
              <>
                <span>·</span><span className="text-orange-500 font-bold">{formatDist((selectedPlace as Place & { _dist?: number })._dist!)}</span>
                <span>·</span><span className="text-slate-500">🚶 {formatWalkTime((selectedPlace as Place & { _dist?: number })._dist!)}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <FavoritesButton placeId={selectedPlace.id} />
          <button onClick={() => setSelectedPlace(null)} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        {selectedPlace.openHours && (
          <div className={`text-xs font-bold px-2 py-1 rounded-full w-fit ${isOpenNow(selectedPlace.openHours) ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
            {isOpenNow(selectedPlace.openHours) ? '🟢 지금 영업중' : '⚪ 영업종료'}
            <span className="font-normal ml-1">{selectedPlace.openHours}</span>
          </div>
        )}
        <p className="text-sm text-slate-500 leading-relaxed">{selectedPlace.shortDesc}</p>
        {selectedPlace.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedPlace.tags.slice(0, 5).map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{t}</span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          <VisitButton placeId={selectedPlace.id} hasVisited={hasVisited(selectedPlace.id)} onCheckIn={() => checkIn(selectedPlace.id)} onUncheck={() => uncheckIn(selectedPlace.id)} />
          <Link href={`/place/${selectedPlace.id}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#e85d26,#f5a623)" }}>
            <MapPin size={14} /> 자세히 보기
          </Link>
          <ShareButton
            title={selectedPlace.name}
            url={`https://whatodo-seven.vercel.app/place/${selectedPlace.id}`}
            address={selectedPlace.address}
            image={selectedPlace.image}
          />
          <ExportButtons places={allPlaces} selectedPlace={selectedPlace} />
          <a href={`https://maps.google.com/?q=${encodeURIComponent(selectedPlace.address)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-700">
            <ExternalLink size={14} /> Google Maps
          </a>
          {selectedPlace.officialWebsite && (
            <a href={selectedPlace.officialWebsite} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-700">
              <ExternalLink size={14} /> 공식 웹사이트
            </a>
          )}
        </div>
        <div className="border-t border-slate-100 pt-3">
          <h4 className="text-xs font-bold text-slate-400 mb-2">주변 장소</h4>
          <div className="space-y-2">
            {allPlaces
              .filter((p) => p.id !== selectedPlace.id)
              .map((p) => ({
                ...p,
                _dist: userLat && userLng
                  ? Math.sqrt((p.lat - selectedPlace.lat) ** 2 + (p.lng - selectedPlace.lng) ** 2) * 111
                  : Infinity,
              }))
              .sort((a, b) => (a as any)._dist - (b as any)._dist)
              .slice(0, 3)
              .map((p) => (
                <button key={p.id} onClick={() => flyToPlace(p)}
                  className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = getPlaceImage(null, p.category, p.tags); }} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-400">{(p as any)._dist < 100 ? `${(p as any)._dist.toFixed(1)}km` : p.category}</div>
                  </div>
                </button>
              ))}
          </div>
        </div>
        {/* Similar places (same category) */}
        <div className="border-t border-slate-100 pt-3">
          <h4 className="text-xs font-bold text-slate-400 mb-2">비슷한 장소 추천</h4>
          <div className="space-y-2">
            {allPlaces
              .filter((p) => p.id !== selectedPlace.id && p.category === selectedPlace.category)
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 3)
              .map((p) => (
                <button key={p.id} onClick={() => flyToPlace(p)}
                  className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = getPlaceImage(null, p.category, p.tags); }} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Star size={9} className="text-yellow-400 fill-yellow-400" />
                      {p.rating}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── List panel ───────────────────────────────────────────────
  const listPanel = (
    <div className="overflow-y-auto bg-slate-50 flex flex-col w-full md:w-[300px] shrink-0">
      <div className="px-3 py-2 bg-white border-b border-slate-100">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">
            {placesLoading ? "장소 불러오는 중..." : `${filtered.length}개 장소`}
          </p>
          <div className="flex items-center gap-1">
            {(["distance", "rating", "reviews"] as const).map((s) => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`text-xs font-bold px-2 py-0.5 rounded-md transition-all ${sortBy === s ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-600"}`}>
                {s === "distance" ? "거리" : s === "rating" ? "평점" : "리뷰"}
              </button>
            ))}
          </div>
        </div>
      </div>
      {placesLoading ? (
        <LoadingSkeleton />
      ) : (
      <div className="flex flex-col divide-y divide-slate-100">
        {filtered.map((place) => {
          const dist = (place as Place & { _dist?: number })._dist;
          const isChecked = hasVisited(place.id);
          const isSelected = selectedPlace?.id === place.id;
          return (
            <button
              key={place.id}
              onClick={() => { setSelectedPlace(place); flyToPlace(place); }}
              className={`flex items-center gap-3 w-full text-left p-3 hover:bg-white transition-colors ${isSelected ? "bg-white ring-1 ring-orange-200" : ""}`}
            >
              <img src={place.image} alt={place.name} className="w-12 h-12 object-cover rounded-lg shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = getPlaceImage(null, place.category, place.tags); }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900 truncate">{place.name}</span>
                  {isChecked && <CheckCircle2 size={14} className="text-green-500 shrink-0" />}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>{categoryIcons[place.category]}</span>
                  <span>{place.category}</span>
                  <span>·</span>
                  <span>{priceLabels[place.priceLevel]}</span>
                  {dist !== undefined && (
                    <>
                      <span>·</span>
                      <span className="text-orange-500 font-bold">{formatDist(dist)}</span>
                    </>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      )}
    </div>
  );

  // ── Map panel ────────────────────────────────────────────────
  const mapPanel = (
    <div className="relative flex-1 min-w-0">
      <div ref={mapContainerRef} className="absolute inset-0" />
      {/* Zoom controls */}
      <div className="absolute bottom-[88px] right-4 z-[999] flex flex-col shadow-lg rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 pointer-events-auto">
        <button onClick={zoomIn} className="w-11 h-11 bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-200 dark:border-slate-700" title="확대">
          <Plus size={18} className="text-slate-700 dark:text-slate-200" />
        </button>
        <button onClick={zoomOut} className="w-11 h-11 bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" title="축소">
          <Minus size={18} className="text-slate-700 dark:text-slate-200" />
        </button>
      </div>
      {/* Measure distance button */}
      <button onClick={() => { setMeasureMode(!measureMode); setMeasurePoints([]); }}
        className="absolute bottom-[140px] right-4 z-[999] w-11 h-11 rounded-full shadow-lg flex items-center justify-center border transition-all"
        style={{ backgroundColor: measureMode ? "#ef4444" : "#fff", color: measureMode ? "white" : "#64748b" }}
        title="거리 측정">
        <Ruler size={18} />
      </button>
      {measureMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[999] bg-white dark:bg-slate-800 rounded-xl shadow-lg px-4 py-2 border border-slate-200 dark:border-slate-700 pointer-events-none">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {measurePoints.length === 0 ? "지도를 클릭하여 시작점 설정" : "두 번째 점을 클릭하세요"}
          </p>
        </div>
      )}
      {/* My location button */}
      <button onClick={flyToUser}
        className="absolute bottom-6 right-4 z-[999] w-11 h-11 rounded-full shadow-lg flex items-center justify-center border transition-shadow disabled:opacity-50"
        style={{ backgroundColor: "#fff" }}
        disabled={geoLoading}
        title={userLat ? "내 위치로 이동" : "위치 권한 요청"}>
        <Navigation size={18} style={{ color: userLat ? "#4285F4" : "#94a3b8" }} className={geoLoading ? "animate-spin" : ""} />
      </button>
      {/* Mobile: back to list */}
      <button onClick={() => setMobileView("list")}
        className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white shadow-md text-xs font-bold text-slate-700 border border-slate-200 md:hidden">
        <List size={13} /> 목록 보기
      </button>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col">
      <div className="px-3 pt-2 pb-1 flex items-center gap-2">
        <div className="flex-1">
          <SearchBox places={allPlaces} userLat={userLat ?? undefined} userLng={userLng ?? undefined}
            onSelect={(place) => { setSelectedPlace(place); flyToPlace(place); }} />
        </div>
      </div>
      {filterBar}

      {/* ── Desktop: list left + detail (if selected) + map right ── */}
      <div className="hidden md:flex flex-1 min-h-0">
        {selectedPlace ? detailPanel : listPanel}
        {mapPanel}
      </div>

      {/* ── Mobile: toggle between list and map ── */}
      <div className="flex md:hidden flex-1 min-h-0">
        {mobileView === "list" ? (
          selectedPlace ? detailPanel : listPanel
        ) : (
          mapPanel
        )}
      </div>
    </div>
  );
}