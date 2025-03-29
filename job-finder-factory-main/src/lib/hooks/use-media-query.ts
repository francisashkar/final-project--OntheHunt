import { useState, useEffect } from "react";

/**
 * Custom hook for responsive designs using media queries
 * @param query CSS media query string (e.g., "(min-width: 768px)")
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Set up initial state based on window size
    const media = window.matchMedia(query);
    // Set state based on initial match
    setMatches(media.matches);

    // Define callback for future changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener for changes
    media.addEventListener("change", listener);

    // Clean up listener when component unmounts
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
} 