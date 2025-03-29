import { motion } from "framer-motion";
import { Element } from "react-scroll";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function JourneySection() {
  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Sign up and build your personalized profile with your skills, experience, and career preferences."
    },
    {
      number: 2,
      title: "Discover Opportunities",
      description: "Browse AI-matched job listings tailored to your profile and career goals."
    },
    {
      number: 3,
      title: "Apply with Confidence",
      description: "Submit applications with professionally crafted resumes and cover letters."
    },
    {
      number: 4,
      title: "Land Your Dream Job",
      description: "Prepare for interviews with our resources and start your new career journey."
    }
  ];

  return (
    <Element name="journey" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Your <span className="text-primary">Career Journey</span> Starts Here
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow these simple steps to find and secure your ideal job opportunity with OnTheHunt
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline connector */}
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-primary/20 transform -translate-x-1/2 hidden md:block"></div>
          
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div 
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex flex-col md:flex-row ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-8 md:gap-0`}
              >
                <div className="md:w-1/2 flex flex-col items-center md:items-end md:pr-12">
                  {index % 2 === 0 ? (
                    <div className="w-full max-w-md space-y-3 text-center md:text-right">
                      <h3 className="text-xl font-bold">
                        <span className="text-primary mr-2">Step {step.number}:</span> {step.title}
                      </h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  ) : null}
                </div>
                
                <div className="z-10 flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full font-bold">
                  {step.number}
                </div>
                
                <div className="md:w-1/2 flex flex-col items-center md:items-start md:pl-12">
                  {index % 2 !== 0 ? (
                    <div className="w-full max-w-md space-y-3 text-center md:text-left">
                      <h3 className="text-xl font-bold">
                        <span className="text-primary mr-2">Step {step.number}:</span> {step.title}
                      </h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-semibold mb-6">Ready to Begin Your Journey?</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/signup">Get Started Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </Element>
  );
} 