import React, { useState, useEffect } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Download, RefreshCw, Bot, ChevronRight, Trophy, Star, TrendingUp, BookOpen } from 'lucide-react';
import { useAssessmentStore } from '../../store/assessmentStore';
import { mockAssessments } from '../../data/mockAssessments';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { generateResponse } from '../../services/geminiService';
import { cn } from '../../lib/utils';

export const AssessmentResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { responses, isFinished } = useAssessmentStore();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  const assessment = mockAssessments.find(a => a.id === id);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!assessment) return <Navigate to="/assessments" replace />;
  const hasResponses = Object.keys(responses).length > 0;
  
  const score = hasResponses ? 85 : 0; 
  const totalQuestions = assessment.questions.length;
  const correctAnswers = Math.round(totalQuestions * (score / 100));

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `
        I completed assessment "${assessment.title}". 
        Score: ${score}%.
        Questions/Answers: ${assessment.questions.map(q => `Q:${q.text} A:${responses[q.id] || 'Skipped'}`).join(' | ')}
        
        Provide:
        1. Two Strengths (bullet points).
        2. Two Areas to Improve (bullet points).
        3. One Career Suggestion.
        Return strictly HTML content (using <ul>, <li>, <strong> tags). No markdown.
      `;
      
      const result = await generateResponse(prompt);
      setAnalysis(result);
    } catch (error) {
      setAnalysis("<ul><li>Analysis unavailable. Please try again.</li></ul>");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section */}
      <div className="relative rounded-[32px] overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-purple via-indigo-600 to-slate-900 text-white p-12 text-center shadow-2xl">
        {/* Background Particles (Simulated) */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        {showConfetti && (
             <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <div className="w-full h-full animate-pulse opacity-50 bg-gradient-to-t from-transparent to-white/10"></div>
             </div>
        )}

        <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-500">
           <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              <Trophy className="h-16 w-16 text-brand-yellow drop-shadow-lg" />
           </div>
           
           <h1 className="text-5xl font-extrabold mb-2 tracking-tight drop-shadow-md">{score}%</h1>
           <p className="text-indigo-100 text-lg font-medium mb-6 uppercase tracking-widest">Assessment Score</p>
           
           <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 text-sm font-semibold">
              <CheckCircle className="h-4 w-4 text-brand-turquoise" />
              {correctAnswers} / {totalQuestions} Correct Answers
           </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Career Fit Card */}
        <Card className="lg:col-span-1 border-t-4 border-t-brand-pink shadow-lg">
          <CardHeader className="bg-brand-pink/5">
             <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900">Job Fit</CardTitle>
                <div className="p-2 bg-white rounded-lg shadow-sm text-brand-pink">
                    <Star className="h-5 w-5 fill-current" />
                </div>
             </div>
          </CardHeader>
          <CardContent className="pt-6">
             <div className="space-y-4">
                <div className="p-4 rounded-xl border border-brand-pink/20 bg-white shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 bg-brand-pink text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">BEST MATCH</div>
                   <h4 className="font-bold text-slate-800">Senior Frontend Dev</h4>
                   <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-brand-pink w-[92%]"></div>
                      </div>
                      <span className="text-xs font-bold text-brand-pink">92%</span>
                   </div>
                </div>
                
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 opacity-80">
                   <h4 className="font-bold text-slate-700">UI/UX Engineer</h4>
                   <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                         <div className="h-full bg-brand-purple w-[78%]"></div>
                      </div>
                      <span className="text-xs font-bold text-brand-purple">78%</span>
                   </div>
                </div>
             </div>
          </CardContent>
        </Card>

        {/* AI Analysis - Strengths & Weaknesses */}
        <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
           <Card className="border-none shadow-md bg-gradient-to-br from-white to-green-50/50">
              <CardHeader>
                 <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-green-100 text-green-600"><TrendingUp className="h-5 w-5" /></div>
                    <CardTitle className="text-lg">Strengths</CardTitle>
                 </div>
              </CardHeader>
              <CardContent>
                 {analysis ? (
                    <div className="prose prose-sm prose-green" dangerouslySetInnerHTML={{__html: analysis.split('Improve')[0]}}></div>
                 ) : (
                    <ul className="space-y-3">
                       <li className="flex gap-3 items-start p-3 bg-white rounded-lg shadow-sm border border-green-100">
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">Advanced React Patterns</span>
                       </li>
                       <li className="flex gap-3 items-start p-3 bg-white rounded-lg shadow-sm border border-green-100">
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">Component Optimization</span>
                       </li>
                    </ul>
                 )}
              </CardContent>
           </Card>

           <Card className="border-none shadow-md bg-gradient-to-br from-white to-orange-50/50">
              <CardHeader>
                 <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-orange-100 text-orange-600"><BookOpen className="h-5 w-5" /></div>
                    <CardTitle className="text-lg">Focus Areas</CardTitle>
                 </div>
              </CardHeader>
              <CardContent>
                 {analysis ? (
                    <div className="prose prose-sm prose-orange" dangerouslySetInnerHTML={{__html: analysis.split('Improve')[1] || "..."}}></div>
                 ) : (
                    <ul className="space-y-3">
                       <li className="flex gap-3 items-start p-3 bg-white rounded-lg shadow-sm border border-orange-100">
                          <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">Server-Side Rendering</span>
                       </li>
                       <li className="flex gap-3 items-start p-3 bg-white rounded-lg shadow-sm border border-orange-100">
                          <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">Accessibility Standards</span>
                       </li>
                    </ul>
                 )}
              </CardContent>
           </Card>
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-6">
         <Button 
            onClick={handleAIAnalysis} 
            isLoading={isAnalyzing}
            className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white"
            disabled={!!analysis}
         >
            <Bot className="mr-2 h-4 w-4" />
            {analysis ? 'Analysis Generated' : 'Generate Detailed AI Report'}
         </Button>
         
         <div className="flex gap-4 w-full md:w-auto">
            <Link to="/assessments" className="flex-1">
               <Button variant="outline" className="w-full">
                  Back to List
               </Button>
            </Link>
            <Link to={`/assessments/${id}`} className="flex-1">
               <Button variant="secondary" className="w-full bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 border-transparent">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retake
               </Button>
            </Link>
         </div>
      </div>
    </div>
  );
};