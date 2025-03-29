import { ParallaxSection } from "@/components/ParallaxSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BackgroundShapes } from "@/components/BackgroundShapes";
import { ScrollToTop } from "@/components/ScrollToTop";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { JobCarouselSection } from "@/components/sections/JobCarouselSection";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Element } from "react-scroll";

export default function Index() {
  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(savedTheme);

    if (!localStorage.getItem("darkModeMessageShown") && savedTheme === "light") {
      toast({
        title: "Hey there!!",
        description: "You can use our dark mode, it's cooler!",
        duration: 5000,
      });
      localStorage.setItem("darkModeMessageShown", "true");
    }
  }, [toast]);

  return (
    <div className="relative">
      <BackgroundShapes />
      <ThemeToggle />
      <ScrollToTop />
      
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

      <Element name="platform">
        <div id="learn-more" className="max-w-4xl mx-auto p-8 glass-card my-20">
          <h2 className="text-3xl font-bold mb-6">Why Choose Our Platform?</h2>
          <div className="grid gap-8 text-left">
            <div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Resume Building</h3>
              <p>Our advanced AI technology helps you create professional resumes tailored to your industry and experience level. Get personalized suggestions and formatting options that make your resume stand out.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Smart Job Matching</h3>
              <p>Our intelligent algorithm analyzes your skills and preferences to match you with the perfect job opportunities. Save time by focusing on positions that align with your career goals.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Career Development Resources</h3>
              <p>Access a wealth of resources including interview preparation guides, salary negotiation tips, and industry insights to help you advance in your career.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Professional Network</h3>
              <p>Connect with industry professionals, mentors, and potential employers. Build meaningful relationships that can help accelerate your career growth.</p>
            </div>
          </div>
        </div>
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