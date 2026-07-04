"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, MapPin } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { categories, getSubCategories, matchesSubCategory, type Category } from "@/data/places";
import { usePlaces } from "@/context/PlacesContext";
import PlaceCard from "@/components/PlaceCard";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { useGeoContext } from "@/context/GeolocationContext";

// Haversine distance calculation
function getDistance(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const haversine =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as Category | null;

  const { places, loading: placesLoading } = usePlaces();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCategory ?? "맛집");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const { lat, lng, error: geoError, loading: geoLoading } = useGeoContext();

  // Default to distance sort when GPS available, otherwise score
  const [sortBy, setSortBy] = useState<"distance" | "score" | "rating">("distance");
  const [maxDistance, setMaxDistance] = useState<number>(100); // km - 기본 100km
  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [freeOnly, setFreeOnly] = useState(false);
  const [hiddenOnly, setHiddenOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Update default sort when GPS loads
  useEffect(() => {
    if (!geoLoading && !geoError && lat && lng) {
      setSortBy("distance");
    }
  }, [geoLoading, geoError, lat, lng]);

  const filtered = useMemo(() => {
    let result = places.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.includes(search));
      const matchCat = !selectedCategory || p.category === selectedCategory;
      const matchSubCat = !selectedSubCategory || matchesSubCategory(p, selectedSubCategory);
      const matchPrice = priceFilter === null || p.priceLevel === priceFilter;
      const matchFree = !freeOnly || p.isFree === true;
      const matchHidden = !hiddenOnly || p.tags.some((t) => t.includes("히든") || t.includes("hidden"));
      
      // Distance filter
      let matchDistance = true;
      if (lat && lng) {
        const dist = getDistance(lat, lng, p.lat, p.lng);
        matchDistance = dist <= maxDistance;
      }
      
      return matchSearch && matchCat && matchSubCat && matchPrice && matchFree && matchHidden && matchDistance;
    });
    
    // Sorting
    if (sortBy === "score") {
      result = [...result].sort((a, b) => (b.recommendScore ?? 0) - (a.recommendScore ?? 0));
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "distance" && lat && lng) {
      result = [...result].sort((a, b) => {
        const distA = getDistance(lat, lng, a.lat, a.lng);
        const distB = getDistance(lat, lng, b.lat, b.lng);
        return distA - distB;
      });
    }
    
    return result;
  }, [places, search, selectedCategory, selectedSubCategory, priceFilter, freeOnly, hiddenOnly, sortBy, maxDistance, lat, lng]);

  const priceLabels = ["무료", "$", "$$", "$$$"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div
        className="py-12 px-4"
        style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 data-testid="explore-heading" className="text-3xl font-black text-white mb-2 flex items-center gap-2">
            <MapPin size={28} className="text-emerald-400" />
            내 주변 핫플
          </h1>
          <p className="text-blue-200 text-sm mb-2">
            현재 위치에서 가까운 맛집, 카페, 액티비티를 추천해드려요
          </p>
          {!geoLoading && !geoError && lat && lng && (
            <p className="text-emerald-300 text-xs mb-4">
              📍 GPS 기준 가까운순 정렬
            </p>
          )}
          {geoLoading && (
            <p className="text-amber-200 text-xs mb-4">
              📡 위치 정보를 가져오는 중...
            </p>
          )}
          {geoError && (
            <p className="text-amber-200 text-xs mb-4">
              ⚠️ {geoError} — 추천순으로 표시됩니다
            </p>
          )}

          {/* Search */}
          <SearchBar
            value={search}
            onChange={setSearch}
            onFilterToggle={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
          />

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 space-y-4">
              {/* 무료 토글 */}
              <div className="flex items-center gap-3">
                <button
                  data-testid="filter-free"
                  onClick={() => setFreeOnly(!freeOnly)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all",
                    freeOnly ? "bg-green-400 text-white border-green-400" : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  )}
                >
                  {freeOnly ? "✅" : "🆓"} 무료만 보기
                </button>
                <button
                  data-testid="filter-hidden"
                  onClick={() => setHiddenOnly(!hiddenOnly)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all",
                    hiddenOnly ? "border-transparent text-white" : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  )}
                  style={hiddenOnly ? { background: "linear-gradient(135deg,#7c3aed,#a855f7)", borderColor: "transparent" } : {}}
                >
                  🕵️ 히든 스팟만
                </button>
              </div>
              {/* 가격대 */}
              <div>
                <p className="text-white/70 text-xs font-semibold uppercase mb-2">가격대</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setPriceFilter(null)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-sm font-semibold transition-all",
                      priceFilter === null ? "bg-white text-slate-900" : "bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    전체
                  </button>
                  {priceLabels.map((label, i) => (
                    <button
                      key={i}
                      onClick={() => setPriceFilter(priceFilter === i ? null : i)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-sm font-semibold transition-all",
                        priceFilter === i ? "bg-white text-slate-900" : "bg-white/10 text-white hover:bg-white/20"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {/* 거리 범위 */}
              {lat && lng && (
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase mb-2">거리 범위</p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setMaxDistance(9999)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-sm font-semibold transition-all",
                        maxDistance === 9999 ? "bg-white text-slate-900" : "bg-white/10 text-white hover:bg-white/20"
                      )}
                    >
                      전체
                    </button>
                    {[5, 10, 20, 50, 100].map((d) => (
                      <button
                        key={d}
                        onClick={() => setMaxDistance(d)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-sm font-semibold transition-all",
                          maxDistance === d ? "bg-white text-slate-900" : "bg-white/10 text-white hover:bg-white/20"
                        )}
                      >
                        {d}km
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* 정렬 */}
              <div>
                <p className="text-white/70 text-xs font-semibold uppercase mb-2">정렬</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSortBy("distance")}
                    disabled={!lat || !lng}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-sm font-semibold transition-all",
                      sortBy === "distance" ? "bg-white text-slate-900" : "bg-white/10 text-white hover:bg-white/20",
                      (!lat || !lng) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    📍 가까운순
                  </button>
                  <button
                    onClick={() => setSortBy("score")}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-sm font-semibold transition-all",
                      sortBy === "score" ? "bg-white text-slate-900" : "bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    ⭐ 추천순
                  </button>
                  <button
                    onClick={() => setSortBy("rating")}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-sm font-semibold transition-all",
                      sortBy === "rating" ? "bg-white text-slate-900" : "bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    🌟 평점순
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          {/* Main categories */}
          <div className="flex gap-2 pt-3 pb-2 overflow-x-auto scrollbar-hide">
            <button
              data-testid="cat-all"
              onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); }}
              className={cn(
                "shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                !selectedCategory ? "text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
              style={!selectedCategory ? { background: "linear-gradient(135deg, #e85d26, #f5a623)" } : {}}
            >
              전체 ({places.length})
            </button>
            {categories.map((cat) => {
              const count = places.filter((p) => p.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  data-testid={`cat-${cat.testId}`}
                  key={cat.id}
                  onClick={() => {
                    if (isSelected) { setSelectedCategory(null); setSelectedSubCategory(null); }
                    else { setSelectedCategory(cat.id); setSelectedSubCategory(null); }
                  }}
                  className={cn(
                    "shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                    isSelected ? "text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                  style={isSelected ? { background: "linear-gradient(135deg, #e85d26, #f5a623)" } : {}}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                  <span className={cn("text-xs", isSelected ? "text-white/70" : "text-slate-400")}>{count}</span>
                </button>
              );
            })}
          </div>
          {/* Sub-category chips — shown when a main category is selected */}
          {selectedCategory && (() => {
            const subs = getSubCategories(selectedCategory);
            if (!subs.length) return null;
            return (
              <div className="flex gap-1.5 pb-2.5 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setSelectedSubCategory(null)}
                  className={cn(
                    "shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all border",
                    !selectedSubCategory ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                  )}
                >
                  전체
                </button>
                {subs.map((sub) => {
                  const isSubSel = selectedSubCategory === sub.id;
                  const subCount = places.filter((p) => p.category === selectedCategory && matchesSubCategory(p, sub.id)).length;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubCategory(isSubSel ? null : sub.id)}
                      className={cn(
                        "shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all border",
                        isSubSel ? "text-white border-transparent" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                      )}
                      style={isSubSel ? { background: "linear-gradient(135deg,#1e3a5f,#2d5a8e)", borderColor: "transparent" } : {}}
                    >
                      <span>{sub.emoji}</span>
                      {sub.label}
                      <span className={cn("text-xs", isSubSel ? "text-white/60" : "text-slate-400")}>{subCount}</span>
                    </button>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p data-testid="results-count" className="text-slate-500 text-sm">
            <span className="font-bold text-slate-900">{filtered.length}개</span> 장소 발견
            {freeOnly && <span className="ml-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">🆓 무료만</span>}
            {hiddenOnly && <span className="ml-2 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">🕵️ 히든만</span>}
            {selectedSubCategory && <span className="ml-2 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">🔍 세부 필터</span>}
          </p>
          <div className="flex items-center gap-2">
            {sortBy === "distance" && lat && lng && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                📍 현재 위치 기준
              </span>
            )}
            {(priceFilter !== null || freeOnly || hiddenOnly || !!selectedSubCategory || sortBy !== "distance") && (
              <button
                data-testid="filter-reset"
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                  setPriceFilter(null);
                  setSearch("");
                  setFreeOnly(false);
                  setHiddenOnly(false);
                  setSortBy("distance");
                }}
                className="flex items-center gap-1 text-sm text-orange-600 font-semibold hover:underline"
              >
                <X size={14} />
                필터 초기화
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-500 text-lg font-semibold mb-2">검색 결과가 없어요</p>
            <p className="text-slate-400 text-sm">다른 키워드나 카테고리로 검색해보세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((place) => (
              <PlaceCard key={place.id} place={place} userLocation={lat && lng ? { lat, lng } : null} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-slate-400">로딩 중...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
