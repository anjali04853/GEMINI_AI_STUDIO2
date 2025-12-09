import React from 'react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/Input';

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
            "p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center",
            value === option
              ? "border-blue-600 bg-blue-50"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          <div className={cn(
            "h-5 w-5 rounded-full border-2 mr-3 flex items-center justify-center",
            value === option ? "border-blue-600" : "border-slate-300"
          )}>
            {value === option && <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
          </div>
          <span className={cn("text-sm font-medium", value === option ? "text-blue-900" : "text-slate-700")}>
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
        className="flex min-h-[120px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Type your answer here..."
        value={value?.toString() || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

// --- Rating Component ---
export const RatingQuestion: React.FC<BaseQuestionProps> = ({ value, onChange }) => {
  const rating = typeof value === 'number' ? value : 0;
  
  return (
    <div className="flex flex-col space-y-4 items-center justify-center py-6">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={cn(
              "w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all",
              rating >= star
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-400"
            )}
          >
            {star}
          </button>
        ))}
      </div>
      <div className="flex justify-between w-full max-w-xs text-xs text-slate-500 px-2">
        <span>Not Confident</span>
        <span>Very Confident</span>
      </div>
    </div>
  );
};