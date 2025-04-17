import { useEffect, useState } from "react";

/**
 * Custom hook that returns true if the media query matches the current viewport
 * @param query - The media query to check (e.g., '(max-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
const useMediaQuery = (query: string): boolean => {
  // Initialize with the current match state
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Update matches when the viewport changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener for viewport changes
    mediaQuery.addEventListener("change", handleChange);

    // Initial check
    setMatches(mediaQuery.matches);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
