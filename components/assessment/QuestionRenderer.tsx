
import React from 'react';
import { Question } from '../../types';
import { MultipleChoiceQuestion, TextQuestion, RatingQuestion, SelectQuestion, RankingQuestion } from './QuestionTypes';

interface QuestionRendererProps {
  question: Question;
  value: string | number | string[] | undefined;
  onChange: (value: string | number | string[]) => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, value, onChange }) => {
  switch (question.type) {
    case 'multiple-choice':
      return (
        <MultipleChoiceQuestion
          options={question.options || []}
          value={value}
          onChange={onChange}
        />
      );
    case 'text':
      return (
        <TextQuestion
          value={value}
          onChange={onChange}
        />
      );
    case 'rating':
      return (
        <RatingQuestion
          value={value}
          onChange={onChange}
        />
      );
    case 'select':
      return (
        <SelectQuestion
          options={question.options || []}
          value={value}
          onChange={onChange}
        />
      );
    case 'ranking':
      return (
        <RankingQuestion
          options={question.options || []}
          value={value}
          onChange={onChange}
        />
      );
    default:
      return <div className="p-4 bg-red-50 text-red-500 rounded-lg border border-red-200">Unsupported question type: {question.type}</div>;
  }
};
