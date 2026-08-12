import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Briefcase, 
  BookOpen, 
  HelpCircle, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Clock, 
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { WhitelistApplication } from '../../types';
import { getApplicationById, reviewApplication } from '../../services/whitelistService';
import { useAuth } from '../../hooks/useAuth';
import { StatusBadge } from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { CardSkeleton } from '../../components/common/Skeleton';

import { ADMIN_ROUTES } from '../../config/constants';

export const AdminApplicationDossier: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { showToast } = useToast();

  const [app, setApp] = useState<WhitelistApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);

  // Modals
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchApp = async () => {
      if (id) {
        setLoading(true);
        const data = await getApplicationById(id);
        setApp(data);
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  const handleAccept = async () => {
    if (!id || !user?.uid) return;
    setReviewing(true);
    try {
      await reviewApplication(
        id,
        'accepted',
        user.uid,
        userProfile?.displayName || 'Admin'
      );
      showToast('Application ACCEPTED successfully!', 'success');
      setAcceptModalOpen(false);
      // Reload dossier data
      const updated = await getApplicationById(id);
      setApp(updated);
    } catch (err: any) {
      console.error('Accept error:', err);
      showToast('Failed to accept application.', 'error');
    } finally {
      setReviewing(false);
    }
  };

  const handleReject = async () => {
    if (!id || !user?.uid) return;
    if (!rejectionReason.trim()) {
      showToast('Please provide a reason for rejection.', 'warning');
      return;
    }
    setReviewing(true);
    try {
      await reviewApplication(
        id,
        'rejected',
        user.uid,
        userProfile?.displayName || 'Admin',
        rejectionReason
      );
      showToast('Application REJECTED with note.', 'info');
      setRejectModalOpen(false);
      // Reload dossier data
      const updated = await getApplicationById(id);
      setApp(updated);
    } catch (err: any) {
      console.error('Reject error:', err);
      showToast('Failed to reject application.', 'error');
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <CardSkeleton />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <p className="text-slate-400 font-bold">Application Dossier Not Found</p>
        <Link to="/admin/applications" className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold uppercase">
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link to={ADMIN_ROUTES.APPLICATIONS} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors mb-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Applications
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight">
              APPLICANT DOSSIER #{id?.substring(0, 6)}
            </h1>
            <StatusBadge status={app.status} size="lg" />
          </div>
          <p className="text-xs text-slate-400 mt-1">Submitted on {formatDate(app.submittedAt)}</p>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAcceptModalOpen(true)}
            className="px-5 py-2.5 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <CheckCircle2 className="h-4 w-4" />
            ACCEPT APPLICATION
          </button>
          <button
            onClick={() => setRejectModalOpen(true)}
            className="px-5 py-2.5 rounded-xl font-bold text-slate-100 bg-rose-600/80 hover:bg-rose-500 border border-rose-500/40 text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <XCircle className="h-4 w-4" />
            REJECT APPLICATION
          </button>
        </div>
      </div>

      {/* Review Information Banner */}
      {app.reviewedAt && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>Reviewed on <strong className="text-slate-100">{formatDate(app.reviewedAt)}</strong> by <strong className="text-amber-400">{app.reviewerName || 'Staff Member'}</strong></span>
          </div>
          {app.adminNote && (
            <span className="text-slate-400 italic">"{app.adminNote}"</span>
          )}
        </div>
      )}

      {/* SECTION 1: PLAYER INFORMATION */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4 shadow-xl">
        <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3 uppercase tracking-wider">
          <User className="h-5 w-5 text-amber-400" />
          1. Out-of-Character Player Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-semibold block">Full Real Name</span>
            <span className="font-bold text-slate-100 text-sm">{app.fullName}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-semibold block">Real Age</span>
            <span className="font-bold text-slate-100 text-sm">{app.realAge} years old</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-semibold block">Country</span>
            <span className="font-bold text-slate-100 text-sm">{app.country}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-semibold block">Discord Username</span>
            <span className="font-bold text-cyan-400 text-sm">{app.discordUsername}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1 sm:col-span-2">
            <span className="text-slate-500 font-semibold block">Email Address</span>
            <span className="font-bold text-slate-100 text-sm">{app.email}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: CHARACTER INFORMATION */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4 shadow-xl">
        <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3 uppercase tracking-wider">
          <Briefcase className="h-5 w-5 text-amber-400" />
          2. In-Game Character Persona & Traits
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-semibold block">Character Name</span>
            <span className="font-extrabold text-cyan-300 text-base">{app.characterName}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-semibold block">Character Age</span>
            <span className="font-bold text-slate-100 text-sm">{app.characterAge} years</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-semibold block">Requested Profession</span>
            <span className="font-bold text-amber-400 text-sm">{app.characterJob}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1 sm:col-span-3">
            <span className="text-slate-500 font-semibold block">Personality Traits</span>
            <p className="text-slate-200 leading-relaxed font-medium">{app.personality}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-semibold block">Character Strengths</span>
            <p className="text-slate-200 font-medium">{app.strengths}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-semibold block">Character Weaknesses</span>
            <p className="text-slate-200 font-medium">{app.weaknesses}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-semibold block">Character Long-Term Goals</span>
            <p className="text-slate-200 font-medium">{app.goals}</p>
          </div>
        </div>
      </div>

      {/* SECTION 3: CHARACTER BACKSTORY */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4 shadow-xl">
        <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3 uppercase tracking-wider">
          <BookOpen className="h-5 w-5 text-amber-400" />
          3. Complete Character Backstory ({app.backstory?.length || 0} Chars)
        </h2>

        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
          {app.backstory}
        </div>
      </div>

      {/* SECTION 4: ROLEPLAY SCENARIO ANSWERS */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3 uppercase tracking-wider">
          <HelpCircle className="h-5 w-5 text-amber-400" />
          4. Roleplay Knowledge & Scenario Answers
        </h2>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <p className="font-bold text-amber-400">1. What is Roleplay (RP) in your own words?</p>
            <p className="text-slate-200 leading-relaxed">{app.roleplayAnswers.question1}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <p className="font-bold text-amber-400">2. Character provocation response:</p>
            <p className="text-slate-200 leading-relaxed">{app.roleplayAnswers.question2}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <p className="font-bold text-amber-400">3. Dangerous situation reaction (NVL):</p>
            <p className="text-slate-200 leading-relaxed">{app.roleplayAnswers.question3}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <p className="font-bold text-amber-400">4. IC vs OOC difference:</p>
            <p className="text-slate-200 leading-relaxed">{app.roleplayAnswers.question4}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <p className="font-bold text-amber-400">5. Fail RP definition & example:</p>
            <p className="text-slate-200 leading-relaxed">{app.roleplayAnswers.question5}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <p className="font-bold text-amber-400">6. Powergaming definition & example:</p>
            <p className="text-slate-200 leading-relaxed">{app.roleplayAnswers.question6}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <p className="font-bold text-amber-400">7. Metagaming definition & example:</p>
            <p className="text-slate-200 leading-relaxed">{app.roleplayAnswers.question7}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <p className="font-bold text-amber-400">8. Witnessing rule breaks procedure:</p>
            <p className="text-slate-200 leading-relaxed">{app.roleplayAnswers.question8}</p>
          </div>
        </div>
      </div>

      {/* MODAL 1: ACCEPT CONFIRMATION */}
      <Modal
        isOpen={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
        title="Accept Whitelist Application"
        footer={
          <>
            <button
              onClick={() => setAcceptModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              disabled={reviewing}
              className="px-6 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md"
            >
              {reviewing ? 'Processing...' : 'Confirm Acceptance'}
            </button>
          </>
        }
      >
        <p className="text-slate-300">
          Are you sure you want to <strong className="text-emerald-400">ACCEPT</strong> this whitelist application for player <strong className="text-slate-100">{app.fullName}</strong> ({app.characterName})?
        </p>
      </Modal>

      {/* MODAL 2: REJECT WITH REASON */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Whitelist Application"
        footer={
          <>
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={reviewing}
              className="px-6 py-2 rounded-xl text-xs font-bold text-slate-100 bg-rose-600 hover:bg-rose-500 shadow-md"
            >
              {reviewing ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-slate-300">
            Please enter a reason for rejecting <strong className="text-slate-100">{app.fullName}'s</strong> application. This note will be visible to the player in their dashboard.
          </p>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-rose-400">Reason for Rejection *</label>
            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Backstory is too short, answers to Metagaming scenario lack detail..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-rose-500"
            />
          </div>
        </div>
      </Modal>

    </div>
  );
};
