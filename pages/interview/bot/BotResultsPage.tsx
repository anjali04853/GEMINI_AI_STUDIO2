
import React from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { User, Bot, Clock, LayoutDashboard, RefreshCw } from 'lucide-react';
import { useVoiceBotStore } from '../../../store/voiceBotStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

export const BotResultsPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const { sessions } = useVoiceBotStore();
  const session = sessions.find(s => s.id === sessionId);

  if (!sessionId || !session) {
    return <Navigate to="/interview" replace />;
  }

  const userMessages = session.transcript.filter(t => t.role === 'user');
  const modelMessages = session.transcript.filter(t => t.role === 'model');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-slate-900">Interview Session Summary</h1>
        <p className="text-slate-500">Topic: {session.config.topic}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
           <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <Clock className="h-8 w-8 text-indigo-500 mb-2" />
              <div className="text-2xl font-bold">{Math.floor(session.durationSeconds / 60)}m {session.durationSeconds % 60}s</div>
              <p className="text-xs text-slate-500">Duration</p>
           </CardContent>
        </Card>
        <Card>
           <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2 font-bold text-sm">{userMessages.length}</div>
              <div className="text-2xl font-bold">Your Turns</div>
              <p className="text-xs text-slate-500">Responses given</p>
           </CardContent>
        </Card>
        <Card>
           <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2 font-bold text-sm">{modelMessages.length}</div>
              <div className="text-2xl font-bold">AI Questions</div>
              <p className="text-xs text-slate-500">Interactions</p>
           </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversation Transcript</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {session.transcript.length === 0 ? (
             <p className="text-center text-slate-500 italic py-8">No conversation recorded.</p>
          ) : (
             session.transcript.map((msg) => (
               <div key={msg.id} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
                   <div className={cn(
                       "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm",
                       msg.role === 'user' ? "bg-blue-100 text-blue-600" : "bg-indigo-100 text-indigo-600"
                   )}>
                       {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                   </div>
                   <div className="flex flex-col max-w-[80%]">
                       <span className={cn("text-xs text-slate-400 mb-1", msg.role === 'user' ? "text-right" : "")}>
                           {msg.role === 'user' ? 'You' : 'Interviewer'} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                       </span>
                       <div className={cn(
                           "p-4 rounded-xl text-sm leading-relaxed shadow-sm",
                           msg.role === 'user' ? "bg-blue-50 border border-blue-100 text-blue-900 rounded-tr-none" : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                       )}>
                           {msg.text}
                       </div>
                   </div>
               </div>
             ))
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 py-8">
        <Link to="/interview">
          <Button variant="outline">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Link to="/interview/bot/setup">
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Start New Session
          </Button>
        </Link>
      </div>
    </div>
  );
};
