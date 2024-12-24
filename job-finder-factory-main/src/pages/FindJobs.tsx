import React, { useState, useEffect } from "react";
import { JobList } from "@/components/JobList";
import { JobModal } from "@/components/JobModal";
import axios from "axios";

interface Job {
  link: string;
  Title: string;
  company: string;
  location: string;
  uploaded: string;
  score: number;
}

export default function FindJobs() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch jobs from the Flask API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/jobs")
      .then((response) => setJobs(response.data))
      .catch(() => setError("Failed to fetch jobs."));
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Find Your Dream Job</h1>
      <JobList jobs={jobs} onJobClick={setSelectedJob} />
      {selectedJob && (
        <JobModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
