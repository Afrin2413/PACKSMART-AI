import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, AlertCircle } from 'lucide-react';

interface RiskBadgeProps {
  level: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const norm = level ? level.toUpperCase() : 'LOW';

  let bgClass = 'bg-brand-emerald/20 text-brand-lime border-brand-emerald/40';
  let Icon = CheckCircle;

  if (norm === 'HIGH') {
    bgClass = 'bg-red-950/40 text-red-400 border-red-800/60';
    Icon = ShieldAlert;
  } else if (norm === 'MODERATE' || norm === 'MEDIUM') {
    bgClass = 'bg-amber-950/40 text-brand-amber border-brand-amber/50';
    Icon = AlertTriangle;
  }

  const sizeClass = {
    sm: 'text-xs px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-3 py-1 rounded-full gap-1.5 font-medium',
    lg: 'text-sm px-4 py-1.5 rounded-full gap-2 font-semibold',
  }[size];

  return (
    <span className={`inline-flex items-center border ${bgClass} ${sizeClass} tracking-wide`}>
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
      <span>{norm} RISK</span>
    </span>
  );
};

export default RiskBadge;
