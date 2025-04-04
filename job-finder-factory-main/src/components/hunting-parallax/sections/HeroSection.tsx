import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/use-scroll";
import DualHandsInteraction from "../DualHandsInteraction";

export default function HeroSection() {
  const { scrollTo } = useScroll();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden bg-gradient-to-br from-green-100 via-white to-green-200 dark:from-green-950 dark:via-gray-900 dark:to-green-900">
      {/* Green gradient overlay for added depth */}
      <div className="absolute inset-0 bg-gradient-radial from-green-300/20 to-transparent dark:from-green-500/10"></div>
      
      <DualHandsInteraction />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6 max-w-4xl relative z-10"
      >
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
          Your <span className="text-primary dark:text-primary">Career Journey</span> Starts Here
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          <span className="font-semibold text-primary">OnTheHunt:</span> AI-Powered Career Platform - Let AI-powered insights guide you to the perfect job match, with personalized tools for every step of your career path.
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
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-sm text-muted-foreground mt-8"
        >
          Experience "The Creation of AI" by clicking the button below to control the AI hand
        </motion.p>
      </motion.div>

      <div 
        className="absolute bottom-8 cursor-pointer z-10"
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