import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/use-scroll";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollToTop } = useScroll();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 700) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed right-6 bottom-6 z-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={scrollToTop}
            variant="outline"
            size="icon"
            className="rounded-full shadow-md hover:shadow-lg hover:bg-primary/10 hover:text-primary"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 