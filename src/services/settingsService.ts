import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface ServerSettings {
  whitelistOpen: boolean;
  minBackstoryLength: number;
  minRealAge: number;
  serverName: string;
  serverIp: string;
  discordUrl: string;
  rulesUrl: string;
  updatedAt?: any;
  updatedBy?: string;
}

export interface ActivityLog {
  id?: string;
  action: string;
  performedBy: string;
  performedByName: string;
  targetUser?: string;
  details?: string;
  timestamp: any;
}

const DEFAULT_SETTINGS: ServerSettings = {
  whitelistOpen: true,
  minBackstoryLength: 200,
  minRealAge: 16,
  serverName: 'NEXUS Roleplay',
  serverIp: 'connect.nexusrp.gg',
  discordUrl: 'https://discord.gg/nexusrp',
  rulesUrl: 'https://nexusrp.gg/rules',
};

export const getServerSettings = async (): Promise<ServerSettings> => {
  try {
    const docRef = doc(db, 'settings', 'whitelist');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...DEFAULT_SETTINGS, ...snap.data() } as ServerSettings;
    }
    // Initialize default settings if doc does not exist
    await setDoc(docRef, { ...DEFAULT_SETTINGS, updatedAt: serverTimestamp() });
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error fetching server settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const updateServerSettings = async (
  settings: Partial<ServerSettings>,
  adminUid: string
): Promise<void> => {
  const docRef = doc(db, 'settings', 'whitelist');
  await setDoc(
    docRef, 
    { ...settings, updatedAt: serverTimestamp(), updatedBy: adminUid }, 
    { merge: true }
  );

  await addActivityLog({
    action: 'SETTINGS_UPDATE',
    performedBy: adminUid,
    performedByName: 'Admin',
    details: 'Server & Whitelist settings updated.',
    timestamp: serverTimestamp(),
  });
};

export const setWhitelistOpenStatus = async (
  isOpen: boolean, 
  adminUid: string,
  adminName: string
): Promise<void> => {
  const docRef = doc(db, 'settings', 'whitelist');
  await setDoc(
    docRef, 
    { whitelistOpen: isOpen, updatedAt: serverTimestamp(), updatedBy: adminUid }, 
    { merge: true }
  );

  await addActivityLog({
    action: isOpen ? 'WHITELIST_OPENED' : 'WHITELIST_CLOSED',
    performedBy: adminUid,
    performedByName: adminName,
    details: `Whitelist status set to ${isOpen ? 'OPEN' : 'CLOSED'}.`,
    timestamp: serverTimestamp(),
  });
};

export const addActivityLog = async (log: ActivityLog): Promise<void> => {
  try {
    const logsCol = collection(db, 'whitelistLogs');
    await addDoc(logsCol, log);
  } catch (error) {
    console.error('Error adding activity log:', error);
  }
};

export const getActivityLogs = async (max: number = 50): Promise<ActivityLog[]> => {
  try {
    const logsCol = collection(db, 'whitelistLogs');
    const q = query(logsCol, orderBy('timestamp', 'desc'), limit(max));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ActivityLog));
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return [];
  }
};
