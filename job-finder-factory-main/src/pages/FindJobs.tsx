import React, { useState, useEffect, useRef } from "react";
import { JobList } from "@/components/JobList";
import { JobModal } from "@/components/JobModal";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Briefcase, MapPin, Clock, X, CheckCircle, XCircle, MessageSquare, Brain, Heart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import BackgroundShapes from "@/components/hunting-parallax/BackgroundShapes";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Job, moveJobToChat } from "@/lib/jobService";
import { useAuth } from "@/contexts/AuthContext";
import { toggleFavoriteJob, checkIfJobFavorited } from "@/lib/jobActions";
import { getFavoriteJobs, getAppliedJobs } from "@/lib/userDataService";

interface Job {
  link: string;
  Title: string;
  company: string;
  location: string;
  uploaded: string;
  matchScore?: number; // Optional match score based on user's preferences
}

export default function FindJobs() {
  const { currentUser } = useAuth();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [showMortyForm, setShowMortyForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [visitedJobs, setVisitedJobs] = useState<Record<string, boolean | null>>({});
  const [favoriteJobs, setFavoriteJobs] = useState<Record<string, boolean>>({});
  const [showMortyPopup, setShowMortyPopup] = useState(false);
  const [mortyMessage, setMortyMessage] = useState("");
  const [lastAppliedJob, setLastAppliedJob] = useState<string | null>(null);
  const [chatFeedback, setChatFeedback] = useState<Record<string, boolean>>({});
  const [userSkills, setUserSkills] = useState<string>("");
  const [mortyScaleScores, setMortyScaleScores] = useState<Record<string, number>>({});
  const [isAnalyzingSkills, setIsAnalyzingSkills] = useState<boolean>(false);
  
  // Form state
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("entry");
  const [remotePreference, setRemotePreference] = useState(false);
  const [desiredSalary, setDesiredSalary] = useState("any");

  // Morty messages
  const mortyMessages = [
    "Aw jeez, that job looks pretty good! Did you apply?",
    "Oh man, Rick would say that's a good opportunity! Did you submit your resume?",
    "I-I-I'm not sure if that's the right job for you, but did you apply anyway?",
    "Wow, that company seems cool! Did you, you know, apply to it?",
    "Aw geez, I hope they call you back! Did you finish applying?"
  ];

  // Load user data from Firebase on component mount
  useEffect(() => {
    if (!currentUser) return;

    const loadUserData = async () => {
      try {
        const userId = currentUser.uid;
        
        // Load favorite jobs from Firebase
        const firebaseFavorites = await getFavoriteJobs(userId);
        const favoritesMap: Record<string, boolean> = {};
        firebaseFavorites.forEach(job => {
          favoritesMap[job.link] = true;
        });
        setFavoriteJobs(favoritesMap);
        
        // Load applied jobs from Firebase
        const firebaseApplied = await getAppliedJobs(userId);
        const appliedMap: Record<string, boolean | null> = {};
        firebaseApplied.forEach(job => {
          appliedMap[job.link] = true; // true means applied
        });
        setVisitedJobs(appliedMap);
        
      } catch (error) {
        console.error('Error loading user data from Firebase:', error);
      }
    };

    loadUserData();
  }, [currentUser]);



  // Fetch jobs from the Flask API
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:5000/api/jobs")
      .then((response) => {
        setJobs(response.data);
        setFilteredJobs(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch jobs.");
        setLoading(false);

        // Mock data for demo purposes if API fails
        const mockJobs = [
          {
            link: "#job1",
            Title: "Senior Frontend Developer",
            company: "Tech Innovations Inc.",
            location: "Remote, USA",
            uploaded: "2 days ago"
          },
          {
            link: "#job2",
            Title: "UX/UI Designer",
            company: "Creative Digital Agency",
            location: "New York, NY",
            uploaded: "1 day ago"
          },
          {
            link: "#job3",
            Title: "Full Stack Engineer",
            company: "Global Solutions Ltd.",
            location: "San Francisco, CA",
            uploaded: "3 days ago"
          },
          {
            link: "#job4",
            Title: "Product Manager",
            company: "InnovateTech",
            location: "Chicago, IL",
            uploaded: "Just now"
          },
          {
            link: "#job5",
            Title: "Data Scientist",
            company: "Analytics Pro",
            location: "Remote, Worldwide",
            uploaded: "1 week ago"
          }
        ];
        setJobs(mockJobs);
        setFilteredJobs(mockJobs);
      });
      
  }, []);

  // Helper function to parse job time strings
  const parseJobTime = (timeString: string): Date | null => {
    const now = new Date();
    const lowerTime = timeString.toLowerCase();
    
    if (lowerTime.includes('just now') || lowerTime.includes('now')) {
      return now;
    } else if (lowerTime.includes('minute')) {
      const minutes = parseInt(timeString.match(/(\d+)/)?.[1] || '0');
      return new Date(now.getTime() - minutes * 60 * 1000);
    } else if (lowerTime.includes('hour')) {
      const hours = parseInt(timeString.match(/(\d+)/)?.[1] || '0');
      return new Date(now.getTime() - hours * 60 * 60 * 1000);
    } else if (lowerTime.includes('day')) {
      const days = parseInt(timeString.match(/(\d+)/)?.[1] || '0');
      return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    } else if (lowerTime.includes('week')) {
      const weeks = parseInt(timeString.match(/(\d+)/)?.[1] || '0');
      return new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);
    } else if (lowerTime.includes('month')) {
      const months = parseInt(timeString.match(/(\d+)/)?.[1] || '0');
      return new Date(now.getTime() - months * 30 * 24 * 60 * 60 * 1000);
    }
    
    return null;
  };

  // Filter jobs based on search query and filters
  useEffect(() => {
    let results = jobs;
    
    if (searchQuery) {
      results = results.filter(job => 
        job.Title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        job.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (locationFilter) {
      results = results.filter(job => 
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    // Filter by time
    if (timeFilter !== "all") {
      const now = new Date();
      results = results.filter(job => {
        const jobTime = parseJobTime(job.uploaded);
        if (!jobTime) return true; // If we can't parse the time, include the job
        
        const timeDiff = now.getTime() - jobTime.getTime();
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        
        switch (timeFilter) {
          case "today":
            return daysDiff <= 1;
          case "week":
            return daysDiff <= 7;
          case "month":
            return daysDiff <= 30;
          case "3months":
            return daysDiff <= 90;
          default:
            return true;
        }
      });
    }
    
    setFilteredJobs(results);
  }, [searchQuery, locationFilter, timeFilter, jobs]);

  // Handle job click
  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    
    // Set this job as needing a response to show "Did you apply?" button
    if (!visitedJobs[job.link]) {
      setLastAppliedJob(job.link);
      setVisitedJobs(prev => ({
        ...prev,
        [job.link]: null // null means needs response
      }));
    }
  };

  // Handle job apply action - just show the "Did you apply?" modal
  const handleJobApply = async (jobLink: string) => {
    if (!currentUser) {
      console.error('User not authenticated');
      return;
    }
    
    // Find the job details
    const job = jobs.find(j => j.link === jobLink);
    if (!job) return;
    
    try {
      // Set the job as needing a response (null value) to show "Did you apply?" button
      setVisitedJobs(prev => {
        const updated = { ...prev, [jobLink]: null };
        return updated;
      });
      
      console.log('Job clicked - showing "Did you apply?" modal for:', job.Title);
      
      // Show Morty popup with random message
      const randomMessage = mortyMessages[Math.floor(Math.random() * mortyMessages.length)];
      setMortyMessage(randomMessage);
      setShowMortyPopup(true);
      setLastAppliedJob(jobLink);
      
      // Hide Morty popup after 10 seconds
      setTimeout(() => {
        setShowMortyPopup(false);
      }, 10000);
    } catch (error) {
      console.error('Error handling job click:', error);
    }
  };

  // Handle "Did you apply?" responses
  const handleApplicationResponse = async (jobLink: string, didApply: boolean) => {
    if (!currentUser) {
      console.error('❌ User not authenticated');
      return;
    }
    
    // Update local state
    setVisitedJobs(prev => {
      const updated = { ...prev, [jobLink]: didApply };
      return updated;
    });
    
    // If user confirms they applied, save to Firebase
    if (didApply) {
      const job = jobs.find(j => j.link === jobLink);
      
      if (job) {
        try {
          // Convert job to the format expected by Firebase
          const firebaseJob = {
            id: jobLink, // Use link as ID for now
            Title: job.Title,
            company: job.company,
            location: job.location,
            uploaded: job.uploaded,
            description: job.description,
            link: job.link,
            score: job.matchScore || 0
          };
          
          // Save to Firebase using the jobActions
          const { applyToJob } = await import('@/lib/jobActions');
          const success = await applyToJob(currentUser.uid, firebaseJob);
          
          if (success) {
            console.log('✅ Job application confirmed and saved to Firebase:', job.Title);
          } else {
            console.error('❌ Failed to save job application to Firebase:', job.Title);
          }
        } catch (error) {
          console.error('❌ Error saving job application to Firebase:', error);
        }
      }
    }
    
    // Hide Morty popup when user responds
    if (jobLink === lastAppliedJob) {
      setShowMortyPopup(false);
    }
  };
  
  // Handle moving job to chat
  const handleMoveToChat = (e: React.MouseEvent, job: Job) => {
    e.stopPropagation(); // Prevent job click event
    
    const isAdded = moveJobToChat(job);
    
    // Show feedback on success
    if (isAdded) {
      setChatFeedback({...chatFeedback, [job.link]: true});
      
      // Hide feedback after 3 seconds
      setTimeout(() => {
        setChatFeedback(prev => {
          const updated = {...prev};
          delete updated[job.link];
          return updated;
        });
      }, 3000);
    }
  };
  
  // Toggle job favorite status
  const handleToggleFavorite = async (e: React.MouseEvent, jobLink: string) => {
    e.stopPropagation(); // Prevent job click
    
    if (!currentUser) {
      console.error('❌ User not authenticated');
      return;
    }
    
    // Find the job details
    const job = jobs.find(j => j.link === jobLink);
    
    if (!job) return;
    
    try {
      // Convert job to the format expected by Firebase
      const firebaseJob = {
        id: jobLink, // Use link as ID for now
        Title: job.Title,
        company: job.company,
        location: job.location,
        uploaded: job.uploaded,
        description: job.description,
        link: job.link,
        score: job.matchScore || 0
      };
      
      // Toggle favorite using Firebase
      const result = await toggleFavoriteJob(currentUser.uid, firebaseJob);
      
      if (result.success) {
        // Update local state
        setFavoriteJobs(prev => ({
          ...prev,
          [jobLink]: result.favorited
        }));
        
        console.log(`✅ Job ${result.favorited ? 'added to' : 'removed from'} favorites:`, job.Title);
      } else {
        console.error('❌ Failed to toggle favorite job:', job.Title);
      }
    } catch (error) {
      console.error('❌ Error toggling favorite job:', error);
    }
  };

  // Generate match scores based on user preferences
  const generateMatchScores = () => {
    const skillsArray = skills.toLowerCase().split(',').map(s => s.trim());
    
    const updatedJobs = filteredJobs.map(job => {
      // Simple matching algorithm - in a real app this would be more sophisticated
      let score = Math.floor(Math.random() * 30) + 50; // Base score between 50-80
      
      // Match based on job title and skills
      if (skillsArray.some(skill => job.Title.toLowerCase().includes(skill))) {
        score += 15;
      }
      
      // Match based on location preference
      if (remotePreference && job.location.toLowerCase().includes('remote')) {
        score += 10;
      }
      
      // Ensure score doesn't exceed 100
      return { ...job, matchScore: Math.min(score, 100) };
    });
    
    // Sort by match score
    updatedJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    
    setFilteredJobs(updatedJobs);
    setFormSubmitted(true);
    setShowMortyForm(false);
    
    // Show Morty with a success message
    setMortyMessage("Aw jeez, I found some great matches for you! Check out the ones at the top!");
    setShowMortyPopup(true);
    
    // Hide Morty popup after 7 seconds
    setTimeout(() => {
      setShowMortyPopup(false);
    }, 7000);
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle location filter input
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationFilter(e.target.value);
  };



  // Handle Morty AI click - provide AI-powered job insights with MortyScale
  const handleMortyAIClick = async () => {
    if (filteredJobs.length === 0) {
      setMortyMessage("Aw geez, I need some jobs to analyze first! Try searching for some jobs and then click me again!");
      setShowMortyPopup(true);
      setTimeout(() => setShowMortyPopup(false), 5000);
      return;
    }

    if (!userSkills.trim()) {
      setMortyMessage("Aw geez, I need to know your skills first! Type your skills in the skills field above and then click me again!");
      setShowMortyPopup(true);
      setTimeout(() => setShowMortyPopup(false), 5000);
      return;
    }

    setMortyMessage("Aw geez, let me analyze these jobs with my AI brain using the MortyScale! Give me a second...");
    setShowMortyPopup(true);
    setIsAnalyzingSkills(true);

    try {
      // Analyze each job with the user's skills using AI
      const newScores: Record<string, number> = {};
      
      for (const job of filteredJobs.slice(0, 10)) { // Analyze first 10 jobs for performance
        const prompt = `I need you to analyze how well a job matches a user's skills. 

User Skills: ${userSkills}

Job Title: ${job.Title}
Company: ${job.company}
Location: ${job.location}
Description: ${job.description}

Please analyze the match between the user's skills and this job. Consider:
1. Skill relevance (how many skills match the job requirements)
2. Skill level alignment (entry-level vs senior skills)
3. Industry fit
4. Overall compatibility

Return ONLY a number between 0-100 representing the match percentage. This is for the "MortyScale" - a fun way to show job compatibility. No explanations, just the number.`;

        const response = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: prompt,
            userProfile: "MortyScale job matching analysis"
          })
        });

        if (response.ok) {
          const data = await response.json();
          const score = parseInt(data.content.replace(/\D/g, '')) || 0; // Extract number from response
          newScores[job.link] = Math.min(100, Math.max(0, score)); // Ensure score is 0-100
        } else {
          newScores[job.link] = 50; // Default score if API fails
        }
      }
      
      setMortyScaleScores(newScores);
      
      // Show success message from Morty
      const analyzedCount = Object.keys(newScores).length;
      setMortyMessage(`Aw geez, I've analyzed ${analyzedCount} jobs with my MortyScale! Check out the match percentages below each job. The higher the percentage, the better the match for your skills!`);
      setShowMortyPopup(true);
      setTimeout(() => setShowMortyPopup(false), 8000);
      
    } catch (error) {
      console.error('Error analyzing skills with AI:', error);
      setMortyMessage("Oh man, something went wrong with my AI brain! Maybe try again later?");
      setShowMortyPopup(true);
      setTimeout(() => setShowMortyPopup(false), 5000);
    } finally {
      setIsAnalyzingSkills(false);
    }
  };



  if (error && filteredJobs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <p>We couldn't load jobs at this time. Please try again later.</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  // Custom Job List component with improved styling and "Did you apply?" buttons
  const EnhancedJobList = ({ jobs }: { jobs: Job[] }) => (
    <div className="space-y-4">
      {jobs.map((job, index) => (
        <Card key={index} className={`hover:shadow-md transition-all border-border bg-card/80 backdrop-blur-sm overflow-hidden ${visitedJobs[job.link] === true ? 'border-l-4 border-l-green-500' : visitedJobs[job.link] === false ? 'border-l-4 border-l-red-500' : ''}`}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors cursor-pointer" onClick={() => handleJobClick(job)}>
                    {job.Title}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full transition-all ${
                      favoriteJobs[job.link] 
                        ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
                        : 'text-muted-foreground hover:text-red-400 hover:bg-red-50'
                    }`}
                    onClick={(e) => handleToggleFavorite(e, job.link)}
                    title={favoriteJobs[job.link] ? "Remove from favorites" : "Add to favorites"}
                  >
                    {favoriteJobs[job.link] ? (
                      <Heart className="h-4 w-4 fill-current" />
                    ) : (
                      <Heart className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex flex-col md:flex-row md:items-center text-sm text-muted-foreground gap-1 md:gap-3 mt-1">
                  <span className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1 flex-shrink-0" />
                    {job.company}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    {job.location}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                    {job.uploaded}
                  </span>
                </div>
                
                {job.matchScore && formSubmitted && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Match Score:</span>
                      <div className="h-2 bg-gray-200 rounded-full w-32 overflow-hidden">
                        <div 
                          className={`h-full ${job.matchScore >= 80 ? 'bg-green-500' : job.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                          style={{ width: `${job.matchScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{job.matchScore}%</span>
                    </div>
                  </div>
                )}
                
                {/* MortyScale Score Display */}
                {mortyScaleScores[job.link] !== undefined && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary">MortyScale:</span>
                      <div className="h-2 bg-gray-200 rounded-full w-32 overflow-hidden">
                        <div 
                          className={`h-full ${mortyScaleScores[job.link] >= 80 ? 'bg-green-500' : mortyScaleScores[job.link] >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                          style={{ width: `${mortyScaleScores[job.link]}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-primary">{mortyScaleScores[job.link]}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      AI-powered skill match based on your skills
                    </p>
                  </div>
                )}
                
                {/* Chat feedback notification */}
                {chatFeedback[job.link] && (
                  <div className="mt-2 bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded text-xs flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                    <span>Job added to Career Chat!</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col items-end justify-between gap-2">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={(e) => handleMoveToChat(e, job)}
                  >
                    <MessageSquare className="h-3 w-3" />
                    Move to Chat
                  </Button>
                  <Button onClick={() => handleJobClick(job)} variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
                
                {lastAppliedJob === job.link && visitedJobs[job.link] === null && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium">Did you apply?</span>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 px-2 text-xs bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                        onClick={() => handleApplicationResponse(job.link, true)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" /> Yes
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 px-2 text-xs bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                        onClick={() => handleApplicationResponse(job.link, false)}
                      >
                        <XCircle className="h-3 w-3 mr-1" /> No
                      </Button>
                    </div>
                  </div>
                )}
                
                {visitedJobs[job.link] === true && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle className="h-3 w-3 mr-1" /> Applied
                  </Badge>
                )}
                
                {visitedJobs[job.link] === false && (
                  <Badge variant="outline" className="border-red-200 text-red-700">
                    <XCircle className="h-3 w-3 mr-1" /> Not Applied
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 relative">
      <BackgroundShapes />
      
      {/* Morty popup from right side */}
      <AnimatePresence>
        {showMortyPopup && (
          <motion.div 
            className="fixed right-0 bottom-16 z-50 flex items-end"
            initial={{ x: 200 }}
            animate={{ x: 0 }}
            exit={{ x: 200 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="relative mr-4 mb-4">
              <div className="absolute right-24 bottom-16 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg max-w-xs">
                <p className="text-sm relative z-10">{mortyMessage}</p>
                <div className="absolute w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 right-[-8px] bottom-5 z-0"></div>
              </div>
              <img 
                src="/images/morty.png" 
                alt="Morty" 
                className="h-36 drop-shadow-lg" 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Discover opportunities that match your skills and career goals. We use AI to find the perfect fit for you.
        </p>
      </div>
      
      {/* Morty Form Modal */}
      {showMortyForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-border relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-2" 
              onClick={() => setShowMortyForm(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <img src="/images/morty.png" alt="Morty" className="h-28" />
              </div>
              <CardTitle className="text-center">Aw geez! Let me help you find better jobs!</CardTitle>
              <CardDescription className="text-center">
                Uh, I-I-I'm not an expert or anything, but if you fill out this form, I can try to find jobs that match your skills better!
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skills">Your skills (separate with commas)</Label>
                  <Textarea 
                    id="skills" 
                    placeholder="React, JavaScript, UI design..." 
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Experience level</Label>
                  <RadioGroup value={experience} onValueChange={setExperience}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="entry" id="entry" />
                      <Label htmlFor="entry">Entry level</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mid" id="mid" />
                      <Label htmlFor="mid">Mid level</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="senior" id="senior" />
                      <Label htmlFor="senior">Senior level</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remote" 
                    checked={remotePreference}
                    onCheckedChange={(checked) => setRemotePreference(checked as boolean)} 
                  />
                  <Label htmlFor="remote">I prefer remote jobs</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary">Desired salary range</Label>
                  <Select value={desiredSalary} onValueChange={setDesiredSalary}>
                    <SelectTrigger id="salary">
                      <SelectValue placeholder="Select salary range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any range</SelectItem>
                      <SelectItem value="low">$40K - $70K</SelectItem>
                      <SelectItem value="medium">$70K - $100K</SelectItem>
                      <SelectItem value="high">$100K - $150K</SelectItem>
                      <SelectItem value="very-high">$150K+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button onClick={generateMatchScores} className="w-full">
                Aw geez, find me jobs!
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {formSubmitted && (
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-4 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
          onClick={() => setShowMortyForm(true)}
        >
          <img src="/images/morty.png" alt="Morty" className="h-5 mr-2" />
          Update Job Preferences
        </Button>
      )}
      

      
      <div className="relative mb-8">
        {/* Morty positioned behind the search container with speech bubble */}
        <div className="absolute right-4 -top-32">
          <div className="relative">
            {/* Speech bubble */}
            <div className="absolute right-28 top-10 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg max-w-[200px] z-40">
              <p className="text-xs font-medium relative z-10">Click me for MortyScale analysis!</p>
              <div className="absolute w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 right-[-6px] top-6 z-0"></div>
            </div>
            
            {/* Morty image */}
            <img 
              src="/images/morty.png" 
              alt="Morty" 
              className={`h-36 drop-shadow-lg cursor-pointer z-20 transition-all ${isAnalyzingSkills ? 'animate-pulse' : 'hover:scale-105'}`}
              onClick={() => handleMortyAIClick()}
              title="Click me for MortyScale analysis!"
            />
            {isAnalyzingSkills && (
              <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-2 animate-ping">
                <Brain className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
        
        {/* Skills Input for MortyScale Analysis */}
        <Card className="border-border bg-card/80 backdrop-blur-sm shadow-md mb-4 relative z-30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Skills (for MortyScale Analysis)
                </label>
                <Input
                  placeholder="e.g., JavaScript, React, Python, Project Management, Communication..."
                  value={userSkills}
                  onChange={(e) => setUserSkills(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Type your skills here, then click Morty to get AI-powered job matching scores!
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isAnalyzingSkills && (
                  <div className="flex items-center gap-2 text-primary">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">Analyzing...</span>
                  </div>
                )}
                {Object.keys(mortyScaleScores).length > 0 && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {Object.keys(mortyScaleScores).length} jobs analyzed
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card backdrop-blur-sm shadow-md relative z-30">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Job title, company, or keywords" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-9 border-border"
                />
              </div>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Location" 
                  value={locationFilter}
                  onChange={handleLocationChange}
                  className="pl-9 border-border"
                />
              </div>
              
              <div>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-full border-border">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Time Posted" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Past Week</SelectItem>
                    <SelectItem value="month">Past Month</SelectItem>
                    <SelectItem value="3months">Past 3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6 flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Updated just now</span>
        </div>
      </div>
      
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Found <span className="font-medium text-foreground">{filteredJobs.length}</span> jobs
        </p>
        
        {searchQuery && (
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
            Search: {searchQuery}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 ml-1 hover:bg-transparent" 
              onClick={() => setSearchQuery("")}
            >
              <span>×</span>
            </Button>
          </Badge>
        )}
        
        {locationFilter && (
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
            Location: {locationFilter}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 ml-1 hover:bg-transparent" 
              onClick={() => setLocationFilter("")}
            >
              <span>×</span>
            </Button>
          </Badge>
        )}
        
        {timeFilter !== "all" && (
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
            Time: {timeFilter === "today" ? "Today" : 
                  timeFilter === "week" ? "Past Week" : 
                  timeFilter === "month" ? "Past Month" : 
                  timeFilter === "3months" ? "Past 3 Months" : timeFilter}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 ml-1 hover:bg-transparent" 
              onClick={() => setTimeFilter("all")}
            >
              <span>×</span>
            </Button>
          </Badge>
        )}
        

        
        {formSubmitted && (
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 bg-primary/5 border-primary/20">
            <img src="/images/morty.png" alt="Morty" className="h-4 mr-1" />
            Personalized Match
          </Badge>
        )}
        

      </div>
      
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4 text-muted-foreground">Searching for the best jobs for you...</p>
        </div>
      ) : (
        filteredJobs.length > 0 ? (
          <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-4">
            <EnhancedJobList jobs={filteredJobs} />
          </div>
        ) : (
          <div className="text-center py-20 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters to find more opportunities.</p>
            <Button onClick={() => {
              setSearchQuery("");
              setLocationFilter("");
              setTimeFilter("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )
      )}
      
      {selectedJob && (
        <JobModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleJobApply}
        />
      )}
    </div>
  );
}
