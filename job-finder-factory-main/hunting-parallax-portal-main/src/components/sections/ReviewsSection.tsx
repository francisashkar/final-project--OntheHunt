
import { motion } from "framer-motion";
import { ReviewCarousel } from "@/components/reviews/ReviewCarousel";
import { reviews } from "@/data/reviews-data";

export const ReviewsSection = () => {
  return (
    <section id="testimonials" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-secondary/5">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-12"
        >
          What Our Users Say
        </motion.h2>
        <div className="relative">
          <ReviewCarousel reviews={reviews} />
        </div>
      </div>
    </section>
  );
};
