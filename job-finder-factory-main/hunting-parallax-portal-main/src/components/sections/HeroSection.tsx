import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <Logo />
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mt-8">
          Your AI-Powered <span className="text-primary">Career Companion</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Find your dream job, build a professional resume, and get career guidance all in one place.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/signup")}>
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate("/learn-more")}
          >
            Learn More
          </Button>
        </div>
      </motion.div>
      <Link
        to="features"
        smooth={true}
        duration={500}
        className="absolute bottom-8 cursor-pointer"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-8 h-8 text-primary hover:scale-110 transition-transform" />
        </motion.div>
      </Link>
    </div>
  );
};