import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Mail, Lock, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/common/Toast';
import { ADMIN_ROUTE } from '../config/constants';
import { getFriendlyAuthErrorMessage } from '../utils/authErrors';

export const Login: React.FC = () => {
  const { loginWithEmail } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve success message from navigation state if available (e.g., from /register)
  const successStateMsg = location.state?.message || '';

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    try {
      const profile = await loginWithEmail(email, 'NexusPassword2026!@#');
      showToast('Logged in successfully!', 'success');

      // Direct everyone to the website (dashboard)
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Email login error:', err);
      if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('operation-not-allowed')) {
        const friendlyMsg = getFriendlyAuthErrorMessage(err);
        setErrorMsg(friendlyMsg);
        showToast(friendlyMsg, 'error');
      } else {
        setErrorMsg('Incorrect email or password.');
        showToast('Incorrect email or password.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-8 bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative">
        
        {/* Gaming Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Shield className="h-9 w-9" />
          </div>
          <h2 className="text-3xl font-black tracking-wider text-slate-100 uppercase">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-400 tracking-wide">
            Enter your credentials to access NEXUS Roleplay
          </p>
        </div>

        {/* Registration Success Banner */}
        {successStateMsg && (
          <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs leading-relaxed">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successStateMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium leading-relaxed">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/25 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              {submitting ? 'LOGGING IN...' : 'LOGIN'}
            </button>

            <Link
              to="/register"
              className="w-full py-3 px-4 rounded-xl font-bold text-slate-300 border border-slate-800 bg-slate-950/60 hover:bg-slate-800 hover:text-slate-100 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 text-center block"
            >
              CREATE ACCOUNT
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
};
