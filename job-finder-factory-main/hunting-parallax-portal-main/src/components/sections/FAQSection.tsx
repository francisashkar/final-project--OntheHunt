import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How does AI-powered job matching work?",
    answer: "Our AI analyzes your skills, experience, and preferences to find the most relevant job opportunities that match your profile. It continuously learns from successful matches to improve recommendations."
  },
  {
    question: "Is the resume builder free?",
    answer: "Yes, our AI-powered resume builder is completely free for all users. You can create multiple versions of your resume and export them in various formats."
  },
  {
    question: "How accurate is the salary analytics feature?",
    answer: "Our salary analytics are based on real-time market data and machine learning algorithms, providing accurate insights within a 5% margin of error for most roles and locations."
  },
  {
    question: "What kind of career guidance do you offer?",
    answer: "We provide personalized career coaching, skill gap analysis, industry insights, and mentorship opportunities to help you make informed career decisions."
  },
  {
    question: "How often are job listings updated?",
    answer: "Our job listings are updated in real-time through direct integrations with major job boards and company career pages."
  },
  {
    question: "Can I track my job applications?",
    answer: "Yes, we provide a comprehensive dashboard to track all your applications, interviews, and follow-ups in one place."
  },
  {
    question: "Do you offer interview preparation?",
    answer: "Yes, we provide AI-powered mock interviews, company-specific interview guides, and personalized feedback to help you prepare."
  },
  {
    question: "What industries do you cover?",
    answer: "We cover all major industries including tech, finance, healthcare, marketing, and more, with specialized insights for each sector."
  },
  {
    question: "How do I connect with mentors?",
    answer: "Our platform matches you with experienced professionals based on your career goals and industry preferences for mentorship opportunities."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use enterprise-grade encryption and follow strict privacy guidelines to protect your personal and professional information."
  }
];

export const FAQSection = () => {
  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-12"
        >
          Frequently Asked Questions
        </motion.h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
};