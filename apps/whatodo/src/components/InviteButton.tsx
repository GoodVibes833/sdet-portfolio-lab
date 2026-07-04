"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import dynamic from "next/dynamic";

const InviteModal = dynamic(() => import("@/components/InviteModal"), { ssr: false });

interface InviteButtonProps {
  placeId: string;
  placeName: string;
  placeNeighborhood?: string;
  variant?: "card" | "full";
}

export default function InviteButton({ placeId, placeName, placeNeighborhood, variant = "full" }: InviteButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className={
          variant === "card"
            ? "flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all border border-orange-100"
            : "flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all border border-orange-100"
        }
      >
        <CalendarDays size={variant === "card" ? 13 : 16} />
        {variant === "card" ? "같이 가자" : "가자고 제안하기"}
      </button>
      {open && (
        <InviteModal
          placeId={placeId}
          placeName={placeName}
          placeNeighborhood={placeNeighborhood}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
