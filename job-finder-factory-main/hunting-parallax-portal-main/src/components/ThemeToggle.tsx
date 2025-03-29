import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const { toast } = useToast();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);

    if (!localStorage.getItem("darkModeMessageShown") && theme === "light") {
      toast({
        title: "Hey there!!",
        description: "You can use our dark mode, it's cooler!",
        duration: 5000,
      });
      localStorage.setItem("darkModeMessageShown", "true");
    }
  }, [theme, toast]);

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {theme === "light" && (
        <span className="text-sm font-medium animate-fade-in">
          Try dark mode!
        </span>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}