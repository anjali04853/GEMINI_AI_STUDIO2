import React from 'react';
import { Clock, BarChart, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Assessment } from '../../types';
import { cn } from '../../lib/utils';

interface AssessmentCardProps {
  assessment: Assessment;
  onStart: (assessment: Assessment) => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment, onStart }) => {
  // Determine badge colors based on category/difficulty
  const getCategoryColor = (cat: string) => {
    if (cat.includes('Technical')) return 'bg-brand-purple text-white';
    if (cat.includes('Soft Skills')) return 'bg-brand-pink text-white';
    return 'bg-brand-turquoise text-white';
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-brand-yellow/20 text-yellow-700'; // Sunshine yellow
      case 'Advanced': return 'bg-brand-pink/20 text-brand-pink';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <Card className="flex flex-col h-full hover:scale-[1.03] hover:shadow-xl transition-all duration-300 rounded-[20px] border-slate-100 overflow-hidden group relative">
      <div className={cn("h-2 w-full", getCategoryColor(assessment.category).split(' ')[0])} />
      
      <CardHeader>
        <div className="flex justify-between items-start mb-3">
          <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide", getCategoryColor(assessment.category))}>
            {assessment.category}
          </span>
          <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getDifficultyColor(assessment.difficulty))}>
            <BarChart className="mr-1 h-3 w-3" />
            {assessment.difficulty}
          </span>
        </div>
        <CardTitle className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-purple transition-colors">
          {assessment.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-slate-500">
          {assessment.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="flex items-center text-sm text-slate-500 bg-slate-50 p-3 rounded-lg w-fit">
          <Clock className="mr-2 h-4 w-4 text-brand-purple" />
          <span className="font-medium">{assessment.durationMinutes} min</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={() => onStart(assessment)} 
          className="w-full rounded-xl bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-brand-purple group-hover:to-brand-darkPurple transition-all duration-300"
        >
          Start Assessment
          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};