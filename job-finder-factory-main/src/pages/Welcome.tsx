import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getUserSettings, 
  getAppliedJobs, 
  getFavoriteJobs, 
  subscribeToAppliedJobs, 
  subscribeToFavoriteJobs,
  UserSettings,
  JobData
} from "@/lib/userDataService";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { migrateLocalStorageToFirebase, needsMigration } from "@/lib/migrationService";

import { motion } from "framer-motion";
import { 
  Rocket, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  BarChart,

  Calendar,
  TrendingUp,
  Star,
  Target,
  Zap,
  Users,
  Award,
  Lightbulb,
  Globe,
  Clock,
  MapPin,
  Building2,
  Search,
  Heart,
  MessageSquare,
  ExternalLink,
  ChevronRight,
     Play,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";
import BackgroundShapes from "@/components/hunting-parallax/BackgroundShapes";

export default function Welcome() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [userName, setUserName] = useState<string>("User");
  const [progress, setProgress] = useState(30); // Profile completion progress
  const [appliedJobs, setAppliedJobs] = useState<JobData[]>([]);
  const [favoriteJobs, setFavoriteJobs] = useState<JobData[]>([]);
  const [confettiEnabled, setConfettiEnabled] = useState(true); // New state for confetti toggle
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
  
  // Profile views information (mock data)
  const [profileViewsInfo] = useState({
    total: 85,
    increase: 12
  });

  // Mock data for insights and trends
  const [insights] = useState({
    marketTrend: "Hot",
    topSkills: ["React", "Python", "Data Analysis"],
    salaryRange: "$80K - $120K",
    industryGrowth: "+15%"
  });
  
  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate("/");
      return;
    }
    
    // Set user name from Firebase user (will be overridden by settings if available)
    // Only set if userName is still the default "User"
    if (userName === "User") {
      if (currentUser.displayName) {
        console.log("Welcome: Setting initial userName from Firebase displayName:", currentUser.displayName);
        setUserName(currentUser.displayName.split(' ')[0]);
      } else if (currentUser.email) {
        console.log("Welcome: Setting initial userName from Firebase email:", currentUser.email.split('@')[0]);
        setUserName(currentUser.email.split('@')[0]);
      }
    }
    
    // Set user email from Firebase
    if (currentUser.email) {
      console.log("Welcome: Setting user email from Firebase:", currentUser.email);
      setUserSettings(prev => ({
        ...prev,
        email: currentUser.email || ""
      }));
    }
    
    // Load confetti preference from localStorage (keep this for now)
    const savedConfettiPreference = localStorage.getItem('confettiEnabled');
    if (savedConfettiPreference !== null) {
      setConfettiEnabled(JSON.parse(savedConfettiPreference));
    }
    
             // Load user data from Firebase
    const loadUserData = async () => {
      try {
        const userId = currentUser.uid;
        console.log("Welcome: Loading data for Firebase user:", userId);
        
        // Check if user needs migration from localStorage
        if (needsMigration(userId)) {
          console.log("Welcome: User needs migration, starting migration process...");
          await migrateLocalStorageToFirebase(userId);
        }
        
        // Load user settings
        const settings = await getUserSettings(userId);
        if (settings) {
                     console.log("Welcome: User settings loaded from Firebase:", settings);
          setUserSettings(prev => ({
            ...prev,
            ...settings,
            email: currentUser.email || settings.email // Firebase email takes priority
          }));
        }
        
        // Load applied jobs
        const applied = await getAppliedJobs(userId);
        setAppliedJobs(applied);
        
        // Load favorite jobs
        const favorites = await getFavoriteJobs(userId);
        setFavoriteJobs(favorites);
        
        // Check for temporary userName first (most recent)
        const tempNameKey = `tempUserName_${currentUser.uid}`;
        const tempUserName = localStorage.getItem(tempNameKey);
        
        if (tempUserName) {
          console.log("Welcome: Found temporary userName:", tempUserName);
          setUserName(tempUserName);
        } else if (settings && settings.name) {
          // Only update if we don't have a valid name yet, or if the settings name is different
          const currentFirstName = userName !== "User" ? userName : null;
          const settingsFirstName = settings.name.split(' ')[0];
          
          if (!currentFirstName || currentFirstName === currentUser.displayName?.split(' ')[0] || currentFirstName === currentUser.email?.split('@')[0]) {
            console.log("Welcome: Final userName update from settings:", settingsFirstName);
            setUserName(settingsFirstName);
          } else {
            console.log("Welcome: Keeping current userName:", currentFirstName, "- not overriding with Firebase data");
          }
        } else if (!settings?.name) {
          // Fallback to Firebase user data if no settings name
          if (currentUser.displayName) {
            console.log("Welcome: Fallback to Firebase displayName:", currentUser.displayName);
            setUserName(currentUser.displayName.split(' ')[0]);
          }
        }
        
        // Calculate profile progress
        let completionProgress = 25; // Basic info is done if logged in
        
        // Check if job preferences exist
        if (settings && (settings.desiredJobTitles || settings.industryPreferences)) {
          completionProgress += 25;
        }
        
        // Check if skills assessment done (mock - could be moved to Firestore later)
        if (false) { // Placeholder for skills assessment
          completionProgress += 25;
        }
        
        setProgress(completionProgress);
        
      } catch (error) {
                 console.error("Error loading user data from Firebase:", error);
      }
    };
    
    loadUserData();
    
    // Run the confetti just once if enabled
    const shouldRunConfetti = savedConfettiPreference !== null ? JSON.parse(savedConfettiPreference) : true;
    if (shouldRunConfetti) {
      runConfetti();
    }
  }, [navigate, currentUser]);
  
  // Set up real-time listeners for user data changes
  useEffect(() => {
    if (!currentUser) return;
    
    const userId = currentUser.uid;
    console.log("Welcome: Setting up real-time listeners for user:", userId);
    
    // Subscribe to applied jobs changes
    const unsubscribeAppliedJobs = subscribeToAppliedJobs(userId, (jobs) => {
      console.log("Welcome: Applied jobs updated in real-time:", jobs.length);
      setAppliedJobs(jobs);
    });
    
    // Subscribe to favorite jobs changes
    const unsubscribeFavoriteJobs = subscribeToFavoriteJobs(userId, (jobs) => {
      console.log("Welcome: Favorite jobs updated in real-time:", jobs.length);
      setFavoriteJobs(jobs);
    });
    
    // Cleanup subscriptions
    return () => {
      unsubscribeAppliedJobs();
      unsubscribeFavoriteJobs();
    };
  }, [currentUser]);

  // Listen for userName changes from settings
  useEffect(() => {
    const handleUserNameChange = (event: CustomEvent) => {
      const newUserName = event.detail;
      console.log("Welcome: userName changed to:", newUserName);
      setUserName(newUserName);
      
      // Store the updated name temporarily to persist across page navigations
      if (currentUser) {
        const tempNameKey = `tempUserName_${currentUser.uid}`;
        localStorage.setItem(tempNameKey, newUserName);
        console.log("Welcome: Stored temporary userName in localStorage:", newUserName);
      }
    };

    window.addEventListener('userNameChanged', handleUserNameChange as EventListener);
    
    return () => {
      window.removeEventListener('userNameChanged', handleUserNameChange as EventListener);
    };
  }, [currentUser]);
  
  // Debug: Monitor userName changes
  useEffect(() => {
    console.log("Welcome: userName state changed to:", userName);
  }, [userName]);
  
  // Real-time listener for user settings changes - DISABLED to prevent conflicts
  // useEffect(() => {
  //   if (!currentUser) return;
  //   
  //   const userId = currentUser.uid;
  //   console.log("Welcome: Setting up real-time listener for user settings");
  //   
  //   // Subscribe to user settings changes
  //   const unsubscribeSettings = onSnapshot(doc(db, 'users', userId), (doc) => {
  //     if (doc.exists()) {
  //       const data = doc.data();
  //       if (data.settings && data.settings.name) {
  //         console.log("Welcome: Real-time settings update - new name:", data.settings.name);
  //         setUserName(data.settings.name.split(' ')[0]);
  //       }
  //     }
  //   });
  //   
  //   return () => unsubscribeSettings();
  // }, [currentUser]);

  // Function to handle navigation with scroll to top
  const handleNavigation = (path: string) => {
    // Scroll to top before navigation
    window.scrollTo(0, 0);
    // Navigate to the path
    navigate(path);
  };

  // Mock data - would come from API in real app
  const recentJobs = [
    { id: 1, title: "Software Engineer", company: "Tech Innovations Inc.", status: "Applied", date: "2023-03-24" },
    { id: 2, title: "Data Scientist", company: "Data Analytics Pro", status: "Interviewing", date: "2023-03-20" },
  ];

  const featuredLinks = [
    {
      title: "Find Jobs",
      description: "Explore job opportunities matched to your skills and preferences",
      icon: <Briefcase className="w-10 h-10 text-primary" />,
      path: "/find-jobs",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Create Your Resume",
      description: "Build a professional resume with our easy-to-use tools",
      icon: <FileText className="w-10 h-10 text-primary" />,
      path: "/resume-builder",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10"
    }
  ];

  // Use real data for stats cards
  const statsCards = [
    { 
      title: "Applied Jobs", 
      value: appliedJobs.length.toString(), 
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      trend: "+2 this week",
      trendColor: "text-green-600"
    },
    { 
      title: "Profile Views", 
      value: profileViewsInfo.total.toString(), 
      icon: <BarChart className="h-8 w-8 text-primary" />,
      subtitle: `+${profileViewsInfo.increase} this week`,
      trend: "+12%",
      trendColor: "text-green-600"
    },
    { 
      title: "Favorite Jobs", 
      value: favoriteJobs.length.toString(), 
      icon: <Star className="h-8 w-8 text-primary" />,
      trend: "+5 this week",
      trendColor: "text-blue-600"
    },
    { 
      title: "Profile Progress", 
      value: `${progress}%`, 
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      trend: "Complete to boost chances",
      trendColor: "text-orange-600"
    }
  ];

  // Function to run confetti animation
  const runConfetti = () => {
    if (!confettiEnabled) return;
    
    // Left side burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#22c55e', '#10b981', '#34d399'],
      disableForReducedMotion: true
    });
    
    // Right side burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#22c55e', '#10b981', '#34d399'],
      disableForReducedMotion: true
    });
  };

  // Function to toggle confetti
  const toggleConfetti = () => {
    const newValue = !confettiEnabled;
    setConfettiEnabled(newValue);
    
    // Save to localStorage
    localStorage.setItem('confettiEnabled', JSON.stringify(newValue));
    
    if (newValue) {
      // If enabling, run confetti immediately
      setTimeout(() => runConfetti(), 100);
    }
  };
  
  return (
    <div className="min-h-screen relative">
      <BackgroundShapes />
      <div className="container mx-auto px-4 py-8 relative">
        
        {/* Hero Section with Enhanced Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6"
            >
              <Zap className="w-4 h-4 mr-2" />
              Welcome back to your career journey!
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Welcome back, {userName}! 👋
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Ready to take your career to the next level? Let's find your dream job together.
            </p>
            
                                                   {/* Confetti Toggle Button */}
              <div className="flex items-center justify-center mt-6 mb-4 gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleConfetti}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    confettiEnabled 
                      ? 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20' 
                      : 'bg-gray-500/10 text-gray-600 border-gray-500/20 hover:bg-gray-500/20'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${confettiEnabled ? 'animate-pulse' : ''}`} />
                  {confettiEnabled ? 'Confetti ON' : 'Confetti OFF'}
                </Button>
                
                
              </div>
            
            <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards with Better Visuals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card className="border-border bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${stat.icon.props.className.includes('text-primary') ? 'bg-primary/10' : 'bg-blue-500/10'}`}>
                      {stat.icon}
                    </div>
                    {stat.trend && (
                      <Badge variant="secondary" className={`text-xs ${stat.trendColor}`}>
                        {stat.trend}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    {stat.subtitle && <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Market Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-primary" />
              Market Insights
            </h2>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
              Live Data
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <Badge className="bg-green-500 text-white">Hot Market</Badge>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Job Market Status</h3>
                <p className="text-3xl font-bold text-green-600 mb-2">{insights.marketTrend}</p>
                <p className="text-sm text-muted-foreground">High demand for tech roles</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge className="bg-blue-500 text-white">Top Skills</Badge>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">In-Demand Skills</h3>
                <div className="space-y-2">
                  {insights.topSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 bg-blue-500/20 text-blue-600">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <Badge className="bg-purple-500 text-white">Salary Range</Badge>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Expected Salary</h3>
                <p className="text-3xl font-bold text-purple-600 mb-2">{insights.salaryRange}</p>
                <p className="text-sm text-muted-foreground">Based on your profile</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
        
        {/* Enhanced Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center">
            <Zap className="w-6 h-6 mr-3 text-primary" />
            Quick Actions
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {featuredLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border bg-card/80 backdrop-blur-sm group">
                  <CardHeader>
                    <div className={`mb-4 p-3 rounded-xl ${link.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      {link.icon}
                    </div>
                    <CardTitle className="text-xl text-foreground">{link.title}</CardTitle>
                    <CardDescription className="text-base">{link.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      className={`w-full bg-gradient-to-r ${link.color} hover:opacity-90 text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      size="lg"
                      onClick={() => handleNavigation(link.path)}
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

                 {/* Enhanced Recent Activity */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.6 }}
           className="mb-12"
         >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center">
              <Clock className="w-6 h-6 mr-3 text-primary" />
              Recent Activity
            </h2>
            <Button variant="ghost" onClick={() => handleNavigation("/dashboard?tab=applications")}>
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              {appliedJobs.length > 0 ? (
                <div className="space-y-4">
                  {appliedJobs.slice(0, 3).map((job, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-background/60 hover:bg-background/80 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{job.Title}</p>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Building2 className="w-4 h-4 mr-1" />
                            {job.company}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                          Applied
                        </Badge>
                        <span className="text-xs text-muted-foreground">{job.uploaded}</span>
                      </div>
                    </motion.div>
                  ))}
                  <Button 
                    variant="outline" 
                    onClick={() => handleNavigation("/dashboard?tab=applications")} 
                    className="w-full mt-4"
                  >
                    View All Applications <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No recent job activity</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Start your job search journey today! Apply to positions that match your skills and interests.
                  </p>
                  <Button 
                    onClick={() => handleNavigation("/find-jobs")} 
                    className="bg-primary hover:bg-primary/90 text-white shadow-lg"
                    size="lg"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Find Jobs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

                 {/* Enhanced Dashboard CTA */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.7 }}
           className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto"
         >
          <Card className="w-full border-border bg-card/80 p-8 rounded-2xl backdrop-blur-sm shadow-xl">
            <div className="mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-foreground">Ready to explore your full dashboard?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Visit your personalized dashboard to track applications, set job alerts, manage favorites, and access advanced features.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => handleNavigation("/dashboard")} 
                className="bg-primary hover:bg-primary/90 text-white shadow-lg px-8 py-3"
              >
                <BarChart className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => handleNavigation("/find-jobs")}
                className="px-8 py-3"
              >
                <Search className="w-5 h-5 mr-2" />
                Browse Jobs
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 