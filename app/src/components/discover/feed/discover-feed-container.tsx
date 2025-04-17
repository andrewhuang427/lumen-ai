"use client";

import { usePathname } from "next/navigation";
import { type PropsWithChildren, useEffect, useRef } from "react";
import { getScrollPosition, saveScrollPosition } from "./discover-feed-utils";

type Props = PropsWithChildren<{
  shouldScrollSavedPosition: boolean;
}>;

export default function DiscoverFeedContainer({
  children,
  shouldScrollSavedPosition,
}: Props) {
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  // Initialize the scroll position to the last saved position
  useEffect(() => {
    const position = getScrollPosition(pathname);
    const container = scrollableDivRef.current;
    if (container && shouldScrollSavedPosition) {
      container.scrollTo(position.left, position.top);
    } else {
      saveScrollPosition(pathname, { left: 0, top: 0 });
    }
  }, [pathname, shouldScrollSavedPosition]);

  // Save the scroll position when the user scrolls
  useEffect(() => {
    const container = scrollableDivRef.current;
    if (container == null) {
      return;
    }
    const handleScroll = () => {
      saveScrollPosition(pathname, {
        left: container.scrollLeft,
        top: container.scrollTop,
      });
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <div
      ref={scrollableDivRef}
      className="flex flex-1 flex-col overflow-y-auto"
    >
      <div className="mx-auto w-full max-w-3xl flex-1 p-4 md:my-8">
        {children}
      </div>
    </div>
  );
}
