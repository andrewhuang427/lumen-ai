"use client";

import { useEffect, useRef } from "react";

interface InfiniteScrollTriggerProps {
  onTrigger: () => void;
  enabled?: boolean;
  threshold?: number;
}

export default function InfiniteScrollTrigger({
  onTrigger,
  enabled = true,
  threshold = 100,
}: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          onTrigger();
        }
      },
      { rootMargin: `${threshold}px` },
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [onTrigger, enabled, threshold]);

  return <div ref={triggerRef} style={{ height: 1 }} />;
}
