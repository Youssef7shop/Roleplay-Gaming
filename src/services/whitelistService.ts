import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { WhitelistApplication, WhitelistStatus } from '../types';
import { updateUserWhitelistStatus } from './userService';
import { approveWhitelistOnGameServer, revokeWhitelistOnGameServer } from './gameServerService';

const COLLECTION_NAME = 'whitelistApplications';

export const submitWhitelistApplication = async (
  data: Omit<WhitelistApplication, 'id' | 'status' | 'submittedAt'>
): Promise<string> => {
  // Check if user already has a pending application
  const existingPending = await getUserPendingApplication(data.userId);
  if (existingPending) {
    throw new Error('You already have a pending application under review.');
  }

  const appCol = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(appCol, {
    ...data,
    status: 'pending' as WhitelistStatus,
    submittedAt: serverTimestamp(),
  });

  // Also update user's profile whitelistStatus
  await updateUserWhitelistStatus(data.userId, 'pending');

  return docRef.id;
};

export const getUserPendingApplication = async (userId: string): Promise<WhitelistApplication | null> => {
  try {
    const appCol = collection(db, COLLECTION_NAME);
    const q = query(
      appCol, 
      where('userId', '==', userId), 
      where('status', '==', 'pending')
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as WhitelistApplication;
    }
    return null;
  } catch (error) {
    console.error('Error checking pending application:', error);
    return null;
  }
};

export const getUserLatestApplication = async (userId: string): Promise<WhitelistApplication | null> => {
  try {
    const appCol = collection(db, COLLECTION_NAME);
    const q = query(
      appCol, 
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;

    // Client-side sort by submittedAt descending to guarantee order
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as WhitelistApplication));
    list.sort((a, b) => {
      const tA = a.submittedAt?.toDate ? a.submittedAt.toDate().getTime() : (a.submittedAt || 0);
      const tB = b.submittedAt?.toDate ? b.submittedAt.toDate().getTime() : (b.submittedAt || 0);
      return tB - tA;
    });

    return list[0] || null;
  } catch (error) {
    console.error('Error fetching user application:', error);
    return null;
  }
};

export const getAllApplications = async (): Promise<WhitelistApplication[]> => {
  try {
    const appCol = collection(db, COLLECTION_NAME);
    const snap = await getDocs(appCol);
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as WhitelistApplication));
    
    list.sort((a, b) => {
      const tA = a.submittedAt?.seconds ? a.submittedAt.seconds : (a.submittedAt ? new Date(a.submittedAt).getTime() : 0);
      const tB = b.submittedAt?.seconds ? b.submittedAt.seconds : (b.submittedAt ? new Date(b.submittedAt).getTime() : 0);
      return tB - tA;
    });

    return list;
  } catch (error) {
    console.error('Error fetching all applications:', error);
    return [];
  }
};

export const getApplicationById = async (id: string): Promise<WhitelistApplication | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as WhitelistApplication;
    }
    return null;
  } catch (error) {
    console.error('Error fetching application by id:', error);
    return null;
  }
};

export const reviewApplication = async (
  id: string,
  status: 'accepted' | 'rejected',
  reviewerUid: string,
  reviewerName: string,
  adminNote?: string
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const appSnap = await getDoc(docRef);
  if (!appSnap.exists()) {
    throw new Error('Application not found');
  }

  const appData = { id: appSnap.id, ...appSnap.data() } as WhitelistApplication;

  await updateDoc(docRef, {
    status,
    reviewedAt: serverTimestamp(),
    reviewedBy: reviewerUid,
    reviewerName: reviewerName || 'Admin',
    adminNote: adminNote || (status === 'accepted' ? 'Welcome to the server!' : 'Application did not meet requirements.'),
  });

  // Update applicant user's whitelist status
  await updateUserWhitelistStatus(appData.userId, status);

  // Trigger optional game server integration hook
  if (status === 'accepted') {
    await approveWhitelistOnGameServer(appData);
  } else {
    await revokeWhitelistOnGameServer(appData);
  }
};
