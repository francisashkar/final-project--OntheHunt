import { useState } from "react";
import { motion } from "framer-motion";
import { Element } from "react-scroll";
import { 
  RocketIcon, 
  LineChart, 
  MessagesSquare, 
  BriefcaseIcon, 
  Settings, 
  Star 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <RocketIcon className="w-10 h-10 text-primary" />,
    title: "AI-Powered Job Matching",
    description: "Our advanced algorithm finds positions that match your skills, experience, and preferences.",
    details: "Using machine learning to analyze job descriptions and your profile, we identify opportunities where you're most likely to succeed."
  },
  {
    icon: <LineChart className="w-10 h-10 text-primary" />,
    title: "Career Path Analysis",
    description: "Visualize potential career trajectories and understand skill requirements for your dream job.",
    details: "Based on data from millions of career paths, we project possible advancement opportunities and help you plan your next steps."
  },
  {
    icon: <MessagesSquare className="w-10 h-10 text-primary" />,
    title: "Interview Preparation",
    description: "Practice with our AI interview coach and get personalized feedback to improve.",
    details: "Our system simulates real interviews for your target roles, analyzing your responses and offering constructive guidance."
  },
  {
    icon: <BriefcaseIcon className="w-10 h-10 text-primary" />,
    title: "Resume Optimization",
    description: "Get tailored recommendations to make your resume stand out to recruiters and ATS systems.",
    details: "We analyze top-performing resumes for your desired positions and suggest specific improvements to increase your chances."
  },
  {
    icon: <Settings className="w-10 h-10 text-primary" />,
    title: "Skills Enhancement",
    description: "Identify and develop the most in-demand skills in your chosen field.",
    details: "Based on market trends and job requirements, we recommend specific courses and resources to build your competitive edge."
  },
  {
    icon: <Star className="w-10 h-10 text-primary" />,
    title: "Personalized Insights",
    description: "Receive data-driven advice tailored to your unique career goals and background.",
    details: "Our platform continuously learns from your interactions to provide increasingly relevant suggestions and opportunities."
  }
];

export default function FeaturesSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Element name="features-section" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            <span className="text-primary">Smart Features</span> for Your Career Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how our AI-powered tools can help you find, prepare for, and secure the perfect job opportunity
          </p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="h-full"
            >
              <Card className="h-full glass-card transition-all duration-300 border-border">
                <CardHeader className="relative z-10">
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                  <CardDescription className="text-foreground/70">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-sm text-muted-foreground bg-primary/5 p-3 rounded-md border border-primary/10">
                    {feature.details}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Element>
  );
} 