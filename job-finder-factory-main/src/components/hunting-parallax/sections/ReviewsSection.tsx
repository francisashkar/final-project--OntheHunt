import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Element } from "react-scroll";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Review {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const reviews: Review[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Software Engineer",
      content: "OnTheHunt completely changed my job search experience. The AI-powered matching helped me find opportunities that aligned perfectly with my skills and career goals. I landed my dream job within just three weeks!",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=32"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Product Manager",
      content: "As someone who was struggling to find the right fit after years at the same company, OnTheHunt's personalized dashboard was a game-changer. The curated job listings saved me countless hours of searching.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=60"
    },
    {
      id: 3,
      name: "Priya Patel",
      role: "UX Designer",
      content: "The career path insights provided by OnTheHunt helped me identify skills I needed to develop to advance in my field. Their focused approach to job matching led me to opportunities I wouldn't have found elsewhere.",
      rating: 4,
      image: "https://i.pravatar.cc/150?img=5"
    },
    {
      id: 4,
      name: "James Wilson",
      role: "Marketing Director",
      content: "After being laid off unexpectedly, OnTheHunt helped me rebuild my confidence and connect with companies that valued my experience. Their platform is intuitive and the support team is incredibly helpful.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=53"
    },
  ];

  useEffect(() => {
    let interval: number;
    if (autoplay) {
      interval = window.setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoplay, reviews.length]);

  const handlePrev = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  return (
    <Element name="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            What Our <span className="text-primary">Users Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how OnTheHunt has helped professionals at every career stage find their perfect job match
          </p>
        </motion.div>

        <div className="relative px-4">
          <div className="overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-8 md:p-10 rounded-lg mx-auto max-w-4xl"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="w-20 h-20 border-4 border-primary/20">
                  <AvatarImage src={reviews[currentIndex].image} alt={reviews[currentIndex].name} />
                  <AvatarFallback>{reviews[currentIndex].name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < reviews[currentIndex].rating 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  
                  <blockquote className="text-lg md:text-xl italic mb-6 leading-relaxed">
                    "{reviews[currentIndex].content}"
                  </blockquote>
                  
                  <div>
                    <p className="font-semibold text-lg">{reviews[currentIndex].name}</p>
                    <p className="text-muted-foreground">{reviews[currentIndex].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-center gap-4 mt-10">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrev}
              className="rounded-full hover:bg-primary/10 hover:text-primary"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNext}
              className="rounded-full hover:bg-primary/10 hover:text-primary"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setAutoplay(false);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Element>
  );
} 