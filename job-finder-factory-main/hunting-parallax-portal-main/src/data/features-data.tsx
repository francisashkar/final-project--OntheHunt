import { 
  Brain, 
  Rocket, 
  Target, 
  Users, 
  Briefcase, 
  TrendingUp,
  Award,
  BookOpen,
  MessageSquare,
  Shield,
  Code,
  Laptop,
  LineChart,
  Network,
  Lightbulb,
  GraduationCap
} from "lucide-react";
import { Feature } from "@/types/learn-more.types";

export const features: Feature[] = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI-Powered Matching",
    description: "Our advanced algorithms analyze your profile to find the perfect job matches.",
    learnContent: {
      whatIsIt: "AI-Powered Matching uses machine learning algorithms to analyze your skills, experience, and preferences against millions of job postings.",
      howItWorks: "The system continuously learns from successful job placements and user feedback to improve its matching accuracy. It considers factors like skills alignment, company culture fit, and career growth potential.",
      benefits: [
        "Higher quality job matches",
        "Reduced time spent searching",
        "Better career trajectory alignment",
        "Increased interview success rate"
      ],
      example: "For instance, if you're a frontend developer with React experience, the system might prioritize companies using similar tech stacks and match your preferred work culture."
    }
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Personalized Roadmap",
    description: "Get a customized career development plan based on your goals.",
    learnContent: {
      whatIsIt: "A dynamic career planning tool that creates a step-by-step path to achieve your professional goals.",
      howItWorks: "Based on your current skills and career aspirations, the system creates a customized learning path with specific milestones and skill-building recommendations.",
      benefits: [
        "Clear career progression path",
        "Targeted skill development",
        "Measurable progress tracking",
        "Industry-aligned goals"
      ],
      example: "If your goal is to become a Senior Software Engineer, your roadmap might include specific technical skills to acquire, leadership courses to take, and project experience to gain."
    }
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Mentorship Network",
    description: "Connect with industry leaders and experienced professionals.",
    learnContent: {
      whatIsIt: "A platform that connects you with mentors in your field to provide guidance and support.",
      howItWorks: "Users can browse mentor profiles, schedule sessions, and receive personalized advice based on their career goals.",
      benefits: [
        "Access to industry insights",
        "Personalized guidance",
        "Networking opportunities",
        "Support in career transitions"
      ],
      example: "For example, if you're transitioning from a technical role to a managerial position, a mentor can provide insights on leadership skills and team management."
    }
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "Job Search Tools",
    description: "Access powerful tools to streamline your job search process.",
    learnContent: {
      whatIsIt: "A suite of tools designed to simplify the job search process, including resume builders and application trackers.",
      howItWorks: "Users can create and customize resumes, track job applications, and receive alerts for new job postings that match their criteria.",
      benefits: [
        "Efficient job application process",
        "Improved resume quality",
        "Better organization of job search",
        "Increased chances of landing interviews"
      ],
      example: "For instance, you can use the resume builder to create a tailored resume for each job application, ensuring you highlight the most relevant experience."
    }
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Market Insights",
    description: "Stay informed with real-time industry trends and salary data.",
    learnContent: {
      whatIsIt: "A feature that provides users with up-to-date information on job market trends and salary benchmarks.",
      howItWorks: "The system aggregates data from various sources to present insights on job demand, salary ranges, and industry growth.",
      benefits: [
        "Informed career decisions",
        "Understanding of market demands",
        "Negotiation leverage",
        "Awareness of emerging skills"
      ],
      example: "For example, if you're considering a career change, you can use market insights to identify high-demand roles and the skills needed to qualify."
    }
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Skill Certifications",
    description: "Earn recognized certifications to boost your credentials.",
    learnContent: {
      whatIsIt: "A program that offers various certifications in different fields to enhance your professional profile.",
      howItWorks: "Users can enroll in courses, complete assessments, and earn certifications that are recognized by employers.",
      benefits: [
        "Enhanced employability",
        "Demonstrated expertise",
        "Opportunities for career advancement",
        "Increased earning potential"
      ],
      example: "For instance, obtaining a certification in project management can make you a more attractive candidate for managerial roles."
    }
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Learning Resources",
    description: "Access comprehensive learning materials and courses.",
    learnContent: {
      whatIsIt: "A library of resources including articles, videos, and courses to help you develop new skills.",
      howItWorks: "Users can browse and enroll in courses tailored to their interests and career goals.",
      benefits: [
        "Continuous skill development",
        "Flexible learning options",
        "Access to expert knowledge",
        "Support for career transitions"
      ],
      example: "For example, you can take an online course in data analysis to pivot your career towards data science."
    }
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Interview Prep",
    description: "Practice with AI-powered mock interviews and get feedback.",
    learnContent: {
      whatIsIt: "A tool that simulates real interview scenarios to help users prepare effectively.",
      howItWorks: "Users can select interview types, practice answering questions, and receive feedback on their performance.",
      benefits: [
        "Increased confidence",
        "Improved interview skills",
        "Personalized feedback",
        "Better preparation for real interviews"
      ],
      example: "For instance, you can practice a technical interview for a software engineering position and receive tips on how to improve your answers."
    }
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Career Security",
    description: "Build a resilient career path with our guidance.",
    learnContent: {
      whatIsIt: "A feature that helps users develop a sustainable career strategy to navigate changes in the job market.",
      howItWorks: "Users receive personalized advice on skill development, networking, and career planning.",
      benefits: [
        "Long-term career stability",
        "Proactive career management",
        "Adaptability to market changes",
        "Informed decision-making"
      ],
      example: "For example, if you're in a declining industry, you can receive guidance on how to transition to a growing field."
    }
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    title: "Growth Opportunities",
    description: "Discover opportunities for advancement and skill development.",
    learnContent: {
      whatIsIt: "A feature that identifies potential career advancement opportunities based on user profiles.",
      howItWorks: "The system analyzes user skills and career goals to suggest relevant growth opportunities.",
      benefits: [
        "Increased career satisfaction",
        "Clear pathways for advancement",
        "Access to new roles",
        "Skill enhancement"
      ],
      example: "For instance, if you're a junior developer, the system might suggest a path to become a senior developer with specific skills to acquire."
    }
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Technical Assessment",
    description: "Evaluate your technical skills with our comprehensive testing platform.",
    learnContent: {
      whatIsIt: "A platform that offers assessments to evaluate your technical skills in various domains.",
      howItWorks: "Users can take tests in their area of expertise and receive detailed feedback on their performance.",
      benefits: [
        "Identify skill gaps",
        "Benchmark against industry standards",
        "Prepare for job applications",
        "Enhance learning focus"
      ],
      example: "For example, you can take a coding assessment to identify areas for improvement before applying for a software engineering role."
    }
  },
  {
    icon: <Laptop className="w-8 h-8" />,
    title: "Remote Work Support",
    description: "Find and prepare for remote opportunities worldwide.",
    learnContent: {
      whatIsIt: "A feature that connects users with remote job opportunities and resources.",
      howItWorks: "Users can browse remote job listings and access resources to prepare for remote work.",
      benefits: [
        "Flexibility in work location",
        "Access to global job market",
        "Work-life balance",
        "Diverse job opportunities"
      ],
      example: "For instance, you can find remote positions in your field and receive tips on how to succeed in a remote work environment."
    }
  },
  {
    icon: <LineChart className="w-8 h-8" />,
    title: "Career Analytics",
    description: "Track your progress and identify areas for improvement.",
    learnContent: {
      whatIsIt: "A tool that provides analytics on your career development and job search activities.",
      howItWorks: "Users can view metrics on their applications, interviews, and skill development over time.",
      benefits: [
        "Data-driven insights",
        "Improved decision-making",
        "Enhanced self-awareness",
        "Targeted skill development"
      ],
      example: "For example, you can analyze your job application success rate and adjust your strategy accordingly."
    }
  },
  {
    icon: <Network className="w-8 h-8" />,
    title: "Industry Network",
    description: "Connect with professionals in your field and build relationships.",
    learnContent: {
      whatIsIt: "A networking platform that facilitates connections between users and industry professionals.",
      howItWorks: "Users can join groups, attend events, and connect with peers and mentors.",
      benefits: [
        "Expanded professional network",
        "Access to job referrals",
        "Collaboration opportunities",
        "Support in career transitions"
      ],
      example: "For instance, you can join a local tech group to meet professionals in your area and learn about job openings."
    }
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Innovation Hub",
    description: "Stay updated with the latest industry innovations and trends.",
    learnContent: {
      whatIsIt: "A resource center that provides information on the latest trends and innovations in various industries.",
      howItWorks: "Users can access articles, webinars, and reports on emerging technologies and practices.",
      benefits: [
        "Stay ahead of the curve",
        "Informed decision-making",
        "Opportunities for innovation",
        "Enhanced competitive edge"
      ],
      example: "For example, you can learn about the latest advancements in AI and how they can impact your career."
    }
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: "Continuous Learning",
    description: "Access ongoing education and professional development resources.",
    learnContent: {
      whatIsIt: "A commitment to lifelong learning through various educational resources and opportunities.",
      howItWorks: "Users can enroll in courses, attend workshops, and access materials to enhance their skills continuously.",
      benefits: [
        "Adaptability to change",
        "Enhanced career prospects",
        "Personal growth",
        "Increased job satisfaction"
      ],
      example: "For instance, you can take a course on leadership skills to prepare for future management roles."
    }
  }
];
