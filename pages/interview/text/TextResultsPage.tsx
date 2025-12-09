import React, { useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { Bot, RefreshCw, LayoutDashboard, ChevronDown, ChevronUp } from 'lucide-react';
import { useTextInterviewStore } from '../../../store/textInterviewStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { generateResponse } from '../../../services/geminiService';
import { cn } from '../../../lib/utils';

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

  const handleAnalyze = async (questionId: string, questionText: string, answerText: string) => {
    if (analyzingIds.includes(questionId) || !answerText.trim()) return;

    setAnalyzingIds(prev => [...prev, questionId]);
    
    try {
      const prompt = `
        Act as a senior hiring manager. Evaluate the following interview answer.
        
        Question: "${questionText}"
        Candidate Answer: "${answerText}"
        
        Provide a constructive critique in valid HTML format (no markdown, use <h4>, <p>, <ul>, <li>).
        Includes:
        1. A score out of 10.
        2. Key Strengths (bullet points).
        3. Areas for Improvement (bullet points).
        4. A refined version of the answer.
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-slate-900">Interview Analysis</h1>
        <p className="text-slate-500">Review your answers and get AI-powered feedback.</p>
      </div>

      <div className="space-y-6">
        {session.questions.map((q, index) => {
          const answer = session.answers[q.id] || "No answer provided.";
          const feedback = session.feedback?.[q.id];
          const isAnalyzing = analyzingIds.includes(q.id);
          const isExpanded = expandedId === q.id;

          return (
            <Card key={q.id} className="overflow-hidden border border-slate-200">
              <CardHeader className="bg-slate-50 border-b border-slate-100 cursor-pointer" onClick={() => toggleExpand(q.id)}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Question {index + 1}</span>
                    <h3 className="text-lg font-semibold text-slate-900 mt-1">{q.text}</h3>
                  </div>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="p-6 space-y-6">
                  {/* User Answer */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Your Answer:</h4>
                    <div className="p-4 bg-slate-50 rounded-md text-slate-800 text-sm whitespace-pre-wrap leading-relaxed border border-slate-200">
                      {answer}
                    </div>
                  </div>

                  {/* Analysis Section */}
                  <div className="border-t border-slate-100 pt-6">
                    {feedback ? (
                      <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                        <div className="flex items-center gap-2 mb-4">
                          <Bot className="h-5 w-5 text-purple-600" />
                          <h4 className="font-bold text-purple-900">AI Feedback</h4>
                        </div>
                        {/* We use dangerouslySetInnerHTML assuming Gemini returns safe HTML based on our prompt instructions, 
                            in production we would sanitize this. */}
                        <div 
                          className="prose prose-sm prose-purple max-w-none"
                          dangerouslySetInnerHTML={{ __html: feedback }} 
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <Button 
                          onClick={() => handleAnalyze(q.id, q.text, answer)}
                          isLoading={isAnalyzing}
                          className="bg-purple-600 hover:bg-purple-700"
                          disabled={!answer.trim()}
                        >
                          <Bot className="mr-2 h-4 w-4" />
                          {isAnalyzing ? 'Analyzing...' : 'Generate AI Feedback'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
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
        <Link to="/interview/text/setup">
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Practice Session
          </Button>
        </Link>
      </div>
    </div>
  );
};