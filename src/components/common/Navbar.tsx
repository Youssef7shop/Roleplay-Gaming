import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, 
  User, 
  FileText, 
  LayoutDashboard, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, userProfile, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="h-6 w-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-wider text-slate-100 uppercase">
                  NEXUS<span className="text-cyan-400">RP</span>
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded uppercase tracking-widest">
                  ROLEPLAY
                </span>
              </div>
              <p className="text-xs text-slate-400 tracking-wide">Official Whitelist Portal</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/') 
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20' 
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/booking"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/booking') 
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20' 
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900'
              }`}
            >
              Booking
            </Link>

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/dashboard') 
                      ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20' 
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <Link
                  to="/whitelist/apply"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/whitelist/apply') 
                      ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20' 
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Apply Whitelist
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin-panel"
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${
                      isActive('/admin-panel') 
                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' 
                        : 'text-amber-500/70 hover:text-amber-400 hover:bg-amber-500/10'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-colors"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                      {userProfile?.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-200">
                    {userProfile?.displayName || user.displayName || 'Player'}
                  </span>
                  {isAdmin && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded uppercase">
                      Admin
                    </span>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Apply Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-slate-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-900"
          >
            Home
          </Link>
          <Link
            to="/booking"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-900"
          >
            Booking
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-900"
              >
                Dashboard
              </Link>
              <Link
                to="/whitelist/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-900"
              >
                Apply Whitelist
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-900"
              >
                Profile Settings
              </Link>
              {isAdmin && (
                <Link
                  to="/admin-panel"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-bold text-amber-500 hover:bg-amber-500/10"
                >
                  Admin Panel
                </Link>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 border border-slate-800 bg-slate-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-cyan-400"
              >
                Create Account / Apply
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
