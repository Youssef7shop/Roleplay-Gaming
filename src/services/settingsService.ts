import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';

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
    const docRef = doc(db, 'settings', 'server');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...DEFAULT_SETTINGS, ...docSnap.data() } as ServerSettings;
    } else {
      await setDoc(docRef, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error('Error fetching settings from Firestore:', error);
    return DEFAULT_SETTINGS;
  }
};

export const subscribeToServerSettings = (callback: (settings: ServerSettings) => void) => {
  const docRef = doc(db, 'settings', 'server');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ ...DEFAULT_SETTINGS, ...docSnap.data() } as ServerSettings);
    } else {
      callback(DEFAULT_SETTINGS);
    }
  }, (error) => {
    console.error('Error listening to settings:', error);
  });
};

export const updateServerSettings = async (
  settings: Partial<ServerSettings>,
  adminUid: string
): Promise<void> => {
  try {
    const docRef = doc(db, 'settings', 'server');
    const updateData = { 
      ...settings, 
      updatedAt: new Date().toISOString(), 
      updatedBy: adminUid 
    };
    
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, { ...DEFAULT_SETTINGS, ...updateData });
    } else {
      await updateDoc(docRef, updateData);
    }
    
    await addActivityLog({
      action: 'SETTINGS_UPDATE',
      performedBy: adminUid,
      performedByName: 'Admin',
      details: 'Server & Whitelist settings updated.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

export const setWhitelistOpenStatus = async (
  isOpen: boolean, 
  adminUid: string,
  adminName: string
): Promise<void> => {
  try {
    const docRef = doc(db, 'settings', 'server');
    
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, { ...DEFAULT_SETTINGS, whitelistOpen: isOpen, updatedAt: new Date().toISOString(), updatedBy: adminUid });
    } else {
      await updateDoc(docRef, { 
        whitelistOpen: isOpen, 
        updatedAt: new Date().toISOString(), 
        updatedBy: adminUid 
      });
    }

    await addActivityLog({
      action: isOpen ? 'WHITELIST_OPENED' : 'WHITELIST_CLOSED',
      performedBy: adminUid,
      performedByName: adminName,
      details: `Whitelist status set to ${isOpen ? 'OPEN' : 'CLOSED'}.`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error toggling whitelist:', error);
    throw error;
  }
};

export const addActivityLog = async (log: ActivityLog): Promise<void> => {
  try {
    const logsRef = collection(db, 'whitelistLogs');
    await addDoc(logsRef, {
      ...log,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding activity log:', error);
  }
};

export const getActivityLogs = async (max: number = 50): Promise<ActivityLog[]> => {
  try {
    const logsRef = collection(db, 'whitelistLogs');
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(max));
    const querySnapshot = await getDocs(q);
    
    const logs: ActivityLog[] = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() } as ActivityLog);
    });
    
    return logs;
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return [];
  }
};
