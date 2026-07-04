"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Place, City } from "@/data/places";
import { places as staticPlaces } from "@/data/places";

interface PlacesContextType {
  places: Place[];
  cityPlaces: Place[];
  loading: boolean;
  error: string | null;
  selectedCity: City | null;
  setSelectedCity: (city: City | null) => void;
  refreshCity: () => void;
}

const cache: Record<string, Place[]> = {};

async function loadCityJson(city: City): Promise<Place[]> {
  if (cache[city]) return cache[city];
  try {
    const res = await fetch(`/data/${city}.json`);
    if (!res.ok) return [];
    const data: Place[] = await res.json();
    cache[city] = data;
    return data;
  } catch {
    return [];
  }
}

const PlacesContext = createContext<PlacesContextType>({
  places: staticPlaces,
  cityPlaces: staticPlaces,
  loading: false,
  error: null,
  selectedCity: null,
  setSelectedCity: () => {},
  refreshCity: () => {},
});

export function PlacesProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [dynamicPlaces, setDynamicPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCity = useCallback(async () => {
    if (!selectedCity) {
      setDynamicPlaces([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const cityData = await loadCityJson(selectedCity);

      // Yelp API for Toronto to fill gaps between downtown and North York
      let yelpData: Place[] = [];
      if (selectedCity === "toronto") {
        const areas = [
          { lat: 43.6532, lng: -79.3832, radius: 5000, name: "Downtown" },
          { lat: 43.6707, lng: -79.3869, radius: 5000, name: "Midtown/Yonge" },
          { lat: 43.7615, lng: -79.4111, radius: 5000, name: "North York" },
        ];
        for (const area of areas) {
          try {
            const res = await fetch(
              `/api/places?lat=${area.lat}&lng=${area.lng}&radius=${area.radius}&limit=50`
            );
            if (res.ok) {
              const json = await res.json();
              const page = (json.places || [])
                .filter((p: any) => typeof p.lat === "number" && typeof p.lng === "number" && !isNaN(p.lat) && !isNaN(p.lng))
                .map((p: any) => ({ ...p, city: "toronto" }));
              yelpData.push(...page);
            }
          } catch {
            // ignore single area failure, continue with others
          }
        }
      }

      // Merge static + Yelp, deduplicate by id
      const merged = [...cityData];
      const existingIds = new Set(cityData.map((p) => p.id));
      for (const p of yelpData) {
        if (!existingIds.has(p.id)) {
          merged.push(p);
          existingIds.add(p.id);
        }
      }

      if (merged.length === 0) {
        setError("데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
      }
      setDynamicPlaces(merged);
    } catch (err) {
      setError("데이터를 불러오는 중 오류가 발생했어요.");
      setDynamicPlaces([]);
    }
    setLoading(false);
  }, [selectedCity]);

  useEffect(() => {
    loadCity();
  }, [loadCity]);

  // 현재 선택된 도시: 동적 데이터(전체) + 다른 도시: 정적 데이터(핵심)
  const cityPlaces = selectedCity
    ? dynamicPlaces.length > 0
      ? dynamicPlaces
      : staticPlaces.filter((p) => p.city === selectedCity)
    : staticPlaces;

  // places = 모든 도시 합산 (선택된 도시는 동적, 나머지는 정적)
  const otherCities = staticPlaces.filter((p) => !selectedCity || p.city !== selectedCity);
  const places = [...otherCities, ...dynamicPlaces];

  return (
    <PlacesContext.Provider
      value={{
        places,
        cityPlaces,
        loading,
        error,
        selectedCity,
        setSelectedCity,
        refreshCity: loadCity,
      }}
    >
      {children}
    </PlacesContext.Provider>
  );
}

export function usePlaces() {
  return useContext(PlacesContext);
}
