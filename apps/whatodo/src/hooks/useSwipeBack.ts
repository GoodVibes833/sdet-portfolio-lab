"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useSwipeBack(threshold = 80) {
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (touchStartX.current == null || touchStartY.current == null) return;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - touchStartX.current;
      const deltaY = endY - touchStartY.current;

      // Only trigger if horizontal swipe from left edge and mostly horizontal
      if (
        touchStartX.current < 30 &&
        deltaX > threshold &&
        Math.abs(deltaY) < Math.abs(deltaX) * 0.5
      ) {
        router.back();
      }
      touchStartX.current = null;
      touchStartY.current = null;
    },
    [router, threshold]
  );

  useEffect(() => {
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [onTouchStart, onTouchEnd]);
}
