import React from "react";

// Define the Job interface
interface Job {
  Title: string;
  company: string;
  location: string;
  uploaded: string;
  score: number;
}

interface JobListProps {
  jobs: Job[]; // Array of job objects
  onJobClick: (job: Job) => void; // Callback function when a job is clicked
}

export const JobList: React.FC<JobListProps> = ({ jobs, onJobClick }) => {
  return (
    <ul className="space-y-6">
      {jobs.map((job) => (
        <li
          key={job.Title} // Using Title as the unique key
          onClick={() => onJobClick(job)} // Call onJobClick when the job is clicked
          className="cursor-pointer p-6 bg-gray-100 shadow-sm rounded-xl hover:shadow-lg transition duration-300 border border-gray-200 hover:border-green-400"
        >
          <div className="flex items-center justify-between">
            {/* Job Title */}
            <h3 className="text-lg font-bold text-gray-800">{job.Title}</h3>
            {/* Score Badge */}
            <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
              Score: {job.score}
            </span>
          </div>
          {/* Company and Location */}
          <div className="mt-2 text-sm text-gray-600 flex items-center space-x-6">
            {/* Company */}
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h11M9 21h6M5 14h9M12 3v18"
                />
              </svg>
              {job.company}
            </span>
            {/* Location */}
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9v10M4 10h16M4 6h16M9 21h6M9 3h6"
                />
              </svg>
              {job.location}
            </span>
          </div>
          {/* Uploaded Time */}
          <div className="mt-3 text-sm text-gray-500">
            Uploaded: {job.uploaded}
          </div>
        </li>
      ))}
    </ul>
  );
};
