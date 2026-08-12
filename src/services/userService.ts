import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  collection, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { UserProfile, WhitelistStatus } from '../types';

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const createUserProfileOnRegistration = async (
  uid: string, 
  email: string, 
  username: string
): Promise<UserProfile> => {
  const userRef = doc(db, 'users', uid);
  
  const newProfile: UserProfile = {
    uid,
    username: username.trim(),
    displayName: username.trim(),
    email: email.toLowerCase().trim(),
    role: 'player', // ALWAYS 'player' on registration
    whitelistStatus: 'none',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userRef, newProfile);
  return {
    ...newProfile,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const checkHasAdmin = async (): Promise<boolean> => {
  try {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where('role', '==', 'admin'));
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (error) {
    console.error('Error checking admin presence:', error);
    return false;
  }
};

export const bootstrapFirstAdmin = async (uid: string): Promise<boolean> => {
  try {
    const hasAdmin = await checkHasAdmin();
    if (hasAdmin) {
      console.warn('Admin already exists. Bootstrap aborted.');
      return false;
    }

    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      role: 'admin',
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error bootstrapping first admin:', error);
    return false;
  }
};

export const updateUserWhitelistStatus = async (uid: string, status: WhitelistStatus): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    whitelistStatus: status,
    updatedAt: serverTimestamp(),
  });
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const usersCol = collection(db, 'users');
    const snap = await getDocs(usersCol);
    return snap.docs.map(doc => doc.data() as UserProfile);
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

export const promoteUserToAdmin = async (uid: string): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    role: 'admin',
    updatedAt: serverTimestamp(),
  });
};

export const demoteAdminToPlayer = async (uid: string): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    role: 'player',
    updatedAt: serverTimestamp(),
  });
};
