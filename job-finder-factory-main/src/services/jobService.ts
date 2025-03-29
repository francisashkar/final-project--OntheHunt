import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Job {
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

export const getAllJobs = async (): Promise<Job[]> => {
  try {
    const response = await axios.get(`${API_URL}/jobs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    return [];
  }
};

export const getFeaturedJobs = async (): Promise<Job[]> => {
  try {
    console.log('Fetching featured jobs from:', `${API_URL}/jobs/featured`);
    const response = await axios.get(`${API_URL}/jobs/featured`);
    console.log('Featured jobs response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured jobs:', error);
    // Check if backend server is running
    try {
      console.log('Testing API connectivity...');
      const testResponse = await axios.get(`${API_URL}`);
      console.log('API test response:', testResponse.status);
    } catch (testError) {
      console.error('API test failed:', testError);
      console.log('Make sure the backend server is running on port 5000');
    }
    return [];
  }
};

export const searchJobs = async (query: string): Promise<Job[]> => {
  try {
    const response = await axios.get(`${API_URL}/jobs/search`, {
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching jobs:', error);
    return [];
  }
};

export const getJobById = async (id: string): Promise<Job | null> => {
  try {
    const response = await axios.get(`${API_URL}/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job ${id}:`, error);
    return null;
  }
};

export const getJobsByFilter = async (filters: {
  location?: string;
  jobType?: string;
  salary?: string;
  keyword?: string;
}): Promise<Job[]> => {
  try {
    const response = await axios.get(`${API_URL}/jobs/filter`, {
      params: filters
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered jobs:', error);
    return [];
  }
};

// Apply to a job
export const applyToJob = async (jobId: string, application: any) => {
  try {
    const response = await axios.post(`${API_URL}/jobs/${jobId}/apply`, application, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error applying to job:', error);
    throw error;
  }
};

// Save or bookmark a job
export const saveJob = async (jobId: string) => {
  try {
    const response = await axios.post(`${API_URL}/user/saved-jobs/${jobId}`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error saving job:', error);
    throw error;
  }
};

// Remove a saved job
export const removeSavedJob = async (jobId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/user/saved-jobs/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error removing saved job:', error);
    throw error;
  }
};

// Get saved jobs for the current user
export const getSavedJobs = async (): Promise<Job[]> => {
  try {
    const response = await axios.get(`${API_URL}/user/saved-jobs`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    return [];
  }
};

export default {
  getAllJobs,
  getFeaturedJobs,
  searchJobs,
  getJobById,
  getJobsByFilter,
  applyToJob,
  saveJob,
  removeSavedJob,
  getSavedJobs
}; 