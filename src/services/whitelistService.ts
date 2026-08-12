import { WhitelistApplication, WhitelistStatus } from '../types';

const STORAGE_KEY = 'nexus_whitelist_apps';

const getLocalApps = (): WhitelistApplication[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalApps = (apps: WhitelistApplication[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
};

export const submitWhitelistApplication = async (
  data: Omit<WhitelistApplication, 'id' | 'status' | 'submittedAt'>
): Promise<string> => {
  const existingPending = await getUserPendingApplication(data.userId);
  if (existingPending) {
    throw new Error('You already have a pending application under review.');
  }

  const newApp: WhitelistApplication = {
    ...data,
    id: 'app_' + Date.now(),
    status: 'pending',
    submittedAt: new Date().toISOString() as any,
  };

  const apps = getLocalApps();
  apps.push(newApp);
  saveLocalApps(apps);

  return newApp.id;
};

export const getUserPendingApplication = async (userId: string): Promise<WhitelistApplication | null> => {
  const apps = getLocalApps();
  return apps.find(a => a.userId === userId && a.status === 'pending') || null;
};

export const getUserLatestApplication = async (userId: string): Promise<WhitelistApplication | null> => {
  const apps = getLocalApps();
  const userApps = apps.filter(a => a.userId === userId);
  if (!userApps.length) return null;
  return userApps.sort((a, b) => new Date(b.submittedAt as any).getTime() - new Date(a.submittedAt as any).getTime())[0];
};

export const getAllApplications = async (): Promise<WhitelistApplication[]> => {
  const apps = getLocalApps();
  return apps.sort((a, b) => new Date(b.submittedAt as any).getTime() - new Date(a.submittedAt as any).getTime());
};

export const getApplicationById = async (id: string): Promise<WhitelistApplication | null> => {
  const apps = getLocalApps();
  return apps.find(a => a.id === id) || null;
};

export const reviewApplication = async (
  id: string,
  status: 'accepted' | 'rejected',
  reviewerUid: string,
  reviewerName: string,
  adminNote?: string
): Promise<void> => {
  const apps = getLocalApps();
  const appIndex = apps.findIndex(a => a.id === id);
  if (appIndex === -1) throw new Error('Application not found');

  apps[appIndex] = {
    ...apps[appIndex],
    status,
    reviewedAt: new Date().toISOString() as any,
    reviewedBy: reviewerUid,
    reviewerName: reviewerName || 'Admin',
    adminNote: adminNote || (status === 'accepted' ? 'Welcome to the server!' : 'Application did not meet requirements.'),
  };

  saveLocalApps(apps);
};
