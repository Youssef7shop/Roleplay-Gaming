import React, { useEffect, useState } from 'react';
import { Calendar, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getBookingSettings, subscribeToBookingSettings, reserveSpot, BookingSettings } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Booking: React.FC = () => {
  const [settings, setSettings] = useState<BookingSettings>({ totalSpots: 10, bookedSpots: 0 });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToBookingSettings(setSettings);
    return () => unsubscribe();
  }, []);

  const isFull = settings.bookedSpots >= settings.totalSpots;

  const handleReserve = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      const success = reserveSpot();
      if (success) {
        setSuccess(true);
      } else {
        setError('Sorry, all spots have been filled.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
          Reserve Your Spot
        </h1>
        <p className="text-lg text-slate-400">
          Secure your place in the upcoming roleplay session. Spots are limited!
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl ${isFull ? 'bg-rose-500/10 text-rose-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                <Calendar className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Next Session Entry</h3>
                <p className="text-slate-400 text-sm mt-1">Official Server Launch Event</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col items-center justify-center text-center">
              <Users className="h-6 w-6 text-slate-500 mb-2" />
              <div className="text-3xl font-bold text-white">{settings.totalSpots}</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Total Spots</div>
            </div>
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col items-center justify-center text-center">
              <Users className={`h-6 w-6 mb-2 ${isFull ? 'text-rose-400' : 'text-cyan-400'}`} />
              <div className={`text-3xl font-bold ${isFull ? 'text-rose-400' : 'text-cyan-400'}`}>
                {settings.totalSpots - settings.bookedSpots}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Available Spots</div>
            </div>
          </div>

          {success ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-emerald-400 mb-1">Reservation Confirmed!</h3>
              <p className="text-emerald-500/80 text-sm">You have successfully reserved your spot for the next session.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {isFull ? (
                <div className="flex items-center justify-center gap-3 p-6 bg-slate-950 border border-slate-800 rounded-xl text-slate-400">
                  <AlertCircle className="h-6 w-6" />
                  <span className="font-medium text-lg">Fully Booked</span>
                </div>
              ) : (
                <button
                  onClick={handleReserve}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 transition-all duration-200"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                  ) : (
                    'Reserve My Spot'
                  )}
                </button>
              )}
            </div>
          )}
        </div>
        
        {isFull && (
          <div className="bg-rose-500/10 py-3 px-6 text-center border-t border-rose-500/20">
            <span className="text-rose-400 text-sm font-medium tracking-wide">
              No more spots available at this time. Please check back later.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
