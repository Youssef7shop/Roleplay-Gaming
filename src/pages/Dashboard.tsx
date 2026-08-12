import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  LogOut, 
  Settings, 
  Eye, 
  Calendar, 
  Briefcase, 
  PlusCircle,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { WhitelistApplication, WhitelistStatus } from '../types';
import { getUserLatestApplication } from '../services/whitelistService';
import { StatusBadge } from '../components/common/Badge';
import { formatDate } from '../utils/formatters';
import { CardSkeleton } from '../components/common/Skeleton';

export const Dashboard: React.FC = () => {
  const { user, userProfile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [latestApp, setLatestApp] = useState<WhitelistApplication | null>(null);
  const [loadingApp, setLoadingApp] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      if (user?.uid) {
        setLoadingApp(true);
        const app = await getUserLatestApplication(user.uid);
        setLatestApp(app);
        setLoadingApp(false);
      }
    };
    fetchApp();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const status: WhitelistStatus = latestApp?.status || userProfile?.whitelistStatus || 'none';

  return (
    <div className="space-y-8 py-4">
      
      {/* Welcome Banner */}
      <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                PLAYER PORTAL
              </span>
              {isAdmin && (
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" />
                  Admin
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              Welcome, <span className="text-cyan-400">{userProfile?.displayName || user?.displayName || 'Player'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
              Manage your NEXUS Roleplay server whitelist status, character dossier, and application details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/profile"
              className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Settings className="h-4 w-4 text-cyan-400" />
              Edit Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <LogOut className="h-4 w-4 text-rose-400" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Status Notice Banner */}
      {status === 'pending' && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4 shadow-lg shadow-amber-950/20">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <Clock className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wide">APPLICATION PENDING</h3>
            <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
              Your application is currently being reviewed by our server administrators. Please check back soon or keep an eye on Discord.
            </p>
          </div>
        </div>
      )}

      {status === 'accepted' && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-4 shadow-lg shadow-emerald-950/20">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wide">WHITELIST ACCEPTED</h3>
            <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
              Congratulations! Your whitelist application has been accepted. You are now cleared to join the game server!
            </p>
          </div>
        </div>
      )}

      {status === 'rejected' && (
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-4 shadow-lg shadow-rose-950/20">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
            <XCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-rose-300 uppercase tracking-wide">APPLICATION REJECTED</h3>
            <p className="text-xs text-rose-200/80 leading-relaxed">
              Your application was rejected by the review staff. You may submit a new application after reviewing server guidelines.
            </p>
            {latestApp?.adminNote && (
              <div className="mt-2 p-3 rounded-xl bg-slate-950/60 border border-rose-500/20 text-xs text-slate-300">
                <span className="font-bold text-rose-400 block mb-0.5">Admin Reviewer Note:</span>
                "{latestApp.adminNote}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Info Cards */}
      {loadingApp ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Whitelist Status */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>WHITELIST STATUS</span>
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <StatusBadge status={status} size="lg" />
            </div>
            <p className="text-[11px] text-slate-500">Official Server Access Clearance</p>
          </div>

          {/* Card 2: Application Date */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>SUBMISSION DATE</span>
              <Calendar className="h-4 w-4 text-cyan-400" />
            </div>
            <p className="text-lg font-extrabold text-slate-100">
              {latestApp ? formatDate(latestApp.submittedAt) : 'None'}
            </p>
            <p className="text-[11px] text-slate-500">Timestamp of last application</p>
          </div>

          {/* Card 3: Character Name */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>CHARACTER NAME</span>
              <User className="h-4 w-4 text-cyan-400" />
            </div>
            <p className="text-lg font-extrabold text-slate-100 truncate">
              {latestApp ? latestApp.characterName : 'Not Set'}
            </p>
            <p className="text-[11px] text-slate-500">In-game identity name</p>
          </div>

          {/* Card 4: Character Job */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>CHARACTER JOB</span>
              <Briefcase className="h-4 w-4 text-cyan-400" />
            </div>
            <p className="text-lg font-extrabold text-slate-100 truncate">
              {latestApp ? (latestApp.characterJob === 'Other' ? latestApp.customJob : latestApp.characterJob) : 'Not Set'}
            </p>
            <p className="text-[11px] text-slate-500">Requested role/profession</p>
          </div>

        </div>
      )}

      {/* Actions & Next Steps */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          Available Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          
          {/* Apply Button */}
          {status === 'pending' ? (
            <div className="px-6 py-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-bold flex items-center gap-2 cursor-not-allowed">
              <Clock className="h-4 w-4" />
              Application Under Review (Duplicates Blocked)
            </div>
          ) : (
            <Link
              to="/whitelist/apply"
              className="px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-lg shadow-cyan-500/20 text-xs tracking-wider uppercase transition-all flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              {status === 'none' ? 'Submit Whitelist Application' : 'Submit New Application'}
            </Link>
          )}

          {/* View Application Button */}
          {latestApp && (
            <Link
              to="/whitelist/application"
              className="px-6 py-3.5 rounded-xl font-bold text-slate-200 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs tracking-wider uppercase transition-all flex items-center gap-2"
            >
              <Eye className="h-4 w-4 text-cyan-400" />
              View Submitted Application
            </Link>
          )}

          <Link
            to="/profile"
            className="px-6 py-3.5 rounded-xl font-semibold text-slate-300 border border-slate-800 bg-slate-950 hover:bg-slate-900 text-xs tracking-wider uppercase transition-all flex items-center gap-2"
          >
            <User className="h-4 w-4 text-slate-400" />
            Edit Profile
          </Link>

        </div>
      </div>

    </div>
  );
};
