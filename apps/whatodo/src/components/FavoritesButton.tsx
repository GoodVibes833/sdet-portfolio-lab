"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface Props {
  placeId: string;
}

function getFavs(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem("favorites") || "[]"));
  } catch {
    return new Set();
  }
}

function setFavs(ids: Set<string>) {
  localStorage.setItem("favorites", JSON.stringify([...ids]));
}

export default function FavoritesButton({ placeId }: Props) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(getFavs().has(placeId));
  }, [placeId]);

  const toggle = () => {
    const favs = getFavs();
    if (favs.has(placeId)) {
      favs.delete(placeId);
      setIsFav(false);
    } else {
      favs.add(placeId);
      setIsFav(true);
    }
    setFavs(favs);
  };

  return (
    <button onClick={toggle} className="flex items-center gap-1.5 text-sm font-bold transition-colors">
      <Heart size={18} className={isFav ? "fill-red-500 text-red-500" : "text-slate-400"} />
      <span className={isFav ? "text-red-500" : "text-slate-400"}>
        {isFav ? "찜함" : "찜하기"}
      </span>
    </button>
  );
}
