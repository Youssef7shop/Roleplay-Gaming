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

const SETTINGS_KEY = 'nexus_settings';
const LOGS_KEY = 'nexus_logs';

const getLocalSettings = (): ServerSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

const saveLocalSettings = (s: ServerSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  // Dispatch a custom event so other components can listen to changes if needed
  window.dispatchEvent(new Event('nexus_settings_updated'));
};

const getLocalLogs = (): ActivityLog[] => {
  try {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalLogs = (logs: ActivityLog[]) => {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

export const getServerSettings = async (): Promise<ServerSettings> => {
  return getLocalSettings();
};

export const subscribeToServerSettings = (callback: (settings: ServerSettings) => void) => {
  // First initial call
  callback(getLocalSettings());

  // Listen to the custom event for local changes
  const handleUpdate = () => {
    callback(getLocalSettings());
  };

  window.addEventListener('nexus_settings_updated', handleUpdate);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener('nexus_settings_updated', handleUpdate);
  };
};

export const updateServerSettings = async (
  settings: Partial<ServerSettings>,
  adminUid: string
): Promise<void> => {
  const current = getLocalSettings();
  const next = { ...current, ...settings, updatedAt: new Date().toISOString(), updatedBy: adminUid };
  saveLocalSettings(next);
  
  await addActivityLog({
    action: 'SETTINGS_UPDATE',
    performedBy: adminUid,
    performedByName: 'Admin',
    details: 'Server & Whitelist settings updated.',
    timestamp: new Date().toISOString(),
  });
};

export const setWhitelistOpenStatus = async (
  isOpen: boolean, 
  adminUid: string,
  adminName: string
): Promise<void> => {
  const current = getLocalSettings();
  const next = { ...current, whitelistOpen: isOpen, updatedAt: new Date().toISOString(), updatedBy: adminUid };
  saveLocalSettings(next);
  
  await addActivityLog({
    action: isOpen ? 'WHITELIST_OPENED' : 'WHITELIST_CLOSED',
    performedBy: adminUid,
    performedByName: adminName,
    details: `Whitelist status set to ${isOpen ? 'OPEN' : 'CLOSED'}.`,
    timestamp: new Date().toISOString(),
  });
};

export const addActivityLog = async (log: ActivityLog): Promise<void> => {
  const logs = getLocalLogs();
  logs.unshift({ ...log, id: 'log_' + Date.now(), timestamp: new Date().toISOString() });
  saveLocalLogs(logs.slice(0, 50));
};

export const getActivityLogs = async (max: number = 50): Promise<ActivityLog[]> => {
  return getLocalLogs().slice(0, max);
};
