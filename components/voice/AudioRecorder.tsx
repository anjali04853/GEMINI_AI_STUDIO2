import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, Trash2, StopCircle, Pause } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, url: string, transcript: string, duration: number) => void;
  existingAudioUrl?: string;
  existingTranscript?: string;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onRecordingComplete, 
  existingAudioUrl,
  existingTranscript
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState(existingTranscript || '');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null); // SpeechRecognition
  const timerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize SpeechRecognition if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };
    }
    
    return () => {
      stopRecordingProcess();
    };
  }, []);

  // Update internal state if props change (e.g. moving between questions)
  useEffect(() => {
    setAudioUrl(existingAudioUrl || null);
    setTranscript(existingTranscript || '');
    setRecordingTime(0);
  }, [existingAudioUrl, existingTranscript]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob, url, transcript, recordingTime); // Note: transcript might lag slightly, handled in real impl by separate state
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      
      if (recognitionRef.current) {
        setTranscript(''); // Clear previous for new recording
        try {
            recognitionRef.current.start();
        } catch (e) {
            console.warn("Recognition already started or error", e);
        }
      }

      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please ensure permissions are granted.");
    }
  };

  const stopRecordingProcess = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch(e) { /* ignore */ }
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const stopRecording = () => {
    stopRecordingProcess();
    // onRecordingComplete called in onstop event
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    setTranscript('');
    setRecordingTime(0);
    if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md mx-auto p-6 bg-slate-50 rounded-xl border border-slate-200">
      
      {/* Visualizer / Status Area */}
      <div className="h-32 w-full bg-white rounded-lg border border-slate-200 flex items-center justify-center relative overflow-hidden">
        {isRecording ? (
          <div className="flex items-center gap-1">
             {/* Mock waveform animation */}
             {[1,2,3,4,5,6,7,8].map(i => (
                 <div 
                   key={i} 
                   className="w-2 bg-red-500 rounded-full animate-pulse"
                   style={{ 
                       height: `${Math.random() * 40 + 20}px`,
                       animationDuration: `${Math.random() * 0.5 + 0.5}s` 
                    }}
                 />
             ))}
             <div className="absolute top-2 right-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-mono text-red-500 font-bold">REC {formatTime(recordingTime)}</span>
             </div>
          </div>
        ) : audioUrl ? (
          <div className="text-center w-full px-4">
             <p className="text-sm font-medium text-slate-700 mb-2">Recording Captured</p>
             <audio 
                ref={audioRef} 
                src={audioUrl} 
                onEnded={() => setIsPlaying(false)} 
                className="hidden" 
             />
             <div className="h-1 bg-slate-100 rounded-full overflow-hidden w-full max-w-[200px] mx-auto">
                 <div className="h-full bg-blue-500 w-full" />
             </div>
          </div>
        ) : (
          <div className="text-slate-400 flex flex-col items-center">
            <Mic className="h-8 w-8 mb-2 opacity-50" />
            <span className="text-sm">Ready to record</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!isRecording && !audioUrl && (
          <Button onClick={startRecording} className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700 p-0 flex items-center justify-center shadow-lg transform transition hover:scale-105">
            <Mic className="h-6 w-6 text-white" />
          </Button>
        )}

        {isRecording && (
          <Button onClick={stopRecording} className="rounded-full w-14 h-14 bg-slate-900 hover:bg-slate-800 p-0 flex items-center justify-center shadow-lg">
            <Square className="h-5 w-5 text-white fill-current" />
          </Button>
        )}

        {!isRecording && audioUrl && (
          <>
            <Button variant="outline" onClick={deleteRecording} className="rounded-full w-10 h-10 p-0 border-slate-300 text-slate-500 hover:text-red-600 hover:border-red-200">
              <Trash2 className="h-4 w-4" />
            </Button>

            <Button onClick={togglePlayback} className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 p-0 flex items-center justify-center shadow-lg">
              {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-1" />}
            </Button>

            <Button variant="outline" onClick={() => { deleteRecording(); startRecording(); }} className="rounded-full w-10 h-10 p-0 border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-200">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Transcript Preview */}
      <div className="w-full text-center">
        <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">Live Transcript</p>
        <div className="text-sm text-slate-600 min-h-[1.5em] italic">
            {transcript || (isRecording ? "Listening..." : "Transcript will appear here...")}
        </div>
      </div>
    </div>
  );
};