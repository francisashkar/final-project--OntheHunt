import { saveUserSettings, saveAppliedJob, saveFavoriteJob, saveDashboardData } from './userDataService';

// Migrate localStorage data to Firebase Firestore
export const migrateLocalStorageToFirebase = async (userId: string) => {
  try {
    console.log('Starting migration of localStorage data to Firebase for user:', userId);
    
    // Migrate user settings
    const userSettingsKey = `userSettings_${userId}`;
    const savedSettings = localStorage.getItem(userSettingsKey);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        await saveUserSettings(userId, parsedSettings);
        console.log('Migrated user settings to Firebase');
        
        // Remove from localStorage after successful migration
        localStorage.removeItem(userSettingsKey);
      } catch (error) {
        console.error('Error migrating user settings:', error);
      }
    }
    
    // Migrate dashboard data
    const dashboardDataKey = `dashboardData_${userId}`;
    const savedDashboardData = localStorage.getItem(dashboardDataKey);
    if (savedDashboardData) {
      try {
        const parsedDashboardData = JSON.parse(savedDashboardData);
        await saveDashboardData(userId, parsedDashboardData);
        console.log('Migrated dashboard data to Firebase');
        
        // Remove from localStorage after successful migration
        localStorage.removeItem(dashboardDataKey);
      } catch (error) {
        console.error('Error migrating dashboard data:', error);
      }
    }
    
    // Migrate applied jobs (these are stored in a different format)
    const appliedJobsKey = `appliedJobs_${userId}`;
    const savedAppliedJobs = localStorage.getItem(appliedJobsKey);
    if (savedAppliedJobs) {
      try {
        const parsedAppliedJobs = JSON.parse(savedAppliedJobs);
        for (const job of parsedAppliedJobs) {
          await saveAppliedJob(userId, job);
        }
        console.log('Migrated applied jobs to Firebase');
        
        // Remove from localStorage after successful migration
        localStorage.removeItem(appliedJobsKey);
      } catch (error) {
        console.error('Error migrating applied jobs:', error);
      }
    }
    
    // Migrate favorite jobs (these are stored in a different format)
    const favoriteJobsKey = `favoriteJobs_${userId}`;
    const savedFavoriteJobs = localStorage.getItem(favoriteJobsKey);
    if (savedFavoriteJobs) {
      try {
        const parsedFavoriteJobs = JSON.parse(savedFavoriteJobs);
        for (const job of parsedFavoriteJobs) {
          await saveFavoriteJob(userId, job);
        }
        console.log('Migrated favorite jobs to Firebase');
        
        // Remove from localStorage after successful migration
        localStorage.removeItem(favoriteJobsKey);
      } catch (error) {
        console.error('Error migrating favorite jobs:', error);
      }
    }
    
    // Clean up any remaining old localStorage keys
    const keysToRemove = [
      'dashboardData',
      'userSettings',
      'auth_token',
      'user_name',
      'user_email'
    ];
    
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key) && !key.includes('_')) {
        localStorage.removeItem(key);
        console.log('Removed old localStorage key:', key);
      }
    });
    
    console.log('Migration completed successfully');
    return true;
    
  } catch (error) {
    console.error('Error during migration:', error);
    return false;
  }
};

// Check if user has data that needs migration
export const needsMigration = (userId: string): boolean => {
  const keysToCheck = [
    `userSettings_${userId}`,
    `dashboardData_${userId}`,
    `appliedJobs_${userId}`,
    `favoriteJobs_${userId}`,
    'dashboardData',
    'userSettings'
  ];
  
  return keysToCheck.some(key => localStorage.getItem(key) !== null);
};
