
import React, { useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { Bot, RefreshCw, LayoutDashboard, ChevronDown, ChevronUp, Zap, Target, BookOpen, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { useTextInterviewStore } from '../../../store/textInterviewStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { generateResponse } from '../../../services/geminiService';
import { cn } from '../../../lib/utils';
import { Badge } from '../../../components/ui/Badge';

export const TextResultsPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const { sessions, saveFeedback } = useTextInterviewStore();
  const session = sessions.find(s => s.id === sessionId);
  const [analyzingIds, setAnalyzingIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!sessionId || !session) {
    return <Navigate to="/interview" replace />;
  }

  // Mock score logic (in real app, this would come from AI analysis of all answers)
  const completedCount = Object.keys(session.answers).length;
  const mockScore = Math.min(100, Math.max(60, completedCount * 20)); 

  const handleAnalyze = async (questionId: string, questionText: string, answerText: string) => {
    if (analyzingIds.includes(questionId) || !answerText.trim()) return;

    setAnalyzingIds(prev => [...prev, questionId]);
    
    try {
      const prompt = `
        Act as a senior hiring manager. Evaluate the following interview answer.
        
        Question: "${questionText}"
        Candidate Answer: "${answerText}"
        
        Provide a constructive critique in valid HTML format (no markdown, use <h4>, <p>, <ul>, <li>).
        Structure the HTML with these specific sections (do not include html/body tags):
        <div class="feedback-section strengths">
           <h4>Strengths</h4>
           <ul><li>...</li></ul>
        </div>
        <div class="feedback-section improvements">
           <h4>Areas for Improvement</h4>
           <ul><li>...</li></ul>
        </div>
        <div class="feedback-section suggestions">
           <h4>Refined Suggestion</h4>
           <p>...</p>
        </div>
      `;
      
      const response = await generateResponse(prompt);
      saveFeedback(sessionId, { [questionId]: response });
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setAnalyzingIds(prev => prev.filter(id => id !== questionId));
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(curr => curr === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* Overview Hero Card */}
      <div className="rounded-[32px] bg-gradient-to-r from-brand-purple to-indigo-800 text-white p-8 md:p-12 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
               <h1 className="text-4xl font-extrabold tracking-tight">Interview Analysis</h1>
               <p className="text-indigo-200 text-lg">Detailed feedback on your {session.config.types.join(', ')} session.</p>
               <div className="flex gap-2 justify-center md:justify-start mt-4">
                  {session.config.types.map(t => (
                      <span key={t} className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">{t}</span>
                  ))}
               </div>
            </div>

            <div className="flex items-center gap-8">
               <div className="text-center">
                  <div className="text-6xl font-black drop-shadow-md">{mockScore}</div>
                  <div className="text-xs uppercase tracking-widest opacity-80 font-bold mt-1">Quality Score</div>
               </div>
               
               <div className="hidden md:flex flex-col gap-3 w-48">
                  <div className="space-y-1">
                     <div className="flex justify-between text-xs font-bold uppercase opacity-80"><span>Structure</span><span>85%</span></div>
                     <div className="h-1.5 bg-black/20 rounded-full overflow-hidden"><div className="h-full bg-brand-turquoise w-[85%]"></div></div>
                  </div>
                  <div className="space-y-1">
                     <div className="flex justify-between text-xs font-bold uppercase opacity-80"><span>Relevance</span><span>92%</span></div>
                     <div className="h-1.5 bg-black/20 rounded-full overflow-hidden"><div className="h-full bg-brand-pink w-[92%]"></div></div>
                  </div>
                  <div className="space-y-1">
                     <div className="flex justify-between text-xs font-bold uppercase opacity-80"><span>Depth</span><span>78%</span></div>
                     <div className="h-1.5 bg-black/20 rounded-full overflow-hidden"><div className="h-full bg-brand-sky w-[78%]"></div></div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Questions Accordion */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 px-2">Detailed Feedback</h2>
        
        {session.questions.map((q, index) => {
          const answer = session.answers[q.id] || "";
          const feedback = session.feedback?.[q.id];
          const isAnalyzing = analyzingIds.includes(q.id);
          const isExpanded = expandedId === q.id;
          const hasAnswer = answer.length > 0;

          // Mock score color per question (logic would be dynamic in real app)
          const borderColor = hasAnswer ? "border-l-brand-turquoise" : "border-l-orange-500";
          const statusColor = hasAnswer ? "bg-brand-turquoise" : "bg-orange-500";

          return (
            <Card key={q.id} className={cn("overflow-hidden transition-all duration-300 border-l-[6px] shadow-sm hover:shadow-md", borderColor)}>
              <CardHeader 
                className={cn("cursor-pointer transition-colors", isExpanded ? "bg-slate-50" : "bg-white")} 
                onClick={() => toggleExpand(q.id)}
              >
                <div className="flex items-start gap-4">
                   <div className={cn("mt-1 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0", statusColor)}>
                      {index + 1}
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start">
                         <h3 className="text-lg font-bold text-slate-900 pr-8 leading-snug">{q.text}</h3>
                         {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400 shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />}
                      </div>
                      <div className="flex gap-2 mt-2">
                         <Badge variant="outline" className="text-xs">{q.type}</Badge>
                         {!hasAnswer && <Badge variant="warning" className="text-xs">Skipped</Badge>}
                         {feedback && <Badge variant="success" className="text-xs bg-purple-100 text-purple-700 border-purple-200">AI Analyzed</Badge>}
                      </div>
                   </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="p-0">
                  <div className="p-6 space-y-8 bg-white border-t border-slate-100">
                    {/* User Answer */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                            Your Response
                        </div>
                        <div className="p-5 bg-brand-offWhite rounded-xl text-slate-800 text-base leading-relaxed border-2 border-slate-100 italic">
                             {answer || <span className="text-slate-400 not-italic">No answer provided.</span>}
                        </div>
                    </div>

                    {/* AI Feedback */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-brand-purple uppercase tracking-wide">
                            <Sparkles className="w-4 h-4" />
                            AI Coach Assessment
                        </div>
                        
                        {feedback ? (
                           <div className="grid gap-4 md:grid-cols-2">
                               {/* We inject HTML but style it with Tailwind via typography plugin or custom CSS usually. 
                                   Here we rely on the specific structure requested in the prompt being returned. 
                                   Since we can't guarantee Gemini's HTML structure perfectly without parsing, 
                                   we'll wrap it in a container that styles generic elements nicely. 
                               */}
                               <div 
                                  className="col-span-2 prose prose-sm prose-purple max-w-none 
                                  prose-h4:font-bold prose-h4:text-slate-900 prose-h4:mb-2 prose-h4:mt-4
                                  prose-ul:list-disc prose-ul:pl-5 prose-li:mb-1
                                  [&_.strengths]:bg-green-50 [&_.strengths]:p-4 [&_.strengths]:rounded-xl [&_.strengths]:border [&_.strengths]:border-green-100
                                  [&_.improvements]:bg-orange-50 [&_.improvements]:p-4 [&_.improvements]:rounded-xl [&_.improvements]:border [&_.improvements]:border-orange-100
                                  [&_.suggestions]:bg-brand-lavender/30 [&_.suggestions]:p-4 [&_.suggestions]:rounded-xl [&_.suggestions]:border [&_.suggestions]:border-brand-purple/20
                                  "
                                  dangerouslySetInnerHTML={{ __html: feedback }} 
                               />
                           </div>
                        ) : (
                           <div className="bg-slate-50 rounded-xl p-8 text-center border-2 border-dashed border-slate-200">
                               <p className="text-slate-500 mb-4">Get instant feedback on your response structure, tone, and content.</p>
                               <Button 
                                  onClick={() => handleAnalyze(q.id, q.text, answer)}
                                  isLoading={isAnalyzing}
                                  className="bg-brand-purple hover:bg-brand-darkPurple"
                                  disabled={!hasAnswer}
                               >
                                  <Bot className="mr-2 h-4 w-4" />
                                  {isAnalyzing ? 'Analyzing...' : 'Generate AI Feedback'}
                               </Button>
                           </div>
                        )}
                    </div>

                    {/* Sample Answer (Static Mock) */}
                    {q.sampleAnswer && (
                        <div className="pt-6 border-t border-slate-100">
                           <div className="bg-brand-sky/5 border border-brand-sky/20 rounded-xl p-5">
                              <div className="flex items-center gap-2 mb-3 text-brand-sky font-bold text-sm uppercase">
                                  <BookOpen className="h-4 w-4" />
                                  Model Answer
                              </div>
                              <p className="text-slate-700 text-sm leading-relaxed">
                                  {q.sampleAnswer}
                              </p>
                           </div>
                        </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 border-t border-slate-200">
        <Link to="/interview">
          <Button variant="outline" className="w-full sm:w-auto h-12 px-8 border-slate-300">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Link to="/interview/text/setup">
          <Button className="w-full sm:w-auto h-12 px-8 bg-brand-pink hover:bg-pink-600 shadow-lg shadow-brand-pink/20">
            <RefreshCw className="mr-2 h-4 w-4" />
            Start New Session
          </Button>
        </Link>
      </div>
    </div>
  );
};
