import { motion } from "framer-motion";
import { Element } from "react-scroll";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  Search, 
  FileText, 
  Trophy, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export default function JourneySection() {
  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Sign up and build your personalized profile with your skills, experience, and career preferences.",
      icon: <UserPlus className="w-6 h-6" />,
      color: "from-primary to-primary/80",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20"
    },
    {
      number: 2,
      title: "Discover Opportunities",
      description: "Browse AI-matched job listings tailored to your profile and career goals.",
      icon: <Search className="w-6 h-6" />,
      color: "from-primary to-primary/80",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20"
    },
    {
      number: 3,
      title: "Apply with Confidence",
      description: "Submit applications with professionally crafted resumes and cover letters.",
      icon: <FileText className="w-6 h-6" />,
      color: "from-primary to-primary/80",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20"
    },
    {
      number: 4,
      title: "Land Your Dream Job",
      description: "Prepare for interviews with our resources and start your new career journey.",
      icon: <Trophy className="w-6 h-6" />,
      color: "from-primary to-primary/80",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20"
    }
  ];

  return (
    <Element name="journey" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-6 py-3 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 border border-primary/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Your Success Path
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
            Your <span className="text-primary">Career Journey</span> Starts Here
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Follow these proven steps to find and secure your ideal job opportunity with OnTheHunt's AI-powered platform
          </p>
        </motion.div>

        <div className="relative">
          {/* Enhanced timeline connector */}
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gradient-to-b from-primary/30 via-primary to-primary/30 transform -translate-x-1/2 hidden lg:block" />
          
          <div className="space-y-16 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div 
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative flex flex-col lg:flex-row ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-12 lg:gap-16`}
              >
                {/* Content Section - Only render once per step */}
                <div className={`lg:w-1/2 flex flex-col items-center ${
                  index % 2 === 0 ? "lg:items-end lg:pr-16" : "lg:items-start lg:pl-16"
                }`}>
                  <motion.div 
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                    className={`w-full max-w-lg space-y-4 text-center ${
                      index % 2 === 0 ? "lg:text-right" : "lg:text-left"
                    }`}
                  >
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4 ${
                      step.bgColor
                    } ${step.borderColor} border`}>
                      {step.icon}
                      <span className="ml-2 text-foreground">Step {step.number}</span>
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    
                  </motion.div>
                </div>
                
                {/* Enhanced Step Circle */}
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.4 }}
                    className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-800`}
                  >
                    <div className="text-2xl font-bold">{step.number}</div>
                    
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} blur-xl opacity-50`} />
                  </motion.div>
                  
                  {/* Connection line for mobile */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden w-1 h-16 bg-gradient-to-b from-primary/30 to-primary/30 mx-auto mt-4" />
                  )}
                </div>
                
                {/* Empty div for layout balance - no content duplication */}
                <div className="lg:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-24 relative"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-8 border border-primary/20 backdrop-blur-sm"
            >
              <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                Ready to Begin Your Journey?
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have transformed their careers with OnTheHunt
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <Link to="/signup" className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Get Started Now
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-3 text-lg font-semibold border-2 hover:bg-primary/10 transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <Link to="/signin">Sign In</Link>
                </Button>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Free to start • No credit card required</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Element>
  );
} 