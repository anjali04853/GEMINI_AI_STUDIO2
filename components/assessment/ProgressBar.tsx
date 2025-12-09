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
    <div className={cn("w-full", className)}>
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>Question {current} of {total}</span>
        <span>{percentage}% Completed</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};