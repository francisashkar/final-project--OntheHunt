import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Clock } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { CarouselButton } from "@/components/ui/carousel-buttons";
import { useCallback, useEffect } from "react";

interface Job {
  title: string;
  company: string;
  location: string;
  timePosted: string;
  matchPercentage: number;
  companyLogo: string;
  salary?: string;
  type?: string;
  description: string;
}

const jobs: Job[] = [
  {
    title: "Senior Frontend Developer",
    company: "Google",
    location: "Tel Aviv",
    timePosted: "2 days ago",
    matchPercentage: 95,
    companyLogo: "/lovable-uploads/a4e0cc79-b5e5-4855-9c4c-1cee104d3d60.png",
    salary: "$120K - $180K",
    type: "Full-time",
    description: "Join our dynamic team to build next-generation web applications using React and modern technologies."
  },
  {
    title: "Product Manager",
    company: "Microsoft",
    location: "Herzliya",
    timePosted: "1 day ago",
    matchPercentage: 92,
    companyLogo: "/lovable-uploads/a4e0cc79-b5e5-4855-9c4c-1cee104d3d60.png",
    salary: "$100K - $150K",
    type: "Full-time",
    description: "Lead product development and collaborate with cross-functional teams to deliver innovative solutions."
  },
  {
    title: "DevOps Engineer",
    company: "Amazon",
    location: "Tel Aviv",
    timePosted: "3 days ago",
    matchPercentage: 88,
    companyLogo: "/lovable-uploads/a4e0cc79-b5e5-4855-9c4c-1cee104d3d60.png",
    salary: "$90K - $140K",
    type: "Remote",
    description: "Manage cloud infrastructure and automate deployment processes to enhance system reliability."
  },
  {
    title: "UX/UI Designer",
    company: "Apple",
    location: "Haifa",
    timePosted: "Just now",
    matchPercentage: 91,
    companyLogo: "/lovable-uploads/a4e0cc79-b5e5-4855-9c4c-1cee104d3d60.png",
    salary: "$80K - $120K",
    type: "Hybrid",
    description: "Design user-friendly interfaces and create engaging user experiences for our products."
  },
  {
    title: "Data Scientist",
    company: "Meta",
    location: "Tel Aviv",
    timePosted: "1 week ago",
    matchPercentage: 89,
    companyLogo: "/lovable-uploads/a4e0cc79-b5e5-4855-9c4c-1cee104d3d60.png",
    salary: "$110K - $170K",
    type: "Full-time",
    description: "Analyze complex data sets to drive business insights and improve decision-making processes."
  },
  {
    title: "Backend Developer",
    company: "Intel",
    location: "Petah Tikva",
    timePosted: "2 weeks ago",
    matchPercentage: 87,
    companyLogo: "/lovable-uploads/a4e0cc79-b5e5-4855-9c4c-1cee104d3d60.png",
    salary: "$95K - $145K",
    type: "Full-time",
    description: "Develop and maintain server-side applications and APIs to support front-end functionality."
  },
  {
    title: "Full Stack Developer",
    company: "Wix",
    location: "Tel Aviv",
    timePosted: "3 days ago",
    matchPercentage: 93,
    companyLogo: "/lovable-uploads/a4e0cc79-b5e5-4855-9c4c-1cee104d3d60.png",
    salary: "$100K - $160K",
    type: "Remote",
    description: "Build and optimize full-stack applications using modern frameworks and technologies."
  },
  {
    title: "AI Engineer",
    company: "NVIDIA",
    location: "Yokneam",
    timePosted: "5 days ago",
    matchPercentage: 90,
    companyLogo: "/lovable-uploads/a4e0cc79-b5e5-4855-9c4c-1cee104d3d60.png",
    salary: "$130K - $190K",
    type: "Hybrid",
    description: "Develop AI models and algorithms to enhance machine learning capabilities."
  },
  {
    title: "Cloud Architect",
    company: "IBM",
    location: "Tel Aviv",
    timePosted: "1 week ago",
    matchPercentage: 94,
    companyLogo: "/lovable-uploads/a4e0cc79-b5e5-4855-9c4c-1cee104d3d60.png",
    salary: "$140K - $200K",
    type: "Remote",
    description: "Design and implement cloud solutions to meet business needs and improve scalability."
  },
  {
    title: "Mobile Developer",
    company: "Apple",
    location: "Herzliya",
    timePosted: "3 days ago",
    matchPercentage: 91,
    companyLogo: "/lovable-uploads/a4e0cc79-b5e5-4855-9c4c-1cee104d3d60.png",
    salary: "$110K - $170K",
    type: "Full-time",
    description: "Create and maintain mobile applications for iOS and Android platforms."
  },
  {
    title: "ML Engineer",
    company: "DeepMind",
    location: "Remote",
    timePosted: "1 day ago",
    matchPercentage: 97,
    companyLogo: "/lovable-uploads/a4e0cc79-b5e5-4855-9c4c-1cee104d3d60.png",
    salary: "$150K - $220K",
    type: "Remote",
    description: "Work on cutting-edge AI projects and help shape the future of machine learning."
  },
  {
    title: "Blockchain Developer",
    company: "Ethereum Foundation",
    location: "Remote",
    timePosted: "3 days ago",
    matchPercentage: 94,
    companyLogo: "/lovable-uploads/a4e0cc79-b5e5-4855-9c4c-1cee104d3d60.png",
    salary: "$130K - $200K",
    type: "Remote",
    description: "Develop and maintain blockchain infrastructure and smart contracts."
  }
];

export const JobCarouselSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    dragFree: false,
    containScroll: 'trimSnaps'
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi]);

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Job Opportunities</h2>
        <div className="relative">
          <Carousel ref={emblaRef} className="w-full max-w-7xl mx-auto">
            <CarouselContent className="-ml-2 md:-ml-4">
              {jobs.slice(0, 6).map((job, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
                  <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800/50 dark:backdrop-blur-sm dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 dark:text-white">{job.title}</h3>
                          <div className="flex items-center text-muted-foreground">
                            <Building2 className="w-4 h-4 mr-1" />
                            <span className="text-sm">{job.company}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="ml-2 dark:bg-primary/20 dark:text-primary">
                          {job.matchPercentage}% Match
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {job.timePosted}
                        </div>
                        {job.description && (
                          <p className="text-sm mt-2 line-clamp-2">{job.description}</p>
                        )}
                        {job.salary && (
                          <div className="font-medium dark:text-gray-300">
                            {job.salary}
                          </div>
                        )}
                        {job.type && (
                          <Badge variant="outline" className="mt-2 dark:border-gray-600 dark:text-gray-300">
                            {job.type}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <CarouselButton direction="prev" onClick={scrollPrev} />
          <CarouselButton direction="next" onClick={scrollNext} />
        </div>
      </div>
    </section>
  );
};
