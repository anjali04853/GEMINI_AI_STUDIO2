import React, { useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { Bot, RefreshCw, LayoutDashboard, ChevronDown, ChevronUp, Play, Pause } from 'lucide-react';
import { useVoiceInterviewStore } from '../../../store/voiceInterviewStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { generateResponse } from '../../../services/geminiService';
import { cn } from '../../../lib/utils';

export const VoiceResultsPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const { sessions, saveFeedback } = useVoiceInterviewStore();
  const session = sessions.find(s => s.id === sessionId);
  const [analyzingIds, setAnalyzingIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!sessionId || !session) {
    return <Navigate to="/interview" replace />;
  }

  const handleAnalyze = async (questionId: string, questionText: string, transcript: string) => {
    if (analyzingIds.includes(questionId) || !transcript.trim()) return;

    setAnalyzingIds(prev => [...prev, questionId]);
    
    try {
      const prompt = `
        Act as a communication coach. Evaluate the following spoken interview answer based on its transcript.
        
        Question: "${questionText}"
        Transcript: "${transcript}"
        
        Provide a constructive critique in valid HTML format (no markdown, use <h4>, <p>, <ul>, <li>).
        Focus on:
        1. Clarity and Structure.
        2. Content relevance.
        3. Filler words or hesitation (if apparent in transcript).
        4. A suggested improved response.
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

  const togglePlay = (id: string) => {
    const audio = document.getElementById(`audio-${id}`) as HTMLAudioElement;
    if (!audio) return;

    if (playingId === id) {
        audio.pause();
        setPlayingId(null);
    } else {
        // stop others
        if (playingId) {
            const prev = document.getElementById(`audio-${playingId}`) as HTMLAudioElement;
            if (prev) prev.pause();
        }
        audio.play();
        setPlayingId(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-slate-900">Voice Session Review</h1>
        <p className="text-slate-500">Listen to your recordings and check the transcripts.</p>
      </div>

      <div className="space-y-6">
        {session.questions.map((q, index) => {
          const answer = session.answers[q.id];
          const feedback = session.feedback?.[q.id];
          const isAnalyzing = analyzingIds.includes(q.id);
          const isExpanded = expandedId === q.id;
          const isPlaying = playingId === q.id;

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
                  {/* Audio Player & Transcript */}
                  <div className="flex flex-col md:flex-row gap-6">
                     <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-slate-700">Recording</h4>
                            <span className="text-xs text-slate-400">{answer ? `${Math.round(answer.durationSeconds)}s` : '0s'}</span>
                        </div>
                        {answer ? (
                            <div className="bg-slate-100 rounded-lg p-3 flex items-center gap-3">
                                <Button size="sm" onClick={() => togglePlay(q.id)} className={cn("rounded-full w-10 h-10 p-0", isPlaying ? "bg-orange-500 hover:bg-orange-600" : "bg-slate-900")}>
                                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                                </Button>
                                <div className="h-1 bg-slate-300 rounded-full flex-1 overflow-hidden">
                                     <div className={cn("h-full bg-orange-500 transition-all duration-1000", isPlaying ? "w-full" : "w-0")} />
                                </div>
                                <audio id={`audio-${q.id}`} src={answer.audioUrl} onEnded={() => setPlayingId(null)} className="hidden" />
                            </div>
                        ) : (
                            <p className="text-sm text-red-400 italic">No audio recorded.</p>
                        )}
                     </div>
                     
                     <div className="flex-1 space-y-3">
                        <h4 className="text-sm font-semibold text-slate-700">Transcript</h4>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-600 italic h-24 overflow-y-auto">
                            {answer?.transcript || "No transcript available."}
                        </div>
                     </div>
                  </div>

                  {/* Analysis Section */}
                  <div className="border-t border-slate-100 pt-6">
                    {feedback ? (
                      <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
                        <div className="flex items-center gap-2 mb-4">
                          <Bot className="h-5 w-5 text-orange-600" />
                          <h4 className="font-bold text-orange-900">AI Feedback</h4>
                        </div>
                        <div 
                          className="prose prose-sm prose-orange max-w-none"
                          dangerouslySetInnerHTML={{ __html: feedback }} 
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <Button 
                          onClick={() => handleAnalyze(q.id, q.text, answer?.transcript || "")}
                          isLoading={isAnalyzing}
                          className="bg-orange-600 hover:bg-orange-700"
                          disabled={!answer?.transcript}
                        >
                          <Bot className="mr-2 h-4 w-4" />
                          {isAnalyzing ? 'Analyzing...' : 'Analyze Recording'}
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
        <Link to="/interview/voice/setup">
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Voice Session
          </Button>
        </Link>
      </div>
    </div>
  );
};