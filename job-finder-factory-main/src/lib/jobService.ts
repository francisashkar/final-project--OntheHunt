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
  matchScore?: number;
}

/**
 * Helper function to move a job to the career chat
 * Returns true if job was added, false if already exists
 */
export const moveJobToChat = (job: Job) => {
  // Get existing chat references or initialize empty array
  const chatReferences = JSON.parse(localStorage.getItem('chatReferences') || '[]');
  
  // Check if job already exists in references
  const jobExists = chatReferences.some((ref: any) => 
    ref.link === job.link && ref.Title === job.Title && ref.company === job.company
  );
  
  // Only add if job doesn't already exist in references
  if (!jobExists) {
    // Add job with timestamp
    chatReferences.push({
      ...job,
      addedAt: new Date().toISOString(),
      type: 'job_reference'
    });
    
    // Save back to localStorage
    localStorage.setItem('chatReferences', JSON.stringify(chatReferences));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('chatReferencesUpdated'));
    
    return true;
  }
  
  return false;
};

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
      // Use description from API or provide default
      description: job.description || "No description available",
      tags: job.tags || ["Python", "Data Science", "ML"],
      salary: job.salary || "$70,000 - $120,000"
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