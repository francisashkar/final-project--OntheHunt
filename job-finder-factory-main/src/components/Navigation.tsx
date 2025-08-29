import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Briefcase, FileText, MessageSquare, LayoutDashboard, LogOut } from "lucide-react";
import Logo from "@/components/hunting-parallax/Logo";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Job, moveJobToChat } from "@/lib/jobService";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Create a custom event for settings updates - using the same event as in Dashboard
export const USER_SETTINGS_CHANGED_EVENT = "userSettingsChanged";
// Export a custom event for chat references updates
export const CHAT_REFERENCES_UPDATED_EVENT = "chatReferencesUpdated";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [userName, setUserName] = useState("User");

  // Load user settings from localStorage
  const loadUserSettings = () => {
    try {
      if (!currentUser) return;
      
      const userKey = currentUser.uid;
      const userSettingsKey = `userSettings_${userKey}`;
      const storedSettings = localStorage.getItem(userSettingsKey);

      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        if (settings.name) {
  
          setUserName(settings.name);
        }
      }
    } catch (error) {
      console.error("Error loading user settings:", error);
    }
  };

  // Check if user is logged in and load user settings
  useEffect(() => {
    if (currentUser) {

      
      // Set up real-time listener to user settings in Firebase
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.settings && data.settings.name) {
            const fullName = data.settings.name; // Get full name with spaces

            setUserName(fullName);
          } else if (currentUser.displayName) {
            // Fallback to Firebase user displayName

            setUserName(currentUser.displayName);
          } else if (currentUser.email) {
            // Fallback to email

            setUserName(currentUser.email.split('@')[0]);
          }
        } else {
          // No user document, use Firebase user data
          if (currentUser.displayName) {
            setUserName(currentUser.displayName);
          } else if (currentUser.email) {
            setUserName(currentUser.email.split('@')[0]);
          }
        }
      }, (error) => {
        console.error("Navigation: Error listening to Firebase:", error);
        // Fallback to Firebase user data on error
        if (currentUser.displayName) {
          setUserName(currentUser.displayName);
        } else if (currentUser.email) {
          setUserName(currentUser.email.split('@')[0]);
        }
      });
      
      return () => {

        unsubscribe();
      };
    } else {
      // No Firebase user, reset to default
      setUserName("User");
    }
  }, [currentUser]);
  
  // Firebase real-time listener handles all name updates automatically
  // No need for complex event handling or localStorage monitoring
  


  const handleLogout = async () => {
    try {
      // Clear any localStorage data that might interfere
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");
      localStorage.removeItem("userSettings");
      
      await logout();
      navigate("/");
    } catch (error) {
      // Handle logout error silently
    }
  };

  const userInitials = userName.split(' ').map(name => name[0]).join('').toUpperCase();

  // Check if current page is an auth page (signin or signup)
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  // Define nav items based on login status
  const getNavItems = () => {
    // Base nav items for all users
    const items = [
      { 
        label: "Home", 
        path: currentUser ? "/welcome" : "/",
        icon: <LayoutDashboard className="h-4 w-4 mr-1.5" />
      },
    ];
    
    // Only add Learn More for non-logged in users
    if (!currentUser) {
      items.push({ label: "Learn More", path: "/learn-more", icon: null });
    }
    
    // Add these items for all users
    items.push(
      { 
        label: "Find Jobs", 
        path: "/jobs",
        icon: <Briefcase className="h-4 w-4 mr-1.5" />
      },
      { 
        label: "Resume Builder", 
        path: "/resume-builder",
        icon: <FileText className="h-4 w-4 mr-1.5" />
      },
      { 
        label: "Career Chat", 
        path: "/career-assistant",
        icon: <MessageSquare className="h-4 w-4 mr-1.5" />
      }
    );
    
    return items;
  };

  const navItems = getNavItems();

  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to={currentUser ? "/welcome" : "/"} className="flex items-center">
            <Logo variant="animated" className="logo-image animated" size="sm" />
          </Link>
          
          {/* Only show navigation items if not on auth pages */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-base font-medium transition-colors hover:text-primary flex items-center",
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-3">
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
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full flex items-center gap-2 px-2 hover:bg-primary/10">
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium hidden sm:inline-block">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex flex-col px-2 pt-1 pb-2">
                    <span className="text-sm font-medium">Welcome back!</span>
                    <span className="text-xs text-muted-foreground truncate">{userName}</span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/welcome" className="w-full">
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="w-full">
                      My Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
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
