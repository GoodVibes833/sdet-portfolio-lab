"use client";

import { Footprints, Star, Heart, Folder, Tag } from "lucide-react";

interface Props {
  visitCount: number;
  reviewCount: number;
  favoriteCount: number;
  collectionCount: number;
  tagCount: number;
  onOpen?: () => void;
}

export default function UserStats({ visitCount, reviewCount, favoriteCount, collectionCount, tagCount, onOpen }: Props) {
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-sm hover:shadow-md transition-shadow w-full"
    >
      <StatItem icon={<Footprints size={16} />} value={visitCount} label="방문" color="text-green-500" />
      <StatItem icon={<Star size={16} />} value={reviewCount} label="리뷰" color="text-yellow-500" />
      <StatItem icon={<Heart size={16} />} value={favoriteCount} label="찜" color="text-red-400" />
      <StatItem icon={<Folder size={16} />} value={collectionCount} label="컬렉션" color="text-purple-500" />
      <StatItem icon={<Tag size={16} />} value={tagCount} label="태그" color="text-orange-500" />
    </button>
  );
}

function StatItem({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 min-w-0">
      <span className={color}>{icon}</span>
      <span className="text-sm font-bold text-slate-800">{value}</span>
      <span className="text-[10px] text-slate-400">{label}</span>
    </div>
  );
}
