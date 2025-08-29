import { db } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';


export interface UserSettings {
  name: string;
  email: string;
  phone: string;
  location: string;
  profileVisibility: string;
  emailNotifications: boolean;
  shareApplicationStatus: boolean;
  desiredJobTitles: string;
  industryPreferences: string;
  remoteWork: boolean;
}

export interface JobData {
  id: string;
  Title: string;
  company: string;
  location: string;
  uploaded: string;
  description?: string;
  link: string;
  score: number;
  appliedAt?: Date;
  favoritedAt?: Date;
}

export interface UserDashboardData {
  appliedJobs: JobData[];
  favoriteJobs: JobData[];
  hasResume: boolean;
  skillsCompleted: boolean;
}

// Save user settings to Firestore
export const saveUserSettings = async (userId: string, settings: Partial<UserSettings>) => {
  try {
    console.log('💾 saveUserSettings called with:', { userId, settings });
    
    const userRef = doc(db, 'users', userId);
    console.log('💾 User document reference created');
    
    // Save the settings directly to the document
    await setDoc(userRef, { 
      settings: settings,
      lastUpdated: new Date(),
      userId: userId
    }, { merge: true });
    
    console.log('✅ User settings saved to Firestore successfully');
    
    // Verify the save by reading back the data
    const verifyDoc = await getDoc(userRef);
    if (verifyDoc.exists()) {
      const savedData = verifyDoc.data();
      console.log('🔍 Verification - saved data:', savedData);
      console.log('🔍 Verification - settings field:', savedData.settings);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error saving user settings:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Check for specific Firebase permission errors
    if (error.code === 'permission-denied') {
      console.error('🚫 PERMISSION DENIED: Check your Firestore security rules');
    } else if (error.code === 'unauthenticated') {
      console.error('🔐 UNAUTHENTICATED: User is not signed in');
    } else if (error.code === 'unavailable') {
      console.error('🌐 UNAVAILABLE: Firestore service is down');
    }
    
    return false;
  }
};

// Get user settings from Firestore
export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    console.log('📥 getUserSettings called for user:', userId);
    
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log('📥 Raw document data:', data);
      console.log('📥 Settings field:', data.settings);
      
      if (data.settings) {
        console.log('✅ Settings found, returning:', data.settings);
        return data.settings;
      } else {
        console.log('⚠️ No settings field found in document');
        return null;
      }
    } else {
      console.log('⚠️ User document does not exist');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting user settings:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Check for specific Firebase permission errors
    if (error.code === 'permission-denied') {
      console.error('🚫 PERMISSION DENIED: Check your Firestore security rules for users collection');
    } else if (error.code === 'unauthenticated') {
      console.error('🔐 UNAUTHENTICATED: User is not signed in');
    } else if (error.code === 'unavailable') {
      console.error('🌐 UNAVAILABLE: Firestore service is down');
    } else if (error.code === 'not-found') {
      console.error('🔍 NOT FOUND: User document does not exist');
    }
    
    return null;
  }
};

// Save applied job to Firestore
export const saveAppliedJob = async (userId: string, job: JobData) => {
  try {
    const appliedJob = {
      ...job,
      appliedAt: new Date(),
      userId: userId
    };
    
    const appliedJobsRef = collection(db, 'appliedJobs');
    await addDoc(appliedJobsRef, appliedJob);
    console.log('✅ Applied job saved to Firestore:', job.Title);
    return true;
  } catch (error) {
    console.error('❌ Error saving applied job:', error);
    return false;
  }
};

// Get all applied jobs for a user
export const getAppliedJobs = async (userId: string): Promise<JobData[]> => {
  try {
    const appliedJobsRef = collection(db, 'appliedJobs');
    const q = query(appliedJobsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const appliedJobs: JobData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      appliedJobs.push({
        id: data.id, // Use the job's id field, not the document id
        Title: data.Title,
        company: data.company,
        location: data.location,
        uploaded: data.uploaded,
        description: data.description,
        link: data.link,
        score: data.score,
        appliedAt: data.appliedAt?.toDate()
      });
    });
    
    console.log('📥 Applied jobs loaded from Firestore:', appliedJobs.length);
    return appliedJobs;
  } catch (error) {
    console.error('❌ Error getting applied jobs:', error);
    return [];
  }
};

