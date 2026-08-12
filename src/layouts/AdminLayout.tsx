import React, { useState } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Users, 
  Settings, 
  LogOut, 
  ShieldAlert,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
  Sliders,
  History
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ADMIN_ROUTE, ADMIN_ROUTES } from '../config/constants';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, userProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: ADMIN_ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Whitelist Applications', path: ADMIN_ROUTES.APPLICATIONS, icon: FileText },
    { label: 'Pending', path: ADMIN_ROUTES.PENDING, icon: Clock },
    { label: 'Accepted', path: ADMIN_ROUTES.ACCEPTED, icon: CheckCircle },
    { label: 'Rejected', path: ADMIN_ROUTES.REJECTED, icon: XCircle },
    { label: 'Users', path: ADMIN_ROUTES.USERS, icon: Users },
    { label: 'Whitelist Control', path: ADMIN_ROUTES.CONTROL, icon: Sliders },
    { label: 'Activity Logs', path: ADMIN_ROUTES.LOGS, icon: History },
    { label: 'Settings', path: ADMIN_ROUTES.SETTINGS, icon: Settings },
  ];

  const isCurrent = (path: string) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path && !location.search;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Admin Header */}
      <div className="md:hidden border-b border-slate-800 bg-slate-900/90 p-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-amber-400" />
          <span className="font-bold text-amber-400 text-sm tracking-wider uppercase">Admin Portal</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-300"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 border-r border-slate-800/80 bg-slate-900/95 backdrop-blur-xl flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-5 overflow-y-auto">
          
          {/* Admin Header / Logo */}
          <div className="space-y-3 pb-4 border-b border-slate-800">
            <RouterLink to="/dashboard" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Player View
            </RouterLink>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-black text-sm tracking-widest text-slate-100 uppercase">ADMIN PANEL</h2>
                <p className="text-[11px] text-slate-400">NEXUS Roleplay Whitelist</p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isCurrent(item.path);

              return (
                <RouterLink
                  key={item.label + item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="h-3.5 w-3.5 text-amber-400" />}
                </RouterLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-500/30">
              {userProfile?.displayName?.[0] || 'A'}
            </div>
            <div className="overflow-hidden text-xs">
              <p className="font-bold text-slate-200 truncate">{userProfile?.displayName || 'Admin'}</p>
              <p className="text-[10px] text-amber-400/80 uppercase font-semibold">Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 transition-all uppercase tracking-wider"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
        {children}
      </main>

    </div>
  );
};
