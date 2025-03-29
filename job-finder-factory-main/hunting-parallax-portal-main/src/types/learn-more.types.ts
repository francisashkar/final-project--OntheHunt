import { LucideIcon } from "lucide-react";

export interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
  learnContent: {
    whatIsIt: string;
    howItWorks: string;
    benefits: string[];
    example: string;
  };
}