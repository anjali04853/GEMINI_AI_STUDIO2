import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Save, AlertCircle } from 'lucide-react';
import { useTextInterviewStore } from '../../../store/textInterviewStore';
import { Card, CardContent, CardFooter, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';

export const TextPlayerPage = () => {
  const navigate = useNavigate();
  const { 
    activeQuestions, 
    currentQuestionIndex, 
    answers, 
    isInterviewActive,
    nextQuestion,
    prevQuestion,
    updateAnswer,
    submitInterview
  } = useTextInterviewStore();

  const [savedStatus, setSavedStatus] = useState<string>('');

  // Auto-save feedback effect (mock)
  useEffect(() => {
    if (savedStatus) {
      const timer = setTimeout(() => setSavedStatus(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [savedStatus]);

  if (!isInterviewActive || activeQuestions.length === 0) {
    return <Navigate to="/interview" replace />;
  }

  const currentQ = activeQuestions[currentQuestionIndex];
  const currentAnswer = answers[currentQ.id] || '';
  const isLast = currentQuestionIndex === activeQuestions.length - 1;
  const progress = ((currentQuestionIndex + 1) / activeQuestions.length) * 100;
  const wordCount = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateAnswer(currentQ.id, e.target.value);
    setSavedStatus('Saving...');
  };

  const handleSubmit = () => {
    const sessionId = submitInterview();
    navigate(`/interview/text/results?session=${sessionId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-xs">
            {currentQ.type}
          </Badge>
          <span className="text-sm text-slate-500">
            Question {currentQuestionIndex + 1} / {activeQuestions.length}
          </span>
        </div>
        <div className="text-xs text-slate-400 font-medium">
            {savedStatus || 'All changes saved'}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-purple-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question & Input */}
      <Card className="min-h-[500px] flex flex-col">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
           <h2 className="text-xl font-bold text-slate-900 leading-relaxed">
             {currentQ.text}
           </h2>
           <p className="text-sm text-slate-500 mt-1">
             Take your time to write a structured response (STAR method recommended).
           </p>
        </CardHeader>
        <CardContent className="flex-1 p-0 flex flex-col">
          <textarea
            className="flex-1 w-full resize-none p-6 focus:outline-none text-base text-slate-800 leading-relaxed"
            placeholder="Type your answer here..."
            value={currentAnswer}
            onChange={handleTextChange}
            spellCheck={false}
          />
          <div className="px-6 py-2 border-t border-slate-100 flex justify-end text-xs text-slate-400">
             {wordCount} words
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-slate-100 py-4 bg-slate-50/50">
          <Button 
            variant="ghost" 
            onClick={prevQuestion} 
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {isLast ? (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Submit & Analyze
            </Button>
          ) : (
            <Button onClick={nextQuestion}>
              Next Question
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <div className="flex justify-center">
        <Button variant="ghost" className="text-xs text-slate-400 hover:text-red-500" onClick={() => navigate('/interview')}>
          <AlertCircle className="h-3 w-3 mr-1" />
          Quit Interview
        </Button>
      </div>
    </div>
  );
};