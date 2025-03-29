
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "./StarRating";
import { type Review } from "@/data/reviews-data";

interface ReviewCardProps {
  review: Review;
  index: number;
}

export const ReviewCard = ({ review, index }: ReviewCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={review.image} alt={review.name} />
              <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <StarRating rating={review.rating} />
            <p className="text-lg mb-4 line-clamp-3">"{review.quote}"</p>
            <div className="text-center">
              <p className="font-semibold">{review.name}</p>
              <p className="text-sm text-muted-foreground">{review.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
