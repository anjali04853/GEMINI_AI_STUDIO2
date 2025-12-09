import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Volume2, AlertCircle, Save, CheckCircle } from 'lucide-react';
import { useVoiceInterviewStore } from '../../../store/voiceInterviewStore';
import { AudioRecorder } from '../../../components/voice/AudioRecorder';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';
import { Tooltip } from '../../../components/ui/Tooltip';

export const VoicePlayerPage = () => {
  const navigate = useNavigate();
  const { 
    activeQuestions, 
    currentQuestionIndex, 
    answers, 
    isInterviewActive,
    nextQuestion,
    prevQuestion,
    saveAnswer,
    submitInterview
  } = useVoiceInterviewStore();

  if (!isInterviewActive || activeQuestions.length === 0) {
    return <Navigate to="/interview" replace />;
  }

  const currentQ = activeQuestions[currentQuestionIndex];
  const currentAnswer = answers[currentQ.id];
  const isLast = currentQuestionIndex === activeQuestions.length - 1;

  const handleRecordingComplete = (blob: Blob, url: string, transcript: string, duration: number) => {
    saveAnswer(currentQ.id, {
        audioUrl: url,
        transcript,
        durationSeconds: duration
    });
  };

  const handleSpeakQuestion = () => {
    const utterance = new SpeechSynthesisUtterance(currentQ.text);
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = () => {
    const sessionId = submitInterview();
    navigate(`/interview/voice/results?session=${sessionId}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Main Player Area */}
         <div className="lg:col-span-8 space-y-6">
            
            {/* Question Card */}
            <div className="bg-brand-lavender/30 rounded-[32px] p-8 md:p-10 relative overflow-hidden border border-brand-purple/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                
                <div className="flex items-start gap-4 relative z-10">
                   <div className="flex-shrink-0 w-12 h-12 bg-brand-turquoise text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-brand-turquoise/20">
                      {currentQuestionIndex + 1}
                   </div>
                   <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2">
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Question {currentQuestionIndex + 1} of {activeQuestions.length}</span>
                         <Badge variant="outline" className="bg-white/50 border-brand-purple/20 text-brand-purple text-[10px]">{currentQ.type}</Badge>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                         {currentQ.text}
                      </h2>
                      <Button 
                         variant="secondary" 
                         size="sm" 
                         onClick={handleSpeakQuestion}
                         className="bg-brand-sky/10 text-brand-sky hover:bg-brand-sky/20 border-transparent rounded-full px-4"
                      >
                         <Volume2 className="h-4 w-4 mr-2" />
                         Read Aloud
                      </Button>
                   </div>
                </div>
            </div>

            {/* Recorder Area */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl p-8 md:p-12 flex flex-col items-center justify-center min-h-[400px]">
               <AudioRecorder 
                  onRecordingComplete={handleRecordingComplete}
                  existingAudioUrl={currentAnswer?.audioUrl}
                  existingTranscript={currentAnswer?.transcript}
               />
               
               {!currentAnswer && (
                  <p className="mt-8 text-slate-400 text-sm font-medium animate-pulse">Tap the microphone to start recording</p>
               )}
            </div>

         </div>

         {/* Sidebar / Progress */}
         <div className="lg:col-span-4 space-y-6">
            
            {/* Progress Grid */}
            <Card className="border-none shadow-lg bg-slate-50">
               <CardHeader className="pb-4">
                  <CardTitle className="text-base">Session Progress</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-5 gap-3">
                     {activeQuestions.map((_, idx) => {
                        const status = idx === currentQuestionIndex ? 'current' : answers[activeQuestions[idx].id] ? 'completed' : 'pending';
                        return (
                           <Tooltip key={idx} content={`Question ${idx + 1}`} className="w-full">
                              <div className={cn(
                                 "aspect-square rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                                 status === 'current' ? "bg-brand-turquoise text-white ring-4 ring-brand-turquoise/20 scale-110" :
                                 status === 'completed' ? "bg-green-500 text-white" :
                                 "bg-slate-200 text-slate-400"
                              )}>
                                 {idx + 1}
                              </div>
                           </Tooltip>
                        );
                     })}
                  </div>
                  <div className="mt-6 flex justify-between text-xs text-slate-500 px-1">
                     <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div>Completed</div>
                     <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-turquoise"></div>Current</div>
                     <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-200"></div>Pending</div>
                  </div>
               </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
               <div className="flex gap-3">
                  <Button 
                     variant="outline" 
                     className="flex-1 h-12 border-brand-turquoise text-brand-turquoise hover:bg-teal-50"
                     onClick={() => saveAnswer(currentQ.id, currentAnswer!)}
                     disabled={!currentAnswer}
                  >
                     <Save className="h-4 w-4 mr-2" />
                     Save Draft
                  </Button>
               </div>
               
               <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <Button 
                     variant="secondary" 
                     className="flex-1 h-12"
                     onClick={prevQuestion}
                     disabled={currentQuestionIndex === 0}
                  >
                     <ChevronLeft className="h-4 w-4 mr-1" />
                     Prev
                  </Button>
                  
                  {isLast ? (
                     <Button 
                        className="flex-[2] h-12 bg-brand-pink hover:bg-pink-600 shadow-lg shadow-brand-pink/30 text-white"
                        onClick={handleSubmit}
                        disabled={!currentAnswer}
                     >
                        Submit Recording
                        <CheckCircle className="ml-2 h-4 w-4" />
                     </Button>
                  ) : (
                     <Button 
                        className="flex-[2] h-12 bg-brand-purple hover:bg-brand-darkPurple shadow-lg shadow-brand-purple/30 text-white"
                        onClick={nextQuestion}
                     >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                     </Button>
                  )}
               </div>

               <div className="pt-4 flex justify-center">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500" onClick={() => navigate('/interview')}>
                     <AlertCircle className="h-3 w-3 mr-1" />
                     Cancel Session
                  </Button>
               </div>
            </div>

         </div>

      </div>
    </div>
  );
};