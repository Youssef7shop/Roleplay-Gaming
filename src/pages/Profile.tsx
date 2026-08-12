import React, { useState } from 'react';
import { Shield, User, Mail, ShieldAlert, Key, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { promoteUserToAdmin } from '../services/userService';
import { useToast } from '../components/common/Toast';

export const Profile: React.FC = () => {
  const { user, userProfile, isAdmin, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [claimingAdmin, setClaimingAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [showAdminPanelSetup, setShowAdminPanelSetup] = useState(false);

  const handleClaimAdmin = async () => {
    if (!user?.uid) return;
    setClaimingAdmin(true);
    try {
      await promoteUserToAdmin(user.uid);
      await refreshProfile();
      showToast('Admin privileges granted to your user profile!', 'success');
      setShowAdminPanelSetup(false);
    } catch (err: any) {
      console.error('Error claiming admin:', err);
      showToast('Failed to promote to admin.', 'error');
    } finally {
      setClaimingAdmin(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      
      {/* Title Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-3">
          <User className="h-8 w-8 text-cyan-400" />
          Player Account Settings
        </h1>
        <p className="text-xs text-slate-400">
          Manage your personal profile details, account credentials, and system roles.
        </p>
      </div>

      {/* Main Profile Info Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-xl">
        
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="h-16 w-16 rounded-full border-2 border-cyan-500/40 object-cover" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-cyan-500/20 text-cyan-400 font-black text-xl flex items-center justify-center border border-cyan-500/30">
              {userProfile?.displayName?.[0] || 'P'}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-slate-100">{userProfile?.displayName || user?.displayName || 'Player'}</h2>
            <p className="text-xs text-slate-400">{userProfile?.email || user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                Role: {userProfile?.role || 'player'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                Whitelist: {userProfile?.whitelistStatus || 'none'}
              </span>
            </div>
          </div>
        </div>

        {/* User Identifiers */}
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-semibold block">User Unique ID (UID)</span>
              <code className="text-slate-300 text-[11px] font-mono break-all">{user?.uid}</code>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-semibold block">Registered Email</span>
              <span className="text-slate-200 font-medium">{user?.email}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Admin Setup Section */}
      <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">ADMINISTRATION ACCESS SETUP</h3>
              <p className="text-xs text-slate-400">First-time administrator setup & permissions configuration</p>
            </div>
          </div>
          {isAdmin ? (
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 uppercase">
              Admin Active
            </span>
          ) : (
            <button
              onClick={() => setShowAdminPanelSetup(!showAdminPanelSetup)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-amber-300 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 transition-all"
            >
              Setup Admin Role
            </button>
          )}
        </div>

        {isAdmin ? (
          <p className="text-xs text-slate-300 leading-relaxed">
            Your account is currently registered as a <span className="font-bold text-amber-400">Server Administrator</span>. You have access to the Admin Dashboard at <code className="text-amber-300">/admin</code> to review whitelist applications.
          </p>
        ) : (
          showAdminPanelSetup && (
            <div className="pt-4 border-t border-amber-500/20 space-y-4 animate-in fade-in duration-200">
              <p className="text-xs text-slate-300 leading-relaxed">
                If you are the server owner or lead administrator initializing this portal, click below to claim Admin rights for your current logged-in account in Firestore.
              </p>

              <button
                onClick={handleClaimAdmin}
                disabled={claimingAdmin}
                className="px-6 py-3 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <Key className="h-4 w-4" />
                {claimingAdmin ? 'Promoting Account...' : 'Promote Account to Admin Role'}
              </button>
            </div>
          )
        )}
      </div>

    </div>
  );
};
