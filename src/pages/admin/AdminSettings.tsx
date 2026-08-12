import React, { useState } from 'react';
import { Settings, ShieldAlert, Save, Disc as Discord, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export const AdminSettings: React.FC = () => {
  const { showToast } = useToast();
  const [whitelistOpen, setWhitelistOpen] = useState(true);
  const [minBackstoryChars, setMinBackstoryChars] = useState(300);
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState('https://discord.com/api/webhooks/...');
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Server settings updated successfully!', 'success');
    }, 600);
  };

  return (
    <div className="max-w-3xl space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
          <Settings className="h-7 w-7 text-amber-400" />
          Server & Whitelist Settings
        </h1>
        <p className="text-xs text-slate-400">Configure portal settings and integration parameters</p>
      </div>

      <form onSubmit={handleSave} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-xl">
        
        {/* Toggle Whitelist Open */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Whitelist Submissions Status</h3>
            <p className="text-xs text-slate-400">Enable or pause new player whitelist applications</p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={whitelistOpen}
              onChange={(e) => setWhitelistOpen(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
          </label>
        </div>

        {/* Backstory Length */}
        <div className="space-y-1.5 pb-6 border-b border-slate-800">
          <label className="text-xs font-semibold text-slate-300">Minimum Backstory Length (Characters)</label>
          <input
            type="number"
            min="100"
            max="1000"
            value={minBackstoryChars}
            onChange={(e) => setMinBackstoryChars(parseInt(e.target.value) || 300)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-amber-500"
          />
          <p className="text-[11px] text-slate-500">Recommended value: 300 characters.</p>
        </div>

        {/* Discord Webhook */}
        <div className="space-y-1.5 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Discord className="h-4 w-4 text-indigo-400" />
            <label className="text-xs font-semibold text-slate-300">Discord Notification Webhook URL</label>
          </div>
          <input
            type="text"
            value={discordWebhookUrl}
            onChange={(e) => setDiscordWebhookUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-amber-500 font-mono"
          />
          <p className="text-[11px] text-slate-500">
            Automatically post a log message to your Discord staff channel whenever an application is accepted or rejected.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving Changes...' : 'Save Settings'}
        </button>

      </form>

    </div>
  );
};
