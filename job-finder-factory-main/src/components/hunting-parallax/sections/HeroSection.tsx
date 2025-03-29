import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/use-scroll";
import Logo from "../Logo";

export default function HeroSection() {
  const { scrollTo } = useScroll();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6 max-w-4xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Logo size="lg" variant="animated" className="mx-auto mb-8" />
        </motion.div>
        
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
          Your <span className="text-primary dark:text-primary">Career Journey</span> Starts Here
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Let AI-powered insights guide you to the perfect job match, with personalized tools for every step of your career path.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            asChild
          >
            <Link to="/signup">Sign Up</Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            asChild
            className="text-foreground border-foreground/20 hover:bg-foreground/5"
          >
            <Link to="/signin">Sign In</Link>
          </Button>
          <Button 
            size="lg" 
            variant="ghost"
            asChild
            className="text-primary dark:text-primary hover:bg-primary/10 dark:hover:bg-primary/10"
          >
            <Link to="/learn-more">Learn More</Link>
          </Button>
        </div>
      </motion.div>

      <div 
        className="absolute bottom-8 cursor-pointer"
        onClick={() => scrollTo("features")}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-8 h-8 text-primary hover:scale-110 transition-transform" />
        </motion.div>
      </div>
    </div>
  );
} 