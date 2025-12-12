import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GeminiLiveVoice } from '../components/voice/GeminiLiveVoice';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const LiveKitVoicePage = () => {
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState('');

  const handleTranscript = (text: string) => {
    setTranscript(prev => prev + text + ' ');
  };

  const handleError = (error: Error) => {
    console.error('Gemini Live API error:', error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-lavender/20 via-white to-brand-sky/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Live Voice Assistant
          </h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Voice Interface */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12">
                <GeminiLiveVoice
                  onTranscript={handleTranscript}
                  onError={handleError}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Transcript */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Conversation</CardTitle>
              </CardHeader>
              <CardContent>
                {transcript ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {transcript}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-sm">Start a conversation to see the transcript here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

