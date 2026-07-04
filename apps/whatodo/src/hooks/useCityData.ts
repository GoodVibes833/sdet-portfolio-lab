import { useState, useEffect } from "react";
import type { Place } from "@/data/places";

const cache: Record<string, Place[]> = {};

export async function loadCityData(city: string): Promise<Place[]> {
  if (cache[city]) return cache[city];

  try {
    const res = await fetch(`/data/${city}.json`);
    if (!res.ok) throw new Error(`Failed to load ${city}`);
    const data: Place[] = await res.json();
    cache[city] = data;
    return data;
  } catch {
    return [];
  }
}

export function useCityData(city: string | null) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city) { setPlaces([]); return; }

    setLoading(true);
    loadCityData(city)
      .then(setPlaces)
      .finally(() => setLoading(false));
  }, [city]);

  return { places, loading };
}
