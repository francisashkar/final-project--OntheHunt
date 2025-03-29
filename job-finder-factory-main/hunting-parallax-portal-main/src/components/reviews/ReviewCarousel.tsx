
import { useEffect } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ReviewCard } from "./ReviewCard";
import type { Review } from "@/data/reviews-data";

interface ReviewCarouselProps {
  reviews: Review[];
}

export const ReviewCarousel = ({ reviews }: ReviewCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'center',
    loop: true,
    dragFree: false,
    skipSnaps: false,
  }, [
    Autoplay({ 
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    })
  ]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi]);

  return (
    <Carousel
      ref={emblaRef}
      className="w-full"
    >
      <CarouselContent>
        {reviews.map((review, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <ReviewCard review={review} index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
