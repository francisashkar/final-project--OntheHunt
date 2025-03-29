import { motion } from "framer-motion";
import { Element } from "react-scroll";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "How does OnTheHunt match me with suitable jobs?",
      answer:
        "OnTheHunt uses advanced AI algorithms to analyze your skills, experience, preferences, and career goals. We then match you with job opportunities that align with your profile, considering factors like required skills, company culture, and growth potential."
    },
    {
      question: "Is OnTheHunt free to use?",
      answer:
        "Yes, our basic job search, matching, and application features are free for all job seekers. We offer premium subscription plans with advanced features like priority matching, unlimited applications, and personalized career coaching for users who want enhanced services."
    },
    {
      question: "How can I improve my match score for job listings?",
      answer:
        "To improve your match score, make sure your profile is complete with detailed information about your skills, experience, and preferences. Regularly update your profile as you gain new skills or experiences. Our AI system will provide personalized recommendations on skills to develop for better matches."
    },
    {
      question: "Can employers contact me directly through OnTheHunt?",
      answer:
        "Yes, employers can reach out to you directly if they're interested in your profile. You have control over your privacy settings and can choose to be visible to all employers, only to specific industries, or remain anonymous until you express interest in a job."
    },
    {
      question: "How often are new jobs added to the platform?",
      answer:
        "New job opportunities are added to our platform daily. Our system continuously crawls job boards, company career pages, and receives direct postings from employers. You can set up alerts to be notified when new jobs matching your criteria are added."
    },
    {
      question: "What makes OnTheHunt different from other job platforms?",
      answer:
        "OnTheHunt stands out with our AI-powered matching technology that goes beyond keyword matching. We consider the nuances of your skills and preferences alongside company culture and job requirements. Our platform also provides personalized career path insights, skill development recommendations, and a supportive community of professionals."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Element name="faq" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our platform, features, and how we can help you land your dream job
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AccordionItem value={`item-${index}`} className="glass-card mb-4 rounded-lg overflow-hidden border-none">
                  <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:no-underline hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </Element>
  );
} 