import React, { useEffect, useState } from 'react';
import { Power, Sliders, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { getServerSettings, updateServerSettings, setWhitelistOpenStatus, ServerSettings } from '../../services/settingsService';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../hooks/useAuth';
import { CardSkeleton } from '../../components/common/Skeleton';

export const AdminControl: React.FC = () => {
  const { userProfile, user } = useAuth();
  const { showToast } = useToast();

  const [settings, setSettings] = useState<ServerSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await getServerSettings();
      setSettings(config);
      setLoading(false);
    };
    fetchConfig();
  }, []);

  const handleToggle = async () => {
    if (!settings || !user) return;
    const nextStatus = !settings.whitelistOpen;
    try {
      await setWhitelistOpenStatus(nextStatus, user.uid, userProfile?.displayName || 'Admin');
      setSettings((prev) => prev ? { ...prev, whitelistOpen: nextStatus } : null);
      showToast(`Whitelist intake is now ${nextStatus ? 'OPEN 🟢' : 'CLOSED 🔴'}`, nextStatus ? 'success' : 'info');
    } catch (error) {
      showToast('Failed to change whitelist status.', 'error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !user) return;
    setSaving(true);
    try {
      await updateServerSettings(settings, user.uid);
      showToast('Whitelist control settings saved.', 'success');
    } catch (error) {
      showToast('Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <CardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sliders className="h-3.5 w-3.5" />
          SYSTEM CONTROL
        </div>
        <h1 className="text-3xl font-black text-slate-100 uppercase tracking-tight">
          Whitelist Control & Status
        </h1>
        <p className="text-xs text-slate-400">
          Manage application intake state, submission requirements, and rules validation.
        </p>
      </div>

      {/* Main Open/Close Toggle Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            Current Whitelist Portal Status
          </h2>
          <p className="text-xs text-slate-400">
            {settings?.whitelistOpen 
              ? 'Players can currently submit new Whitelist applications.' 
              : 'Application portal is locked. New submissions are blocked.'}
          </p>
          <div className="inline-flex items-center gap-2 pt-1">
            <span className={`h-3 w-3 rounded-full ${settings?.whitelistOpen ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]'}`} />
            <span className={`font-black text-base uppercase tracking-wider ${settings?.whitelistOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
              {settings?.whitelistOpen ? 'INTAKE ACTIVE (OPEN 🟢)' : 'INTAKE LOCKED (CLOSED 🔴)'}
            </span>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl transition-all flex items-center gap-3 ${
            settings?.whitelistOpen
              ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/25'
              : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/25'
          }`}
        >
          <Power className="h-5 w-5" />
          {settings?.whitelistOpen ? 'CLOSE WHITELIST' : 'OPEN WHITELIST'}
        </button>
      </div>

      {/* Submission Requirements Controls */}
      <form onSubmit={handleSaveSettings} className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
        <h3 className="font-bold text-slate-100 text-base uppercase tracking-wider border-b border-slate-800 pb-3">
          Application Requirement Rules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Minimum Backstory Character Length
            </label>
            <input
              type="number"
              value={settings?.minBackstoryLength || 200}
              onChange={(e) => setSettings(s => s ? { ...s, minBackstoryLength: parseInt(e.target.value) || 0 } : null)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
            <p className="text-[11px] text-slate-500">
              Minimum characters required in player's backstory.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Minimum Real Age Requirement
            </label>
            <input
              type="number"
              value={settings?.minRealAge || 16}
              onChange={(e) => setSettings(s => s ? { ...s, minRealAge: parseInt(e.target.value) || 0 } : null)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
            <p className="text-[11px] text-slate-500">
              Minimum real age for applicant qualification.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl font-extrabold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'SAVING...' : 'SAVE REQUIREMENT RULES'}
        </button>
      </form>
    </div>
  );
};
