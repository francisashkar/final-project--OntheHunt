
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

export const StarRating = ({ rating, maxRating = 5 }: StarRatingProps) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }).map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};
