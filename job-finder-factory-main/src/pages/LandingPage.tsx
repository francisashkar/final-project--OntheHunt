import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Element } from "react-scroll";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/hunting-parallax/sections/HeroSection";
import FeaturesSection from "@/components/hunting-parallax/sections/FeaturesSection";
import ReviewsSection from "@/components/hunting-parallax/sections/ReviewsSection";
import FAQSection from "@/components/hunting-parallax/sections/FAQSection";
import ContactSection from "@/components/hunting-parallax/sections/ContactSection";
import JourneySection from "@/components/hunting-parallax/sections/JourneySection";
import JobCarouselSection from "@/components/hunting-parallax/sections/JobCarouselSection";
import BackgroundShapes from "@/components/hunting-parallax/BackgroundShapes";
import ScrollToTop from "@/components/hunting-parallax/ScrollToTop";
import ParallaxSection from "@/components/hunting-parallax/ParallaxSection";
import LandingHeader from "@/components/hunting-parallax/LandingHeader";

export default function LandingPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Note: Theme preservation is now handled by ThemeToggle component
  // This useEffect is simplified to only set light mode when NOT coming from Learn More
  useEffect(() => {
    // Check if we should preserve the theme (coming from Learn More page)
    const shouldPreserveTheme = localStorage.getItem("preserveTheme") === "true";
    
    // Only force light mode if we're not preserving theme
    if (!shouldPreserveTheme) {
      // Set light mode as default
      localStorage.setItem("theme", "light");
      const root = window.document.documentElement;
      root.classList.remove("dark", "light");
      root.classList.add("light");
    }
  }, []);

  return (
    <div className="relative">
      <BackgroundShapes />
      <ScrollToTop />
      <LandingHeader />
      
      <Element name="hero">
        <ParallaxSection>
          <HeroSection />
        </ParallaxSection>
      </Element>

      <Element name="features">
        <ParallaxSection offset={30}>
          <FeaturesSection />
        </ParallaxSection>
      </Element>

      <Element name="jobs">
        <JobCarouselSection />
      </Element>

      <Element name="testimonials">
        <ReviewsSection />
      </Element>

      <Element name="faq">
        <FAQSection />
      </Element>

      <Element name="contact">
        <ContactSection />
      </Element>

      <Element name="journey">
        <JourneySection />
      </Element>
    </div>
  );
} 