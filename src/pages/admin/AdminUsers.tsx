import React, { useEffect, useState } from 'react';
import { Users, ShieldAlert, ShieldCheck, Mail, Calendar, Key, Search, UserMinus } from 'lucide-react';
import { UserProfile } from '../../types';
import { getAllUsers, promoteUserToAdmin, demoteAdminToPlayer } from '../../services/userService';
import { StatusBadge } from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../components/common/Toast';
import { CardSkeleton } from '../../components/common/Skeleton';
import { useAuth } from '../../hooks/useAuth';

export const AdminUsers: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getAllUsers();
    setUsersList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromote = async (uid: string, name: string) => {
    if (window.confirm(`Are you sure you want to promote ${name} to Admin?`)) {
      try {
        await promoteUserToAdmin(uid);
        showToast(`Promoted ${name} to Admin!`, 'success');
        fetchUsers();
      } catch (err: any) {
        console.error('Error promoting user:', err);
        showToast('Failed to promote user.', 'error');
      }
    }
  };

  const handleDemote = async (uid: string, name: string) => {
    if (uid === currentUser?.uid) {
      showToast('You cannot demote yourself!', 'warning');
      return;
    }
    if (window.confirm(`Are you sure you want to demote Admin ${name} to Player?`)) {
      try {
        await demoteAdminToPlayer(uid);
        showToast(`Demoted ${name} to Player.`, 'info');
        fetchUsers();
      } catch (err: any) {
        console.error('Error demoting user:', err);
        showToast('Failed to demote user.', 'error');
      }
    }
  };

  const filteredUsers = usersList.filter((u) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const matchName = u.displayName?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q);
    const matchEmail = u.email?.toLowerCase().includes(q);
    return matchName || matchEmail;
  });

  return (
    <div className="space-y-6">
      
      {/* Title & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
            <Users className="h-7 w-7 text-amber-400" />
            User Management
          </h1>
          <p className="text-xs text-slate-400">View registered player accounts, whitelist status, and staff permissions</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search username or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {loading ? (
        <CardSkeleton />
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-5">Username</th>
                  <th className="py-3.5 px-5">Email Address</th>
                  <th className="py-3.5 px-5">System Role</th>
                  <th className="py-3.5 px-5">Whitelist Status</th>
                  <th className="py-3.5 px-5">Registered</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                      No matching user accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((usr) => (
                    <tr key={usr.uid} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-100">{usr.username || usr.displayName || 'Player'}</div>
                        <div className="text-[10px] text-slate-500 font-mono">UID: {usr.uid.substring(0, 8)}...</div>
                      </td>
                      <td className="py-4 px-5 text-slate-300 font-medium">{usr.email}</td>
                      <td className="py-4 px-5">
                        {usr.role === 'admin' ? (
                          <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase text-[10px]">
                            ADMINISTRATOR
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                            PLAYER
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <StatusBadge status={usr.whitelistStatus} size="sm" />
                      </td>
                      <td className="py-4 px-5 text-slate-400">{formatDate(usr.createdAt)}</td>
                      <td className="py-4 px-5 text-right">
                        {usr.role !== 'admin' ? (
                          <button
                            onClick={() => handlePromote(usr.uid, usr.username || usr.displayName)}
                            className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold transition-all flex items-center gap-1.5 ml-auto"
                          >
                            <Key className="h-3.5 w-3.5" />
                            Promote to Admin
                          </button>
                        ) : (
                          usr.uid !== currentUser?.uid && (
                            <button
                              onClick={() => handleDemote(usr.uid, usr.username || usr.displayName)}
                              className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-bold transition-all flex items-center gap-1.5 ml-auto"
                            >
                              <UserMinus className="h-3.5 w-3.5" />
                              Demote to Player
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
