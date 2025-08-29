import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';



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