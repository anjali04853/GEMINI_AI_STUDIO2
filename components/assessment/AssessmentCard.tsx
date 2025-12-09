import React from 'react';
import { Clock, BarChart, Tag } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Assessment } from '../../types';

interface AssessmentCardProps {
  assessment: Assessment;
  onStart: (assessment: Assessment) => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment, onStart }) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {assessment.category}
          </span>
          <span className="inline-flex items-center text-xs text-slate-500">
            <BarChart className="mr-1 h-3 w-3" />
            {assessment.difficulty}
          </span>
        </div>
        <CardTitle className="text-xl mb-2">{assessment.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {assessment.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center text-sm text-slate-500">
          <Clock className="mr-2 h-4 w-4" />
          {assessment.durationMinutes} minutes estimated
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onStart(assessment)} className="w-full">
          Start Assessment
        </Button>
      </CardFooter>
    </Card>
  );
};