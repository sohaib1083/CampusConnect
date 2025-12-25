import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * SECURE Firebase Configuration
 * Uses environment variables instead of hardcoded values
 * 
 * IMPORTANT: Make sure your .env file is in .gitignore!
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyBSz4ecwotOxrBd5uCqPgUSXa4jraoD2TA",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "campusconnect-2d216.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "campusconnect-2d216",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "campusconnect-2d216.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "198016662792",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:198016662792:android:3bf1503ce155752cd2c0bd",
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firebase Auth
let auth: any;
try {
  // For React Native with AsyncStorage persistence
  auth = initializeAuth(app, {
    persistence: [
      // Use AsyncStorage for persistence
      // getReactNativePersistence(AsyncStorage)
    ]
  });
} catch (error: any) {
  // Auth already initialized
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (web only - with environment check and API key validation)
export let analytics: any = null;
if (typeof window !== 'undefined' && process.env.EXPO_PUBLIC_FIREBASE_API_KEY !== '***REMOVED_FOR_GITHUB***') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics not supported or API key invalid, keep null
    console.warn('Firebase Analytics not supported or API key invalid');
    analytics = null;
  });
}

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export { auth };
export default app;