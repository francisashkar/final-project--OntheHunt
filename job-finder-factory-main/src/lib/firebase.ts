import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb08DAGtOvfAm5OXh_uIIPgdloGsYwnhY",
  authDomain: "onthehunt-2dc29.firebaseapp.com",
  projectId: "onthehunt-2dc29",
  storageBucket: "onthehunt-2dc29.firebasestorage.app",
  messagingSenderId: "920539186338",
  appId: "1:920539186338:web:ade4ff5c70bacce5bb43fb",
  measurementId: "G-H4YQ1PGY12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics (optional - only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.log('Analytics not available:', error);
  }
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);



// Export analytics
export { analytics };

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
