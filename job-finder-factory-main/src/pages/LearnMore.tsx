import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { InfoIcon, ArrowRight, Award, TrendingUp, CheckCircle2, Users, Clock, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import BackgroundShapes from "@/components/hunting-parallax/BackgroundShapes";
import LandingHeader from "@/components/hunting-parallax/LandingHeader";
import ScrollToTop from "@/components/hunting-parallax/ScrollToTop";

// Feature data
const features = [
  {
    title: "AI-Powered Job Matching",
    description: "Our advanced AI algorithm analyzes your skills, experience, and preferences to find the perfect job opportunities tailored just for you.",
    details: "Using natural language processing and machine learning, our system understands the nuances of your career history and matches you with relevant opportunities. It continuously improves as you interact with jobs.",
    icon: "🤖",
    stats: { accuracy: "93%", matches: "150+", time: "75%" }
  },
  {
    title: "Smart Resume Builder",
    description: "Create professional, ATS-optimized resumes with our intelligent builder that suggests improvements and tailors content for specific job applications.",
    details: "The resume builder analyzes job descriptions and suggests keyword optimizations to help you pass Applicant Tracking Systems. It also provides formatting templates that are proven to catch recruiters' attention.",
    icon: "📝",
    stats: { acceptance: "68%", templates: "25+", time: "85%" }
  },
  {
    title: "Interview Preparation",
    description: "Practice with our AI interview simulator that provides real-time feedback and personalized coaching to improve your interview skills.",
    details: "The interview simulator uses speech recognition to analyze your responses, body language (via camera), and provides feedback on areas like clarity, confidence, and relevance. It includes industry-specific question banks.",
    icon: "🎯",
    stats: { questions: "1000+", skills: "12", success: "82%" }
  },
  {
    title: "Career Path Visualization",
    description: "Explore potential career paths based on your background and see the skills you need to acquire to reach your dream position.",
    details: "Using data from millions of career trajectories, we map out possible advancement paths, including salary projections, required skills, and estimated timelines. You can compare different paths side by side.",
    icon: "📊",
    stats: { paths: "50+", projections: "5 years", accuracy: "91%" }
  },
  {
    title: "Networking Opportunities",
    description: "Connect with professionals in your field, join industry-specific communities, and discover mentorship opportunities.",
    details: "Our networking algorithm suggests connections based on mutual career interests, industry, and potential for meaningful relationship building. It also highlights mentorship opportunities and industry events.",
    icon: "🌐",
    stats: { professionals: "100K+", industries: "75+", events: "200+" }
  },
  {
    title: "Skill Enhancement",
    description: "Identify skill gaps and access personalized learning resources to enhance your marketability in your chosen field.",
    details: "The skill enhancement feature compares your current skills against market demand and recommends specific courses, certifications, and resources. It tracks your progress and updates your profile as you acquire new skills.",
    icon: "🚀",
    stats: { courses: "5000+", partners: "120+", skills: "350+" }
  }
];

// Testimonials data - expanded with more testimonials
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer at TechGiant",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    quote: "I landed my dream job within 3 weeks of using this platform. The AI job matching was spot on!",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Marketing Director at BrandCorp",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    quote: "The interview preparation tool helped me overcome my anxiety and nail difficult questions.",
    rating: 5
  },
  {
    name: "Lucia Rodriguez",
    role: "Data Scientist at AnalyticsFirm",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    quote: "I was able to visualize my career path and focus on the right skills to advance quickly.",
    rating: 4
  },
  {
    name: "James Wilson",
    role: "UX Designer at CreativeStudio",
    image: "https://randomuser.me/api/portraits/men/42.jpg",
    quote: "The resume builder helped me transform my outdated CV into a modern, compelling story that got me multiple callbacks.",
    rating: 5
  },
  {
    name: "Emma Thompson",
    role: "Project Manager at GlobalTech",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    quote: "The networking features helped me connect with industry leaders I'd never have met otherwise. I'm now mentored by one of them!",
    rating: 5
  }
];

