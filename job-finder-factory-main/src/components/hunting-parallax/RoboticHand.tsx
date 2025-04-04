import { useState, useEffect, useRef } from 'react';

// Component that creates a robotic hand effect that follows the mouse cursor
export default function RoboticHand() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    // Set initial position to center of the window
    setMousePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    
    const handleMouseMove = (e: MouseEvent) => {
      // Track exact mouse position for hand following
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Calculate the transform values with constraint on the left side to prevent edge visibility
  const mouseXPercent = mousePos.x / window.innerWidth;
  const mouseYPercent = mousePos.y / window.innerHeight;
  
  // Constrain horizontal movement with minimum 15% position for left side
  // And extend movement range by multiplying by 1.1 to allow it to go further
  const transformX = Math.max(15, mouseXPercent * 110);
  
  // Extend vertical movement slightly as well
  const transformY = mouseYPercent * 110;

  return (
    <div 
      ref={containerRef}
      className="absolute left-0 top-0 w-full h-full z-0 overflow-hidden pointer-events-none"
    >
      <div 
        className="absolute w-[120%] h-[120%] left-[-10%] top-[-10%] bg-contain bg-center bg-no-repeat z-[1] opacity-70 pointer-events-none"
        style={{
          backgroundImage: `url('/images/components/cyborg-hand.png')`,
          transform: `translate(${transformX}%, ${transformY}%) scale(0.97)`,
          transition: 'transform 0.22s ease-out',
        }}
      >
        {/* No gradient overlay to avoid box issues */}
      </div>
    </div>
  );
} 