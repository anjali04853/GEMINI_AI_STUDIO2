import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Volume2, AlertCircle } from 'lucide-react';
import { useVoiceInterviewStore } from '../../../store/voiceInterviewStore';
import { AudioRecorder } from '../../../components/voice/AudioRecorder';
import { Card, CardContent, CardFooter, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

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
  const progress = ((currentQuestionIndex + 1) / activeQuestions.length) * 100;

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-xs">
            {currentQ.type}
          </Badge>
          <span className="text-sm text-slate-500">
            Question {currentQuestionIndex + 1} / {activeQuestions.length}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSpeakQuestion} className="text-blue-600 hover:bg-blue-50">
           <Volume2 className="h-4 w-4 mr-2" />
           Read Question
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-orange-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question & Recorder */}
      <Card className="min-h-[500px] flex flex-col">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6 text-center">
           <h2 className="text-2xl font-bold text-slate-900 leading-relaxed max-w-2xl mx-auto">
             {currentQ.text}
           </h2>
           <p className="text-sm text-slate-500 mt-2">
             Record your answer clearly. Aim for 30-90 seconds.
           </p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col items-center justify-center p-8">
           <AudioRecorder 
             onRecordingComplete={handleRecordingComplete}
             existingAudioUrl={currentAnswer?.audioUrl}
             existingTranscript={currentAnswer?.transcript}
           />
        </CardContent>

        <CardFooter className="flex justify-between border-t border-slate-100 py-4 bg-slate-50/50">
          <Button 
            variant="ghost" 
            onClick={prevQuestion} 
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {isLast ? (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700" disabled={!currentAnswer}>
              Submit Interview
            </Button>
          ) : (
            <Button onClick={nextQuestion} disabled={!currentAnswer}>
              Next Question
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <div className="flex justify-center">
        <Button variant="ghost" className="text-xs text-slate-400 hover:text-red-500" onClick={() => navigate('/interview')}>
          <AlertCircle className="h-3 w-3 mr-1" />
          Quit Interview
        </Button>
      </div>
    </div>
  );
};