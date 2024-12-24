import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Timer } from "lucide-react";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedAt: string;
  salary?: string;
}

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
}

export function JobCard({ job, onClick }: JobCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow animate-fade-up">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg leading-none">{job.title}</h3>
              {job.salary && (
                <Badge variant="secondary" className="ml-2">
                  {job.salary}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Building2 className="mr-1 h-4 w-4" />
                {job.company}
              </span>
              <span className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                {job.location}
              </span>
              <span className="flex items-center">
                <Timer className="mr-1 h-4 w-4" />
                {job.postedAt}
              </span>
            </div>
          </div>
          <Badge>{job.type}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => onClick(job)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}