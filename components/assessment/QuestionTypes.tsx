
import React from 'react';
import { cn } from '../../lib/utils';
import { Star, ChevronUp, ChevronDown, GripVertical, Check } from 'lucide-react';

interface BaseQuestionProps {
  value: string | number | string[] | undefined;
  onChange: (value: string | number | string[]) => void;
}

// --- Multiple Choice Component ---
interface OptionsProps extends BaseQuestionProps {
  options: string[];
}

export const MultipleChoiceQuestion: React.FC<OptionsProps> = ({ options, value, onChange }) => {
  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <div
          key={index}
          onClick={() => onChange(option)}
          className={cn(
            "group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center",
            value === option
              ? "border-brand-purple bg-brand-lavender/40 shadow-sm ring-1 ring-brand-purple/20"
              : "border-slate-100 bg-white hover:border-brand-purple/30 hover:bg-brand-lavender/10"
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
  const textValue = typeof value === 'string' ? value : '';
  
  return (
    <div className="space-y-2">
      <textarea
        className="flex min-h-[160px] w-full rounded-xl border-2 border-slate-200 bg-brand-offWhite px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
        placeholder="Type your detailed answer here..."
        value={textValue}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="text-right text-xs text-slate-400 font-medium">
         {textValue.length} characters
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

// --- Select / Dropdown Component ---
export const SelectQuestion: React.FC<OptionsProps> = ({ options, value, onChange }) => {
  return (
    <div className="relative">
        <select 
            value={value as string || ''} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-14 pl-4 pr-10 rounded-xl border-2 border-slate-200 bg-white text-slate-800 text-lg focus:outline-none focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 appearance-none cursor-pointer transition-all"
        >
            <option value="" disabled>Select an option...</option>
            {options.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
            ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className="h-5 w-5 text-slate-400" />
        </div>
    </div>
  );
};

// --- Ranking / Ordering Component ---
export const RankingQuestion: React.FC<OptionsProps> = ({ options, value, onChange }) => {
  // If no value set yet, initialize with default order
  const currentOrder = (value as string[]) || options;

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...currentOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      onChange(newOrder);
    }
  };

  return (
    <div className="space-y-3">
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">
            Reorder the items (Top = Highest Priority)
        </div>
        {currentOrder.map((item, index) => (
            <div 
                key={item} 
                className="flex items-center gap-3 p-3 bg-white rounded-lg border-l-4 border-l-brand-sky border-y border-r border-slate-200 shadow-sm transition-all hover:shadow-md"
            >
                <div className="text-slate-300 cursor-move">
                    <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1 font-medium text-slate-700">
                    {item}
                </div>
                <div className="flex flex-col gap-1">
                    <button 
                        onClick={(e) => { e.stopPropagation(); moveItem(index, 'up'); }}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-brand-purple hover:bg-brand-lavender rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                    >
                        <ChevronUp className="h-4 w-4" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); moveItem(index, 'down'); }}
                        disabled={index === currentOrder.length - 1}
                        className="p-1 text-slate-400 hover:text-brand-purple hover:bg-brand-lavender rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </button>
                </div>
            </div>
        ))}
    </div>
  );
};
