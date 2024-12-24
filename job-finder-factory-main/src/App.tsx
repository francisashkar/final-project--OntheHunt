import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";

// Import pages
import Index from "./pages/Index";
import LearnMore from "./pages/LearnMore";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import FindJobs from "./pages/FindJobs";
import ResumeBuilder from "./pages/ResumeBuilder";
import CareerAssistant from "./pages/CareerAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Top Navigation */}
        <Navigation />
        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/find-jobs" element={<FindJobs />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/career-assistant" element={<CareerAssistant />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        </Routes>
        {/* Footer */}
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
