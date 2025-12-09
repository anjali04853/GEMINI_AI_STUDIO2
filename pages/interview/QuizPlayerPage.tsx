import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useInterviewStore } from '../../store/interviewStore';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';

export const QuizPlayerPage = () => {
  const navigate = useNavigate();
  const { 
    activeQuestions, 
    currentQuestionIndex, 
    activeConfig, 
    answers, 
    isQuizActive,
    nextQuestion,
    prevQuestion,
    answerQuestion,
    submitQuiz
  } = useInterviewStore();

  const [timeLeft, setTimeLeft] = useState(activeConfig?.timeLimit ? activeConfig.timeLimit * 60 : 0);

  // Timer Effect
  useEffect(() => {
    if (!activeConfig?.timeLimit || !isQuizActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeConfig, isQuizActive]);

  const handleSubmit = () => {
    const sessionId = submitQuiz();
    navigate(`/interview/results?session=${sessionId}`);
  };

  if (!isQuizActive || activeQuestions.length === 0) {
    return <Navigate to="/interview" replace />;
  }

  const currentQ = activeQuestions[currentQuestionIndex];
  const selectedOption = answers[currentQ.id];
  const isLast = currentQuestionIndex === activeQuestions.length - 1;
  const progress = ((currentQuestionIndex + 1) / activeQuestions.length) * 100;

  // Format Time
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-xs">
            {currentQ.topic}
          </Badge>
          <span className="text-sm text-slate-500">
            Question {currentQuestionIndex + 1} / {activeQuestions.length}
          </span>
        </div>
        {activeConfig?.timeLimit && activeConfig.timeLimit > 0 && (
          <div className={cn(
            "flex items-center font-mono text-sm font-medium px-3 py-1 rounded-md",
            timeLeft < 60 ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-700"
          )}>
            <Clock className="h-4 w-4 mr-2" />
            {timeString}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="min-h-[400px] flex flex-col">
        <CardHeader>
           <h2 className="text-xl font-bold text-slate-900 leading-relaxed">
             {currentQ.text}
           </h2>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          {currentQ.options.map((option, idx) => (
            <div
              key={idx}
              onClick={() => answerQuestion(currentQ.id, idx)}
              className={cn(
                "p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center group",
                selectedOption === idx
                  ? "border-blue-600 bg-blue-50 shadow-sm"
                  : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
              )}
            >
              <div className={cn(
                "h-6 w-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors",
                selectedOption === idx ? "border-blue-600 bg-blue-600" : "border-slate-300 group-hover:border-blue-300"
              )}>
                {selectedOption === idx && <CheckCircle2 className="h-4 w-4 text-white" />}
              </div>
              <span className={cn(
                "text-base",
                selectedOption === idx ? "text-blue-900 font-medium" : "text-slate-700"
              )}>
                {option}
              </span>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
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
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={nextQuestion}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <div className="flex justify-center">
        <Button variant="ghost" className="text-xs text-slate-400 hover:text-red-500" onClick={() => navigate('/interview')}>
          <AlertCircle className="h-3 w-3 mr-1" />
          Quit Quiz
        </Button>
      </div>
    </div>
  );
};