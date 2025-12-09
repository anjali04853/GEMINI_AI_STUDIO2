import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, CheckCircle2, AlertTriangle, ArrowLeft, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useVoiceInterviewStore } from '../../../store/voiceInterviewStore';

export const VoiceSetupPage = () => {
  const navigate = useNavigate();
  const startInterview = useVoiceInterviewStore(state => state.startInterview);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const checkPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      setPermissionError(null);
      // Clean up stream immediately
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error(err);
      setHasPermission(false);
      setPermissionError("Microphone access denied. Please allow permission in your browser settings.");
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  const handleStart = () => {
    startInterview({ questionCount: 3 });
    navigate('/interview/voice/active');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/interview')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">Voice Check</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Microphone Setup</CardTitle>
          <CardDescription>Ensure your audio is working correctly before starting the interview.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-slate-50 border-slate-200">
            {hasPermission === null ? (
              <div className="text-slate-500">Checking permissions...</div>
            ) : hasPermission ? (
              <div className="text-center space-y-3">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                   <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Microphone Ready</h3>
                <p className="text-sm text-slate-500">We successfully accessed your audio device.</p>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                   <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Access Denied</h3>
                <p className="text-sm text-red-500 max-w-xs mx-auto">{permissionError}</p>
                <Button variant="outline" onClick={checkPermission} className="mt-2">
                  Retry Permission
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-slate-900">Tips for a good session:</h4>
            <ul className="text-sm text-slate-500 list-disc list-inside space-y-1">
               <li>Find a quiet room with minimal echo.</li>
               <li>Speak clearly and at a normal pace.</li>
               <li>Wait a second after clicking record before speaking.</li>
            </ul>
          </div>

        </CardContent>
        <CardFooter>
          <Button 
            className="w-full h-11" 
            onClick={handleStart}
            disabled={!hasPermission}
          >
            Start Voice Interview
            <Play className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};