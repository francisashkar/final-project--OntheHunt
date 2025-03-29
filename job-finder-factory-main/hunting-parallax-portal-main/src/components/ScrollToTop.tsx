import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={scrollToTop}
            className="rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <ArrowUp className="w-6 h-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};