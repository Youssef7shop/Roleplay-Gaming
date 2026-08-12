import { WhitelistStatus } from '../types';

export const formatDate = (timestamp: any): string => {
  if (!timestamp) return 'N/A';
  
  let date: Date;
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) return 'N/A';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getStatusBadgeStyle = (status: WhitelistStatus) => {
  switch (status) {
    case 'accepted':
      return {
        bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
        label: 'ACCEPTED',
      };
    case 'pending':
      return {
        bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
        label: 'PENDING REVIEW',
      };
    case 'rejected':
      return {
        bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
        glow: 'shadow-[0_0_15px_rgba(244,63,94,0.2)]',
        label: 'REJECTED',
      };
    case 'none':
    default:
      return {
        bg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
        glow: '',
        label: 'NOT APPLIED',
      };
  }
};
