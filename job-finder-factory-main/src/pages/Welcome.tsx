import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Briefcase, FileText, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import confetti from "canvas-confetti";

export default function Welcome() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("User");
  
  useEffect(() => {
    // Redirect if not logged in
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/");
      return;
    }
    
    // Set user name
    const storedName = localStorage.getItem("user_name");
    if (storedName) {
      setUserName(storedName);
    }
    
    // Trigger confetti effect - one time with shorter duration
    const runConfetti = () => {
      // Left side burst
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#22c55e', '#10b981', '#34d399'],
        disableForReducedMotion: true
      });
      
      // Right side burst
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#22c55e', '#10b981', '#34d399'],
        disableForReducedMotion: true
      });
    };
    
    // Run the confetti just once
    runConfetti();
  }, [navigate]);

  const featuredLinks = [
    {
      title: "Find Jobs",
      description: "Explore job opportunities matched to your skills and preferences",
      icon: <Briefcase className="w-10 h-10 text-primary dark:text-primary" />,
      path: "/jobs"
    },
    {
      title: "Create Your Resume",
      description: "Build a professional resume with our easy-to-use tools",
      icon: <FileText className="w-10 h-10 text-primary dark:text-primary" />,
      path: "/resume-builder"
    },
    {
      title: "Complete Your Profile",
      description: "Enhance your profile to get better job matches",
      icon: <CheckCircle className="w-10 h-10 text-primary dark:text-primary" />,
      path: "/dashboard"
    }
  ];
  
  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 text-foreground">Welcome to OnTheHunt, {userName}!</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your journey to finding the perfect job starts now. Let's get you set up for success.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid gap-6 md:grid-cols-3 mb-12"
      >
        {featuredLinks.map((link, index) => (
          <motion.div
            key={link.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow border-border">
              <CardHeader>
                <div className="mb-2">{link.icon}</div>
                <CardTitle className="text-foreground">{link.title}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-primary dark:text-primary hover:bg-primary/10 dark:hover:bg-primary/10"
                  onClick={() => navigate(link.path)}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto bg-primary/5 dark:bg-primary/10 p-8 rounded-lg"
      >
        <Rocket className="w-12 h-12 text-primary dark:text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-foreground">Ready to explore your full dashboard?</h2>
        <p className="text-muted-foreground mb-6">
          Visit your personalized dashboard to track applications, set job alerts, and more.
        </p>
        <Button size="lg" onClick={() => navigate("/dashboard")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Go to Dashboard
        </Button>
      </motion.div>
    </div>
  );
} 