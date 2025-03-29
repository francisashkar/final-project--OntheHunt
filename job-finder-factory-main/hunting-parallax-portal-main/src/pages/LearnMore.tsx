import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BackgroundShapes } from "@/components/BackgroundShapes";
import { useState } from "react";
import { LearnModeToggle } from "@/components/LearnModeToggle";
import { useToast } from "@/hooks/use-toast";
import { features } from "@/data/features-data";
import { FeatureCard } from "@/components/learn-more/FeatureCard";

export default function LearnMore() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [learnMode, setLearnMode] = useState(false);

  const handleLearnModeToggle = (enabled: boolean) => {
    setLearnMode(enabled);
    toast({
      title: enabled ? "Learn Mode Activated" : "Learn Mode Deactivated",
      description: enabled 
        ? "Hover over cards to discover detailed information about each feature" 
        : "Regular viewing mode restored",
      duration: 3000,
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative">
      <BackgroundShapes />
      <LearnModeToggle enabled={learnMode} onToggle={handleLearnModeToggle} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50"
          >
            Transform Your Career Journey
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Discover how our AI-powered platform can help you achieve your career goals
            and connect with opportunities that matter.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              learnMode={learnMode}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button 
            size="lg"
            onClick={() => navigate("/")}
            variant="outline"
            className="mr-4"
          >
            Back to Home
          </Button>
          <Button 
            size="lg"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}