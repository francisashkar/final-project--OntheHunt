import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  offset?: number;
}

export function ParallaxSection({ children, offset = 50 }: ParallaxSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className="parallax-section"
    >
      {children}
    </motion.div>
  );
}