import { useEffect, useState } from "react";

/**
 * Custom hook that returns true if the media query matches the current viewport
 * @param query - The media query to check (e.g., '(max-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const mediaQuery = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    setMatches(mediaQuery.matches);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
