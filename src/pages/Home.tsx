import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  Users, 
  ChevronRight, 
  UserPlus, 
  FileCheck, 
  Clock, 
  CheckCircle, 
  Gamepad2, 
  Award, 
  Flame, 
  BookOpen, 
  Zap, 
  Shield 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getServerSettings } from '../services/settingsService';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [isWhitelistOpen, setIsWhitelistOpen] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getServerSettings();
        setIsWhitelistOpen(settings.whitelistOpen);
      } catch (e) {
        console.error('Error fetching settings:', e);
      }
    };
    fetchSettings();
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Create Your Account',
      desc: 'Register using Google Auth or Email to setup your player profile on our portal.',
      icon: UserPlus,
    },
    {
      num: '02',
      title: 'Complete Whitelist Form',
      desc: 'Detail your personal info, character biography, backstory, and roleplay scenario answers.',
      icon: FileCheck,
    },
    {
      num: '03',
      title: 'Wait for Staff Review',
      desc: 'Our dedicated staff team reviews application details to ensure top roleplay quality.',
      icon: Clock,
    },
    {
      num: '04',
      title: 'Get Accepted',
      desc: 'Receive your acceptance badge and review your custom server access credentials.',
      icon: CheckCircle,
    },
    {
      num: '05',
      title: 'Join The City',
      desc: 'Connect to our high-performance FiveM game server and begin your roleplay story!',
      icon: Gamepad2,
    },
  ];

  return (
    <div className="space-y-24 py-6">
      
      {/* Hero Section */}
      <section className="relative rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 p-8 sm:p-14 lg:p-20 overflow-hidden text-center shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            NEXUS ROLEPLAY COMMUNITY
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-100 uppercase tracking-tight leading-none">
            ENTER THE <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">CITY</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Apply for your whitelist application, craft your character's biography, and start your immersive Roleplay journey in our custom-built city.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              isWhitelistOpen ? (
                <Link
                  to="/whitelist/apply"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-3 text-base tracking-wide"
                >
                  APPLY FOR WHITELIST NOW
                  <ChevronRight className="h-5 w-5" />
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-rose-300 bg-rose-500/10 border border-rose-500/30 flex items-center justify-center gap-3 text-base tracking-wide cursor-not-allowed opacity-80"
                >
                  WAITLIST CLOSED
                </button>
              )
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-3 text-base tracking-wide"
                >
                  APPLY FOR WHITELIST
                  <ChevronRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-slate-200 border border-slate-700 bg-slate-900/80 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-base"
                >
                  PLAYER LOGIN
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Server Highlights Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-slate-100">60 FPS+</p>
            <p className="text-xs text-slate-400 font-medium">Custom Optimization</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-cyan-400">Strict RP</p>
            <p className="text-xs text-slate-400 font-medium">Serious Roleplay Rules</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-slate-100">100%</p>
            <p className="text-xs text-slate-400 font-medium">Player-Driven Economy</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-blue-400">24/7 Staff</p>
            <p className="text-xs text-slate-400 font-medium">Fast Whitelist Reviews</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            WHITELIST PROCESS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 uppercase tracking-tight">
            HOW IT WORKS
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Get whitelisted in 5 easy steps and gain access to our custom RP server.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-cyan-500/40 hover:bg-slate-900 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-400 tracking-wider">
                    STEP {step.num}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-800 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="font-bold text-slate-100 text-base">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Roleplay Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-4 hover:border-slate-700 transition-all">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-fit">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Law & Emergency Services</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Apply as a Police Officer, EMT Doctor, or Prosecutor. Engage in high-stakes investigations, court trials, and life-saving operations.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-4 hover:border-slate-700 transition-all">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 w-fit">
            <Flame className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Civilian & Business Life</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Own custom nightclubs, mechanic shops, real estate agencies, or taxi fleets. Shape the city's economy with full player business ownership.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-4 hover:border-slate-700 transition-all">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 w-fit">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Active Staff & Community</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fair and transparent administration team dedicated to maintaining high roleplay standards, organizing community events, and fast whitelist reviews.
          </p>
        </div>
      </section>

      {/* Server Rules Teaser */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 sm:p-12 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">Core Roleplay Standards</h3>
            <p className="text-xs text-slate-400">Essential rules required for whitelist approval</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400 block">No Fail RP / Powergaming</span>
            <p className="text-slate-400">Stay in character at all times and do not force impossible actions on others.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400 block">No Metagaming</span>
            <p className="text-slate-400">Using OOC knowledge (e.g. stream info or Discord) in IC situations is strictly prohibited.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400 block">Respect All Players</span>
            <p className="text-slate-400">Maintain respectful OOC communication and zero tolerance for harassment.</p>
          </div>
        </div>
      </section>

    </div>
  );
};
