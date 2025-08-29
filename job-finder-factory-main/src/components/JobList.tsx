import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, Star, CheckCircle, XCircle, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toggleFavoriteJob, checkIfJobFavorited } from "@/lib/jobActions";

// Define the Job interface
interface Job {
  link: string;
  Title: string;
  company: string;
  location: string;
  uploaded: string;
  matchScore?: number;
}

interface JobListProps {
  jobs: Job[];
  onJobClick: (job: Job) => void;
}

export const JobList: React.FC<JobListProps> = ({ jobs, onJobClick }) => {
  const { currentUser } = useAuth();
  const [visitedJobs, setVisitedJobs] = React.useState<Record<string, boolean | null>>({});
  const [favoriteJobs, setFavoriteJobs] = React.useState<Record<string, boolean>>({});
  const [lastAppliedJob, setLastAppliedJob] = React.useState<string | null>(null);

  // Load user data from Firebase on component mount
  React.useEffect(() => {
    if (!currentUser) return;

    const loadUserData = async () => {
      try {
        const { getAppliedJobs, getFavoriteJobs } = await import('@/lib/userDataService');
        
        // Load applied jobs from Firebase
        const firebaseApplied = await getAppliedJobs(currentUser.uid);
        const appliedMap: Record<string, boolean | null> = {};
        firebaseApplied.forEach(job => {
          appliedMap[job.link] = true; // true means applied
        });
        setVisitedJobs(appliedMap);
        
        // Load favorite jobs from Firebase
        const firebaseFavorites = await getFavoriteJobs(currentUser.uid);
        const favoritesMap: Record<string, boolean> = {};
        firebaseFavorites.forEach(job => {
          favoritesMap[job.link] = true;
        });
        setFavoriteJobs(favoritesMap);
        
      } catch (error) {
        console.error('Error loading user data from Firebase:', error);
      }
    };

    loadUserData();
  }, [currentUser]);

  // Handle favorite toggle
  const handleToggleFavorite = async (e: React.MouseEvent, job: Job) => {
    e.stopPropagation(); // Prevent job click handler from firing
    
    if (!currentUser) {
      console.error('User not authenticated');
      return;
    }
    
    try {
      // Convert job to the format expected by Firebase
      const firebaseJob = {
        id: job.link, // Use link as ID since that's unique
        Title: job.Title,
        company: job.company,
        location: job.location,
        uploaded: job.uploaded,
        link: job.link,
        score: job.matchScore || 0
      };
      
      // Toggle favorite using Firebase
      const result = await toggleFavoriteJob(currentUser.uid, firebaseJob);
      
      if (result.success) {
        // Update local state
        setFavoriteJobs(prev => ({
          ...prev,
          [job.link]: result.favorited
        }));
        
        console.log(`Job ${result.favorited ? 'added to' : 'removed from'} favorites:`, job.Title);
      } else {
        console.error('Failed to toggle favorite job:', job.Title);
      }
    } catch (error) {
      console.error('Error toggling favorite job:', error);
    }
  };

  // Handle "Did you apply?" responses
  const handleApplicationResponse = async (e: React.MouseEvent, jobLink: string, didApply: boolean) => {
    e.stopPropagation(); // Prevent job click handler from firing
    
    if (!currentUser) {
      console.error('User not authenticated');
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
            id: jobLink, // Use link as ID since that's unique
            Title: job.Title,
            company: job.company,
            location: job.location,
            uploaded: job.uploaded,
            link: job.link,
            score: job.matchScore || 0
          };
          
          // Save to Firebase using the jobActions
          const { applyToJob } = await import('@/lib/jobActions');
          const success = await applyToJob(currentUser.uid, firebaseJob);
          
          if (success) {
            console.log('Job application confirmed and saved to Firebase:', job.Title);
          } else {
            console.error('Failed to save job application to Firebase:', job.Title);
          }
        } catch (error) {
          console.error('Error saving job application to Firebase:', error);
        }
      }
    }
    
    setLastAppliedJob(null);
  };

  return (
    <div className="space-y-4">
      {jobs.map((job, index) => (
        <Card 
          key={index} 
          className={`hover:shadow-md transition-all border-border bg-card/80 backdrop-blur-sm overflow-hidden ${
            visitedJobs[job.link] === true ? 'border-l-4 border-l-green-500' : 
            visitedJobs[job.link] === false ? 'border-l-4 border-l-red-500' : ''
          }`}
          onClick={() => onJobClick(job)}
        >
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                  {job.Title}
                </h3>
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
                {/* Favorite Heart Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full transition-all ${
                    favoriteJobs[job.link] 
                      ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
                      : 'text-muted-foreground hover:text-red-400 hover:bg-red-50'
                  }`}
                  onClick={(e) => handleToggleFavorite(e, job)}
                  title={favoriteJobs[job.link] ? "Remove from favorites" : "Add to favorites"}
                >
                  {favoriteJobs[job.link] ? (
                    <Heart className="h-4 w-4 fill-current" />
                  ) : (
                    <Heart className="h-4 w-4" />
                  )}
                </Button>
                
                <Button variant="outline" size="sm" className="z-10" onClick={(e) => {
                  e.stopPropagation();
                  onJobClick(job);
                }}>
                  View Details
                </Button>
                
                {lastAppliedJob === job.link && visitedJobs[job.link] === null && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium">Did you apply?</span>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 px-2 text-xs bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                        onClick={(e) => handleApplicationResponse(e, job.link, true)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" /> Yes
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 px-2 text-xs bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                        onClick={(e) => handleApplicationResponse(e, job.link, false)}
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
};
