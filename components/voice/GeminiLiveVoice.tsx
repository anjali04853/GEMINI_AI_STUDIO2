import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Volume2, VolumeX, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { GeminiLiveService } from '../../services/geminiLiveService';
import { useToast } from '../ui/Toast';

interface GeminiLiveVoiceProps {
  onTranscript?: (text: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const GeminiLiveVoice: React.FC<GeminiLiveVoiceProps> = ({
  onTranscript,
  onError,
  className,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const serviceRef = useRef<GeminiLiveService | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const connect = async () => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    setError(null);

    try {
      console.log('🚀 Connecting to Gemini Live API...');

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Create Gemini Live service
      const service = new GeminiLiveService({
        onOpen: () => {
          console.log('✅ Connected to Gemini Live API');
          setIsConnected(true);
          setIsConnecting(false);
          addToast('Connected to Gemini', 'success');
          startRecording(stream);
        },
        onMessage: (message) => {
          console.log('📨 Message received in component:', message);
        },
        onAudioChunk: (audioData) => {
          console.log('🔊 Audio chunk received in component:', audioData.byteLength, 'bytes');
        },
        onTranscript: (text) => {
          console.log('📝 Transcript:', text);
          setTranscript((prev) => prev + text + ' ');
          onTranscript?.(text);
        },
        onError: (err) => {
          console.error('❌ Error:', err);
          setError(err.message);
          setIsConnecting(false);
          setIsConnected(false);
          onError?.(err);
          addToast(err.message, 'error');
        },
        onClose: (reason) => {
          console.log('🔌 Closed:', reason);
          setIsConnected(false);
          addToast('Disconnected from Gemini', 'info');
        },
      });

      serviceRef.current = service;
      await service.connect();
    } catch (err) {
      console.error('❌ Connection error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Gemini';
      setError(errorMessage);
      setIsConnecting(false);
      onError?.(err as Error);
      addToast(errorMessage, 'error');
    }
  };

  const startRecording = (stream: MediaStream) => {
    // Use AudioContext for better control and PCM output
    startAudioCapture(stream);
  };

  const startAudioCapture = (stream: MediaStream) => {
    try {
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const source = audioContext.createMediaStreamSource(stream);
      
      // Use AudioWorkletNode if available, otherwise fallback to ScriptProcessorNode
      if (audioContext.audioWorklet) {
        // AudioWorklet is preferred but requires a separate worklet file
        // For now, use ScriptProcessorNode
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (event) => {
          if (serviceRef.current && !isMuted && isConnected) {
            const inputData = event.inputBuffer.getChannelData(0);
            
            // Convert Float32Array to Int16Array (PCM)
            const pcmData = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              const s = Math.max(-1, Math.min(1, inputData[i]));
              pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }

            // Send PCM data directly
            serviceRef.current.sendAudio(pcmData.buffer);
          }
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
        console.log('🎤 Audio capture started with ScriptProcessorNode');
      } else {
        // Fallback: Use ScriptProcessorNode (deprecated but widely supported)
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (event) => {
          if (serviceRef.current && !isMuted && isConnected) {
            const inputData = event.inputBuffer.getChannelData(0);
            
            // Convert Float32Array to Int16Array (PCM)
            const pcmData = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              const s = Math.max(-1, Math.min(1, inputData[i]));
              pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }

            // Send PCM data directly
            serviceRef.current.sendAudio(pcmData.buffer);
          }
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
        console.log('🎤 Audio capture started with ScriptProcessorNode (fallback)');
      }
    } catch (err) {
      console.error('Error starting audio capture:', err);
      addToast('Failed to start audio capture', 'error');
    }
  };

  const disconnect = async () => {
    console.log('🔌 Disconnecting...');

    // Stop recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Disconnect service
    if (serviceRef.current) {
      serviceRef.current.disconnect();
      serviceRef.current = null;
    }

    setIsConnected(false);
    setIsMuted(false);
    setTranscript('');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    addToast(isMuted ? 'Microphone unmuted' : 'Microphone muted', 'info');
  };

  return (
    <div className={cn("flex flex-col items-center space-y-8 w-full", className)}>
      {/* Error Display */}
      {error && (
        <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Main Control Button */}
      <div className="relative flex items-center justify-center">
        {isConnecting ? (
          <div className="relative z-10 w-24 h-24 rounded-full bg-brand-turquoise/50 shadow-xl flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
        ) : isConnected ? (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={toggleMute}
              className={cn(
                "relative z-10 w-24 h-24 rounded-full shadow-xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 border-4 border-white",
                isMuted ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              )}
            >
              {isMuted ? (
                <VolumeX className="h-10 w-10 text-white" />
              ) : (
                <Volume2 className="h-10 w-10 text-white" />
              )}
            </button>
            <Button
              variant="outline"
              onClick={disconnect}
              className="text-red-500 border-red-200 hover:bg-red-50"
            >
              <Square className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        ) : (
          <button
            onClick={connect}
            className="relative z-10 w-24 h-24 rounded-full bg-brand-turquoise hover:bg-teal-500 shadow-xl shadow-brand-turquoise/30 flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 border-4 border-white"
          >
            <Mic className="h-10 w-10 text-white" />
          </button>
        )}

        {/* Animated Rings for Connected State */}
        {isConnected && (
          <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-75 scale-150"></div>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="w-full max-w-2xl bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wider">
            Conversation Transcript
          </h3>
          <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
            {transcript}
          </p>
        </div>
      )}

      {/* Status Info */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-green-500 animate-pulse" : "bg-slate-300"
          )}
        />
        <span>
          {isConnecting
            ? 'Connecting...'
            : isConnected
            ? 'Connected - Speak to interact'
            : 'Click to start voice conversation'}
        </span>
      </div>
    </div>
  );
};

