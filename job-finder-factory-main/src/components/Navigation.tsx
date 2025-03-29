import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, UserCircle2 } from "lucide-react";
import Logo from "@/components/hunting-parallax/Logo";

export default function Navigation() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);
  
  // Toggle theme
  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = root.classList.contains("dark") ? "light" : "dark";
    
    root.classList.remove("dark", "light");
    root.classList.add(newTheme);
    
    localStorage.setItem("theme", newTheme);
    setIsDarkMode(newTheme === "dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const userName = localStorage.getItem("user_name") || "User";

  // Check if current page is an auth page (signin or signup)
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  const navItems = [
    { label: "Home", path: isLoggedIn ? "/welcome" : "/" },
    { label: "Learn More", path: "/learn-more" },
    { label: "Find Jobs", path: "/jobs" },
    { label: "Resume Builder", path: "/resume-builder" },
    { label: "Career Chat", path: "/career-assistant" },
  ];

  // Add Dashboard link for logged in users
  if (isLoggedIn) {
    navItems.push({ label: "Dashboard", path: "/dashboard" });
  }

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/">
            <Logo variant="default" />
          </Link>
          
          {/* Only show navigation items if not on auth pages */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-base font-medium transition-colors hover:text-primary",
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            {/* Conditionally render auth buttons based on login status and current page */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                    <UserCircle2 className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex flex-col px-2 pt-1 pb-2">
                    <span className="text-sm font-medium">Welcome!</span>
                    <span className="text-xs text-muted-foreground">{userName}</span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="w-full">
                      My Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full">
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              !isAuthPage && (
                <>
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
                </>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
