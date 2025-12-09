
import React, { useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, RefreshCw, LayoutDashboard, Target, Zap, Layers } from 'lucide-react';
import { useInterviewStore } from '../../store/interviewStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';

export const QuizResultsPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const { sessions } = useInterviewStore();
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [showOnlyIncorrect, setShowOnlyIncorrect] = useState(false);

  const session = sessions.find(s => s.id === sessionId);

  if (!sessionId || !session) {
    return <Navigate to="/interview" replace />;
  }

  // Assuming session.questions is populated (based on store updates logic)
  // Fallback to empty array if type mismatch during dev
  const questions = (session as any).questions || [];
  
  // Helpers for Hero styling
  const getScoreTheme = () => {
      if (session.score >= 80) return {
          gradient: "from-green-500 to-emerald-700",
          icon: <CheckCircle className="h-16 w-16 text-white opacity-80" />,
          message: "Excellent Job!"
      };
      if (session.score >= 60) return {
          gradient: "from-brand-turquoise to-teal-600",
          icon: <Target className="h-16 w-16 text-white opacity-80" />,
          message: "Good Effort!"
      };
      return {
          gradient: "from-orange-400 to-red-500",
          icon: <Zap className="h-16 w-16 text-white opacity-80" />,
          message: "Keep Practicing!"
      };
  };

  const theme = getScoreTheme();
  
  const toggleExpand = (id: string) => {
    setExpandedQuestion(curr => curr === id ? null : id);
  };

  const filteredQuestions = showOnlyIncorrect 
    ? questions.filter((q: any) => session.answers[q.id] !== q.correctOptionIndex)
    : questions;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* Score Hero Card */}
      <div className={cn(
          "rounded-[32px] overflow-hidden text-white shadow-2xl relative p-10 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r",
          theme.gradient
      )}>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
          
          <div className="relative z-10 text-center md:text-left space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">{theme.message}</h1>
              <p className="text-white/80 text-lg">You completed the {session.config.difficulty} {session.config.topics[0]} Quiz</p>
          </div>

          <div className="relative z-10 mt-6 md:mt-0 flex items-center gap-6">
              <div className="text-center">
                  <div className="text-6xl font-extrabold drop-shadow-md">{session.score}%</div>
                  <div className="text-sm font-medium uppercase tracking-widest opacity-80 mt-1">Total Score</div>
              </div>
              <div className="hidden md:block w-px h-24 bg-white/20"></div>
              <div className="hidden md:block">
                  {theme.icon}
              </div>
          </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
          {/* Accuracy */}
          <Card className="border-t-4 border-green-500">
             <CardContent className="p-6">
                 <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 bg-green-100 rounded-lg text-green-600">
                         <Target className="h-6 w-6" />
                     </div>
                     <div>
                         <div className="text-sm text-slate-500 font-medium">Accuracy</div>
                         <div className="text-2xl font-bold text-slate-900">{session.correctCount} / {session.totalQuestions}</div>
                     </div>
                 </div>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-green-500" style={{ width: `${session.score}%` }}></div>
                 </div>
             </CardContent>
          </Card>

          {/* Speed */}
          <Card className="border-t-4 border-brand-sky">
             <CardContent className="p-6">
                 <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 bg-sky-100 rounded-lg text-brand-sky">
                         <Zap className="h-6 w-6" />
                     </div>
                     <div>
                         <div className="text-sm text-slate-500 font-medium">Avg Time/Q</div>
                         <div className="text-2xl font-bold text-slate-900">{Math.round(session.durationSeconds / session.totalQuestions)}s</div>
                     </div>
                 </div>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-brand-sky" style={{ width: '75%' }}></div>
                 </div>
             </CardContent>
          </Card>

          {/* Topics */}
          <Card className="border-t-4 border-brand-turquoise">
             <CardContent className="p-6">
                 <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 bg-teal-100 rounded-lg text-brand-turquoise">
                         <Layers className="h-6 w-6" />
                     </div>
                     <div>
                         <div className="text-sm text-slate-500 font-medium">Topics Covered</div>
                         <div className="text-lg font-bold text-slate-900 truncate max-w-[150px]">{session.config.topics.join(', ')}</div>
                     </div>
                 </div>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-brand-turquoise" style={{ width: '100%' }}></div>
                 </div>
             </CardContent>
          </Card>
      </div>

      {/* Review Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Question Review</h2>
            <Button 
                variant="outline" 
                onClick={() => setShowOnlyIncorrect(!showOnlyIncorrect)}
                className={cn(
                    "border-brand-purple text-brand-purple hover:bg-brand-lavender",
                    showOnlyIncorrect && "bg-brand-purple text-white hover:bg-brand-darkPurple hover:text-white"
                )}
            >
                {showOnlyIncorrect ? "Show All Questions" : "Show Only Incorrect"}
            </Button>
        </div>

        <div className="space-y-4">
            {filteredQuestions.map((q: any, index: number) => {
            const userAnswerIndex = session.answers[q.id];
            const isCorrect = userAnswerIndex === q.correctOptionIndex;
            const isExpanded = expandedQuestion === q.id;

            return (
                <Card 
                    key={q.id} 
                    className={cn(
                        "overflow-hidden transition-all duration-300 border-l-[6px] shadow-sm hover:shadow-md", 
                        isCorrect ? "border-l-green-500" : "border-l-red-500"
                    )}
                >
                <div 
                    className="p-5 flex items-start gap-4 cursor-pointer bg-white"
                    onClick={() => toggleExpand(q.id)}
                >
                    <div className={cn(
                        "mt-0.5 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs",
                        isCorrect ? "bg-green-500" : "bg-red-500"
                    )}>
                        {showOnlyIncorrect ? '!' : index + 1}
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <p className="font-semibold text-slate-900 text-lg pr-8">{q.text}</p>
                            {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                        </div>
                        
                        {!isExpanded && (
                            <div className="mt-2 flex items-center gap-3">
                                <Badge variant="secondary" className={cn("text-xs", isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
                                    Your Answer: {q.options[userAnswerIndex]}
                                </Badge>
                                {!isCorrect && (
                                    <span className="text-xs text-slate-400">Click to see correct answer</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {isExpanded && (
                    <div className="px-5 pb-6 pl-14 space-y-4 bg-slate-50/80 border-t border-slate-100 pt-4 animate-in slide-in-from-top-2">
                        <div className="grid gap-2">
                            {q.options.map((opt: string, idx: number) => (
                            <div 
                                key={idx}
                                className={cn(
                                "text-sm p-3 rounded-lg flex items-center border",
                                idx === q.correctOptionIndex 
                                    ? "bg-brand-lavender/50 border-brand-purple/20 text-brand-darkPurple font-medium" // Correct Answer Style
                                    : idx === userAnswerIndex && !isCorrect 
                                        ? "bg-red-50 border-red-100 text-red-800" // Wrong Selection Style
                                        : "bg-white border-slate-100 text-slate-600"
                                )}
                            >
                                <div className="w-6 mr-2 flex justify-center">
                                    {idx === q.correctOptionIndex && <CheckCircle className="h-4 w-4 text-brand-purple" />}
                                    {idx === userAnswerIndex && !isCorrect && <XCircle className="h-4 w-4 text-red-500" />}
                                </div>
                                {opt}
                            </div>
                            ))}
                        </div>
                        
                        <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-sky"></div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Explanation</h4>
                            <p className="text-sm text-slate-700 leading-relaxed">
                                {q.explanation}
                            </p>
                        </div>
                    </div>
                )}
                </Card>
            );
            })}
            
            {filteredQuestions.length === 0 && (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-500">No incorrect answers to review. Great job!</p>
                </div>
            )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <Link to="/interview">
          <Button variant="outline" className="w-full sm:w-auto h-12 px-8 border-slate-200">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Link to="/interview/setup">
          <Button className="w-full sm:w-auto h-12 px-8 bg-brand-pink hover:bg-pink-600 shadow-lg shadow-brand-pink/20">
            <RefreshCw className="mr-2 h-4 w-4" />
            Start New Quiz
          </Button>
        </Link>
      </div>

    </div>
  );
};
