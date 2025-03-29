import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { useState, useEffect } from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  alternativeAction: {
    text: string;
    linkText: string;
    href: string;
  };
}

// Helper function to generate random particles
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    color: Math.random() > 0.6 ? "primary" : "secondary",
  }));
};

export function AuthCard({
  title,
  subtitle,
  children,
  alternativeAction,
}: AuthCardProps) {
  // Responsive width adjustment
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [particles, setParticles] = useState(() => generateParticles(15));
  
  // Regenerate particles occasionally for dynamic effect
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(generateParticles(15));
    }, 7000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full ${isDesktop ? "max-w-3xl" : "max-w-lg"}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative mt-[-50px]"
      >
        {/* Background decorative elements - make them more chaotic */}
        <div className="absolute -top-10 -left-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-16 w-24 h-24 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-12 -left-12 w-28 h-28 bg-accent/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-primary/15 rounded-full blur-3xl" />
        
        {/* Animated particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute z-0 rounded-full bg-${particle.color}/30`}
            style={{
              top: `${particle.y}%`,
              left: `${particle.x}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        <div className="bg-card/90 backdrop-blur-lg p-8 md:p-10 rounded-xl shadow-lg border border-border relative z-10 overflow-hidden">
          {/* Subtle gradient overlay with more visual interest */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-card/90 to-background/50 opacity-80 dark:from-card dark:via-card/70 dark:to-card/90" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rotate-45 transform translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rotate-45 transform -translate-x-16 translate-y-16" />
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-xl z-0">
            <div className="absolute inset-px rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 animate-gradient-x" />
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
              >
                {title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-muted-foreground mt-3"
              >
                {subtitle}
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {children}
            </motion.div>
            
            <div className="text-center mt-8">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-sm text-muted-foreground"
              >
                {alternativeAction.text}{" "}
                <Link to={alternativeAction.href} className="text-primary font-medium hover:underline">
                  {alternativeAction.linkText}
                </Link>
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 