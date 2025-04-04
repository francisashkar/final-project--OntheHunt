import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check localStorage for theme preference
    const savedTheme = localStorage.getItem("theme");
    
    // Check if we should preserve the theme (coming from Learn More page)
    const shouldPreserveTheme = localStorage.getItem("preserveTheme") === "true";
    
    if (shouldPreserveTheme) {
      // If preserving, use the current theme (which is already applied)
      const currentIsDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(currentIsDark);
      localStorage.removeItem("preserveTheme");
    } else {
      // Otherwise apply the theme from localStorage, defaulting to light
      const initialDarkMode = savedTheme === "dark";
      setIsDarkMode(initialDarkMode);
      
      // Apply the theme to the document (defaulting to light)
      applyTheme(initialDarkMode);
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    applyTheme(newDarkMode);
  };

  const applyTheme = (darkMode: boolean) => {
    const root = window.document.documentElement;
    
    if (darkMode) {
      root.classList.remove("light");
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="icon"
          className="rounded-full bg-background/30 backdrop-blur-md hover:bg-primary/10 hover:text-primary transition-colors"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </motion.div>
    </div>
  );
} 