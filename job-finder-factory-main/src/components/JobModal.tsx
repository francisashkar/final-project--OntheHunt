import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ExternalLink, CheckCircle, Building2, MapPin, Timer, Briefcase } from "lucide-react";
import { Job, moveJobToChat } from "@/lib/jobService";
import { useAuth } from "@/contexts/AuthContext";
import { toggleFavoriteJob, checkIfJobFavorited } from "@/lib/jobActions";

interface JobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (jobLink: string) => void;
}

// Extend the Job interface to include AI-generated skills
interface JobWithAISkills extends Job {
  aiGeneratedSkills?: string[];
}

export function JobModal({ job, isOpen, onClose, onApply }: JobModalProps) {
  const { currentUser } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showChatConfirmation, setShowChatConfirmation] = useState(false);
  const [aiGeneratedSkills, setAiGeneratedSkills] = useState<string[]>([]);
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
  const [aiGeneratedSalary, setAiGeneratedSalary] = useState<string>('');
  const [isGeneratingSalary, setIsGeneratingSalary] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const currentJobRef = useRef<string | null>(null);
  
  // Check if job is favorited from Firebase
  useEffect(() => {
    if (job && currentUser) {
      const checkFavorite = async () => {
        try {
          const favorited = await checkIfJobFavorited(currentUser.uid, job.link);
          setIsFavorite(favorited);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      };
      checkFavorite();
    }
  }, [job, currentUser]);

  // Generate AI skills and salary when modal opens
  useEffect(() => {
    if (job && currentJobRef.current !== job.link) {
      currentJobRef.current = job.link;
      setAiGeneratedSkills([]); // Reset skills for new job
      setAiGeneratedSalary(''); // Reset salary for new job
      setExpandedDescription(false); // Reset description expansion for new job
      
      // Only generate AI content if description is available
      if (job.description) {
        generateAISkills();
        generateAISalary();
      }
    }
  }, [job]);

  // Function to generate AI skills from job description
  const generateAISkills = async () => {
    if (!job?.description) return;
    
    setIsGeneratingSkills(true);
    try {
      const prompt = `Analyze this job description and extract the key technical skills, programming languages, tools, and technologies required. Return ONLY a JSON array of skill strings, no explanations.

Job Title: ${job.Title}
Company: ${job.company}
Description: ${job.description}

Return format: ["skill1", "skill2", "skill3"]`;

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          userProfile: "AI Skills Extraction"
        })
      });

      if (response.ok) {
        const data = await response.json();
        try {
          // Try to parse the response as JSON
          const skills = JSON.parse(data.content);
          if (Array.isArray(skills)) {
            setAiGeneratedSkills(skills);
          } else {
            // If not JSON, try to extract skills from text
            const extractedSkills = extractSkillsFromText(data.content);
            setAiGeneratedSkills(extractedSkills);
          }
        } catch (parseError) {
          // If JSON parsing fails, extract skills from text
          const extractedSkills = extractSkillsFromText(data.content);
          setAiGeneratedSkills(extractedSkills);
        }
      } else {
        // Fallback to basic skill extraction
        const fallbackSkills = extractBasicSkills(job.Title, job.description);
        setAiGeneratedSkills(fallbackSkills);
      }
    } catch (error) {
      console.error('Error generating AI skills:', error);
      // Fallback to basic skill extraction
      const fallbackSkills = extractBasicSkills(job.Title, job.description);
      setAiGeneratedSkills(fallbackSkills);
    } finally {
      setIsGeneratingSkills(false);
    }
  };

  // Function to generate AI salary estimate from job description
  const generateAISalary = async () => {
    if (!job?.description) return;
    
    setIsGeneratingSalary(true);
    try {
      const prompt = `Analyze this job posting and provide a realistic salary range estimate based on the job title, company, location, and description. Consider factors like experience level, required skills, and market rates.

Job Title: ${job.Title}
Company: ${job.company}
Location: ${job.location}
Description: ${job.description}

Return ONLY a JSON object with this exact format:
{
  "salaryRange": "salary range in format like $60K - $90K",
  "period": "per year, per month, or per hour",
  "confidence": "high, medium, or low",
  "reasoning": "brief explanation of the estimate"
}

Example: {"salaryRange": "$80K - $120K", "period": "per year", "confidence": "high", "reasoning": "Based on senior developer requirements and market rates"}`;

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          userProfile: "AI Salary Estimation"
        })
      });

      if (response.ok) {
        const data = await response.json();
        try {
          // Try to parse the response as JSON
          const salaryData = JSON.parse(data.content);
          if (salaryData.salaryRange && salaryData.period) {
            setAiGeneratedSalary(`${salaryData.salaryRange} ${salaryData.period}`);
          } else {
            // If not valid JSON, use fallback
            setAiGeneratedSalary(generateFallbackSalary(job.Title, job.location));
          }
        } catch (parseError) {
          // If JSON parsing fails, use fallback
          setAiGeneratedSalary(generateFallbackSalary(job.Title, job.location));
        }
      } else {
        // Fallback to basic salary generation
        setAiGeneratedSalary(generateFallbackSalary(job.Title, job.location));
      }
    } catch (error) {
      console.error('Error generating AI salary:', error);
      // Fallback to basic salary generation
      setAiGeneratedSalary(generateFallbackSalary(job.Title, job.location));
    } finally {
      setIsGeneratingSalary(false);
    }
  };

  // Fallback function to generate basic salary estimate
  const generateFallbackSalary = (title: string, location: string): string => {
    const lowerTitle = title.toLowerCase();
    const lowerLocation = location.toLowerCase();
    
    // Base salary ranges by experience level
    let baseRange = '';
    if (lowerTitle.includes('senior') || lowerTitle.includes('lead') || lowerTitle.includes('principal')) {
      baseRange = '$100K - $150K';
    } else if (lowerTitle.includes('mid') || lowerTitle.includes('intermediate')) {
      baseRange = '$70K - $110K';
    } else if (lowerTitle.includes('junior') || lowerTitle.includes('entry')) {
      baseRange = '$50K - $80K';
    } else {
      baseRange = '$60K - $100K';
    }
    
    // Adjust for location (high cost of living areas)
    if (lowerLocation.includes('san francisco') || lowerLocation.includes('new york') || 
        lowerLocation.includes('seattle') || lowerLocation.includes('boston')) {
      baseRange = baseRange.replace(/\$(\d+)K/g, (match, num) => `$${Math.floor(parseInt(num) * 1.3)}K`);
    }
    
    return `${baseRange} per year`;
  };

  // Fallback function to extract basic skills from job title and description
  const extractBasicSkills = (title: string, description: string): string[] => {
    const skills: string[] = [];
    const lowerTitle = title.toLowerCase();
    const lowerDesc = description.toLowerCase();
    
    // Common programming languages
    const languages = ['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin'];
    languages.forEach(lang => {
      if (lowerTitle.includes(lang) || lowerDesc.includes(lang)) {
        skills.push(lang.charAt(0).toUpperCase() + lang.slice(1));
      }
    });
    
    // Common frameworks and tools
    const frameworks = ['react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'asp.net'];
    frameworks.forEach(framework => {
      if (lowerTitle.includes(framework) || lowerDesc.includes(framework)) {
        skills.push(framework.charAt(0).toUpperCase() + framework.slice(1));
      }
    });
    
    // Common databases
    const databases = ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server'];
    databases.forEach(db => {
      if (lowerTitle.includes(db) || lowerDesc.includes(db)) {
        skills.push(db.charAt(0).toUpperCase() + db.slice(1));
      }
    });
    
    // Common cloud platforms
    const clouds = ['aws', 'azure', 'gcp', 'heroku', 'digitalocean'];
    clouds.forEach(cloud => {
      if (lowerTitle.includes(cloud) || lowerDesc.includes(cloud)) {
        skills.push(cloud.toUpperCase());
      }
    });
    
    // If no specific skills found, add generic ones based on job type
    if (skills.length === 0) {
      if (lowerTitle.includes('frontend') || lowerTitle.includes('ui')) {
        skills.push('HTML/CSS', 'JavaScript', 'Responsive Design');
      } else if (lowerTitle.includes('backend') || lowerTitle.includes('api')) {
        skills.push('API Development', 'Database Design', 'Server Management');
      } else if (lowerTitle.includes('data') || lowerTitle.includes('analytics')) {
        skills.push('Data Analysis', 'SQL', 'Statistical Analysis');
      } else if (lowerTitle.includes('devops') || lowerTitle.includes('infrastructure')) {
        skills.push('CI/CD', 'Docker', 'Kubernetes');
      } else {
        skills.push('Problem Solving', 'Communication', 'Teamwork');
      }
    }
    
    return skills.slice(0, 8); // Limit to 8 skills
  };

  // Function to extract skills from AI response text
  const extractSkillsFromText = (text: string): string[] => {
    const skills: string[] = [];
    
    // Look for patterns like "skill1, skill2, skill3" or "skill1 and skill2"
    const skillPatterns = [
      /["']([^"']+)["']/g, // Quoted strings
      /([A-Z][a-z]+(?:\s*[A-Z][a-z]+)*)/g, // Capitalized words
      /([a-z]+(?:\s*[a-z]+)*)/g // Lowercase words
    ];
    
    skillPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const skill = match.replace(/["']/g, '').trim();
          if (skill.length > 2 && skill.length < 20 && !skills.includes(skill)) {
            skills.push(skill);
          }
        });
      }
    });
    
    return skills.slice(0, 8); // Limit to 8 skills
  };
  
  if (!job) return null;

  const handleApply = () => {
    // Open job link in new tab
    window.open(job.link, '_blank');
    
    // Notify parent that job was applied to
    onApply(job.link);
    
    // Close the modal
    onClose();
  };
  
  const handleToggleFavorite = async () => {
    if (!currentUser) {
      console.error('User not authenticated');
      return;
    }
    
    try {
      // Convert job to the format expected by Firebase
      const firebaseJob = {
        id: job.link, // Use link as ID for now
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
        setIsFavorite(result.favorited);
        console.log(`Job ${result.favorited ? 'added to' : 'removed from'} favorites:`, job.Title);
      } else {
        console.error('Failed to toggle favorite job:', job.Title);
      }
    } catch (error) {
      console.error('Error toggling favorite job:', error);
    }
  };
  
  const handleMoveToChat = () => {
    const isAdded = moveJobToChat(job);
    if (isAdded) {
      setShowChatConfirmation(true);
      
      // Hide confirmation after 3 seconds
      setTimeout(() => {
        setShowChatConfirmation(false);
      }, 3000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">{job.Title}</DialogTitle>
              <DialogDescription className="text-base font-medium">{job.company}</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {job.matchScore && (
                <Badge className="bg-primary/10 text-primary border-0 flex items-center gap-1 px-3 py-1.5">
                  <Star className="h-4 w-4" />
                  <span className="font-semibold">{job.matchScore}% Match</span>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 rounded-full ${isFavorite ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : 'text-muted-foreground hover:text-red-400 hover:bg-red-50'}`}
                onClick={handleToggleFavorite}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          {/* Chat confirmation message */}
          {showChatConfirmation && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <span>Job added to Career Chat for discussion!</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          {/* Company */}
              <span className="flex items-center">
                <Building2 className="mr-1.5 h-4 w-4 text-primary" />
                {job.company}
              </span>
              {/* Location */}
              <span className="flex items-center">
                <MapPin className="mr-1.5 h-4 w-4 text-primary" />
                {job.location}
              </span>
              {/* Uploaded */}
              <span className="flex items-center">
                <Timer className="mr-1.5 h-4 w-4 text-primary" />
                {job.uploaded}
              </span>
              {/* Job Type (mocked) */}
              <span className="flex items-center">
                <Building2 className="mr-1.5 h-4 w-4 text-primary" />
                Full-time
              </span>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-semibold flex items-center mb-2">
              <CheckCircle className="mr-2 h-4 w-4 text-primary" />
              Key Skills Required
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {isGeneratingSkills ? (
                <div className="flex items-center gap-2 text-primary">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm">Analyzing skills...</span>
                </div>
              ) : aiGeneratedSkills.length > 0 ? (
                aiGeneratedSkills.map((skill: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-primary/10 border-primary/30">
                    {skill}
                  </Badge>
                ))
              ) : job.description ? (
                <div className="text-sm text-muted-foreground">
                  Skills will be generated from job description
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Building2 className="h-4 w-4" />
                    <span>Visit company site for detailed requirements</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Job Description</h3>
            {job.description ? (
              <div className="text-muted-foreground leading-relaxed">
                <div className="mb-4">
                  {job.description.length > 300 ? (
                    <>
                      {!expandedDescription ? (
                        <>
                          <p className="line-clamp-3 max-h-20">
                            {job.description.slice(0, 300) + '...'}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedDescription(true)}
                            className="mt-2 text-primary hover:text-primary/80 p-0 h-auto font-medium"
                          >
                            Read More
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="relative">
                            <div className="max-h-64 overflow-y-auto custom-scrollbar border border-border rounded-lg p-3 bg-background/50">
                              <p className="whitespace-pre-wrap leading-relaxed">
                                {job.description}
                              </p>
                            </div>
                            {/* Scroll indicator */}
                            {job.description.length > 800 && (
                              <div className="absolute bottom-2 right-2 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full border border-primary/20">
                                Scroll to read more
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedDescription(false)}
                            className="mt-2 text-primary hover:text-primary/80 p-0 h-auto font-medium"
                          >
                            Show Less
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <p>{job.description}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground leading-relaxed">
                <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-2">
                        Job Description Not Available
                      </p>
                      <p className="text-sm mb-3">
                        The detailed job description is not available in our database. 
                        Please visit the company's website for complete information about 
                        this position, requirements, and responsibilities.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(job.link, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View on Company Site
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <h4 className="text-sm font-medium">Salary Range (AI Estimated)</h4>
              {isGeneratingSalary ? (
                <div className="flex items-center gap-2 text-primary">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm">Analyzing salary...</span>
                </div>
              ) : aiGeneratedSalary ? (
                <p className="text-primary font-bold">
                  {aiGeneratedSalary}
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Salary estimate will be generated from job details
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {/* Move to Chat Button */}
              <Button 
                variant="outline" 
                className="flex items-center gap-1.5"
                onClick={handleMoveToChat}
              >
                <MessageSquare className="h-4 w-4" />
                Move to Chat
              </Button>
              {/* Apply Button */}
              <Button onClick={handleApply}>
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
