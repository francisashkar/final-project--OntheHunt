import { Link } from "react-router-dom";
import { Flame } from "lucide-react";

export function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2 text-xl font-semibold">
      <Flame className="h-6 w-6 text-[#00e887]" />
      <span>OnTheHunt</span>
    </Link>
  );
}