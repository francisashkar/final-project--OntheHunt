import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Import pages
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index"; // Main app home after login
import LearnMore from "./pages/LearnMore";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import FindJobs from "./pages/FindJobs";
import ResumeBuilder from "./pages/ResumeBuilder";
import CareerAssistant from "./pages/CareerAssistant";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";

const queryClient = new QueryClient();

// Navigation wrapper component that only shows on routes that are not the landing page
const NavigationWrapper = () => {
  const location = useLocation();
  // Hide navigation on the landing page and learn more page since they use LandingHeader
  return location.pathname === "/" || location.pathname === "/learn-more" ? null : <Navigation />;
};

// Auth redirect component - redirects based on authentication status
const AuthRedirect = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  }, []);
  
  // Show nothing while checking auth status
  if (isAuthenticated === null) {
    return null;
  }
  
  // Redirect to welcome if authenticated, landing page if not
  return isAuthenticated ? <Navigate to="/welcome" replace /> : <LandingPage />;
};

// Protected route component - redirects to landing if not authenticated
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  }, []);
  
  // Show nothing while checking auth status
  if (isAuthenticated === null) {
    return null;
  }
  
  return isAuthenticated ? <>{element}</> : <Navigate to="/" replace />;
};

// Routes that should display the footer
const routesWithFooter = ["/app"]; // Add routes that should not have the footer

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Top Navigation - conditionally rendered */}
          <Routes>
            <Route path="*" element={<NavigationWrapper />} />
          </Routes>
          
          {/* Page Routes */}
          <Routes>
            {/* The root path now uses AuthRedirect to determine where to go */}
            <Route path="/" element={<AuthRedirect />} />
            
            {/* Protected routes - require authentication */}
            <Route path="/welcome" element={<ProtectedRoute element={<Welcome />} />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/app" element={<ProtectedRoute element={<Index />} />} />
            <Route path="/find-jobs" element={<ProtectedRoute element={<FindJobs />} />} />
            <Route path="/resume-builder" element={<ProtectedRoute element={<ResumeBuilder />} />} />
            <Route path="/career-assistant" element={<ProtectedRoute element={<CareerAssistant />} />} />
            <Route path="/jobs" element={<ProtectedRoute element={<FindJobs />} />} />
            
            {/* Public routes - available to all */}
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
          
          {/* Footer - only show on non-landing routes and specific routes */}
          <Routes>
            <Route path="*" element={<FooterWrapper />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Footer wrapper component that only shows on non-landing routes and specific routes
const FooterWrapper = () => {
  const location = useLocation();
  const hiddenPaths = ["/", "/dashboard", "/signin", "/signup"]; // Hide on landing page, dashboard, signin and signup
  
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }
  
  return <Footer />;
};

export default App;
