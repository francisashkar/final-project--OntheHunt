import { useCallback } from "react";
import { animateScroll, scroller } from "react-scroll";

export function useScroll() {
  const scrollTo = useCallback((elementName: string) => {
    scroller.scrollTo(elementName, {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -80, // Adjust for navbar height
    });
  }, []);

  const scrollToTop = useCallback((options = {}) => {
    animateScroll.scrollToTop({
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      ...options,
    });
  }, []);

  const scrollToBottom = useCallback((options = {}) => {
    animateScroll.scrollToBottom({
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      ...options,
    });
  }, []);

  return {
    scrollTo,
    scrollToTop,
    scrollToBottom,
  };
} 