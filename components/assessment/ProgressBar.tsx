import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, className }) => {
  const percentage = Math.round(((current) / total) * 100);

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex justify-between items-end">
        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Progress</span>
        <div className="text-right">
           <span className="text-sm font-bold text-slate-900">{percentage}%</span>
           <span className="text-xs text-slate-500 ml-1">({current} of {total})</span>
        </div>
      </div>
      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-brand-purple to-brand-turquoise transition-all duration-500 ease-out rounded-full relative"
          style={{ width: `${percentage}%` }}
        >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};