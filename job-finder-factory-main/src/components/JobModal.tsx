import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Timer } from "lucide-react";
import type { Job } from "./JobCard";

interface JobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobModal({ job, isOpen, onClose }: JobModalProps) {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{job.Title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {/* Company */}
            <span className="flex items-center">
              <Building2 className="mr-1 h-4 w-4" />
              {job.company}
            </span>
            {/* Location */}
            <span className="flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              {job.location}
            </span>
            {/* Uploaded */}
            <span className="flex items-center">
              <Timer className="mr-1 h-4 w-4" />
              {job.uploaded}
            </span>
          </div>
          {job.score && <Badge variant="secondary">Score: {job.score}</Badge>}
          <div className="space-y-4">
            <h3 className="font-semibold">Job Description</h3>
            <p className="text-muted-foreground">
              This is a placeholder job description. In a real application, this
              would contain detailed information about the role,
              responsibilities, requirements, and company culture.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {/* Apply Button */}
            <a
              href={job.link} // Use the job.link as the target URL
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Apply Now</Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
