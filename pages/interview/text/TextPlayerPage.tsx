
import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Save, AlertCircle, Info, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
import { useTextInterviewStore } from '../../../store/textInterviewStore';
import { Card, CardContent, CardFooter, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';
import { Tooltip } from '../../../components/ui/Tooltip';

export const TextPlayerPage = () => {
  const navigate = useNavigate();
  const { 
    activeQuestions, 
    currentQuestionIndex, 
    answers, 
    isInterviewActive,
    activeConfig,
    nextQuestion,
    prevQuestion,
    updateAnswer,
    submitInterview
  } = useTextInterviewStore();

  const [savedStatus, setSavedStatus] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState(0);

  // Auto-save feedback effect
  useEffect(() => {
    if (savedStatus) {
      const timer = setTimeout(() => setSavedStatus(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [savedStatus]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setElapsedTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isInterviewActive || activeQuestions.length === 0) {
    return <Navigate to="/interview" replace />;
  }

  const currentQ = activeQuestions[currentQuestionIndex];
  const currentAnswer = answers[currentQ.id] || '';
  const isLast = currentQuestionIndex === activeQuestions.length - 1;
  const wordCount = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0;
  
  // Character limit logic (mock limit 2000)
  const CHAR_LIMIT = 2000;
  const charCount = currentAnswer.length;
  const charPercentage = (charCount / CHAR_LIMIT) * 100;
  let charColor = "bg-slate-300";
  if (charPercentage > 90) charColor = "bg-red-500";
  else if (charPercentage > 75) charColor = "bg-orange-500";
  else if (charPercentage > 0) charColor = "bg-brand-purple";

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateAnswer(currentQ.id, e.target.value);
    setSavedStatus('Saving...');
  };

  const handleSubmit = () => {
    const sessionId = submitInterview();
    navigate(`/interview/text/results?session=${sessionId}`);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your response?")) {
        updateAnswer(currentQ.id, '');
    }
  };

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-50">
      
      {/* Left Panel - Question & Context */}
      <div className="w-full md:w-1/3 p-6 bg-brand-lavender/20 border-r border-slate-200 flex flex-col gap-6 overflow-y-auto">
         
         <div className="flex justify-between items-start">
             <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Question {currentQuestionIndex + 1} of {activeQuestions.length}</span>
                <div className="mt-2 flex gap-2">
                    <Badge variant="outline" className="bg-white border-brand-purple text-brand-purple">{currentQ.type}</Badge>
                    {activeConfig?.experienceLevel && <Badge variant="secondary" className="bg-white">{activeConfig.experienceLevel}</Badge>}
                </div>
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm text-brand-purple font-mono text-sm border border-brand-purple/20">
                 <Clock className="h-3.5 w-3.5" />
                 {formatTime(elapsedTime)}
             </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h2 className="text-xl font-bold text-slate-900 leading-relaxed">{currentQ.text}</h2>
         </div>

         <div className="bg-brand-sky/10 border border-brand-sky/20 rounded-xl p-4">
             <div className="flex items-center gap-2 mb-2 text-brand-sky">
                 <Info className="h-5 w-5" />
                 <span className="font-bold text-sm uppercase">Quick Tips</span>
             </div>
             <p className="text-sm text-slate-600 leading-relaxed">
                 {currentQ.type === 'Behavioral' && "Use the STAR method: Situation, Task, Action, Result. Be specific about your role."}
                 {currentQ.type === 'Technical' && "Focus on efficiency, scalability, and trade-offs. Explain 'why', not just 'how'."}
                 {currentQ.type === 'Situational' && "Explain your thought process. There isn't always one right answer, justify your choice."}
             </p>
         </div>

         <div className="mt-auto pt-6 flex justify-center">
            <Button variant="ghost" className="text-xs text-slate-400 hover:text-red-500" onClick={() => navigate('/interview')}>
                <AlertCircle className="h-3 w-3 mr-1" />
                Quit Session
            </Button>
         </div>
      </div>

      {/* Right Panel - Response Editor */}
      <div className="w-full md:w-2/3 flex flex-col h-[calc(100vh-4rem)] md:h-auto">
         
         {/* Editor Area */}
         <div className="flex-1 p-6 md:p-8 bg-white overflow-y-auto flex flex-col relative">
            <div className="absolute top-4 right-6 flex items-center gap-2">
                 <span className={cn("text-xs font-medium transition-all duration-300 flex items-center gap-1", savedStatus ? "opacity-100 text-green-600" : "opacity-0")}>
                    <CheckCircle2 className="h-3 w-3" />
                    Saved
                 </span>
            </div>

            <textarea
                className="flex-1 w-full resize-none focus:outline-none text-lg text-slate-800 leading-relaxed bg-brand-offWhite p-6 rounded-xl border-2 border-slate-100 focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/5 transition-all"
                placeholder="Type your structured response here..."
                value={currentAnswer}
                onChange={handleTextChange}
                maxLength={CHAR_LIMIT}
                spellCheck={false}
            />
            
            <div className="flex justify-between items-center mt-3 px-2">
                 <div className="text-xs font-medium text-slate-400">
                     {wordCount} words
                 </div>
                 <div className="flex items-center gap-3">
                     <span className={cn("text-xs font-bold", charPercentage > 90 ? "text-red-500" : "text-slate-400")}>
                        {charCount} / {CHAR_LIMIT}
                     </span>
                     <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className={cn("h-full transition-all duration-300", charColor)} style={{ width: `${charPercentage}%` }}></div>
                     </div>
                 </div>
            </div>
         </div>

         {/* Bottom Bar */}
         <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
             <div className="flex gap-2">
                 <Button variant="outline" onClick={() => updateAnswer(currentQ.id, currentAnswer)} className="border-brand-turquoise text-brand-turquoise hover:bg-teal-50">
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                 </Button>
                 <Button variant="ghost" onClick={handleClear} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
                    <RotateCcw className="h-4 w-4" />
                 </Button>
             </div>

             <div className="flex gap-3">
                 <Button 
                    variant="secondary" 
                    onClick={prevQuestion} 
                    disabled={currentQuestionIndex === 0}
                 >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Prev
                 </Button>

                 {isLast ? (
                    <Button onClick={handleSubmit} className="bg-brand-pink hover:bg-pink-600 text-white shadow-lg shadow-brand-pink/30 px-6">
                       Submit Interview
                    </Button>
                 ) : (
                    <Button onClick={nextQuestion} className="bg-brand-purple hover:bg-brand-darkPurple text-white px-6">
                       Next Question
                       <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                 )}
             </div>
         </div>
      </div>

    </div>
  );
};
