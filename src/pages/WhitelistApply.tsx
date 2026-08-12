import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Briefcase, 
  BookOpen, 
  HelpCircle, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { JobType, RoleplayAnswers } from '../types';
import { submitWhitelistApplication, getUserPendingApplication } from '../services/whitelistService';
import { getServerSettings } from '../services/settingsService';
import { Modal } from '../components/common/Modal';
import { useToast } from '../components/common/Toast';

export const WhitelistApply: React.FC = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [loadingCheck, setLoadingCheck] = useState<boolean>(true);
  const [hasPending, setHasPending] = useState<boolean>(false);
  const [isWhitelistOpen, setIsWhitelistOpen] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

  // Form State
  const [fullName, setFullName] = useState(userProfile?.displayName || '');
  const [realAge, setRealAge] = useState<number>(18);
  const [country, setCountry] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [email, setEmail] = useState(user?.email || '');

  const [characterName, setCharacterName] = useState('');
  const [characterAge, setCharacterAge] = useState<number>(25);
  const [characterJob, setCharacterJob] = useState<JobType>('Civilian');
  const [customJob, setCustomJob] = useState('');
  const [personality, setPersonality] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [goals, setGoals] = useState('');

  const [backstory, setBackstory] = useState('');

  const [rpAnswers, setRpAnswers] = useState<RoleplayAnswers>({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: '',
    question6: '',
    question7: '',
    question8: '',
  });

  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const checkPending = async () => {
      try {
        const settings = await getServerSettings();
        setIsWhitelistOpen(settings.whitelistOpen);
        
        if (user?.uid) {
          const pending = await getUserPendingApplication(user.uid);
          if (pending) {
            setHasPending(true);
          }
        }
      } catch (err) {
        console.error('Error fetching settings or pending app:', err);
      } finally {
        setLoadingCheck(false);
      }
    };
    checkPending();
  }, [user]);

  const handleRpChange = (field: keyof RoleplayAnswers, value: string) => {
    setRpAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (currentStep: number): boolean => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full real name.');
        return false;
      }
      if (realAge < 16) {
        setErrorMsg('You must be at least 16 years old to apply.');
        return false;
      }
      if (!country.trim()) {
        setErrorMsg('Please enter your country.');
        return false;
      }
      if (!discordUsername.trim()) {
        setErrorMsg('Please enter your Discord username (e.g. John#1234 or john_rp).');
        return false;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return false;
      }
    }

    if (currentStep === 2) {
      if (!characterName.trim()) {
        setErrorMsg('Please enter your character full name.');
        return false;
      }
      if (characterAge < 18) {
        setErrorMsg('Character age must be at least 18.');
        return false;
      }
      if (characterJob === 'Other' && !customJob.trim()) {
        setErrorMsg('Please specify your custom job title.');
        return false;
      }
      if (!personality.trim() || !strengths.trim() || !weaknesses.trim() || !goals.trim()) {
        setErrorMsg('Please complete all character trait fields.');
        return false;
      }
    }

    if (currentStep === 3) {
      if (backstory.length < 300) {
        setErrorMsg(`Backstory is too short (${backstory.length}/300 characters minimum).`);
        return false;
      }
      if (backstory.length > 3000) {
        setErrorMsg(`Backstory exceeds maximum limit of 3000 characters.`);
        return false;
      }
    }

    if (currentStep === 4) {
      const keys = Object.keys(rpAnswers) as (keyof RoleplayAnswers)[];
      for (const k of keys) {
        if (!rpAnswers[k].trim()) {
          setErrorMsg('Please answer all 8 roleplay scenario questions thoroughly.');
          return false;
        }
      }
    }

    if (currentStep === 5) {
      if (!rulesAccepted) {
        setErrorMsg('You must agree to all server rules before submitting.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitFinal = async () => {
    if (!user?.uid) return;
    setSubmitting(true);
    setConfirmModalOpen(false);

    try {
      await submitWhitelistApplication({
        userId: user.uid,
        fullName,
        realAge,
        country,
        discordUsername,
        email,
        characterName,
        characterAge,
        characterJob: characterJob === 'Other' ? customJob : characterJob,
        customJob,
        personality,
        strengths,
        weaknesses,
        goals,
        backstory,
        roleplayAnswers: rpAnswers,
        rulesAccepted,
      });

      showToast('Whitelist application submitted successfully!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Submission error:', err);
      showToast(err?.message || 'Failed to submit application.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCheck) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Clock className="h-8 w-8 animate-spin mx-auto text-cyan-400 mb-2" />
        Loading application status...
      </div>
    );
  }

  if (!isWhitelistOpen) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="p-8 rounded-3xl border border-rose-500/30 bg-rose-500/10 space-y-4">
          <AlertCircle className="h-12 w-12 text-rose-400 mx-auto" />
          <h2 className="text-2xl font-black text-rose-300 uppercase">WAITLIST CLOSED</h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            The whitelist application process is currently closed. Staff are not accepting new applications at this time. Please check our Discord for updates on when applications will reopen.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl bg-rose-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-rose-400 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (hasPending) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="p-8 rounded-3xl border border-amber-500/30 bg-amber-500/10 space-y-4">
          <Clock className="h-12 w-12 text-amber-400 mx-auto animate-pulse" />
          <h2 className="text-2xl font-black text-amber-300 uppercase">APPLICATION ALREADY PENDING</h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            You currently have a whitelist application under staff review. Duplicate applications are blocked until review is completed.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider"
            >
              Return to Player Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stepsList = [
    { num: 1, label: 'Personal Info', icon: User },
    { num: 2, label: 'Character Info', icon: Briefcase },
    { num: 3, label: 'Backstory', icon: BookOpen },
    { num: 4, label: 'RP Questions', icon: HelpCircle },
    { num: 5, label: 'Rules & Submit', icon: ShieldCheck },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest">
          APPLICATION PORTAL
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 uppercase tracking-tight">
          WHITELIST APPLICATION
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Complete all 5 sections to apply for whitelist access on NEXUS Roleplay.
        </p>
      </div>

      {/* Progress Bar Indicator */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-6 shadow-xl">
        <div className="grid grid-cols-5 gap-2 text-center">
          {stepsList.map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div key={s.num} className="space-y-2">
                <div
                  className={`mx-auto h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : isCurrent
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 font-black scale-105'
                      : 'bg-slate-950 text-slate-600 border border-slate-800'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <p
                  className={`text-[10px] sm:text-xs font-semibold hidden sm:block ${
                    isCurrent ? 'text-cyan-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  Step {s.num}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step Container Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-10 shadow-2xl space-y-6">
        
        {/* STEP 1: PERSONAL INFORMATION */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <User className="h-5 w-5 text-cyan-400" />
                STEP 1 — PERSONAL INFORMATION
              </h2>
              <p className="text-xs text-slate-400">Private out-of-character information for staff review only.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Real Age *</label>
                <input
                  type="number"
                  min="16"
                  max="99"
                  value={realAge}
                  onChange={(e) => setRealAge(parseInt(e.target.value) || 18)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Country *</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States, Morocco, Germany..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Discord Username *</label>
                <input
                  type="text"
                  value={discordUsername}
                  onChange={(e) => setDiscordUsername(e.target.value)}
                  placeholder="username or User#1234"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CHARACTER INFORMATION */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-cyan-400" />
                STEP 2 — CHARACTER INFORMATION
              </h2>
              <p className="text-xs text-slate-400">Define your primary in-game character persona and aspirations.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Character Full Name *</label>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="e.g. John Carter"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Character Age *</label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={characterAge}
                  onChange={(e) => setCharacterAge(parseInt(e.target.value) || 25)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Character Job / Profession *</label>
                <select
                  value={characterJob}
                  onChange={(e) => setCharacterJob(e.target.value as JobType)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500"
                >
                  <option value="Police Officer">Police Officer</option>
                  <option value="Doctor">Doctor / EMT</option>
                  <option value="Mechanic">Mechanic</option>
                  <option value="Taxi Driver">Taxi Driver</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Lawyer">Lawyer / Attorney</option>
                  <option value="Civilian">Civilian</option>
                  <option value="Other">Other (Custom)</option>
                </select>
              </div>

              {characterJob === 'Other' && (
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Specify Custom Job Title *</label>
                  <input
                    type="text"
                    value={customJob}
                    onChange={(e) => setCustomJob(e.target.value)}
                    placeholder="e.g. Journalist, Private Investigator, News Reporter..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500"
                  />
                </div>
              )}

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Personality Traits *</label>
                <input
                  type="text"
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  placeholder="e.g. Calm under pressure, ambitious, fiercely loyal, observant..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Character Strengths *</label>
                <input
                  type="text"
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  placeholder="e.g. Great communicator, skilled driver..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Character Weaknesses *</label>
                <input
                  type="text"
                  value={weaknesses}
                  onChange={(e) => setWeaknesses(e.target.value)}
                  placeholder="e.g. Stubborn, quick-tempered when disrespected..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Character Long-Term Goals *</label>
                <input
                  type="text"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="e.g. Open a downtown auto repair business and build a clean reputation..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CHARACTER BACKSTORY */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-cyan-400" />
                STEP 3 — CHARACTER BACKSTORY
              </h2>
              <p className="text-xs text-slate-400">Tell us your character's history, origin, and reasons for moving to the city.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Character Story (300 - 3000 characters)</label>
                <span
                  className={`text-xs font-bold ${
                    backstory.length < 300
                      ? 'text-rose-400'
                      : backstory.length > 3000
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {backstory.length} / 3000 chars (Min: 300)
                </span>
              </div>

              <textarea
                rows={10}
                value={backstory}
                onChange={(e) => setBackstory(e.target.value)}
                placeholder={`Example:\n"John Carter was born in a quiet coastal town and grew up assisting his father in an automotive repair workshop. After studying mechanical engineering, he decided to move to NEXUS City looking for new opportunities. Driven by ambition and craftsmanship, his goal is to establish an independent mechanic shop and serve the community..."`}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm leading-relaxed placeholder-slate-600 focus:border-cyan-500"
              />
            </div>
          </div>
        )}

        {/* STEP 4: ROLEPLAY QUESTIONS */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-cyan-400" />
                STEP 4 — ROLEPLAY SCENARIOS & KNOWLEDGE
              </h2>
              <p className="text-xs text-slate-400">Answer all 8 roleplay questions to demonstrate your understanding of strict RP concepts.</p>
            </div>

            <div className="space-y-5 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 block">1. What is Roleplay (RP) in your own words? *</label>
                <textarea
                  rows={2}
                  value={rpAnswers.question1}
                  onChange={(e) => handleRpChange('question1', e.target.value)}
                  placeholder="Explain the definition of RP..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 block">2. What would you do if another player provokes your character? *</label>
                <textarea
                  rows={2}
                  value={rpAnswers.question2}
                  onChange={(e) => handleRpChange('question2', e.target.value)}
                  placeholder="Describe your in-character reaction..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 block">3. What would you do if your character is involved in a dangerous situation? *</label>
                <textarea
                  rows={2}
                  value={rpAnswers.question3}
                  onChange={(e) => handleRpChange('question3', e.target.value)}
                  placeholder="Value of life principle (NVL)..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 block">4. What is the difference between IC (In Character) and OOC (Out of Character)? *</label>
                <textarea
                  rows={2}
                  value={rpAnswers.question4}
                  onChange={(e) => handleRpChange('question4', e.target.value)}
                  placeholder="Explain IC vs OOC..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 block">5. What is Fail RP? Give an example. *</label>
                <textarea
                  rows={2}
                  value={rpAnswers.question5}
                  onChange={(e) => handleRpChange('question5', e.target.value)}
                  placeholder="Fail RP definition and example..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 block">6. What is Powergaming? Give an example. *</label>
                <textarea
                  rows={2}
                  value={rpAnswers.question6}
                  onChange={(e) => handleRpChange('question6', e.target.value)}
                  placeholder="Powergaming definition..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 block">7. What is Metagaming? Give an example. *</label>
                <textarea
                  rows={2}
                  value={rpAnswers.question7}
                  onChange={(e) => handleRpChange('question7', e.target.value)}
                  placeholder="Metagaming definition..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 block">8. What would you do if you witnessed another player breaking server rules? *</label>
                <textarea
                  rows={2}
                  value={rpAnswers.question8}
                  onChange={(e) => handleRpChange('question8', e.target.value)}
                  placeholder="Finish scene then clip & report to staff via ticket..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-cyan-500"
                />
              </div>

            </div>
          </div>
        )}

        {/* STEP 5: RULES & SUBMIT */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
                STEP 5 — SERVER RULES & AGREEMENT
              </h2>
              <p className="text-xs text-slate-400">Review server guidelines before finalizing your application.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 max-h-60 overflow-y-auto text-xs text-slate-300">
              <p className="font-bold text-cyan-400 uppercase">SERVER CODE OF CONDUCT:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Respect all community members and staff team at all times.</li>
                <li>Zero tolerance for harassment, racism, toxic behavior, or hate speech.</li>
                <li>No cheating, exploiting server bugs, or using third-party software.</li>
                <li>No Powergaming — forcing unrealistic or uncounterable actions on others.</li>
                <li>No Metagaming — using out-of-character information in-game.</li>
                <li>Always value your character's life (NVL - No Value of Life).</li>
                <li>Stay in character at all times during game sessions.</li>
                <li>Follow all server staff instructions during OOC disputes.</li>
                <li>Do not break character during active scenes; report issues after scene conclusion.</li>
                <li>Keep roleplay realistic and immersive for everyone.</li>
              </ul>
            </div>

            <label className="flex items-start gap-3 p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 cursor-pointer">
              <input
                type="checkbox"
                checked={rulesAccepted}
                onChange={(e) => setRulesAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded bg-slate-950 border-slate-700 text-cyan-400 focus:ring-cyan-500"
              />
              <span className="text-xs font-semibold text-slate-200">
                I have read, understood, and agree to follow all NEXUS Roleplay server rules and code of conduct.
              </span>
            </label>
          </div>
        )}

        {/* Navigation Buttons Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-2 hover:bg-slate-700 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous Step
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              Next Step
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (validateStep(5)) setConfirmModalOpen(true);
              }}
              disabled={!rulesAccepted || submitting}
              className="px-8 py-3 rounded-xl font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              SUBMIT WHITELIST APPLICATION
            </button>
          )}
        </div>

      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Application Submission"
        footer={
          <>
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitFinal}
              disabled={submitting}
              className="px-6 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md"
            >
              {submitting ? 'Submitting...' : 'Confirm & Submit Application'}
            </button>
          </>
        }
      >
        <p className="text-slate-300">
          Are you sure you want to submit your whitelist application now? Please ensure all character details and roleplay scenario answers are accurate.
        </p>
      </Modal>

    </div>
  );
};
