import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/common/Toast';
import { getFriendlyAuthErrorMessage } from '../utils/authErrors';

export const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setErrorMsg('');
    setSubmitting(true);

    try {
      await resetPassword(email);
      setSubmitted(true);
      showToast('Password reset link sent to your email.', 'success');
    } catch (err: any) {
      console.error('Password reset error:', err);
      const friendlyMsg = getFriendlyAuthErrorMessage(err);
      setErrorMsg(friendlyMsg);
      showToast(friendlyMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-6 bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
        
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black tracking-wider text-slate-100 uppercase">
            Reset Password
          </h2>
          <p className="text-xs text-slate-400">
            Enter your email address to receive password recovery instructions
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="font-bold text-slate-100 text-sm">Reset Link Sent!</h3>
            <p className="text-xs text-slate-300">
              Check your inbox at <span className="font-semibold text-emerald-300">{email}</span> for instructions to reset your password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/30">
                {errorMsg}
              </p>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl font-extrabold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'SENDING...' : 'SEND PASSWORD RESET EMAIL'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
