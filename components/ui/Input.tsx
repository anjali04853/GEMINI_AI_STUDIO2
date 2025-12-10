import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-brand-offWhite dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus:bg-white dark:focus:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm",
            error && "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs font-medium text-red-500 animate-in slide-in-from-top-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";