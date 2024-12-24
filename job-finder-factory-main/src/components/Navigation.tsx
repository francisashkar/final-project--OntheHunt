import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { Button } from "./ui/button";

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Find Jobs", path: "/find-jobs" },
    { label: "Resume Builder", path: "/resume-builder" },
    { label: "Career Chat", path: "/career-assistant" },
  ];

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-base font-medium transition-colors hover:text-[#00e887]",
                  location.pathname === item.path
                    ? "text-[#00e887]"
                    : "text-gray-600"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="font-medium">
              Sign In
            </Button>
            <Button className="bg-[#00e887] text-white hover:bg-[#00e887]/90">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
