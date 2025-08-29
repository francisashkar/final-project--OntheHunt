import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getUserSettings, 
  getAppliedJobs, 
  getFavoriteJobs, 
  saveUserSettings,
  subscribeToAppliedJobs, 
  subscribeToFavoriteJobs,
  UserSettings,
  JobData
} from "@/lib/userDataService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";


import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Briefcase, 
  FileText, 
  Bell, 
  Settings, 
  BarChart, 
  Calendar,
  MessageSquare,
  MapPin,
  Clock,
  Heart,
  ExternalLink,
  Building2,
  Search,
  CheckCircle,
  TrendingUp,
  X,
  Lightbulb,
  RefreshCw
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import BackgroundShapes from "@/components/hunting-parallax/BackgroundShapes";
import RecentApplications from '@/components/dashboard/RecentApplications';
import JobRecommendations from '@/components/dashboard/JobRecommendations';
import UpcomingInterviews from '@/components/dashboard/UpcomingInterviews';

interface Job {
  id: string;
  link: string;
  Title: string;
  company: string;
  location: string;
  uploaded: string;
  matchScore?: number;
}

interface Notification {
  id: number;
  message: string;
  date: string;
  type: string;
  isNew?: boolean;
}

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Get the tab from URL query parameter if it exists
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    // Return the tab parameter if it's valid, otherwise default to 'applications'
    return ['applications', 'favorites', 'settings'].includes(tabParam || '') 
      ? tabParam 
      : 'applications';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [favoriteJobs, setFavoriteJobs] = useState<Job[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  // Add a state for showing feedback toast
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // AI Tip Generator state
  const [aiTip, setAiTip] = useState<string>("");
  const [isGeneratingTip, setIsGeneratingTip] = useState(false);
  const [tipCategory, setTipCategory] = useState<string>("general");
  
  // Profile views stats
  const [profileViewsInfo] = useState({
    total: 85,
    increase: 12
  });
  
  // User settings state
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: "",
    email: "",
    phone: "",
    location: "",
    profileVisibility: "everyone",
    emailNotifications: true,
    shareApplicationStatus: true,
    desiredJobTitles: "",
    industryPreferences: "",
    remoteWork: true
  });
  

  
  // Function to handle tab changes through the user menu
  const handleTabChange = (tab: string) => {
    handleTabChangeFromUrl(tab);
  };

  // Function to mark notifications as read
  const markNotificationsAsRead = () => {
    setUnreadNotifications(0);
    // In a real app, we would call an API to mark notifications as read
  };
  
  // Function to show feedback toast
  const showFeedbackToast = (message: string) => {
    setFeedbackMessage(message);
    setShowFeedback(true);
    
    // Auto-hide the toast after 3 seconds
    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);
  };
  
  // Helper function to update settings
  const updateSetting = (key: string, value: any) => {
    const updatedSettings = {...userSettings, [key]: value};
    
    // Update state
    setUserSettings(updatedSettings);
    
    // Mark that there are unsaved changes
    setHasUnsavedChanges(true);
    
    // Don't dispatch userNameChanged event here - only when user actually saves
    // This prevents the "typewriter" effect where name updates instantly as you type
    
    // Trigger a custom event to notify other components that settings have changed
    window.dispatchEvent(new Event('userSettingsChanged'));
    
    // Don't auto-save here - let the user manually save when ready
  };





  // Function to discard unsaved changes and reload from Firebase
  const discardChanges = async () => {
    if (!currentUser) return;
    
    try {
      // Reload user settings from Firebase
      const settings = await getUserSettings(currentUser.uid);
      if (settings) {
        setUserSettings(prev => ({
          ...prev,
          ...settings,
          email: currentUser.email || settings.email // Firebase email takes priority
        }));
      }
      setHasUnsavedChanges(false);
      showFeedbackToast("Changes discarded");
    } catch (error) {
      showFeedbackToast("Error discarding changes");
    }
  };


  
  // Update the URL when tab changes
  const handleTabChangeFromUrl = (value: string) => {
    setActiveTab(value);
    navigate(`/dashboard?tab=${value}`, { replace: true });
  };
  
  // Update activeTab when URL query parameter changes
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.search]);

  // Function to generate AI career tips
  const generateAITip = async () => {
    setIsGeneratingTip(true);
    try {
      const prompt = `Generate a helpful career tip for a job seeker. 

Context: User has ${appliedJobs.length} applied jobs and ${favoriteJobs.length} favorite jobs.

Category: ${tipCategory === "general" ? "General career advice" : 
         tipCategory === "interview" ? "Interview preparation" : 
         tipCategory === "resume" ? "Resume optimization" : 
         tipCategory === "networking" ? "Professional networking" : 
         "Job search strategy"}

Please provide a practical, actionable tip that's specific to their situation. Keep it concise (1-2 sentences) and encouraging. Return ONLY the tip text, no explanations or formatting.`;

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          userProfile: "AI Career Tip Generator"
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiTip(data.content);
      } else {
        // Fallback tips if AI fails
        const fallbackTips = {
          general: "Focus on building a strong personal brand through consistent online presence and professional networking.",
          interview: "Practice your elevator pitch and prepare STAR method responses for behavioral questions.",
          resume: "Tailor your resume for each job application by highlighting relevant keywords from the job description.",
          networking: "Attend industry events and connect with professionals on LinkedIn to expand your network.",
          strategy: "Set specific, measurable goals for your job search and track your progress weekly."
        };
        setAiTip(fallbackTips[tipCategory as keyof typeof fallbackTips] || fallbackTips.general);
      }
    } catch (error) {
      console.error('Error generating AI tip:', error);
      // Fallback tip
      setAiTip("Stay persistent in your job search and remember that every application brings you closer to your dream job.");
    } finally {
      setIsGeneratingTip(false);
    }
  };

  // Load real data from Firebase Firestore
  useEffect(() => {
    if (!currentUser) {
      // If no Firebase user, redirect to landing page
      navigate("/");
      return;
    }
    
    // Generate initial AI tip
    generateAITip();
    
    // Update user settings with Firebase user data
    if (currentUser.displayName || currentUser.email) {

      setUserSettings(prev => ({
        ...prev,
        // Only set name if it's not already set (don't override user's typed name)
        name: prev.name || currentUser.displayName || "",
        email: currentUser.email || prev.email
      }));
    }
    
             // Load user data from Firebase
    const loadUserData = async () => {
      try {
        const userId = currentUser.uid;

        
        // Load user settings
        const settings = await getUserSettings(userId);
        if (settings) {

          setUserSettings(prev => {
            const newSettings = {
              ...prev,
              ...settings,
              // Let user's typed name take priority over Firebase displayName
              name: settings.name || currentUser.displayName || prev.name,
              email: currentUser.email || settings.email // Firebase email takes priority
            };

            return newSettings;
          });
          // Clear unsaved changes flag since we just loaded fresh data
          setHasUnsavedChanges(false);
        }
        
        // Load applied jobs
        const applied = await getAppliedJobs(userId);
        setAppliedJobs(applied);
        
        // Load favorite jobs
        const favorites = await getFavoriteJobs(userId);
        setFavoriteJobs(favorites);
        
      } catch (error) {

      }
    };
    
    loadUserData();
  }, [navigate, currentUser]);

  // Set up real-time listeners for user data changes
  useEffect(() => {
    if (!currentUser) return;
    
    const userId = currentUser.uid;
    
    
    // Subscribe to applied jobs changes
    const unsubscribeAppliedJobs = subscribeToAppliedJobs(userId, (jobs) => {
      
      setAppliedJobs(jobs);
    });
    
    // Subscribe to favorite jobs changes
    const unsubscribeFavoriteJobs = subscribeToFavoriteJobs(userId, (jobs) => {
      
      setFavoriteJobs(jobs);
    });
    
    // Cleanup subscriptions
    return () => {
      unsubscribeAppliedJobs();
      unsubscribeFavoriteJobs();
    };
  }, [currentUser]);

  // Monitor userSettings state changes
  useEffect(() => {

  }, [userSettings]);

  // Save user settings
  const handleSaveUserSettings = async (newSettings: any) => {

    
    if (!currentUser) {
      showFeedbackToast("Error: User not authenticated");
      return;
    }
    
    try {
      // Use the current userSettings state directly - this contains all the latest changes
      const updatedSettings = {...userSettings};

      
      // Ensure Firebase user data is preserved (but don't override user's typed name)
      updatedSettings.email = currentUser.email || updatedSettings.email;
      
      
      
      // Save to Firebase Firestore
      const userId = currentUser.uid;
      const success = await saveUserSettings(userId, updatedSettings);
      
      if (success) {
        // Show success toast or notification
        showFeedbackToast("Settings saved successfully to Firebase!");
        
        // Clear the unsaved changes flag
        setHasUnsavedChanges(false);
        
        // Name will be automatically updated in Navigation via Firebase real-time listener
        // No need for manual event dispatching or localStorage storage
      } else {
        showFeedbackToast("Failed to save settings to Firebase");
      }
    } catch (error) {
      showFeedbackToast("Error saving settings");
    }
  };
  
  // Format date for display
  const formatDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  // Mock data for notifications
  const notifications: Notification[] = [
    { id: 1, message: "New interview invitation from Tech Innovations Inc.", date: "2 hours ago", type: "interview", isNew: true },
    { id: 2, message: "Your resume has been viewed by 5 employers", date: "Yesterday", type: "view", isNew: true },
    { id: 3, message: "Application status updated for Data Scientist position", date: "2 days ago", type: "update", isNew: true },
    { id: 4, message: "New job posting that matches your skills: Frontend Developer", date: "3 days ago", type: "job", isNew: false },
    { id: 5, message: "Reminder: Complete your profile to get better job matches", date: "1 week ago", type: "reminder", isNew: false }
  ];

  // Mock data for upcoming events
  const upcomingEvents = [
    { id: 1, title: "Interview: Software Engineer", date: "March 28, 2023", time: "10:00 AM", type: "interview" },
    { id: 2, title: "Tech Career Fair", date: "April 2, 2023", time: "09:00 AM - 04:00 PM", type: "event" },
  ];

  const recommendedJobs = [
    { id: 1, title: "Frontend Developer", company: "WebTech Solutions", matchScore: 92 },
    { id: 2, title: "Product Manager", company: "Innovation Labs", matchScore: 85 },
    { id: 3, title: "DevOps Engineer", company: "Cloud Systems Inc.", matchScore: 78 },
  ];

  useEffect(() => {
    // Close menus when clicking outside
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notifications-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {
    // Update the active tab when the URL changes
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);



  return (
    <div className="container mx-auto px-4 py-12 relative">
      <BackgroundShapes />
      <div className="container max-w-6xl mx-auto relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>

        {/* User Profile Section */}
        <div className="mb-8">
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    Welcome back, {userSettings.name || 'User'}!
                  </h2>
                  <p className="text-muted-foreground">
                    {userSettings.email || currentUser?.email}
                  </p>
                  {userSettings.location && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {userSettings.location}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Toast */}
        {showFeedback && (
          <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center shadow-lg max-w-sm">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>{feedbackMessage}</span>
            <button 
              onClick={() => setShowFeedback(false)} 
              className="ml-auto pl-3"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Notifications dropdown shown when toggled from the user menu in Navigation bar */}
        {showNotifications && (
          <div className="absolute right-4 mt-2 w-80 bg-card/80 backdrop-blur-sm border border-border rounded-md shadow-lg z-50 notifications-container">
            <div className="p-3 border-b border-border">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Notifications</h3>
                <Button variant="ghost" size="sm" onClick={markNotificationsAsRead}>
                  Mark all as read
                </Button>
              </div>
            </div>
            <div className="max-h-[350px] overflow-y-auto">
              {notifications.map(notification => (
                <div key={notification.id} className={`p-3 border-b border-border hover:bg-accent/50 ${notification.isNew ? 'bg-primary/5' : ''}`}>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                </div>
              ))}
            </div>
            <div className="p-2 text-center">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View all notifications
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Applied Jobs</p>
                  <p className="text-2xl font-bold text-foreground">{appliedJobs.length}</p>
                </div>
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Favorite Jobs</p>
                  <p className="text-2xl font-bold text-foreground">{favoriteJobs.length}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Profile Views</p>
                  <p className="text-2xl font-bold text-foreground">{profileViewsInfo.total}</p>
                  <p className="text-xs text-green-600">+{profileViewsInfo.increase} this week</p>
                </div>
                <BarChart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Career Tip Generator */}
        <div className="mb-8">
          <Card className="border-border bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">AI Career Tip</h3>
                    <p className="text-sm text-muted-foreground">Get personalized advice for your job search</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateAITip}
                  disabled={isGeneratingTip}
                  className="flex items-center gap-2"
                >
                  {isGeneratingTip ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      New Tip
                    </>
                  )}
                </Button>
              </div>
              
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">Tip Category:</label>
                <Select value={tipCategory} onValueChange={setTipCategory}>
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Career Advice</SelectItem>
                    <SelectItem value="interview">Interview Preparation</SelectItem>
                    <SelectItem value="resume">Resume Optimization</SelectItem>
                    <SelectItem value="networking">Professional Networking</SelectItem>
                    <SelectItem value="strategy">Job Search Strategy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {aiTip ? (
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                  <p className="text-foreground leading-relaxed">{aiTip}</p>
                </div>
              ) : (
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-200/50 dark:border-purple-700/50 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Generating your personalized tip...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} className="w-full" onValueChange={handleTabChangeFromUrl}>
          <TabsList className="grid grid-cols-3 w-full max-w-2xl mb-8">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="applications">
            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Your Job Applications</CardTitle>
                <CardDescription>Track all your job applications</CardDescription>
              </CardHeader>
              <CardContent>
                {appliedJobs.length > 0 ? (
                  <div className="space-y-4">
                    {appliedJobs.map((job, index) => (
                      <Card key={index} className="overflow-hidden border-border bg-background/60 backdrop-blur-sm border-l-4 border-l-green-500">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground">{job.Title}</h3>
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
                            </div>
                            
                            <div className="mt-4 md:mt-0 flex flex-col items-end justify-between">
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-2">
                                Applied
                              </Badge>
                              <Button 
                                size="sm" 
                                className="flex items-center gap-1"
                                onClick={() => window.open(job.link, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3" />
                                View Job
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Briefcase className="h-16 w-16 text-muted-foreground mb-6 opacity-50" />
                    <h3 className="text-xl font-medium text-foreground mb-2">No applications yet</h3>
                    <p className="text-muted-foreground max-w-md mb-8">
                      You haven't applied to any jobs yet. Start your job search and apply to positions that match your skills and interests.
                    </p>
                    <Button onClick={() => navigate("/find-jobs")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Find Jobs
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="favorites">
            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Your Favorite Jobs</CardTitle>
                <CardDescription>Jobs you've saved for later</CardDescription>
              </CardHeader>
              <CardContent>
                {favoriteJobs.length > 0 ? (
                  <div className="space-y-4">
                    {favoriteJobs.map((job, index) => (
                      <Card key={index} className="overflow-hidden border-border bg-background/60 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="text-lg font-semibold text-foreground">{job.Title}</h3>
                                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
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
                              
                              {job.matchScore && (
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
                            </div>
                            
                            <div className="mt-4 md:mt-0 flex flex-col items-end justify-between gap-2">
                              <Button 
                                size="sm" 
                                className="flex items-center gap-1"
                                onClick={() => window.open(job.link, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3" />
                                View Job
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Heart className="h-16 w-16 text-muted-foreground mb-6 opacity-50" />
                    <h3 className="text-xl font-medium text-foreground mb-2">No favorite jobs yet</h3>
                    <p className="text-muted-foreground max-w-md mb-8">
                      Save jobs you're interested in by clicking the heart icon on job listings. They will appear here for easy access.
                    </p>
                    <Button onClick={() => navigate("/find-jobs")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Find Jobs
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          

          
          <TabsContent value="settings">
            <Card className="border-border bg-card/80 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="text-foreground">Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Personal Information</h3>
                    

                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input 
                          value={userSettings.name} 
                          onChange={(e) => updateSetting('name', e.target.value)}
                        />

                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input 
                          value={userSettings.email} 
                          onChange={(e) => updateSetting('email', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input 
                          value={userSettings.phone} 
                          onChange={(e) => updateSetting('phone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input 
                          value={userSettings.location} 
                          onChange={(e) => updateSetting('location', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t border-border">
                    <h3 className="font-medium">Privacy Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Profile Visibility</p>
                          <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                        </div>
                        <Select 
                          value={userSettings.profileVisibility}
                          onValueChange={(value) => updateSetting('profileVisibility', value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="connections">Connections Only</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive job alerts and updates</p>
                        </div>
                        <Switch 
                          checked={userSettings.emailNotifications}
                          onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Application Activity</p>
                          <p className="text-sm text-muted-foreground">Share your application status</p>
                        </div>
                        <Switch 
                          checked={userSettings.shareApplicationStatus}
                          onCheckedChange={(checked) => updateSetting('shareApplicationStatus', checked)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t border-border">
                    <h3 className="font-medium">Job Preferences</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Desired Job Titles</label>
                        <Input 
                          value={userSettings.desiredJobTitles} 
                          onChange={(e) => updateSetting('desiredJobTitles', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Separate with commas, e.g. "Frontend Developer, React Developer"
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Industry Preferences</label>
                        <Input 
                          value={userSettings.industryPreferences} 
                          onChange={(e) => updateSetting('industryPreferences', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Separate with commas, e.g. "Technology, Healthcare, Finance"
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Open to Remote Work</p>
                          <p className="text-sm text-muted-foreground">Show remote jobs in search</p>
                        </div>
                        <Switch 
                          checked={userSettings.remoteWork}
                          onCheckedChange={(checked) => updateSetting('remoteWork', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center gap-3 ml-auto">

                  {hasUnsavedChanges && (
                    <Button 
                      variant="outline"
                      onClick={discardChanges}
                    >
                      Discard Changes
                    </Button>
                  )}
                  <Button 
                    onClick={() => handleSaveUserSettings(userSettings)}
                    disabled={!hasUnsavedChanges}
                    variant={hasUnsavedChanges ? "default" : "secondary"}
                  >
                    {hasUnsavedChanges ? "Save Changes" : "No Changes"}
                  </Button>
                </div>
                {hasUnsavedChanges && (
                  <p className="text-sm text-muted-foreground ml-3">
                    You have unsaved changes
                  </p>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>


    </div>
  );
} 