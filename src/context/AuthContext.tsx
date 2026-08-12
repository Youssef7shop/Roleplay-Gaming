import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithEmail: (e: string, p: string) => Promise<UserProfile | null>;
  registerWithEmail: (e: string, p: string, username: string) => Promise<void>;
  resetPassword: (e: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    // In local mode, nothing to refresh
  };

  useEffect(() => {
    // Check localStorage on mount
    const localUserStr = localStorage.getItem('nexus_auth_user');
    if (localUserStr) {
      try {
        const localUser = JSON.parse(localUserStr);
        setUser(localUser);
        setUserProfile(localUser);
      } catch (e) {
        console.error('Failed to parse local user', e);
      }
    }
    setLoading(false);
  }, []);

  const loginWithEmail = async (email: string, pass: string): Promise<UserProfile | null> => {
    setLoading(true);
    try {
      const emailLower = email.toLowerCase().trim();
      const isAdminAccount = 
        emailLower === 'heitem.rais71.gmail.com' || 
        emailLower === 'heitem.rais71@gmail.com' ||
        emailLower === 'haitamraiss71@gmail.com';
      const userRole = isAdminAccount ? 'admin' : 'player';

      const mockProfile: UserProfile = {
        uid: isAdminAccount ? 'local_admin_' + Date.now() : 'local_player_' + Date.now(),
        email: emailLower,
        displayName: isAdminAccount ? 'Nexus Admin' : 'Nexus Player',
        role: userRole,
        whitelistStatus: 'accepted',
        createdAt: new Date().toISOString()
      };
      
      setUser(mockProfile);
      setUserProfile(mockProfile);
      localStorage.setItem('nexus_auth_user', JSON.stringify(mockProfile));
      
      return mockProfile;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, username: string) => {
    setLoading(true);
    try {
      const emailLower = email.toLowerCase().trim();
      const isAdminAccount = 
        emailLower === 'heitem.rais71.gmail.com' || 
        emailLower === 'heitem.rais71@gmail.com' ||
        emailLower === 'haitamraiss71@gmail.com';
      const userRole = isAdminAccount ? 'admin' : 'player';

      const mockProfile: UserProfile = {
        uid: isAdminAccount ? 'local_admin_' + Date.now() : 'local_player_' + Date.now(),
        email: emailLower,
        displayName: username.trim(),
        role: userRole,
        whitelistStatus: isAdminAccount ? 'accepted' : 'none',
        createdAt: new Date().toISOString()
      };
      
      setUser(mockProfile);
      setUserProfile(mockProfile);
      localStorage.setItem('nexus_auth_user', JSON.stringify(mockProfile));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    // No-op for local storage
  };

  const logout = async () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('nexus_auth_user');
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAdmin,
        loginWithEmail,
        registerWithEmail,
        resetPassword,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
