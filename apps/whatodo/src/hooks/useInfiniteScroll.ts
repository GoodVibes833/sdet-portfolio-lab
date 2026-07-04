"use client";

import { useEffect, useRef, useCallback } from "react";

export function useInfiniteScroll(
  onIntersect: () => void,
  hasMore: boolean,
  loading: boolean
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const setSentinel = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (node && hasMore && !loading) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              onIntersect();
            }
          },
          { rootMargin: "100px" }
        );
        observerRef.current.observe(node);
      }
      sentinelRef.current = node;
    },
    [onIntersect, hasMore, loading]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  return { setSentinel };
}
