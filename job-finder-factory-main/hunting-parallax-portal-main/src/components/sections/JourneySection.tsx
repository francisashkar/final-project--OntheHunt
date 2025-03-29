import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { createJourneyConfetti } from "@/utils/confettiEffects";

export const JourneySection = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    createJourneyConfetti();
    setTimeout(() => navigate("/signup"), 500);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto text-center"
      >
        <Rocket className="w-16 h-16 mx-auto mb-6 text-primary animate-float" />
        <h2 className="text-4xl font-bold mb-6">
          Are You Ready to Start Your Journey?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of professionals who have already transformed their careers with our platform.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            className="text-lg px-8"
            onClick={handleClick}
          >
            Start Your Journey Today
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};