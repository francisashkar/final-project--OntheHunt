import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '@/lib/firebase';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
    } catch (error: any) {
      let errorMessage = 'Failed to sign in';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      if (result.user) {
        await updateProfile(result.user, {
          displayName: name
        });
      }
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      let errorMessage = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in with Google successfully!');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in popup was closed');
      } else {
        toast.error('Failed to sign in with Google');
      }
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      toast.success('Signed in with GitHub successfully!');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in popup was closed');
      } else {
        toast.error('Failed to sign in with GitHub');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox');
    } catch (error: any) {
      let errorMessage = 'Failed to send reset email';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
