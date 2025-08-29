import { saveAppliedJob, saveFavoriteJob, removeFavoriteJob, isJobFavorited } from './userDataService';

export interface Job {
  id: string;
  Title: string;
  company: string;
  location: string;
  uploaded: string;
  description?: string;
  link: string;
  score: number;
}

// Apply to a job
export const applyToJob = async (userId: string, job: Job) => {
  try {
    const success = await saveAppliedJob(userId, job);
    if (success) {
      console.log('Successfully applied to job:', job.Title);
      return true;
    } else {
      console.error('Failed to apply to job:', job.Title);
      return false;
    }
  } catch (error) {
    console.error('Error applying to job:', error);
    return false;
  }
};

// Toggle favorite status for a job
export const toggleFavoriteJob = async (userId: string, job: Job) => {
  try {
    const isFavorited = await isJobFavorited(userId, job.id);
    
    if (isFavorited) {
      // Remove from favorites
      const success = await removeFavoriteJob(userId, job.id);
      if (success) {
        console.log('Successfully removed job from favorites:', job.Title);
        return { success: true, favorited: false };
      } else {
        console.error('Failed to remove job from favorites:', job.Title);
        return { success: false, favorited: true };
      }
    } else {
      // Add to favorites
      const success = await saveFavoriteJob(userId, job);
      if (success) {
        console.log('Successfully added job to favorites:', job.Title);
        return { success: true, favorited: true };
      } else {
        console.error('Failed to add job to favorites:', job.Title);
        return { success: false, favorited: false };
      }
    }
  } catch (error) {
    console.error('Error toggling favorite job:', error);
    return { success: false, favorited: false };
  }
};

// Check if a job is favorited
export const checkIfJobFavorited = async (userId: string, jobId: string) => {
  try {
    return await isJobFavorited(userId, jobId);
  } catch (error) {
    console.error('Error checking if job is favorited:', error);
    return false;
  }
};
