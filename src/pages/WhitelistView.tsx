import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  ArrowLeft, 
  User, 
  Briefcase, 
  BookOpen, 
  HelpCircle, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { WhitelistApplication } from '../types';
import { getUserLatestApplication } from '../services/whitelistService';
import { StatusBadge } from '../components/common/Badge';
import { formatDate } from '../utils/formatters';
import { CardSkeleton } from '../components/common/Skeleton';

export const WhitelistView: React.FC = () => {
  const { user } = useAuth();
  const [app, setApp] = useState<WhitelistApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      if (user?.uid) {
        setLoading(true);
        const data = await getUserLatestApplication(user.uid);
        setApp(data);
        setLoading(false);
      }
    };
    fetchApp();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <CardSkeleton />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
          <FileText className="h-10 w-10 mx-auto text-slate-500 mb-2" />
          <h2 className="text-lg font-bold text-slate-200">No Application Found</h2>
          <p className="text-xs text-slate-400 mt-1">You have not submitted a whitelist application yet.</p>
        </div>
        <Link
          to="/whitelist/apply"
          className="inline-block px-6 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs uppercase"
        >
          Submit Whitelist Application
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors mb-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-3">
            <FileText className="h-7 w-7 text-cyan-400" />
            Your Whitelist Application
          </h1>
          <p className="text-xs text-slate-400">Submitted on {formatDate(app.submittedAt)}</p>
        </div>

        <div>
          <StatusBadge status={app.status} size="lg" />
        </div>
      </div>

      {/* Admin Review Note callout if rejected */}
      {app.status === 'rejected' && app.adminNote && (
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
          <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            REJECTION REASON FROM STAFF:
          </h3>
          <p className="text-xs text-rose-200 leading-relaxed font-medium">"{app.adminNote}"</p>
        </div>
      )}

      {/* Section 1: Personal Info */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
          <User className="h-4 w-4 text-cyan-400" />
          Applicant Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Full Real Name</span>
            <span className="font-semibold text-slate-200">{app.fullName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Real Age</span>
            <span className="font-semibold text-slate-200">{app.realAge} years</span>
          </div>
          <div>
            <span className="text-slate-500 block">Country</span>
            <span className="font-semibold text-slate-200">{app.country}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Discord Handle</span>
            <span className="font-semibold text-cyan-400">{app.discordUsername}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-slate-500 block">Email</span>
            <span className="font-semibold text-slate-200">{app.email}</span>
          </div>
        </div>
      </div>

      {/* Section 2: Character Info */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
          <Briefcase className="h-4 w-4 text-cyan-400" />
          Character Persona & Traits
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Character Name</span>
            <span className="font-extrabold text-slate-100 text-sm">{app.characterName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Character Age</span>
            <span className="font-semibold text-slate-200">{app.characterAge} years</span>
          </div>
          <div>
            <span className="text-slate-500 block">Requested Job</span>
            <span className="font-semibold text-slate-200">{app.characterJob}</span>
          </div>
          <div className="sm:col-span-3">
            <span className="text-slate-500 block">Personality Traits</span>
            <p className="text-slate-300 mt-0.5">{app.personality}</p>
          </div>
          <div>
            <span className="text-slate-500 block">Strengths</span>
            <p className="text-slate-300 mt-0.5">{app.strengths}</p>
          </div>
          <div>
            <span className="text-slate-500 block">Weaknesses</span>
            <p className="text-slate-300 mt-0.5">{app.weaknesses}</p>
          </div>
          <div>
            <span className="text-slate-500 block">Long-Term Goals</span>
            <p className="text-slate-300 mt-0.5">{app.goals}</p>
          </div>
        </div>
      </div>

      {/* Section 3: Backstory */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="h-4 w-4 text-cyan-400" />
          Character Backstory
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950 p-4 rounded-2xl border border-slate-800">
          {app.backstory}
        </p>
      </div>

      {/* Section 4: Roleplay Answers */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
          <HelpCircle className="h-4 w-4 text-cyan-400" />
          Roleplay Scenario Answers
        </h2>
        <div className="space-y-4 text-xs">
          <div>
            <span className="font-bold text-slate-300 block mb-1">1. What is Roleplay in your own words?</span>
            <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">{app.roleplayAnswers.question1}</p>
          </div>
          <div>
            <span className="font-bold text-slate-300 block mb-1">2. Character provocation scenario:</span>
            <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">{app.roleplayAnswers.question2}</p>
          </div>
          <div>
            <span className="font-bold text-slate-300 block mb-1">3. Dangerous situation reaction:</span>
            <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">{app.roleplayAnswers.question3}</p>
          </div>
          <div>
            <span className="font-bold text-slate-300 block mb-1">4. IC vs OOC difference:</span>
            <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">{app.roleplayAnswers.question4}</p>
          </div>
          <div>
            <span className="font-bold text-slate-300 block mb-1">5. Fail RP definition:</span>
            <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">{app.roleplayAnswers.question5}</p>
          </div>
          <div>
            <span className="font-bold text-slate-300 block mb-1">6. Powergaming definition:</span>
            <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">{app.roleplayAnswers.question6}</p>
          </div>
          <div>
            <span className="font-bold text-slate-300 block mb-1">7. Metagaming definition:</span>
            <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">{app.roleplayAnswers.question7}</p>
          </div>
          <div>
            <span className="font-bold text-slate-300 block mb-1">8. Witnessing rule breaks:</span>
            <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">{app.roleplayAnswers.question8}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
