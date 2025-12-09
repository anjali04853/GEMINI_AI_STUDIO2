
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

  // Format Time
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Timer Color Logic
  const getTimerColor = () => {
      if (!activeConfig?.timeLimit) return "text-brand-purple bg-brand-lavender";
      if (timeLeft > 30) return "text-brand-turquoise bg-teal-50";
      if (timeLeft > 10) return "text-orange-500 bg-orange-50";
      return "text-red-500 bg-red-50 animate-pulse";
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 pb-10">
      
      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border-b-4 border-slate-100 shadow-sm">
            <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-xs border-brand-sky text-brand-sky bg-sky-50">
                    {currentQ.topic}
                </Badge>
                <div className="px-3 py-1 bg-brand-lavender text-slate-700 rounded-full text-xs font-bold">
                    Question {currentQuestionIndex + 1}
                </div>
            </div>
            
            {activeConfig?.timeLimit ? (
                <div className={cn("flex items-center font-mono text-sm font-bold px-4 py-1.5 rounded-full transition-colors", getTimerColor())}>
                    <Clock className="h-4 w-4 mr-2" />
                    {timeString}
                </div>
            ) : (
                <div className="text-brand-purple font-bold">Unlimited Time</div>
            )}
        </div>

        {/* Question Card */}
        <Card className="min-h-[500px] flex flex-col rounded-[24px] shadow-xl border-none">
            <CardHeader className="bg-white p-8 pb-4">
                <h2 className="text-2xl font-bold text-slate-900 leading-relaxed">
                    {currentQ.text}
                </h2>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 p-8">
            {currentQ.options.map((option, idx) => (
                <div
                key={idx}
                onClick={() => answerQuestion(currentQ.id, idx)}
                className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center group",
                    selectedOption === idx
                    ? "border-brand-purple bg-brand-lavender/30 shadow-md transform scale-[1.01]"
                    : "border-slate-100 bg-white hover:border-brand-purple/50 hover:bg-brand-lavender/10"
                )}
                >
                <div className={cn(
                    "h-8 w-8 rounded-full border-2 mr-4 flex items-center justify-center transition-colors font-bold text-sm",
                    selectedOption === idx 
                        ? "border-brand-purple bg-brand-purple text-white" 
                        : "border-slate-200 text-slate-400 group-hover:border-brand-purple group-hover:text-brand-purple"
                )}>
                    {selectedOption === idx ? <CheckCircle2 className="h-5 w-5" /> : optionLabels[idx]}
                </div>
                <span className={cn(
                    "text-lg",
                    selectedOption === idx ? "text-brand-darkPurple font-medium" : "text-slate-700"
                )}>
                    {option}
                </span>
                </div>
            ))}
            </CardContent>
            <CardFooter className="flex justify-between border-t border-slate-100 p-6 bg-slate-50 rounded-b-[24px]">
                <Button 
                    variant="secondary" 
                    onClick={prevQuestion} 
                    disabled={currentQuestionIndex === 0}
                    className="hover:bg-white border-slate-200"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                </Button>
                
                {isLast ? (
                    <Button onClick={handleSubmit} className="bg-brand-pink hover:bg-pink-600 text-white shadow-lg shadow-brand-pink/30 hover:-translate-y-1">
                        Submit Answer
                    </Button>
                ) : (
                    <Button onClick={nextQuestion} className="bg-brand-purple hover:bg-brand-darkPurple shadow-lg shadow-brand-purple/30 hover:-translate-y-1">
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </CardFooter>
        </Card>
        
        <div className="flex justify-center md:hidden">
             {/* Mobile Quit Button */}
            <Button variant="ghost" className="text-xs text-slate-400 hover:text-red-500" onClick={() => navigate('/interview')}>
                <AlertCircle className="h-3 w-3 mr-1" />
                Quit Quiz
            </Button>
        </div>
      </div>

      {/* Right Sidebar - Navigation Grid */}
      <div className="w-full lg:w-72 flex-shrink-0">
         <div className="bg-brand-offWhite rounded-2xl p-6 border border-slate-200 sticky top-24">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Question Navigator</h3>
             <div className="grid grid-cols-5 gap-3">
                 {activeQuestions.map((_, idx) => {
                     const isCurrent = idx === currentQuestionIndex;
                     const isAnswered = answers[activeQuestions[idx].id] !== undefined;
                     
                     return (
                         <button
                           key={idx}
                           onClick={() => {/* Navigate logic if needed, usually linear but allowed here */}}
                           className={cn(
                               "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 shadow-sm",
                               isCurrent 
                                 ? "bg-brand-pink text-white ring-4 ring-brand-pink/20 scale-110 z-10" 
                                 : isAnswered 
                                    ? "bg-brand-turquoise text-white hover:bg-teal-500"
                                    : "bg-white border-2 border-slate-200 text-slate-400 hover:border-brand-purple/50"
                           )}
                         >
                             {idx + 1}
                         </button>
                     );
                 })}
             </div>
             
             <div className="mt-8 space-y-3">
                 <div className="flex items-center gap-3 text-xs text-slate-500">
                     <div className="w-3 h-3 rounded-full bg-brand-pink"></div>
                     <span>Current</span>
                 </div>
                 <div className="flex items-center gap-3 text-xs text-slate-500">
                     <div className="w-3 h-3 rounded-full bg-brand-turquoise"></div>
                     <span>Answered</span>
                 </div>
                 <div className="flex items-center gap-3 text-xs text-slate-500">
                     <div className="w-3 h-3 rounded-full border-2 border-slate-200 bg-white"></div>
                     <span>Unanswered</span>
                 </div>
             </div>

             <Button 
                variant="outline" 
                className="w-full mt-8 border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200" 
                onClick={() => navigate('/interview')}
             >
                <AlertCircle className="h-4 w-4 mr-2" />
                Quit Quiz
            </Button>
         </div>
      </div>
    </div>
  );
};
