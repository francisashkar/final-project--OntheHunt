import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

// Component that creates an interactive experience with a human hand and AI robotic hand
export default function DualHandsInteraction() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Position for the fully visible hand on the right
  const [mousePos, setMousePos] = useState({ x: window.innerWidth * 0.8, y: window.innerHeight * 0.5 });
  const [isNearHumanHand, setIsNearHumanHand] = useState(false);
  const [isFrozen, setIsFrozen] = useState(true); // Start with the hand frozen

  // Define a constant for the reset position matching the screenshot
  const getResetPosition = () => ({
    x: window.innerWidth * 0.8, // Right side of the screen for visibility
    y: window.innerHeight * 0.5  // Center vertically
  });

  useEffect(() => {
    // Set initial position
    const resetPos = getResetPosition();
    setMousePos(resetPos);
    
    const handleMouseMove = (e: MouseEvent) => {
      // Only update position if not frozen
      if (!isFrozen) {
        // Track exact mouse position for hand following
        setMousePos({ x: e.clientX, y: e.clientY });
        
        // Check if AI hand is near the human hand (left side of screen)
        const isNear = e.clientX < window.innerWidth * 0.30 && 
                      e.clientY > window.innerHeight * 0.35 && 
                      e.clientY < window.innerHeight * 0.65;
        setIsNearHumanHand(isNear);
      }
    };

    // Handle window resize to maintain position
    const handleResize = () => {
      if (isFrozen) {
        // Get the updated reset position when window is resized
        const resetPos = getResetPosition();
        setMousePos(resetPos);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [isFrozen]);

  const toggleFreeze = () => {
    setIsFrozen(prev => !prev);
    if (isFrozen) {
      // If unfreezing, start hand at current mouse position
      const mouseEvent = window.event as MouseEvent;
      if (mouseEvent) {
        setMousePos({ x: mouseEvent.clientX, y: mouseEvent.clientY });
      }
    } else {
      // If freezing, return to default position
      const resetPos = getResetPosition();
      setMousePos(resetPos);
    }
  };

  // Calculate the transform values with constraint on the left side to prevent edge visibility
  const mouseXPercent = mousePos.x / window.innerWidth;
  const mouseYPercent = mousePos.y / window.innerHeight;
  
  // Calculate transforms that allow for movement but still keep the hand visible
  const transformX = Math.max(15, mouseXPercent * 100);
  const transformY = mouseYPercent * 100;

  // Define shared styles for both hands to ensure identical sizing
  const handSize = "w-[110%] h-[110%]";
  const handScale = "scale(0.85)";

  return (
    <div 
      ref={containerRef}
      className="absolute left-0 top-0 w-full h-full z-0 overflow-hidden"
    >
      {/* Human hand positioned on the left side with a good portion sticking out */}
      <div 
        className={`absolute w-[120%] h-[120%] left-[-70%] top-[-10%] bg-contain bg-right bg-no-repeat z-[1] opacity-90 pointer-events-none transition-all duration-500 ${isNearHumanHand ? 'scale-105 translate-x-[8%]' : ''}`}
        style={{
          backgroundImage: `url('/pics/img.png')`,
          transform: 'rotate(5deg)',
        }}
      />
      
      {/* AI robotic hand that follows the cursor when not frozen */}
      {isFrozen ? (
        // Fixed positioned hand - same size but moved 10% to the left and 8% down total
        <div 
          className={`absolute ${handSize} right-[-20%] bottom-[-18%] bg-contain bg-right-bottom bg-no-repeat z-[1] opacity-100 pointer-events-none`}
          style={{
            backgroundImage: `url('/images/components/cyborg-hand.png')`,
            transform: `${handScale}`,
          }}
        />
      ) : (
        // Movable hand - using the same size variables
        <div 
          className={`absolute ${handSize} left-0 top-[-5%] bg-contain bg-center bg-no-repeat z-[1] opacity-90 pointer-events-none transition-all duration-300`}
          style={{
            backgroundImage: `url('/images/components/cyborg-hand.png')`,
            transform: `translate(${transformX}%, ${transformY}%) ${handScale}`,
            transition: 'transform 0.22s ease-out',
          }}
        />
      )}
      
      {/* Button to toggle between fixed and movable hand */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20">
        <Button 
          onClick={toggleFreeze}
          variant="outline" 
          className="bg-white/80 backdrop-blur-sm border border-green-300 hover:bg-green-50 text-green-800 font-medium px-6 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
        >
          {isFrozen ? "Control Hand with Mouse" : "Reset Hand Position"}
        </Button>
      </div>
    </div>
  );
} 