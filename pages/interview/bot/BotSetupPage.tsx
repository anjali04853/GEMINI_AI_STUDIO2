
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic2, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useVoiceBotStore } from '../../../store/voiceBotStore';
import { cn } from '../../../lib/utils';

const TOPICS = ['Frontend React', 'System Design', 'Behavioral', 'General Coding'];

export const BotSetupPage = () => {
  const navigate = useNavigate();
  const startBotSession = useVoiceBotStore(state => state.startBotSession);

  const [topic, setTopic] = useState<string>('Frontend React');
  const [context, setContext] = useState('');

  const handleStart = () => {
    startBotSession({
      topic,
      context: context || `You are conducting a ${topic} interview.`,
      difficulty: 'Medium'
    });
    
    navigate('/interview/bot/active');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/interview')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">Real-Time Bot Setup</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure AI Interviewer</CardTitle>
          <CardDescription>
            Have a live voice conversation with Gemini. It will act as your interviewer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Interview Topic</label>
            <div className="grid grid-cols-2 gap-2">
              {TOPICS.map(t => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={cn(
                    "px-4 py-3 rounded-md text-sm font-medium transition-all border text-left flex items-center justify-between",
                    topic === t
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {t}
                  {topic === t && <Bot className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Additional Context (Optional)</label>
            <textarea
               className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[100px]"
               placeholder="E.g., Focus on React Hooks and Performance. Ask me 3 questions then give feedback."
               value={context}
               onChange={(e) => setContext(e.target.value)}
            />
            <p className="text-xs text-slate-500">
              Give the AI specific instructions on how to behave or what to focus on.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
            <p className="font-semibold mb-1">Note on Real-Time Audio</p>
            <p>
              This mode uses the Gemini Live API. Please use headphones to prevent audio feedback (echo) from your speakers back into your microphone.
            </p>
          </div>

        </CardContent>
        <CardFooter>
          <Button 
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700" 
            onClick={handleStart}
          >
            Start Live Interview
            <Mic2 className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
