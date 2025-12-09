import React, { useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { Bot, RefreshCw, LayoutDashboard, ChevronDown, ChevronUp, Play, Pause, Activity, Mic, Clock, Sparkles } from 'lucide-react';
import { useVoiceInterviewStore } from '../../../store/voiceInterviewStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { generateResponse } from '../../../services/geminiService';
import { cn } from '../../../lib/utils';
import { Badge } from '../../../components/ui/Badge';

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

  // Mock scoring for demo visual
  const contentScore = 82;
  const deliveryScore = 75;

  const handleAnalyze = async (questionId: string, questionText: string, transcript: string) => {
    if (analyzingIds.includes(questionId) || !transcript.trim()) return;

    setAnalyzingIds(prev => [...prev, questionId]);
    
    try {
      const prompt = `
        Act as a communication coach. Evaluate the following spoken interview answer based on its transcript.
        
        Question: "${questionText}"
        Transcript: "${transcript}"
        
        Provide feedback in HTML format (no markdown, use <h4>, <p>, <ul>, <li>).
        Div structure:
        <div class="content-feedback"><h4>Content Analysis</h4><ul>...</ul></div>
        <div class="delivery-feedback"><h4>Delivery Notes</h4><p>...</p></div>
        <div class="improvement"><h4>Quick Fix</h4><p>...</p></div>
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
        if (playingId) {
            const prev = document.getElementById(`audio-${playingId}`) as HTMLAudioElement;
            if (prev) prev.pause();
        }
        audio.play();
        setPlayingId(id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* Hero Section */}
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-brand-turquoise to-teal-600 text-white p-8 md:p-12 shadow-2xl">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left space-y-2">
               <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-sm">Voice Analysis</h1>
               <p className="text-teal-100 text-lg max-w-md">Your speech clarity, pacing, and content relevance scores are ready.</p>
               <div className="flex gap-2 justify-center md:justify-start mt-4">
                  <Badge variant="outline" className="border-white/30 text-white backdrop-blur-sm">3 Questions</Badge>
                  <Badge variant="outline" className="border-white/30 text-white backdrop-blur-sm">Audio Recorded</Badge>
               </div>
            </div>

            <div className="flex gap-8">
               {/* Content Score */}
               <div className="flex flex-col items-center">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                     <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-teal-800/30" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path className="text-brand-purple drop-shadow-md" strokeDasharray={`${contentScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                     </svg>
                     <span className="absolute text-3xl font-bold">{contentScore}</span>
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider mt-2 opacity-90">Content</span>
               </div>

               {/* Delivery Score */}
               <div className="flex flex-col items-center">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                     <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-teal-800/30" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path className="text-brand-pink drop-shadow-md" strokeDasharray={`${deliveryScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                     </svg>
                     <span className="absolute text-3xl font-bold">{deliveryScore}</span>
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider mt-2 opacity-90">Delivery</span>
               </div>
            </div>
         </div>
      </div>

      {/* Playback & Analysis Cards */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 px-2">Recording Review</h2>
        
        {session.questions.map((q, index) => {
          const answer = session.answers[q.id];
          const feedback = session.feedback?.[q.id];
          const isAnalyzing = analyzingIds.includes(q.id);
          const isExpanded = expandedId === q.id;
          const isPlaying = playingId === q.id;

          return (
            <Card key={q.id} className="overflow-hidden border-none shadow-md bg-white">
              <CardHeader className={cn("cursor-pointer border-l-[6px] transition-colors", isExpanded ? "bg-slate-50 border-l-brand-turquoise" : "bg-white border-l-slate-200 hover:bg-slate-50")} onClick={() => toggleExpand(q.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0">
                     {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{q.text}</h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {answer ? `${Math.round(answer.durationSeconds)}s` : '0s'}</span>
                        {feedback && <span className="flex items-center gap-1 text-brand-purple font-bold"><Sparkles className="h-3 w-3" /> Analyzed</span>}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="p-0">
                  <div className="p-6 md:p-8 space-y-8 border-l-[6px] border-l-transparent">
                    
                    {/* Audio Player */}
                    <div className="bg-brand-offWhite rounded-2xl p-6 border border-slate-100 flex flex-col md:flex-row items-center gap-6">
                       <Button 
                          onClick={() => togglePlay(q.id)} 
                          className={cn(
                             "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105", 
                             isPlaying ? "bg-brand-turquoise" : "bg-white text-brand-turquoise border-2 border-brand-turquoise"
                          )}
                       >
                          {isPlaying ? <Pause className="h-6 w-6 text-white fill-current" /> : <Play className="h-6 w-6 fill-current ml-1" />}
                       </Button>
                       
                       <div className="flex-1 w-full space-y-2">
                          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                             <span>0:00</span>
                             <span>{answer ? `${Math.floor(answer.durationSeconds/60)}:${(answer.durationSeconds%60).toString().padStart(2,'0')}` : '0:00'}</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden w-full relative">
                             {isPlaying && <div className="absolute inset-0 bg-brand-turquoise animate-progress origin-left"></div>}
                             {/* Simple progress simulation */}
                             <div className={cn("h-full bg-brand-turquoise transition-all duration-300", isPlaying ? "w-full opacity-50" : "w-0")}></div>
                          </div>
                          <audio id={`audio-${q.id}`} src={answer?.audioUrl} onEnded={() => setPlayingId(null)} className="hidden" />
                       </div>
                    </div>

                    {/* Transcription */}
                    <div className="space-y-2">
                       <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Transcript</h4>
                       <div className="p-4 bg-white border border-slate-100 rounded-xl text-slate-600 italic text-sm leading-relaxed">
                          "{answer?.transcript || <span className="text-slate-300">No transcript available.</span>}"
                       </div>
                    </div>

                    {/* Analysis Cards */}
                    <div className="grid md:grid-cols-2 gap-6">
                       {/* Content Analysis */}
                       <div className="bg-white rounded-xl border-t-4 border-t-brand-purple shadow-sm p-6 border-x border-b border-slate-100">
                          <h4 className="font-bold text-brand-purple mb-4 flex items-center gap-2">
                             <Activity className="h-4 w-4" /> Content Analysis
                          </h4>
                          {feedback ? (
                             <div className="text-sm text-slate-600 [&_.content-feedback]:block" dangerouslySetInnerHTML={{__html: feedback}} />
                          ) : (
                             <div className="h-32 flex items-center justify-center bg-slate-50 rounded-lg text-slate-400 text-sm">
                                Pending Analysis
                             </div>
                          )}
                          
                          {/* Mock Metrics */}
                          <div className="mt-6 space-y-3">
                             <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-slate-500"><span>Relevance</span><span>High</span></div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[85%]"></div></div>
                             </div>
                             <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-slate-500"><span>Structure</span><span>Med</span></div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-brand-sky w-[60%]"></div></div>
                             </div>
                          </div>
                       </div>

                       {/* Delivery Analysis */}
                       <div className="bg-white rounded-xl border-t-4 border-t-brand-pink shadow-sm p-6 border-x border-b border-slate-100">
                          <h4 className="font-bold text-brand-pink mb-4 flex items-center gap-2">
                             <Mic className="h-4 w-4" /> Delivery Analysis
                          </h4>
                          {feedback ? (
                             <div className="text-sm text-slate-600" dangerouslySetInnerHTML={{__html: feedback}} /> // Simplified for demo, real app would parse specific sections
                          ) : (
                              <div className="h-32 flex items-center justify-center bg-slate-50 rounded-lg">
                                  <Button 
                                     size="sm" 
                                     onClick={() => handleAnalyze(q.id, q.text, answer?.transcript || "")}
                                     isLoading={isAnalyzing}
                                     className="bg-slate-900 text-white"
                                     disabled={!answer?.transcript}
                                  >
                                     <Sparkles className="mr-2 h-3 w-3" />
                                     Analyze
                                  </Button>
                              </div>
                          )}

                          {/* Mock Metrics */}
                          <div className="mt-6 space-y-3">
                             <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-slate-500"><span>Pace</span><span>Optimal</span></div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                                   <div className="absolute left-[40%] right-[40%] h-full bg-green-200"></div> {/* Optimal Zone */}
                                   <div className="h-full bg-slate-800 w-[2px] absolute left-[50%]"></div> {/* Indicator */}
                                </div>
                             </div>
                             <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-slate-500"><span>Clarity</span><span>95%</span></div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-brand-turquoise w-[95%]"></div></div>
                             </div>
                          </div>
                       </div>
                    </div>

                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 border-t border-slate-200">
        <Link to="/interview">
          <Button variant="outline" className="h-12 px-8 border-slate-300 hover:border-slate-400">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Link to="/interview/voice/setup">
          <Button className="h-12 px-8 bg-brand-turquoise hover:bg-teal-500 shadow-lg shadow-brand-turquoise/20">
            <RefreshCw className="mr-2 h-4 w-4" />
            New Voice Session
          </Button>
        </Link>
      </div>
    </div>
  );
};