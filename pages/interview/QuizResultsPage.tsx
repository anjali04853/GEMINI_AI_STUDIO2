import React, { useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, RefreshCw, LayoutDashboard } from 'lucide-react';
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

  const session = sessions.find(s => s.id === sessionId);

  if (!sessionId || !session) {
    return <Navigate to="/interview" replace />;
  }

  // Combine questions with answers for rendering
  const reviewData = session.config.topics.length > 0 ? session.questions || [] : []; 
  // Note: In a real app we might store the questions within the session to ensure history integrity 
  // if question text changes. For now we are using the 'activeQuestions' logic implicitly stored in session 
  // (Assuming we added 'questions' to InterviewSession interface in types.ts update, 
  // if not, we would need to map ids back to mock data, but mock data is static so it's safer to rely on session.questions if we saved it).
  
  // Let's assume we need to update types.ts to include questions in Session, 
  // which I included in the types.ts update plan above.
  
  // Mock questions fallback if types aren't perfectly aligned in runtime during dev HMR
  const questions = (session as any).questions || [];

  const toggleExpand = (id: string) => {
    setExpandedQuestion(curr => curr === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-slate-900">Quiz Results</h1>
        <p className="text-slate-500">Completed on {new Date(session.date).toLocaleDateString()}</p>
      </div>

      {/* Score Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1 md:col-span-1 border-t-4 border-t-blue-600">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="relative h-32 w-32 flex items-center justify-center rounded-full border-8 border-slate-100">
               <span className="text-3xl font-bold text-blue-600">{session.score}%</span>
               <svg className="absolute inset-0 h-full w-full -rotate-90 stroke-blue-600" viewBox="0 0 100 100" fill="none" strokeWidth="8" strokeDasharray="251" strokeDashoffset={251 - (251 * session.score) / 100}>
                 <circle cx="50" cy="50" r="40" />
               </svg>
            </div>
            <p className="mt-4 font-medium text-slate-900">
              {session.correctCount} / {session.totalQuestions} Correct
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Breakdown by difficulty and timing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Time Taken</p>
                <p className="text-xl font-bold text-slate-900">
                  {Math.floor(session.durationSeconds / 60)}m {session.durationSeconds % 60}s
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                 <p className="text-sm text-slate-500 mb-1">Topics</p>
                 <div className="flex flex-wrap gap-1 mt-1">
                   {session.config.topics.map(t => (
                     <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                   ))}
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Review */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Detailed Review</h2>
        {questions.map((q: any, index: number) => {
          const userAnswerIndex = session.answers[q.id];
          const isCorrect = userAnswerIndex === q.correctOptionIndex;
          const isExpanded = expandedQuestion === q.id;

          return (
            <Card key={q.id} className={cn("overflow-hidden transition-all", isCorrect ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500")}>
              <div 
                className="p-4 flex items-start gap-4 cursor-pointer hover:bg-slate-50"
                onClick={() => toggleExpand(q.id)}
              >
                <div className="mt-1 flex-shrink-0">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-slate-900 pr-8">{q.text}</p>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </div>
                  {!isExpanded && (
                    <p className="text-sm text-slate-500 mt-1">
                      Click to see explanation
                    </p>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pl-14 space-y-3 bg-slate-50/50 border-t border-slate-100 pt-3">
                  <div className="space-y-2">
                    {q.options.map((opt: string, idx: number) => (
                      <div 
                        key={idx}
                        className={cn(
                          "text-sm p-2 rounded flex items-center",
                          idx === q.correctOptionIndex ? "bg-green-100 text-green-800 font-medium" :
                          idx === userAnswerIndex && !isCorrect ? "bg-red-100 text-red-800 line-through" :
                          "text-slate-600"
                        )}
                      >
                        {idx === q.correctOptionIndex && <CheckCircle className="h-3 w-3 mr-2 inline" />}
                        {opt}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 rounded text-sm text-blue-900">
                    <span className="font-semibold block mb-1">Explanation:</span>
                    {q.explanation}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 py-8">
        <Link to="/interview">
          <Button variant="outline">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Link to="/interview/setup">
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Start New Quiz
          </Button>
        </Link>
      </div>

    </div>
  );
};