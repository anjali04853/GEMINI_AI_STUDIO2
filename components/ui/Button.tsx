import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'cta';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-accent text-white shadow-accent hover:-translate-y-0.5 border border-transparent',
    cta: 'bg-accent text-white shadow-accent hover:-translate-y-0.5 hover:scale-105 border border-transparent font-bold',
    secondary: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-accent hover:border-accent/20 shadow-sm',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-white',
    ghost: 'hover:bg-accent-light hover:text-accent dark:hover:bg-slate-700',
    destructive: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-md shadow-red-500/20',
  };

  const sizes = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-11 px-6 text-sm',
    lg: 'h-14 px-8 text-lg rounded-xl',
    icon: 'h-10 w-10 p-2 flex items-center justify-center',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};