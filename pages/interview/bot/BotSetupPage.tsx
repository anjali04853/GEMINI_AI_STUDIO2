import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic2, Bot, CheckCircle2, Wifi, Volume2, Sparkles, Code, MessageSquare, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useVoiceBotStore } from '../../../store/voiceBotStore';
import { cn } from '../../../lib/utils';
import { Badge } from '../../../components/ui/Badge';

// Map topics to the visual types defined in requirements
const INTERVIEW_TYPES = [
  { 
    id: 'technical',
    label: 'Technical', 
    icon: Code, 
    color: 'text-brand-purple', 
    border: 'border-brand-purple',
    bg: 'bg-brand-lavender/50',
    description: 'System design, coding challenges, and architecture.'
  },
  { 
    id: 'behavioral',
    label: 'Behavioral', 
    icon: MessageSquare, 
    color: 'text-brand-pink', 
    border: 'border-brand-pink',
    bg: 'bg-pink-50',
    description: 'Leadership, conflict resolution, and soft skills.'
  },
  { 
    id: 'mixed',
    label: 'Mixed', 
    icon: Layers, 
    color: 'text-brand-turquoise', 
    border: 'border-brand-turquoise',
    bg: 'bg-teal-50',
    description: 'A balanced mix of technical and situational questions.'
  }
];

export const BotSetupPage = () => {
  const navigate = useNavigate();
  const startBotSession = useVoiceBotStore(state => state.startBotSession);

  const [selectedType, setSelectedType] = useState('technical');
  const [context, setContext] = useState('');
  const [isReady, setIsReady] = useState(false);

  // Auto-check simulation
  React.useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    startBotSession({
      topic: selectedType === 'technical' ? 'System Design' : selectedType === 'behavioral' ? 'Leadership' : 'General Interview',
      context: context || `You are conducting a ${selectedType} interview. Be professional but friendly.`,
      difficulty: 'Medium'
    });
    
    navigate('/interview/bot/active');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-brand-purple to-indigo-900 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <div className="flex items-center mb-6 text-white/80">
          <Button variant="ghost" size="sm" onClick={() => navigate('/interview')} className="hover:bg-white/10 hover:text-white mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden">
          <div className="bg-white p-8 md:p-12">
            <div className="text-center mb-10">
               <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-brand-purple to-brand-pink rounded-full flex items-center justify-center shadow-lg mb-6 relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                  <Bot className="h-12 w-12 text-white" />
               </div>
               <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
                 Ready for your Interview?
               </h1>
               <p className="text-slate-500 text-lg max-w-md mx-auto">
                 Choose your focus area and let our AI coach guide you through a realistic interview simulation.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-10">
               {INTERVIEW_TYPES.map((type) => (
                 <button
                   key={type.id}
                   onClick={() => setSelectedType(type.id)}
                   className={cn(
                     "relative p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:-translate-y-1",
                     selectedType === type.id
                       ? `${type.border} ${type.bg} shadow-md`
                       : "border-slate-100 bg-white hover:border-slate-200"
                   )}
                 >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", type.bg)}>
                       <type.icon className={cn("h-6 w-6", type.color)} />
                    </div>
                    <h3 className={cn("font-bold text-lg mb-1", selectedType === type.id ? "text-slate-900" : "text-slate-700")}>
                      {type.label}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {type.description}
                    </p>
                    {selectedType === type.id && (
                      <div className={cn("absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center", type.color.replace('text-', 'bg-'))}>
                         <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    )}
                 </button>
               ))}
            </div>

            <div className="bg-brand-lavender/30 rounded-2xl p-6 border border-brand-purple/10 mb-10">
               <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">System Readiness</h4>
               <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-center gap-3">
                     <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", isReady ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400")}>
                        <Volume2 className="h-4 w-4" />
                     </div>
                     <span className="text-sm font-medium text-slate-700">Microphone Check</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", isReady ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400")}>
                        <Wifi className="h-4 w-4" />
                     </div>
                     <span className="text-sm font-medium text-slate-700">Connection Stable</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", isReady ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400")}>
                        <CheckCircle2 className="h-4 w-4" />
                     </div>
                     <span className="text-sm font-medium text-slate-700">Quiet Environment</span>
                  </div>
               </div>
            </div>

            <Button 
               size="lg" 
               className="w-full h-16 text-xl uppercase tracking-widest font-bold bg-gradient-to-r from-brand-pink to-orange-500 hover:from-brand-pink hover:to-orange-600 shadow-xl shadow-orange-500/20 rounded-xl transition-all hover:scale-[1.02] relative overflow-hidden group"
               onClick={handleStart}
               disabled={!isReady}
            >
               <span className="relative z-10 flex items-center justify-center">
                  Start Live Interview
                  <Sparkles className="ml-2 h-6 w-6 animate-pulse" />
               </span>
               <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 skew-x-12 -translate-x-full"></div>
            </Button>
            <p className="text-center text-xs text-slate-400 mt-4">
               By starting, you agree to audio recording for analysis purposes.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};