import React from 'react';
import { Shield, Disc as Discord, Globe, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
                <Shield className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-xl text-slate-100 tracking-wider">
                NEXUS<span className="text-cyan-400">RP</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Experience authentic, immersive Roleplay in a high-performance custom city. Apply for your whitelist today and build your legacy.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-cyan-400 transition-colors">Home Portal</a></li>
              <li><a href="/whitelist/apply" className="hover:text-cyan-400 transition-colors">Apply Whitelist</a></li>
              <li><a href="/dashboard" className="hover:text-cyan-400 transition-colors">Player Dashboard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-3">Community</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="#" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                <Discord className="h-4 w-4 text-indigo-400" />
                Discord Server
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                <Globe className="h-4 w-4 text-cyan-400" />
                Server Rules & Guidelines
              </a>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NEXUS Roleplay Server. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for Roleplay Communities <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
