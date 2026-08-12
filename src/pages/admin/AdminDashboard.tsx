import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight, 
  Users, 
  ShieldAlert,
  ChevronRight,
  Power,
  Sparkles
} from 'lucide-react';
import { WhitelistApplication } from '../../types';
import { getAllApplications } from '../../services/whitelistService';
import { getAllUsers } from '../../services/userService';
import { getServerSettings, setWhitelistOpenStatus, ServerSettings } from '../../services/settingsService';
import { formatDate } from '../../utils/formatters';
import { CardSkeleton } from '../../components/common/Skeleton';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_ROUTES } from '../../config/constants';

export const AdminDashboard: React.FC = () => {
  const { userProfile, user } = useAuth();
  const { showToast } = useToast();

  const [apps, setApps] = useState<WhitelistApplication[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [settings, setSettings] = useState<ServerSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toggling, setToggling] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    const [applications, usersList, serverConfig] = await Promise.all([
      getAllApplications(),
      getAllUsers(),
      getServerSettings(),
    ]);
    setApps(applications);
    setTotalUsers(usersList.length);
    setSettings(serverConfig);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalApps = apps.length;
  const pendingApps = apps.filter((a) => a.status === 'pending');
  const acceptedApps = apps.filter((a) => a.status === 'accepted');
  const rejectedApps = apps.filter((a) => a.status === 'rejected');

  const recentPending = pendingApps.slice(0, 5);

  const handleToggleWhitelist = async () => {
    if (!settings || !user) return;
    setToggling(true);
    const nextStatus = !settings.whitelistOpen;
    try {
      await setWhitelistOpenStatus(
        nextStatus, 
        user.uid, 
        userProfile?.displayName || 'Admin'
      );
      setSettings((prev) => prev ? { ...prev, whitelistOpen: nextStatus } : null);
      showToast(`Whitelist is now ${nextStatus ? 'OPEN' : 'CLOSED'}!`, nextStatus ? 'success' : 'info');
    } catch (err) {
      console.error('Failed to toggle whitelist:', err);
      showToast('Failed to change whitelist status.', 'error');
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Admin Title & Whitelist Toggle Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="h-3.5 w-3.5" />
            ADMINISTRATION OVERVIEW
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight">
            NEXUS STAFF CONTROL
          </h1>
          <p className="text-xs text-slate-400">
            Monitor real-time metrics, review player dossiers, and control server whitelist intake.
          </p>
        </div>

        {/* Whitelist Status Box */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Whitelist Status
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-block h-3 w-3 rounded-full ${settings?.whitelistOpen ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]'}`} />
              <span className={`font-black text-sm tracking-wider uppercase ${settings?.whitelistOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
                {settings?.whitelistOpen ? 'OPEN 🟢' : 'CLOSED 🔴'}
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleWhitelist}
            disabled={toggling || loading}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              settings?.whitelistOpen
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
            } disabled:opacity-50`}
          >
            <Power className="h-4 w-4" />
            {settings?.whitelistOpen ? 'CLOSE WHITELIST' : 'OPEN WHITELIST'}
          </button>
        </div>
      </div>

      {/* 5 Statistics Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Total Users */}
          <Link
            to={ADMIN_ROUTES.USERS}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2 hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              <span>Total Users</span>
              <div className="p-2 rounded-lg bg-slate-800 text-cyan-400 group-hover:scale-110 transition-transform">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-100">{totalUsers}</p>
            <p className="text-[10px] text-slate-500">Registered accounts</p>
          </Link>

          {/* Total Applications */}
          <Link
            to={ADMIN_ROUTES.APPLICATIONS}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2 hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              <span>Total Applications</span>
              <div className="p-2 rounded-lg bg-slate-800 text-blue-400 group-hover:scale-110 transition-transform">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-100">{totalApps}</p>
            <p className="text-[10px] text-slate-500">Submitted dossiers</p>
          </Link>

          {/* Pending Applications WITH NOTIFICATION BADGE */}
          <Link
            to={ADMIN_ROUTES.PENDING}
            className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 space-y-2 hover:bg-amber-500/20 transition-all group relative overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.1)]"
          >
            <div className="flex items-center justify-between text-[11px] font-extrabold text-amber-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                Pending Apps
                {pendingApps.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] animate-pulse">
                    {pendingApps.length} NEW
                  </span>
                )}
              </span>
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                <Clock className="h-4 w-4 animate-pulse" />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-300">{pendingApps.length}</p>
            <p className="text-[10px] text-amber-400/80">Requires staff decision</p>
          </Link>

          {/* Accepted Applications */}
          <Link
            to={ADMIN_ROUTES.ACCEPTED}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-2 hover:bg-emerald-500/10 transition-all group"
          >
            <div className="flex items-center justify-between text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider">
              <span>Accepted Apps</span>
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-300">{acceptedApps.length}</p>
            <p className="text-[10px] text-emerald-400/80">Approved players</p>
          </Link>

          {/* Rejected Applications */}
          <Link
            to={ADMIN_ROUTES.REJECTED}
            className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 space-y-2 hover:bg-rose-500/10 transition-all group"
          >
            <div className="flex items-center justify-between text-[11px] font-extrabold text-rose-400 uppercase tracking-wider">
              <span>Rejected Apps</span>
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
                <XCircle className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-rose-300">{rejectedApps.length}</p>
            <p className="text-[10px] text-rose-400/80">Denied applications</p>
          </Link>

        </div>
      )}

      {/* Pending Queue Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              Pending Applications Queue
            </h2>
            <p className="text-xs text-slate-400">Review dossiers requiring staff action</p>
          </div>

          <Link
            to={ADMIN_ROUTES.PENDING}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            View All Pending
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {recentPending.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
            No pending applications in queue. Whitelist queue is clear!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Character Name</th>
                  <th className="py-3 px-4">Job Choice</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {recentPending.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{app.fullName}</div>
                      <div className="text-[11px] text-cyan-400">{app.discordUsername}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 font-semibold">{app.characterName}</td>
                    <td className="py-3.5 px-4 text-slate-300">{app.characterJob}</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(app.submittedAt)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`${ADMIN_ROUTES.APPLICATIONS}/${app.id}`}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-[11px] uppercase tracking-wider hover:bg-amber-300 transition-all"
                      >
                        OPEN DOSSIER
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
