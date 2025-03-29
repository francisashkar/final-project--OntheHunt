
import { Flame } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center text-2xl font-bold no-underline transition-all duration-300 hover:scale-105"
      aria-label="OnTheHunt logo featuring a green flame integrated in the letter O"
    >
      <div className="relative flex items-center">
        <span className="dark:text-white text-[#1A1F2C]">
          <span className="relative inline-flex items-center justify-center">
            <span className="opacity-0">O</span>
            <Flame 
              className="absolute -left-[5px] w-7 h-7 text-primary transition-all duration-300 hover:brightness-110 animate-subtle-float" 
              strokeWidth={2.5}
            />
          </span>
          <span>nthe</span>
        </span>
        <span className="text-primary">Hunt</span>
      </div>
    </Link>
  );
};
