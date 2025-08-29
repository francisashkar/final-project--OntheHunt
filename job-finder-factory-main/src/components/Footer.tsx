import { Link } from "react-router-dom";
import Logo from "@/components/hunting-parallax/Logo";

export default function Footer() {
  // Function to scroll to top when navigating
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo variant="animated" className="inline-block" />
            <p className="text-muted-foreground">
              Your AI-powered career companion, helping you find the perfect job match.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/Welcome" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLinkClick}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/find-jobs" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLinkClick}>
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/resume-builder" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLinkClick}>
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/career-assistant" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLinkClick}>
                  Career Assistant
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLinkClick}>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLinkClick}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-muted-foreground hover:text-primary transition-colors" onClick={handleLinkClick}>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">
                <a href="mailto:contact@onthehunt.com" className="hover:text-primary transition-colors">
                  contact@onthehunt.com
                </a>
              </li>
              <li className="text-muted-foreground">
                <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="text-muted-foreground">
                123 Career Street, Job City,
                <br /> Opportunity State, 12345
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} OnTheHunt. All rights reserved.
            </p>

          </div>
        </div>
      </div>
    </footer>
  );
}
