import { motion } from "framer-motion";
import { Brain, FileText, MessageSquare, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-scroll";
import { ArrowDown } from "lucide-react";

const features = [
  {
    title: "Smart Job Matching",
    description: "AI-powered job recommendations based on your skills and preferences",
    icon: <Brain className="w-8 h-8 text-primary" />
  },
  {
    title: "AI Resume Builder",
    description: "Create professional resumes with intelligent suggestions",
    icon: <FileText className="w-8 h-8 text-primary" />
  },
  {
    title: "Career Chat Assistant",
    description: "Get instant answers to your career questions",
    icon: <MessageSquare className="w-8 h-8 text-primary" />
  },
  {
    title: "Salary Analytics",
    description: "Make informed decisions with real-time salary insights",
    icon: <TrendingUp className="w-8 h-8 text-primary" />
  }
];

export const FeaturesSection = () => {
  return (
    <div id="features" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="cursor-pointer"
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      <Link
        to="platform"
        smooth={true}
        duration={500}
        className="flex justify-center mt-12"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-8 h-8 text-primary hover:scale-110 transition-transform cursor-pointer" />
        </motion.div>
      </Link>
    </div>
  );
};