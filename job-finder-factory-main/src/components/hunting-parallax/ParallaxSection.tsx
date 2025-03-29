import { ReactNode, useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: ReactNode;
  offset?: number;
  speed?: number;
}

export default function ParallaxSection({
  children,
  offset = 50,
  speed = 0.5,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  const { scrollY } = useScroll();

  // Update element position on load and resize
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updatePosition = () => {
      const rect = element.getBoundingClientRect();
      setElementTop(rect.top + window.scrollY);
      setClientHeight(window.innerHeight);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  // Transform based on scroll position
  const y = useTransform(
    scrollY,
    [elementTop - clientHeight, elementTop + clientHeight],
    [-offset, offset * speed]
  );

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y }} className="h-full">
        {children}
      </motion.div>
    </div>
  );
} 