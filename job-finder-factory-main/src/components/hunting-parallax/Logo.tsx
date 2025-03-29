import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  className?: string;
  variant?: "default" | "animated";
}

export default function Logo({ 
  size = "md", 
  withText = true,
  className = "",
  variant = "default"
}: LogoProps) {
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14"
  };

  const textSizeMap = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl"
  };

  const flameVariants = {
    animate: {
      scale: [1, 1.1, 1],
      filter: [
        "brightness(1) drop-shadow(0 0 5px rgba(34, 197, 94, 0.5))",
        "brightness(1.2) drop-shadow(0 0 10px rgba(34, 197, 94, 0.7))",
        "brightness(1) drop-shadow(0 0 5px rgba(34, 197, 94, 0.5))"
      ],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <Link
      to="/"
      className={`flex items-center gap-3 ${className}`}
    >
      {variant === "animated" ? (
        <motion.div
          initial={{ scale: 0.9 }}
          animate="animate"
          variants={flameVariants}
          whileHover={{ scale: 1.05, rotate: 5 }}
          className={`relative grid place-items-center rounded-full ${sizeMap[size]} bg-gradient-to-br from-green-500 to-emerald-700`}
        >
          <Flame className="w-6 h-6 text-white" />
          <motion.div
            animate={{
              opacity: [0.7, 0.9, 0.7],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 bg-gradient-to-t from-green-500 to-transparent rounded-full blur-md z-0"
          />
        </motion.div>
      ) : (
        <div className={`rounded-full grid place-items-center ${sizeMap[size]} bg-gradient-to-br from-green-500 to-emerald-700`}>
          <Flame className="w-5 h-5 text-white" />
        </div>
      )}
      
      {withText && (
        <div className={variant === "animated" ? "animate-fade-in" : ""}>
          <div className="flex flex-col justify-center">
            <span className={`font-bold ${textSizeMap[size]} ${variant === "animated" ? "bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-700" : "text-primary"} tracking-tight`}>
              <span className="text-green-500">O</span>nTheHunt
            </span>
            {size !== "sm" && (
              <span className="text-xs text-muted-foreground">
                {variant === "animated" ? "AI-Powered Career Platform" : "Find Your Perfect Career"}
              </span>
            )}
          </div>
        </div>
      )}
    </Link>
  );
} 