import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Job {
  id?: string;
  link?: string;
  Title: string;
  company: string;
  location: string;
  uploaded?: string;
  score?: number;
  description?: string;
  tags?: string[];
  salary?: string;
}

export const getJobs = async (): Promise<Job[]> => {
  try {
    const response = await axios.get(`${API_URL}/jobs`);
    
    // Transform the data to match our Job interface
    return response.data.map((job: any) => ({
      id: job._id || job.id,
      link: job.link,
      Title: job.Title,
      company: job.company, 
      location: job.location,
      uploaded: job.uploaded,
      score: job.score,
      // Add default values for properties not in the API
      description: "No description available",
      tags: ["Python", "Data Science", "ML"],
      salary: "$70,000 - $120,000"
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

export const getJobById = async (id: string): Promise<Job | null> => {
  try {
    const response = await axios.get(`${API_URL}/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job with id ${id}:`, error);
    return null;
  }
}; 