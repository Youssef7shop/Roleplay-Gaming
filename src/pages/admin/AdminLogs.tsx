import React, { useEffect, useState } from 'react';
import { History, Shield, Clock } from 'lucide-react';
import { getActivityLogs, ActivityLog } from '../../services/settingsService';
import { formatDate } from '../../utils/formatters';
import { CardSkeleton } from '../../components/common/Skeleton';

export const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const logData = await getActivityLogs(50);
      setLogs(logData);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  if (loading) {
    return <CardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <History className="h-3.5 w-3.5" />
          AUDIT & LOGS
        </div>
        <h1 className="text-3xl font-black text-slate-100 uppercase tracking-tight">
          System Activity Logs
        </h1>
        <p className="text-xs text-slate-400">
          Chronological record of staff decisions, whitelist applications, and status updates.
        </p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
            No system activity logs recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Performed By</th>
                  <th className="py-3.5 px-4">Details</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {logs.map((log) => (
                  <tr key={log.id || Math.random().toString()} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-amber-400 uppercase tracking-wider text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200">
                      {log.performedByName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {log.details || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {formatDate(log.timestamp)}
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
