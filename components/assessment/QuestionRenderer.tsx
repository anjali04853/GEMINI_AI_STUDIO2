import React from 'react';
import { Question } from '../../types';
import { MultipleChoiceQuestion, TextQuestion, RatingQuestion } from './QuestionTypes';

interface QuestionRendererProps {
  question: Question;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
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
    default:
      return <div>Unsupported question type</div>;
  }
};