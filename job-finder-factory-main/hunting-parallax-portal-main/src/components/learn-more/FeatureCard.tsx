import { motion } from "framer-motion";
import { Feature } from "@/types/learn-more.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FeatureCardProps {
  feature: Feature;
  learnMode: boolean;
}

export const FeatureCard = ({ feature, learnMode }: FeatureCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full relative group">
        <CardHeader>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-primary mb-4"
          >
            {feature.icon}
          </motion.div>
          <CardTitle>{feature.title}</CardTitle>
          <CardDescription>{feature.description}</CardDescription>
        </CardHeader>
        
        {learnMode && (
          <CardContent className="absolute inset-0 bg-background/95 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-6 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-primary mb-2">What is it?</h4>
                <p className="text-sm">{feature.learnContent.whatIsIt}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-primary mb-2">How it works</h4>
                <p className="text-sm">{feature.learnContent.howItWorks}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-primary mb-2">Key Benefits</h4>
                <ul className="list-disc list-inside text-sm">
                  {feature.learnContent.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-primary mb-2">Example</h4>
                <p className="text-sm">{feature.learnContent.example}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};