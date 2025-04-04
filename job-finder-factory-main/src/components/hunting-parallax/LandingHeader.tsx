import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });
  const { scrollTo } = useScroll();
  const location = useLocation();
  const isLearnMorePage = location.pathname === "/learn-more";

  // Navigation links for landing page
  const landingPageLinks = [
    { name: "Home", target: "hero" },
    { name: "Features", target: "features" },
    { name: "Jobs", target: "jobs" },
    { name: "Testimonials", target: "testimonials" },
    { name: "FAQ", target: "faq" },
    { name: "Contact", target: "contact" }
  ];

  // Navigation links for learn more page
  const learnMorePageLinks = [
    { name: "Stats", target: "stats" },
    { name: "Features", target: "features" },
    { name: "Stories", target: "stories" },
    { name: "Get Started", target: "cta" }
  ];

  // Select the appropriate links based on the current page
  const navLinks = isLearnMorePage ? learnMorePageLinks : landingPageLinks;

  // Detect scroll position to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Toggle theme
  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = root.classList.contains("dark") ? "light" : "dark";
    
    root.classList.remove("dark", "light");
    root.classList.add(newTheme);
    
    localStorage.setItem("theme", newTheme);
    setIsDarkMode(newTheme === "dark");
  };

  // Function to handle navigation
  const handleNavigation = (target: string) => {
    if (isLearnMorePage) {
      // For Learn More page, scroll to section IDs
      const element = document.getElementById(target);
      if (element) {
        const headerOffset = 100; // Adjust for header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    } else {
      // For Landing page, use the existing scrollTo function
      scrollTo(target);
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6",
        isScrolled ? "glass-navbar shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/">
          <Logo size="md" variant="animated" className="logo-image animated" />
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <button 
              key={link.target}
              onClick={() => handleNavigation(link.target)}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              {link.name}
            </button>
          ))}
          {isLearnMorePage && (
            <Link to="/" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Back to Home
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          <Link to="/signin">
            <Button variant="ghost" className="font-medium">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-primary text-white hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
} 