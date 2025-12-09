import React, { useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { User, Bot, Clock, LayoutDashboard, RefreshCw, Activity, MessageCircle, Mic, Star, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { useVoiceBotStore } from '../../../store/voiceBotStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';
import { Badge } from '../../../components/ui/Badge';

export const BotResultsPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const { sessions } = useVoiceBotStore();
  const session = sessions.find(s => s.id === sessionId);
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  if (!sessionId || !session) {
    return <Navigate to="/interview" replace />;
  }

  // Mock scoring logic for display
  const overallScore = 88;
  const flowScore = 92;
  const contentScore = 85;
  const commsScore = 80;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* 7.4 Hero Section - Success Green Theme */}
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 md:p-12 shadow-2xl">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/confetti.png')] opacity-20 animate-pulse-glow"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left">
               <Badge variant="secondary" className="bg-white/20 text-white border-none backdrop-blur-md mb-4 hover:bg-white/30">
                  Live Interview Completed
               </Badge>
               <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">Great Job!</h1>
               <p className="text-emerald-100 text-lg max-w-md">
                 You successfully completed the {session.config.topic} session.
               </p>
               <div className="mt-6 flex items-center gap-2 justify-center md:justify-start text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {Math.floor(session.durationSeconds / 60)}m {session.durationSeconds % 60}s</span>
               </div>
            </div>

            <div className="flex flex-col items-center justify-center">
               <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                     <path className="text-emerald-800/30" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                     <path className="text-white drop-shadow-md" strokeDasharray={`${overallScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                     <span className="text-4xl font-black">{overallScore}</span>
                     <span className="text-[10px] uppercase tracking-wider opacity-80">Overall</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 7.4 Scoring Dashboard */}
      <div className="grid gap-6 md:grid-cols-3">
         <Card className="border-t-4 border-brand-sky shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-sky-100 rounded-xl text-brand-sky">
                     <Activity className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{flowScore}%</span>
               </div>
               <h3 className="font-bold text-slate-800">Natural Flow</h3>
               <p className="text-xs text-slate-500 mt-1">Response time and coherence were strong.</p>
               <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-sky w-[92%]"></div>
               </div>
            </CardContent>
         </Card>

         <Card className="border-t-4 border-brand-purple shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl text-brand-purple">
                     <Star className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{contentScore}%</span>
               </div>
               <h3 className="font-bold text-slate-800">Content Quality</h3>
               <p className="text-xs text-slate-500 mt-1">Good technical depth and relevance.</p>
               <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-purple w-[85%]"></div>
               </div>
            </CardContent>
         </Card>

         <Card className="border-t-4 border-brand-pink shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-pink-100 rounded-xl text-brand-pink">
                     <Mic className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{commsScore}%</span>
               </div>
               <h3 className="font-bold text-slate-800">Communication</h3>
               <p className="text-xs text-slate-500 mt-1">Clear pronunciation and steady pace.</p>
               <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-pink w-[80%]"></div>
               </div>
            </CardContent>
         </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
         {/* 7.4 AI Feedback Card */}
         <div className="md:col-span-1 space-y-6">
            <Card className="border-t-4 border-brand-purple overflow-hidden">
               <CardHeader className="bg-brand-lavender/30 pb-4">
                  <CardTitle className="flex items-center gap-2 text-brand-purple">
                     <Bot className="h-5 w-5" />
                     AI Interviewer Feedback
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="p-6 space-y-6">
                     <div className="space-y-2">
                        <h4 className="flex items-center gap-2 font-bold text-slate-700 text-sm uppercase tracking-wide">
                           <span className="w-2 h-2 rounded-full bg-green-500"></span> Strengths
                        </h4>
                        <ul className="text-sm text-slate-600 space-y-2 pl-4 border-l-2 border-green-100">
                           <li>• Excellent explanation of core concepts.</li>
                           <li>• Maintained a professional tone throughout.</li>
                        </ul>
                     </div>
                     <div className="space-y-2">
                        <h4 className="flex items-center gap-2 font-bold text-slate-700 text-sm uppercase tracking-wide">
                           <span className="w-2 h-2 rounded-full bg-orange-500"></span> Areas to Improve
                        </h4>
                        <ul className="text-sm text-slate-600 space-y-2 pl-4 border-l-2 border-orange-100">
                           <li>• Could provide more concrete examples.</li>
                           <li>• Avoid slight hesitation when answering complex queries.</li>
                        </ul>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* 7.4 Conversation Replay */}
         <div className="md:col-span-2">
            <Card className="h-full border-none shadow-md">
               <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Conversation Replay</CardTitle>
                  <Button 
                     variant="ghost" 
                     size="sm" 
                     onClick={() => setShowFullTranscript(!showFullTranscript)}
                     className="text-brand-purple"
                  >
                     {showFullTranscript ? "Show Less" : "Show All"}
                  </Button>
               </CardHeader>
               <CardContent className="bg-brand-offWhite/50 max-h-[500px] overflow-y-auto p-0">
                  <div className="divide-y divide-slate-100">
                     {session.transcript.slice(0, showFullTranscript ? undefined : 4).map((msg, i) => (
                        <div key={msg.id} className="p-4 hover:bg-white transition-colors group relative">
                           {/* Timeline Highlights (Mock) */}
                           {i === 1 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-400" title="Strong Moment"></div>}
                           {i === 3 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400" title="Needs Improvement"></div>}

                           <div className="flex gap-4">
                              <div className={cn(
                                 "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm",
                                 msg.role === 'user' ? "bg-brand-purple" : "bg-brand-turquoise"
                              )}>
                                 {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-slate-700 text-sm">{msg.role === 'user' ? 'You' : 'Interviewer'}</span>
                                    <span className="text-xs text-slate-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                 </div>
                                 <p className="text-slate-600 text-sm leading-relaxed">{msg.text}</p>
                                 
                                 {/* Audio Playback Trigger (Mock) */}
                                 <button className="mt-2 text-xs font-bold text-brand-purple flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play className="h-3 w-3 fill-current" /> Play Audio
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
                     {!showFullTranscript && session.transcript.length > 4 && (
                        <div className="p-4 text-center">
                           <button onClick={() => setShowFullTranscript(true)} className="text-sm text-slate-400 hover:text-brand-purple flex items-center justify-center w-full">
                              View {session.transcript.length - 4} more messages <ChevronDown className="ml-1 h-3 w-3" />
                           </button>
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>

      <div className="flex justify-center gap-4 py-8">
        <Link to="/interview">
          <Button variant="outline" className="h-12 px-8">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Link to="/interview/bot/setup">
          <Button className="h-12 px-8 bg-brand-purple hover:bg-brand-darkPurple shadow-lg shadow-brand-purple/20">
            <RefreshCw className="mr-2 h-4 w-4" />
            Start New Session
          </Button>
        </Link>
      </div>
    </div>
  );
};