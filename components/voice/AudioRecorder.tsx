import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, Trash2, Pause, StopCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, url: string, transcript: string, duration: number) => void;
  existingAudioUrl?: string;
  existingTranscript?: string;
  className?: string;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onRecordingComplete, 
  existingAudioUrl,
  existingTranscript,
  className
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

  // For visualizer
  const [volumeLevel, setVolumeLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
      cancelAnimationFrame(animationFrameRef.current!);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  // Update internal state if props change
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

      // Audio Context for Visualizer
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for(let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;
        setVolumeLevel(average);
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();


      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob, url, transcript, recordingTime);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        cancelAnimationFrame(animationFrameRef.current!);
        setVolumeLevel(0);
      };

      mediaRecorderRef.current.start();
      
      if (recognitionRef.current) {
        setTranscript(''); 
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
    <div className={cn("flex flex-col items-center space-y-8 w-full", className)}>
      
      {/* Central Visualizer / Interaction Area */}
      <div className="relative flex items-center justify-center">
        {/* Animated Rings for Recording */}
        {isRecording && (
          <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-ping opacity-75 scale-150"></div>
        )}
        
        {/* Main Action Button */}
        {isRecording ? (
           // RECORDING STATE -> STOP
           <button 
             onClick={stopRecording}
             className="relative z-10 w-24 h-24 rounded-full bg-red-500 hover:bg-red-600 shadow-xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 group"
           >
              <Square className="h-8 w-8 text-white fill-current animate-pulse" />
              <span className="absolute -bottom-8 text-sm font-bold text-red-500 font-mono">
                {formatTime(recordingTime)}
              </span>
           </button>
        ) : audioUrl ? (
           // RECORDED STATE -> PLAY
           <button 
             onClick={togglePlayback}
             className={cn(
               "relative z-10 w-24 h-24 rounded-full shadow-xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 border-4 border-white",
               isPlaying ? "bg-brand-turquoise" : "bg-green-500 hover:bg-green-600"
             )}
           >
              {isPlaying ? <Pause className="h-10 w-10 text-white fill-current" /> : <Play className="h-10 w-10 text-white fill-current ml-1" />}
              <audio 
                ref={audioRef} 
                src={audioUrl} 
                onEnded={() => setIsPlaying(false)} 
                className="hidden" 
              />
           </button>
        ) : (
           // IDLE STATE -> RECORD
           <button 
             onClick={startRecording}
             className="relative z-10 w-24 h-24 rounded-full bg-brand-turquoise hover:bg-teal-500 shadow-xl shadow-brand-turquoise/30 flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 border-4 border-white"
           >
              <Mic className="h-10 w-10 text-white" />
           </button>
        )}

        {/* Live Waveform Visualization */}
        {isRecording && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center pointer-events-none -z-10">
              <div className="w-full h-full rounded-full border border-red-100 flex items-center justify-center">
                 {/* Just decorative pulsing rings for now, simplistic visualizer */}
                 <div 
                   className="absolute rounded-full border border-red-200 transition-all duration-75"
                   style={{ width: `${100 + volumeLevel}%`, height: `${100 + volumeLevel}%`, opacity: 0.5 }}
                 ></div>
              </div>
          </div>
        )}
      </div>

      {/* Secondary Controls (Only when recorded) */}
      {audioUrl && !isRecording && (
         <div className="flex items-center gap-6 animate-in fade-in slide-in-from-bottom-4">
             <Button 
               variant="outline" 
               onClick={deleteRecording} 
               className="h-12 w-12 rounded-full p-0 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm"
               title="Delete & Re-record"
             >
                <Trash2 className="h-5 w-5" />
             </Button>
             
             <Button 
               variant="outline"
               onClick={() => { deleteRecording(); startRecording(); }}
               className="h-12 w-12 rounded-full p-0 border-brand-yellow text-brand-yellow hover:bg-yellow-50 hover:border-yellow-400 transition-colors shadow-sm"
               title="Re-record immediately"
             >
                <RotateCcw className="h-5 w-5" />
             </Button>
         </div>
      )}

      {/* Waveform / Visualizer Bar */}
      <div className="w-full h-16 bg-slate-50 rounded-xl flex items-end justify-center gap-1 p-2 border border-slate-100 overflow-hidden">
         {isRecording ? (
             // Live Recording Waves (Red)
             Array.from({ length: 20 }).map((_, i) => (
                 <div 
                   key={i} 
                   className="w-2 bg-red-400 rounded-t-full transition-all duration-100"
                   style={{ 
                       height: `${Math.max(20, Math.random() * volumeLevel * 3)}%`,
                       opacity: 0.7 
                   }}
                 />
             ))
         ) : audioUrl ? (
             // Playback Waves (Turquoise)
             Array.from({ length: 20 }).map((_, i) => (
                 <div 
                   key={i} 
                   className={cn(
                       "w-2 rounded-t-full transition-all duration-300",
                       isPlaying ? "bg-brand-turquoise animate-pulse" : "bg-slate-300"
                   )}
                   style={{ height: `${30 + Math.random() * 50}%` }}
                 />
             ))
         ) : (
             <span className="self-center text-xs text-slate-400 font-medium uppercase tracking-wider">Ready to Record</span>
         )}
      </div>

    </div>
  );
};