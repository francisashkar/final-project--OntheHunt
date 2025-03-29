import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { BriefcaseIcon, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Element } from "react-scroll";
import { getFeaturedJobs } from "@/services/jobService";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  postedDate: string;
  jobType: string;
  salary: string;
  description: string;
  logo?: string;
}

export default function JobCarouselSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [displayJobs, setDisplayJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Animation speed (pixels per frame)
  const SCROLL_SPEED = 0.5;
  const MAX_JOBS = 16; // Increased job limit
  
  useEffect(() => {
    loadJobs();
    return () => {
      // Clean up animation frame on unmount
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Set up continuous scrolling animation
  useEffect(() => {
    if (jobs.length > 0 && !loading) {
      // Create a duplicate set of jobs for seamless looping
      const duplicatedJobs = [...jobs, ...jobs, ...jobs]; // Add three copies for smoother looping
      setDisplayJobs(duplicatedJobs);
      
      // Start the continuous scrolling animation
      startScrollAnimation();
    }
  }, [jobs, loading]);

  const startScrollAnimation = () => {
    const animate = () => {
      setScrollPosition(prevPosition => {
        const newPosition = prevPosition + SCROLL_SPEED;
        
        // Reset position when we've scrolled through the first set of jobs
        // This creates the illusion of an infinite loop
        const cardWidth = carouselRef.current?.querySelector('.job-card')?.clientWidth || 300;
        const totalWidth = cardWidth * jobs.length;
        
        if (newPosition >= totalWidth) {
          return 0;
        }
        
        return newPosition;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const jobsData = await getFeaturedJobs();
      
      if (jobsData && jobsData.length > 0) {
        setJobs(jobsData.slice(0, MAX_JOBS)); // Show up to 16 jobs
      } else {
        // Fallback data in case database is empty - with additional jobs
        setJobs([
          {
            _id: "1",
            title: "Senior Full Stack Developer",
            company: "TechCorp Solutions",
            location: "San Francisco, CA",
            postedDate: "2 days ago",
            jobType: "Full-time",
            salary: "$120,000 - $150,000",
            description: "Join our team to build cutting-edge web applications using React, Node.js, and MongoDB.",
            logo: "https://ui-avatars.com/api/?name=TechCorp&background=6366f1&color=fff"
          },
          {
            _id: "2",
            title: "Product Manager",
            company: "InnovateTech",
            location: "New York, NY",
            postedDate: "1 week ago",
            jobType: "Full-time",
            salary: "$110,000 - $130,000",
            description: "Lead product development for our SaaS platform that serves over 5,000 businesses worldwide.",
            logo: "https://ui-avatars.com/api/?name=InnovateTech&background=6366f1&color=fff"
          },
          {
            _id: "3",
            title: "UX/UI Designer",
            company: "DesignWave",
            location: "Remote",
            postedDate: "3 days ago",
            jobType: "Contract",
            salary: "$90,000 - $120,000",
            description: "Create beautiful, intuitive interfaces for our mobile and web applications.",
            logo: "https://ui-avatars.com/api/?name=DesignWave&background=6366f1&color=fff"
          },
          {
            _id: "4",
            title: "AI Research Scientist",
            company: "IntelliTech",
            location: "Boston, MA",
            postedDate: "5 days ago",
            jobType: "Full-time",
            salary: "$130,000 - $160,000",
            description: "Research and develop cutting-edge machine learning algorithms for our next-generation AI platform.",
            logo: "https://ui-avatars.com/api/?name=IntelliTech&background=6366f1&color=fff"
          },
          {
            _id: "5",
            title: "Cybersecurity Analyst",
            company: "SecureDefense",
            location: "Washington, DC",
            postedDate: "3 days ago",
            jobType: "Full-time",
            salary: "$105,000 - $135,000",
            description: "Protect our systems and data from cyber threats using advanced security tools and techniques.",
            logo: "https://ui-avatars.com/api/?name=SecureDefense&background=6366f1&color=fff"
          },
          {
            _id: "6",
            title: "Mobile App Developer",
            company: "AppWorks",
            location: "Austin, TX",
            postedDate: "1 week ago",
            jobType: "Remote",
            salary: "$100,000 - $125,000",
            description: "Create innovative and responsive mobile applications for iOS and Android platforms.",
            logo: "https://ui-avatars.com/api/?name=AppWorks&background=6366f1&color=fff"
          },
          {
            _id: "7",
            title: "Data Engineer",
            company: "DataFlow Systems",
            location: "Chicago, IL",
            postedDate: "4 days ago",
            jobType: "Full-time",
            salary: "$115,000 - $140,000",
            description: "Design and build data pipelines to process and analyze large datasets for business intelligence.",
            logo: "https://ui-avatars.com/api/?name=DataFlow&background=6366f1&color=fff"
          },
          {
            _id: "8",
            title: "DevOps Engineer",
            company: "CloudScale",
            location: "Seattle, WA",
            postedDate: "2 weeks ago",
            jobType: "Full-time",
            salary: "$125,000 - $155,000",
            description: "Build and maintain CI/CD pipelines and cloud infrastructure using AWS, Docker, and Kubernetes.",
            logo: "https://ui-avatars.com/api/?name=CloudScale&background=6366f1&color=fff"
          },
          {
            _id: "9",
            title: "Frontend Developer",
            company: "VisualEdge",
            location: "Denver, CO",
            postedDate: "3 days ago",
            jobType: "Contract",
            salary: "$95,000 - $115,000",
            description: "Create responsive and accessible web interfaces using modern JavaScript frameworks like React.",
            logo: "https://ui-avatars.com/api/?name=VisualEdge&background=6366f1&color=fff"
          },
          {
            _id: "10",
            title: "Blockchain Developer",
            company: "ChainTech",
            location: "Miami, FL",
            postedDate: "1 week ago",
            jobType: "Full-time",
            salary: "$130,000 - $160,000",
            description: "Develop smart contracts and decentralized applications on Ethereum and other blockchain platforms.",
            logo: "https://ui-avatars.com/api/?name=ChainTech&background=6366f1&color=fff"
          },
          {
            _id: "11",
            title: "Technical Writer",
            company: "DocuCraft",
            location: "Portland, OR",
            postedDate: "5 days ago",
            jobType: "Part-time",
            salary: "$60,000 - $80,000",
            description: "Create clear and concise technical documentation for software products and APIs.",
            logo: "https://ui-avatars.com/api/?name=DocuCraft&background=6366f1&color=fff"
          },
          {
            _id: "12",
            title: "QA Automation Engineer",
            company: "QualityFirst",
            location: "Minneapolis, MN",
            postedDate: "2 days ago",
            jobType: "Full-time",
            salary: "$90,000 - $120,000",
            description: "Design and implement automated testing frameworks to ensure software quality and reliability.",
            logo: "https://ui-avatars.com/api/?name=QualityFirst&background=6366f1&color=fff"
          },
          {
            _id: "13",
            title: "Game Developer",
            company: "PixelPlay",
            location: "Los Angeles, CA",
            postedDate: "1 week ago",
            jobType: "Full-time",
            salary: "$100,000 - $130,000",
            description: "Develop engaging games for mobile and desktop platforms using Unity or Unreal Engine.",
            logo: "https://ui-avatars.com/api/?name=PixelPlay&background=6366f1&color=fff"
          },
          {
            _id: "14",
            title: "Technical Project Manager",
            company: "ProjectPro",
            location: "Atlanta, GA",
            postedDate: "3 days ago",
            jobType: "Full-time",
            salary: "$115,000 - $140,000",
            description: "Lead technical projects from conception to delivery, managing resources and timelines.",
            logo: "https://ui-avatars.com/api/?name=ProjectPro&background=6366f1&color=fff"
          },
          {
            _id: "15",
            title: "Systems Administrator",
            company: "SysOps Inc",
            location: "Dallas, TX",
            postedDate: "6 days ago",
            jobType: "Full-time",
            salary: "$85,000 - $110,000",
            description: "Maintain and optimize server infrastructure and IT systems for a growing company.",
            logo: "https://ui-avatars.com/api/?name=SysOps&background=6366f1&color=fff"
          },
          {
            _id: "16",
            title: "Machine Learning Engineer",
            company: "AI Innovations",
            location: "Raleigh, NC",
            postedDate: "2 weeks ago",
            jobType: "Full-time",
            salary: "$140,000 - $170,000",
            description: "Develop and deploy machine learning models to solve complex business problems.",
            logo: "https://ui-avatars.com/api/?name=AIInnovations&background=6366f1&color=fff"
          }
        ]);
      }
    } catch (err) {
      console.error("Failed to load jobs", err);
      setError("Failed to load jobs. Please try again later.");
      // Set fallback jobs with just a few entries since this is error state
      setJobs([
        {
          _id: "1",
          title: "Senior Full Stack Developer",
          company: "TechCorp Solutions",
          location: "San Francisco, CA",
          postedDate: "2 days ago",
          jobType: "Full-time",
          salary: "$120,000 - $150,000",
          description: "Join our team to build cutting-edge web applications using React, Node.js, and MongoDB.",
          logo: "https://ui-avatars.com/api/?name=TechCorp&background=6366f1&color=fff"
        },
        {
          _id: "2",
          title: "Product Manager",
          company: "InnovateTech",
          location: "New York, NY",
          postedDate: "1 week ago",
          jobType: "Full-time",
          salary: "$110,000 - $130,000",
          description: "Lead product development for our SaaS platform that serves over 5,000 businesses worldwide.",
          logo: "https://ui-avatars.com/api/?name=InnovateTech&background=6366f1&color=fff"
        },
        {
          _id: "3",
          title: "UX/UI Designer",
          company: "DesignWave",
          location: "Remote",
          postedDate: "3 days ago",
          jobType: "Contract",
          salary: "$90,000 - $120,000",
          description: "Create beautiful, intuitive interfaces for our mobile and web applications.",
          logo: "https://ui-avatars.com/api/?name=DesignWave&background=6366f1&color=fff"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Job card loading skeleton
  const JobCardSkeleton = () => (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="mt-2">
            <Skeleton className="h-5 w-28 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );

  return (
    <Element name="jobs" className="py-16 bg-background dark:bg-transparent w-full relative overflow-visible">
      {/* Section header with title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold mb-4 text-foreground"
          >
            Featured <span className="text-primary dark:text-primary">Job Opportunities</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Discover our handpicked selection of top job openings across various industries
          </motion.p>
        </div>
      </div>

      {/* Full width carousel container - extended to the edges */}
      <div className="relative w-full overflow-visible">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {[1, 2, 3].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <JobCardSkeleton />
              </motion.div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-10 glass-card rounded-xl border-border relative overflow-hidden max-w-3xl mx-auto px-4">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent z-0"></div>
            <div className="relative z-10">
              <div className="text-red-500 mb-4 font-medium">{error}</div>
              <Button variant="outline" onClick={loadJobs}>
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="full-bleed-carousel relative pb-12"
            ref={carouselRef}
          >
            {/* Main carousel slider - truly full width with no padding */}
            <div className="carousel-container">
              <div 
                className="flex transition-all duration-500 ease-linear"
                style={{
                  transform: `translateX(-${scrollPosition}px)`,
                }}
              >
                {displayJobs.map((job, index) => (
                  <div 
                    key={`${job._id}-${index}`} 
                    className="flex-shrink-0 job-card"
                  >
                    <Card className="glass-card h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:border-primary/40 mr-4">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            {job.logo ? (
                              <img 
                                src={job.logo} 
                                alt={`${job.company} logo`}
                                className="w-10 h-10 rounded-full object-cover border border-border"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <BriefcaseIcon className="w-5 h-5 text-primary" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium text-foreground">{job.company}</h3>
                              <p className="text-sm text-muted-foreground">{job.postedDate}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {job.jobType}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4 flex-grow">
                        <h3 className="text-lg font-semibold text-foreground mb-3">{job.title}</h3>
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span>{job.salary}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button asChild variant="default" className="w-full">
                          <Link to={`/jobs/${job._id}`}>
                            View Details
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Browse all jobs button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-12 px-4 sm:px-6 lg:px-8"
      >
        <Button asChild variant="outline" size="lg">
          <Link to="/signup">
            Browse All Jobs
          </Link>
        </Button>
      </motion.div>
    </Element>
  );
} 