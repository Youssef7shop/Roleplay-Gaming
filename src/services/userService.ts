import { UserProfile, WhitelistStatus } from '../types';

const STORAGE_KEY = 'nexus_users';

const getLocalUsers = (): Record<string, UserProfile> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

const saveLocalUsers = (users: Record<string, UserProfile>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const users = getLocalUsers();
  return users[uid] || null;
};

export const createUserProfileOnRegistration = async (
  uid: string, 
  email: string, 
  username: string
): Promise<UserProfile> => {
  const users = getLocalUsers();
  
  const newProfile: UserProfile = {
    uid,
    username: username.trim(),
    displayName: username.trim(),
    email: email.toLowerCase().trim(),
    role: 'player',
    whitelistStatus: 'none',
    createdAt: new Date().toISOString() as any,
    updatedAt: new Date().toISOString() as any,
  };

  users[uid] = newProfile;
  saveLocalUsers(users);

  return newProfile;
};

export const checkHasAdmin = async (): Promise<boolean> => {
  const users = Object.values(getLocalUsers());
  return users.some(u => u.role === 'admin');
};

export const bootstrapFirstAdmin = async (uid: string): Promise<boolean> => {
  const hasAdmin = await checkHasAdmin();
  if (hasAdmin) return false;

  const users = getLocalUsers();
  if (users[uid]) {
    users[uid].role = 'admin';
    users[uid].updatedAt = new Date().toISOString() as any;
    saveLocalUsers(users);
    return true;
  }
  return false;
};

export const updateUserWhitelistStatus = async (uid: string, status: WhitelistStatus): Promise<void> => {
  const users = getLocalUsers();
  if (users[uid]) {
    users[uid].whitelistStatus = status;
    users[uid].updatedAt = new Date().toISOString() as any;
    saveLocalUsers(users);
  }
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  return Object.values(getLocalUsers());
};

export const promoteUserToAdmin = async (uid: string): Promise<void> => {
  const users = getLocalUsers();
  if (users[uid]) {
    users[uid].role = 'admin';
    users[uid].updatedAt = new Date().toISOString() as any;
    saveLocalUsers(users);
  }
};

export const demoteAdminToPlayer = async (uid: string): Promise<void> => {
  const users = getLocalUsers();
  if (users[uid]) {
    users[uid].role = 'player';
    users[uid].updatedAt = new Date().toISOString() as any;
    saveLocalUsers(users);
  }
};
