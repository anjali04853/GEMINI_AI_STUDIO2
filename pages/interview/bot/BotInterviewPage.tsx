import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { GoogleGenAI, LiveServerMessage, Modality, type Blob as GenAIBlob } from '@google/genai';
import { Mic, MicOff, PhoneOff, User, Bot, Volume2, MoreHorizontal, LogOut, PauseCircle, PlayCircle, StopCircle, Radio } from 'lucide-react';
import { useVoiceBotStore } from '../../../store/voiceBotStore';
import { Button } from '../../../components/ui/Button';
import { cn, generateId } from '../../../lib/utils';
import { BotTranscriptItem } from '../../../types';
import { Badge } from '../../../components/ui/Badge';

// --- Audio Helper Functions (Inline for portability) ---
function createBlob(data: Float32Array): GenAIBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const BotInterviewPage = () => {
  const navigate = useNavigate();
  const { activeConfig, saveBotSession } = useVoiceBotStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Session State
  const [isConnected, setIsConnected] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [transcript, setTranscript] = useState<BotTranscriptItem[]>([]);
  const [duration, setDuration] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [botStatus, setBotStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');

  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<Promise<any> | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Transcript Buffer Refs
  const currentInputTransRef = useRef('');
  const currentOutputTransRef = useRef('');

  useEffect(() => {
    // Auto-scroll transcript
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, currentInputTransRef.current, currentOutputTransRef.current]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) setDuration(d => d + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  useEffect(() => {
    return () => disconnect();
  }, []);

  if (!activeConfig) {
    return <Navigate to="/interview/bot/setup" replace />;
  }

  const initializeAudio = async () => {
    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = inputCtx;

      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputAudioContextRef.current = outputCtx;
      const outputNode = outputCtx.createGain();
      outputNode.connect(outputCtx.destination);
      outputNodeRef.current = outputNode;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const source = inputCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      processor.onaudioprocess = (e) => {
        if (!isMicOn) return;
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Volume for visualizer
        let sum = 0;
        for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
        const rms = Math.sqrt(sum / inputData.length);
        setVolumeLevel(Math.min(100, rms * 500)); // Amplify for visual

        if (rms > 0.01) setBotStatus('listening');

        const pcmBlob = createBlob(inputData);
        if (sessionRef.current) {
          sessionRef.current.then((session: any) => {
             try { session.sendRealtimeInput({ media: pcmBlob }); } catch (err) { console.error(err); }
          });
        }
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);
      return true;
    } catch (e) {
      console.error("Audio init error", e);
      return false;
    }
  };

  const connect = async () => {
    const success = await initializeAudio();
    if (!success) return;

    const apiKey = process.env.API_KEY || '';
    if (!apiKey) { alert("API Key missing"); return; }

    const ai = new GoogleGenAI({ apiKey });
    
    const config = {
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        systemInstruction: activeConfig.context || `You are a helpful interviewer conducting a ${activeConfig.topic} interview.`,
        inputAudioTranscription: { model: "gemini-2.5-flash" },
        outputAudioTranscription: { model: "gemini-2.5-flash" },
      }
    };

    try {
      const sessionPromise = ai.live.connect({
        ...config,
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setTranscript([{ id: 'init', role: 'model', text: "Hello! I'm your AI interviewer. Shall we begin?", timestamp: Date.now() }]);
            setBotStatus('speaking');
          },
          onmessage: async (message: LiveServerMessage) => {
            // Transcript handling
            if (message.serverContent?.outputTranscription) {
              currentOutputTransRef.current += message.serverContent.outputTranscription.text;
            } else if (message.serverContent?.inputTranscription) {
              currentInputTransRef.current += message.serverContent.inputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              if (currentInputTransRef.current.trim()) {
                 setTranscript(prev => [...prev, { id: generateId(), role: 'user', text: currentInputTransRef.current, timestamp: Date.now() }]);
                 currentInputTransRef.current = '';
                 setBotStatus('thinking'); // User done, bot processing
              }
              if (currentOutputTransRef.current.trim()) {
                 setTranscript(prev => [...prev, { id: generateId(), role: 'model', text: currentOutputTransRef.current, timestamp: Date.now() }]);
                 currentOutputTransRef.current = '';
                 setBotStatus('idle'); // Bot done
              }
            }

            // Audio handling
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current && outputNodeRef.current) {
               setBotStatus('speaking');
               try {
                   const ctx = outputAudioContextRef.current;
                   nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                   const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                   const source = ctx.createBufferSource();
                   source.buffer = audioBuffer;
                   source.connect(outputNodeRef.current);
                   source.addEventListener('ended', () => {
                       sourcesRef.current.delete(source);
                       if (sourcesRef.current.size === 0) setBotStatus('idle');
                   });
                   source.start(nextStartTimeRef.current);
                   nextStartTimeRef.current += audioBuffer.duration;
                   sourcesRef.current.add(source);
               } catch (err) { console.error(err); }
            }
            
            if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => { try { s.stop(); } catch(e){} });
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setBotStatus('listening');
            }
          },
          onclose: () => setIsConnected(false),
          onerror: (err) => setIsConnected(false)
        }
      });
      sessionRef.current = sessionPromise;
    } catch (err) { console.error(err); }
  };

  const disconnect = () => {
    if (sessionRef.current) sessionRef.current.then((s: any) => s.close && s.close());
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    setIsConnected(false);
  };

  const handleEndSession = () => {
    disconnect();
    const sessionId = saveBotSession(transcript, duration);
    navigate(`/interview/bot/results?session=${sessionId}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white overflow-hidden relative">
      
      {/* 7.2 Header */}
      <header className="flex-shrink-0 h-16 bg-brand-purple flex items-center justify-between px-6 shadow-md z-20">
         <div className="flex items-center gap-4">
            <div className="relative">
               <div className={cn("w-3 h-3 rounded-full", isConnected ? "bg-red-500 animate-pulse" : "bg-slate-400")} />
               {isConnected && <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>}
            </div>
            <div>
               <h1 className="text-white font-bold text-lg tracking-tight">Live Interview</h1>
               <div className="flex items-center gap-2 text-xs text-brand-lavender">
                  <span>{isConnected ? "Connected" : "Standby"}</span>
                  <span>•</span>
                  <span className="font-mono">{Math.floor(duration/60)}:{(duration%60).toString().padStart(2,'0')}</span>
               </div>
            </div>
         </div>
         <Button 
            variant="outline" 
            size="sm"
            onClick={handleEndSession} 
            className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
         >
            <LogOut className="h-4 w-4 mr-2" />
            End Session
         </Button>
      </header>

      {/* 7.2 Conversation Area */}
      <div 
         ref={scrollRef}
         className="flex-1 overflow-y-auto bg-gradient-to-b from-brand-lavender/30 to-brand-offWhite p-6 space-y-6 pb-32"
      >
         {transcript.length === 0 && !isConnected && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
               <div className="w-24 h-24 bg-brand-purple/10 rounded-full flex items-center justify-center mb-4">
                  <Bot className="h-10 w-10 text-brand-purple" />
               </div>
               <p className="text-slate-500 font-medium">Ready to start your {activeConfig.topic} interview?</p>
               <p className="text-sm text-slate-400">Press the button below to connect.</p>
            </div>
         )}

         {transcript.map((msg) => (
            <div key={msg.id} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
               <div className={cn("flex max-w-[80%] md:max-w-[60%] gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                  {/* Avatar */}
                  <div className={cn(
                     "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-white",
                     msg.role === 'user' ? "bg-brand-purple" : "bg-gradient-to-br from-brand-turquoise to-teal-500"
                  )}>
                     {msg.role === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
                  </div>
                  
                  {/* Bubble */}
                  <div className="flex flex-col gap-1">
                     <div className={cn(
                        "p-4 text-sm leading-relaxed shadow-sm relative",
                        msg.role === 'user' 
                           ? "bg-brand-purple text-white rounded-2xl rounded-tr-none" 
                           : "bg-white text-slate-800 rounded-2xl rounded-tl-none border border-slate-100"
                     )}>
                        {msg.text}
                     </div>
                     <span className={cn("text-[10px] text-slate-400", msg.role === 'user' ? "text-right" : "text-left")}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </span>
                  </div>
               </div>
            </div>
         ))}

         {/* Streaming / Status Indicators */}
         {botStatus === 'thinking' && (
             <div className="flex justify-start">
                 <div className="flex gap-3">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-turquoise to-teal-500 flex items-center justify-center shadow-sm">
                         <Bot className="h-5 w-5 text-white" />
                     </div>
                     <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2">
                         <div className="flex space-x-1">
                             <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                             <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                             <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                         </div>
                         <span className="text-xs text-slate-400 font-medium">Thinking...</span>
                     </div>
                 </div>
             </div>
         )}
      </div>

      {/* 7.3 Bottom Control Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-4 z-30">
         <div className="max-w-4xl mx-auto flex items-center justify-between">
            
            {/* Left: Mode/Settings */}
            <div className="flex items-center gap-4 w-1/3">
               <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
                  <Radio className="h-3 w-3 text-brand-turquoise" />
                  <span className="text-xs font-medium text-slate-600">Auto-Detect</span>
               </div>
            </div>

            {/* Center: Main Record Button */}
            <div className="flex flex-col items-center justify-center -mt-8 relative w-1/3">
               {!isConnected ? (
                  <button 
                     onClick={connect}
                     className="w-20 h-20 rounded-full bg-brand-turquoise hover:bg-teal-500 shadow-xl shadow-brand-turquoise/40 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border-4 border-white"
                  >
                     <Mic className="h-8 w-8 text-white" />
                  </button>
               ) : (
                  <div className="relative">
                     {/* Pulse Rings */}
                     <div className={cn("absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-20", botStatus === 'listening' ? "block" : "hidden")} />
                     
                     <button 
                        onClick={() => setIsMicOn(!isMicOn)}
                        className={cn(
                           "relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all border-4 border-white shadow-xl",
                           isMicOn 
                              ? "bg-red-500 hover:bg-red-600 shadow-red-500/30" 
                              : "bg-slate-400 hover:bg-slate-500"
                        )}
                     >
                        {isMicOn ? <StopCircle className="h-8 w-8 text-white fill-current animate-pulse" /> : <MicOff className="h-8 w-8 text-white" />}
                     </button>
                  </div>
               )}
               {/* Waveform Visualizer under button */}
               {isConnected && isMicOn && (
                   <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8 opacity-50">
                       {[...Array(5)].map((_,i) => (
                           <div 
                              key={i} 
                              className="w-1 bg-red-500 rounded-full transition-all duration-75" 
                              style={{ height: `${Math.max(20, Math.random() * volumeLevel)}%` }} 
                           />
                       ))}
                   </div>
               )}
            </div>

            {/* Right: Emergency Controls */}
            <div className="flex items-center justify-end gap-3 w-1/3">
               <Button variant="ghost" size="icon" className="text-slate-400 hover:text-orange-500">
                  <PauseCircle className="h-6 w-6" />
               </Button>
               <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={handleEndSession}>
                  <PhoneOff className="h-6 w-6" />
               </Button>
            </div>
         </div>
         
         {/* Live Text Caption */}
         {isConnected && (
            <div className="text-center mt-6 text-xs font-mono text-slate-400">
               {botStatus === 'speaking' ? "Interviewer speaking..." : botStatus === 'listening' ? "Listening..." : "Live"}
            </div>
         )}
      </div>
    </div>
  );
};