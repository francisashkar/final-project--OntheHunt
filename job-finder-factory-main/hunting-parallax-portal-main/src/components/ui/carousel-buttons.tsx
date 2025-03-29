import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselButtonProps {
  onClick: () => void;
  disabled?: boolean;
  direction: "prev" | "next";
}

export const CarouselButton = ({ onClick, disabled, direction }: CarouselButtonProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className={`absolute top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90 ${
        direction === "prev" ? "-left-4 lg:-left-12" : "-right-4 lg:-right-12"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {direction === "prev" ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
      <span className="sr-only">{direction === "prev" ? "Previous" : "Next"}</span>
    </Button>
  );
};