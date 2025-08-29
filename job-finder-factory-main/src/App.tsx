import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute as FirebaseProtectedRoute } from "@/components/auth/ProtectedRoute";

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
  const { currentUser, loading } = useAuth();
  
  // Show nothing while checking auth status
  if (loading) {
    return null;
  }
  
  // Redirect to welcome if authenticated, landing page if not
  return currentUser ? <Navigate to="/welcome" replace /> : <LandingPage />;
};



// Routes that should display the footer
const routesWithFooter = ["/app"]; // Add routes that should not have the footer

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <ThemeProvider>
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
              <Route path="/welcome" element={<FirebaseProtectedRoute><Welcome /></FirebaseProtectedRoute>} />
              <Route path="/dashboard" element={<FirebaseProtectedRoute><Dashboard /></FirebaseProtectedRoute>} />
              <Route path="/app" element={<FirebaseProtectedRoute><Index /></FirebaseProtectedRoute>} />
              <Route path="/find-jobs" element={<FirebaseProtectedRoute><FindJobs /></FirebaseProtectedRoute>} />
              <Route path="/resume-builder" element={<FirebaseProtectedRoute><ResumeBuilder /></FirebaseProtectedRoute>} />
              <Route path="/career-assistant" element={<FirebaseProtectedRoute><CareerAssistant /></FirebaseProtectedRoute>} />
              <Route path="/jobs" element={<FirebaseProtectedRoute><FindJobs /></FirebaseProtectedRoute>} />
              
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
            </ThemeProvider>
        </AuthProvider>
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
