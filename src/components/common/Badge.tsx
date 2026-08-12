import React from 'react';
import { WhitelistStatus } from '../../types';
import { getStatusBadgeStyle } from '../../utils/formatters';

interface BadgeProps {
  status: WhitelistStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, size = 'md' }) => {
  const style = getStatusBadgeStyle(status);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold rounded-full',
    md: 'px-3 py-1 text-xs font-semibold rounded-full',
    lg: 'px-4 py-1.5 text-sm font-bold rounded-full',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 border ${style.bg} ${style.glow} ${sizeClasses} uppercase tracking-wider transition-all`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      {style.label}
    </span>
  );
};
