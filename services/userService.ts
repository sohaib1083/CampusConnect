import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export interface UserProfile {
  uid?: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  createdAt: string;
  updatedAt?: string;
  // Additional profile fields
  phoneNumber?: string;
  studentId?: string;
  major?: string;
  year?: string;
  bio?: string;
}

/**
 * Create user profile in Firestore
 */
export const createUserProfile = async (
  uid: string,
  profileData: Omit<UserProfile, 'uid' | 'updatedAt'>
) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...profileData,
      uid,
      createdAt: profileData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log('✅ User profile created');
  } catch (error: any) {
    console.error('❌ Create profile error:', error.message);
    throw error;
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error: any) {
    console.error('❌ Get profile error:', error.message);
    throw error;
  }
};

/**
 * Update user profile in Firestore
 */
export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    console.log('✅ User profile updated');
  } catch (error: any) {
    console.error('❌ Update profile error:', error.message);
    throw error;
  }
};

/**
 * Check if user profile exists
 */
export const userProfileExists = async (uid: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (error: any) {
    console.error('❌ Check profile error:', error.message);
    return false;
  }
};

/**
 * Search users by email
 */
export const searchUserByEmail = async (email: string): Promise<UserProfile | null> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as UserProfile;
    }
    return null;
  } catch (error: any) {
    console.error('❌ Search user error:', error.message);
    throw error;
  }
};