// Save favorite job to Firestore
export const saveFavoriteJob = async (userId: string, job: JobData) => {
  try {
    const favoriteJob = {
      ...job,
      favoritedAt: new Date(),
      userId: userId
    };
    
    const favoriteJobsRef = collection(db, 'favoriteJobs');
    await addDoc(favoriteJobsRef, favoriteJob);
    console.log('❤️ Favorite job saved to Firestore:', job.Title);
    return true;
  } catch (error) {
    console.error('❌ Error saving favorite job:', error);
    return false;
  }
};

// Remove favorite job from Firestore
export const removeFavoriteJob = async (userId: string, jobId: string) => {
  try {
    const favoriteJobsRef = collection(db, 'favoriteJobs');
    const q = query(favoriteJobsRef, where('userId', '==', userId), where('id', '==', jobId));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    
    console.log('Favorite job removed from Firestore');
    return true;
  } catch (error) {
    console.error('Error removing favorite job:', error);
    return false;
  }
};

// Get all favorite jobs for a user
export const getFavoriteJobs = async (userId: string): Promise<JobData[]> => {
  try {
    const favoriteJobsRef = collection(db, 'favoriteJobs');
    const q = query(favoriteJobsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const favoriteJobs: JobData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      favoriteJobs.push({
        id: data.id, // Use the job's id field, not the document id
        Title: data.Title,
        company: data.company,
        location: data.location,
        uploaded: data.uploaded,
        description: data.description,
        link: data.link,
        score: data.score,
        favoritedAt: data.favoritedAt?.toDate()
      });
    });
    
    console.log('💖 Favorite jobs loaded from Firestore:', favoriteJobs.length);
    return favoriteJobs;
  } catch (error) {
    console.error('❌ Error getting favorite jobs:', error);
    return [];
  }
};

// Check if a job is favorited
export const isJobFavorited = async (userId: string, jobId: string): Promise<boolean> => {
  try {
    const favoriteJobsRef = collection(db, 'favoriteJobs');
    const q = query(favoriteJobsRef, where('userId', '==', userId), where('id', '==', jobId));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if job is favorited:', error);
    return false;
  }
};

// Save dashboard data to Firestore
export const saveDashboardData = async (userId: string, data: Partial<UserDashboardData>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { dashboardData: data }, { merge: true });
    console.log('Dashboard data saved to Firestore');
    return true;
  } catch (error) {
    console.error('Error saving dashboard data:', error);
    return false;
  }
};

// Get dashboard data from Firestore
export const getDashboardData = async (userId: string): Promise<UserDashboardData | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data()?.dashboardData || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    return null;
  }
};

// Real-time listener for user data changes
export const subscribeToUserData = (
  userId: string, 
  callback: (data: { settings: UserSettings | null; dashboardData: UserDashboardData | null }) => void
) => {
  const userRef = doc(db, 'users', userId);
  
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback({
        settings: data.settings || null,
        dashboardData: data.dashboardData || null
      });
    } else {
      callback({ settings: null, dashboardData: null });
    }
  });
};

// Real-time listener for applied jobs
export const subscribeToAppliedJobs = (
  userId: string, 
  callback: (jobs: JobData[]) => void
) => {
  const appliedJobsRef = collection(db, 'appliedJobs');
  const q = query(appliedJobsRef, where('userId', '==', userId));
  
  return onSnapshot(q, (querySnapshot) => {
    const appliedJobs: JobData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      appliedJobs.push({
        id: data.id, // Use the job's id field, not the document id
        Title: data.Title,
        company: data.company,
        location: data.location,
        uploaded: data.uploaded,
        description: data.description,
        link: data.link,
        score: data.score,
        appliedAt: data.appliedAt?.toDate()
      });
    });
    
    callback(appliedJobs);
  });
};

// Real-time listener for favorite jobs
export const subscribeToFavoriteJobs = (
  userId: string, 
  callback: (jobs: JobData[]) => void
) => {
  const favoriteJobsRef = collection(db, 'favoriteJobs');
  const q = query(favoriteJobsRef, where('userId', '==', userId));
  
  return onSnapshot(q, (querySnapshot) => {
    const favoriteJobs: JobData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      favoriteJobs.push({
        id: data.id, // Use the job's id field, not the document id
        Title: data.Title,
        company: data.company,
        location: data.location,
        uploaded: data.uploaded,
        description: data.description,
        link: data.link,
        score: data.score,
        favoritedAt: data.favoritedAt?.toDate()
      });
    });
    
    callback(favoriteJobs);
  });
};




