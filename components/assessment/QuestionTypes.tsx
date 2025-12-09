import React from 'react';
import { cn } from '../../lib/utils';
import { Star } from 'lucide-react';

interface BaseQuestionProps {
  value: string | number | undefined;
  onChange: (value: string | number) => void;
}

// --- Multiple Choice Component ---
interface MultipleChoiceProps extends BaseQuestionProps {
  options: string[];
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceProps> = ({ options, value, onChange }) => {
  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <div
          key={index}
          onClick={() => onChange(option)}
          className={cn(
            "group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center",
            value === option
              ? "border-brand-purple bg-brand-lavender/40 shadow-sm ring-1 ring-brand-purple/20" // Selected: Purple border + Lavender BG
              : "border-slate-100 bg-white hover:border-brand-purple/30 hover:bg-brand-lavender/10" // Default + Hover
          )}
          style={{ borderWidth: value === option ? '3px' : '2px' }}
        >
          <div className={cn(
            "h-6 w-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all",
            value === option 
                ? "border-brand-purple bg-brand-purple scale-110" 
                : "border-slate-300 group-hover:border-brand-purple/50"
          )}>
            {value === option && <div className="h-2.5 w-2.5 rounded-full bg-white shadow-sm" />}
          </div>
          <span className={cn(
            "text-base transition-colors", 
            value === option ? "text-brand-darkPurple font-semibold" : "text-slate-700"
          )}>
            {option}
          </span>
        </div>
      ))}
    </div>
  );
};

// --- Text Input Component ---
export const TextQuestion: React.FC<BaseQuestionProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <textarea
        className="flex min-h-[160px] w-full rounded-xl border-2 border-slate-200 bg-brand-offWhite px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
        placeholder="Type your detailed answer here..."
        value={value?.toString() || ''}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="text-right text-xs text-slate-400 font-medium">
         {(value?.toString() || '').length} characters
      </div>
    </div>
  );
};

// --- Rating Component ---
export const RatingQuestion: React.FC<BaseQuestionProps> = ({ value, onChange }) => {
  const rating = typeof value === 'number' ? value : 0;
  
  return (
    <div className="flex flex-col space-y-6 items-center justify-center py-8 bg-brand-offWhite/50 rounded-xl border border-dashed border-slate-200">
      <div className="flex gap-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="group relative focus:outline-none transition-transform active:scale-90 hover:scale-110"
          >
            <Star 
                className={cn(
                    "w-10 h-10 transition-all duration-200",
                    rating >= star 
                        ? "fill-brand-yellow text-brand-yellow drop-shadow-md" 
                        : "fill-transparent text-slate-300 group-hover:text-brand-yellow/60"
                )} 
                strokeWidth={rating >= star ? 0 : 2}
            />
          </button>
        ))}
      </div>
      <div className="flex justify-between w-full max-w-sm px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        <span>Not Confident</span>
        <span>Very Confident</span>
      </div>
    </div>
  );
};