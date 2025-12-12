import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebaseConfig';

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  studentId?: string;
  createdAt?: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string, studentId?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await handleUserAuthenticated(firebaseUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleUserAuthenticated = async (firebaseUser: FirebaseUser) => {
    try {
      // Get user document from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || userData.displayName || '',
          photoURL: firebaseUser.photoURL || userData.photoURL,
          studentId: userData.studentId,
          createdAt: userData.createdAt?.toDate(),
        });
      } else {
        // Create new user document if it doesn't exist
        const newUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: new Date(),
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...newUser,
          createdAt: serverTimestamp(),
        });
        
        setUser(newUser);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || undefined,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const signup = async (email: string, password: string, displayName: string, studentId?: string) => {
    try {
      console.log('� Creating user account...');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ User created successfully:', result.user.uid);
      
      // Create user document in Firestore
      try {
        const userDocData = {
          uid: result.user.uid,
          email,
          displayName,
          studentId: studentId || null,
          createdAt: serverTimestamp(),
          photoURL: null,
        };
        
        await setDoc(doc(db, 'users', result.user.uid), userDocData);
        console.log('✅ User profile saved to Firestore');
      } catch (firestoreError: any) {
        console.warn('⚠️ Profile save failed (continuing):', firestoreError.code);
        // Continue - user is authenticated even if profile save fails
      }
    } catch (error: any) {
      console.error('❌ Signup failed:', error.code);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await setDoc(doc(db, 'users', user.uid), data, { merge: true });
      setUser({ ...user, ...data });
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to get user-friendly error messages
function getAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/configuration-not-found':
      return 'Firebase authentication is not properly configured. Please check your Firebase project settings.';
    case 'auth/project-not-found':
      return 'Firebase project not found. Please check your configuration.';
    case 'auth/api-key-not-valid':
      return 'Invalid Firebase API key. Please check your configuration.';
    case 'permission-denied':
      return 'Database access denied. Please enable Firestore database in Firebase Console.';
    default:
      return `Authentication error (${code}): Please try again or contact support.`;
  }
}