// Feature Card component
function FeatureCard({ feature }: { feature: any }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full overflow-hidden glass-card hover:shadow-lg hover:border-primary/50 transition-all duration-300">
        <CardHeader>
          <div className="text-3xl mb-2">{feature.icon}</div>
          <CardTitle className="text-foreground">{feature.title}</CardTitle>
          <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="p-3 bg-primary/5 rounded-md border border-primary/10">
            <p className="text-sm text-muted-foreground">{feature.details}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(feature.stats).map(([key, value]) => (
              <div key={key} className="flex flex-col items-center justify-center p-2 bg-background/50 rounded-md border border-border">
                <span className="text-sm font-semibold text-primary">{value}</span>
                <span className="text-xs text-muted-foreground capitalize">{key}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Testimonial Card component
function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass-card overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <img 
              src={testimonial.image} 
              alt={testimonial.name} 
              className="w-12 h-12 rounded-full object-cover border-2 border-primary"
            />
            <div>
              <p className="text-foreground font-medium">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              <div className="flex mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} 
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm italic text-muted-foreground">"{testimonial.quote}"</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Testimonial Carousel component
function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Show just 3 testimonials at once - this is optimal for most screen sizes
  const VISIBLE_ITEMS = 3; 
  const AUTO_SCROLL_INTERVAL = 5000; // 5 seconds

  // Auto scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setActiveIndex((current) => (current + 1) % (testimonials.length - VISIBLE_ITEMS + 1));
      }
    }, AUTO_SCROLL_INTERVAL);
    
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setActiveIndex((current) => 
      current >= testimonials.length - VISIBLE_ITEMS ? 0 : current + 1
    );
  };

  const handlePrev = () => {
    setActiveIndex((current) => 
      current <= 0 ? testimonials.length - VISIBLE_ITEMS : current - 1
    );
  };

  // Show progress indicators
  const renderProgressIndicators = () => {
    return (
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: testimonials.length - VISIBLE_ITEMS + 1 }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? "bg-primary" : "bg-primary/30"
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    );
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={carouselRef}
    >
      <div className="flex overflow-hidden relative">
        <motion.div
          className="flex gap-4 transition-all duration-500 ease-in-out"
          style={{
            transform: `translateX(-${activeIndex * 33.333}%)`,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="min-w-[33.333%] px-3"
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </motion.div>
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-background z-10 border border-border"
      >
        <ChevronLeft className="h-5 w-5 text-foreground" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-background z-10 border border-border"
      >
        <ChevronRight className="h-5 w-5 text-foreground" />
      </button>

      {renderProgressIndicators()}
    </div>
  );
}

// Stats Section component
function StatsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
      <StatCard 
        icon={<Users className="w-10 h-10 text-primary" />}
        value="250,000+"
        label="Active Users"
        description="Professionals using our platform daily"
      />
      <StatCard 
        icon={<TrendingUp className="w-10 h-10 text-primary" />}
        value="65%"
        label="Success Rate"
        description="Users finding jobs within 90 days"
      />
      <StatCard 
        icon={<Award className="w-10 h-10 text-primary" />}
        value="4.8/5"
        label="User Rating"
        description="Average satisfaction score"
      />
      <StatCard 
        icon={<Clock className="w-10 h-10 text-primary" />}
        value="42 Days"
        label="Average Time"
        description="From sign-up to accepted offer"
      />
    </div>
  );
}

// Stat Card component
function StatCard({ icon, value, label, description }: { icon: React.ReactNode, value: string, label: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass-card hover:shadow-lg hover:border-primary/50 transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3">{icon}</div>
            <h3 className="text-2xl font-bold text-foreground">{value}</h3>
            <p className="font-medium text-primary">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function LearnMore() {
  const navigate = useNavigate();
  
  // No need for a useEffect hook for theme preservation
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Function to navigate back to home while preserving theme
  const navigateToHome = () => {
    // Set flag to preserve theme when returning to landing page
    localStorage.setItem("preserveTheme", "true");
    navigate("/");
  };

  return (
    <div className="relative">
      <BackgroundShapes />
      <ScrollToTop />
      <LandingHeader />
      
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/80 dark:from-primary dark:via-primary/90 dark:to-primary/70"
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

          <div id="stats">
            <StatsSection />
          </div>

          <div id="features" className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Our <span className="text-primary">Powerful</span> Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every feature is designed to maximize your chances of landing the perfect job and accelerating your career growth.
            </p>
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
              />
            ))}
          </motion.div>

          <div id="stories" className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Success <span className="text-primary">Stories</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
              Hear from professionals who transformed their careers using our platform.
            </p>
            
            <TestimonialCarousel />
          </div>

          <div id="cta" className="bg-primary/5 p-8 rounded-xl border border-primary/20 mb-20 mt-24">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Ready to accelerate your career?</h3>
                <p className="text-muted-foreground">Join thousands of professionals who've found their dream jobs.</p>
              </div>
              <Button 
                size="lg"
                onClick={() => navigate("/signup")}
                className="group"
              >
                Get Started 
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Button 
              size="lg"
              onClick={navigateToHome}
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
    </div>
  );
}
