import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "default" | "animated";
}

export default function Logo({ 
  size = "md", 
  className = "",
  variant = "default"
}: LogoProps) {
  // Get current theme to adapt logo styling
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const sizeMap = {
    sm: "h-20 w-auto",
    md: "h-32 w-auto",
    lg: "h-48 w-auto"
  };

  const logoVariants = {
    animate: {
      filter: isDarkMode
        ? [
            "brightness(1.2) saturate(1.1) drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))",
            "brightness(1.3) saturate(1.2) drop-shadow(0 0 10px rgba(34, 197, 94, 0.6))",
            "brightness(1.2) saturate(1.1) drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))"
          ]
        : [
            "brightness(1.05) saturate(1.1) drop-shadow(0 0 4px rgba(34, 197, 94, 0.3))",
            "brightness(1.1) saturate(1.2) drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))",
            "brightness(1.05) saturate(1.1) drop-shadow(0 0 4px rgba(34, 197, 94, 0.3))"
          ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  // Adapt color filter based on the current theme
  const colorFilter = isDarkMode
    ? "brightness(1.4) contrast(1.15) saturate(1.1)"
    : "contrast(1.05) saturate(1.1)";

  // Base classes for all logo sizes
  const baseClasses = cn(
    sizeMap[size], 
    "object-contain bg-transparent logo-image",
    variant === "animated" && "animated",
    isDarkMode ? 'drop-shadow-md' : '',
    className
  );

  return (
    <Link
      to="/"
      className="flex items-center"
    >
      {variant === "animated" ? (
        <motion.img
          src="/images/branding/logo.png"
          alt="OnTheHunt Logo"
          initial={{ scale: 0.98 }}
          animate="animate"
          variants={logoVariants}
          whileHover={{ scale: 1.05 }}
          className={baseClasses}
          style={{ filter: colorFilter }}
        />
      ) : (
        <img 
          src="/images/branding/logo.png" 
          alt="OnTheHunt Logo" 
          className={baseClasses}
          style={{ filter: colorFilter }}
        />
      )}
    </Link>
  );
} 