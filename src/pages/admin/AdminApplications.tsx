import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  ShieldAlert, 
  Clock, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { WhitelistApplication, WhitelistStatus } from '../../types';
import { getAllApplications } from '../../services/whitelistService';
import { StatusBadge } from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';
import { CardSkeleton } from '../../components/common/Skeleton';

import { ADMIN_ROUTES } from '../../config/constants';

export const AdminApplications: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilterParam = searchParams.get('status') || 'all';

  const [apps, setApps] = useState<WhitelistApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(statusFilterParam);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    setStatusFilter(statusFilterParam);
  }, [statusFilterParam]);

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      const data = await getAllApplications();
      setApps(data);
      setLoading(false);
    };
    fetchApps();
  }, []);

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    if (status === 'all') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ status });
    }
  };

  // Filter & Search Logic
  const filteredApps = apps.filter((app) => {
    // Status Filter
    if (statusFilter !== 'all' && app.status !== statusFilter) {
      return false;
    }

    // Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchPlayer = app.fullName?.toLowerCase().includes(q);
      const matchChar = app.characterName?.toLowerCase().includes(q);
      const matchDiscord = app.discordUsername?.toLowerCase().includes(q);
      const matchEmail = app.email?.toLowerCase().includes(q);
      return matchPlayer || matchChar || matchDiscord || matchEmail;
    }

    return true;
  });

  // Sorting
  filteredApps.sort((a, b) => {
    const tA = a.submittedAt?.seconds ? a.submittedAt.seconds : (a.submittedAt ? new Date(a.submittedAt).getTime() : 0);
    const tB = b.submittedAt?.seconds ? b.submittedAt.seconds : (b.submittedAt ? new Date(b.submittedAt).getTime() : 0);
    return sortOrder === 'newest' ? tB - tA : tA - tB;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
            <FileText className="h-7 w-7 text-amber-400" />
            Whitelist Applications
          </h1>
          <p className="text-xs text-slate-400">Search, filter, and review submitted player dossiers</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              statusFilter === 'all'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({apps.length})
          </button>
          <button
            onClick={() => handleFilterChange('pending')}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            Pending ({apps.filter((a) => a.status === 'pending').length})
          </button>
          <button
            onClick={() => handleFilterChange('accepted')}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
              statusFilter === 'accepted'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
            Accepted ({apps.filter((a) => a.status === 'accepted').length})
          </button>
          <button
            onClick={() => handleFilterChange('rejected')}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
              statusFilter === 'rejected'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <XCircle className="h-3.5 w-3.5 text-rose-400" />
            Rejected ({apps.filter((a) => a.status === 'rejected').length})
          </button>
        </div>

        {/* Search Input & Sort Selector */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, character, discord..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 text-xs font-semibold flex items-center gap-1 hover:border-slate-700"
            title="Toggle sort order"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>

      </div>

      {/* Content Table / Cards */}
      {loading ? (
        <CardSkeleton />
      ) : filteredApps.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-400 space-y-2">
          <FileText className="h-10 w-10 mx-auto text-slate-600" />
          <p className="font-bold text-slate-300 text-sm">No applications found</p>
          <p className="text-xs text-slate-500">Try adjusting your filter or search query.</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl overflow-hidden">
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-5">Applicant</th>
                  <th className="py-3.5 px-5">Character Name</th>
                  <th className="py-3.5 px-5">Requested Job</th>
                  <th className="py-3.5 px-5">Date Submitted</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-100">{app.fullName}</div>
                      <div className="text-[11px] text-cyan-400 font-mono">{app.discordUsername}</div>
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-200">{app.characterName}</td>
                    <td className="py-4 px-5 text-slate-300">{app.characterJob}</td>
                    <td className="py-4 px-5 text-slate-400">{formatDate(app.submittedAt)}</td>
                    <td className="py-4 px-5">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        to={`${ADMIN_ROUTES.APPLICATIONS}/${app.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all shadow-md"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        VIEW DOSSIER
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards */}
          <div className="md:hidden divide-y divide-slate-800">
            {filteredApps.map((app) => (
              <div key={app.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <StatusBadge status={app.status} size="sm" />
                  <span className="text-[11px] text-slate-400">{formatDate(app.submittedAt)}</span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-100 text-sm">{app.characterName}</h3>
                  <p className="text-xs text-slate-400">Applicant: {app.fullName} ({app.discordUsername})</p>
                  <p className="text-xs text-cyan-400 font-semibold mt-1">Job: {app.characterJob}</p>
                </div>

                <div className="pt-2">
                  <Link
                    to={`${ADMIN_ROUTES.APPLICATIONS}/${app.id}`}
                    className="w-full py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Review Dossier
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
