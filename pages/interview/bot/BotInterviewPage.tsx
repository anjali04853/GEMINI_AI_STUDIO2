import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { Mic, MicOff, PhoneOff, User, Bot, Volume2 } from 'lucide-react';
import { useVoiceBotStore } from '../../../store/voiceBotStore';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardFooter } from '../../../components/ui/Card';
import { cn, generateId } from '../../../lib/utils';
import { BotTranscriptItem } from '../../../types';

// Helper types for Blob creation
function createBlob(data: Float32Array): Blob {
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

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
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
  
  // Session State
  const [isConnected, setIsConnected] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [transcript, setTranscript] = useState<BotTranscriptItem[]>([]);
  const [duration, setDuration] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);

  // Refs for Audio Handling
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<Promise<any> | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Refs for Transcript Accumulation (to avoid re-renders)
  const currentInputTransRef = useRef('');
  const currentOutputTransRef = useRef('');

  useEffect(() => {
    // Start timer
    const interval = setInterval(() => {
      if (isConnected) setDuration(d => d + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  if (!activeConfig) {
    return <Navigate to="/interview/bot/setup" replace />;
  }

  const initializeAudio = async () => {
    try {
      // Input Context (16kHz required by Gemini)
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = inputCtx;

      // Output Context (24kHz typical for Gemini output)
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputAudioContextRef.current = outputCtx;
      const outputNode = outputCtx.createGain();
      outputNode.connect(outputCtx.destination);
      outputNodeRef.current = outputNode;

      // Microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const source = inputCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      
      // Processor
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      processor.onaudioprocess = (e) => {
        if (!isMicOn) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Calculate volume for visualizer
        let sum = 0;
        for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
        setVolumeLevel(Math.sqrt(sum / inputData.length) * 100);

        const pcmBlob = createBlob(inputData);
        
        if (sessionRef.current) {
          sessionRef.current.then((session: any) => {
             try {
                session.sendRealtimeInput({ media: pcmBlob });
             } catch (err) {
                console.error("Error sending input", err);
             }
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
    if (!apiKey) {
      alert("API Key missing");
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Config
    const config = {
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }, // Zephyr, Puck, Charon, Kore, Fenrir
        },
        systemInstruction: activeConfig.context || `You are a helpful interviewer conducting a ${activeConfig.topic} interview.`,
        inputAudioTranscription: { model: "gemini-2.5-flash" }, // Request input transcription
        outputAudioTranscription: { model: "gemini-2.5-flash" }, // Request output transcription
      }
    };

    try {
      const sessionPromise = ai.live.connect({
        ...config,
        callbacks: {
          onopen: () => {
            console.log("Gemini Live Connected");
            setIsConnected(true);
            setTranscript([{ id: 'init', role: 'model', text: 'Hello! I am ready to begin the interview. Can you hear me clearly?', timestamp: Date.now() }]);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcripts
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              currentOutputTransRef.current += text;
            } else if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              currentInputTransRef.current += text;
            }

            if (message.serverContent?.turnComplete) {
              // Finalize turns
              if (currentInputTransRef.current.trim()) {
                 setTranscript(prev => [...prev, {
                    id: generateId(),
                    role: 'user',
                    text: currentInputTransRef.current,
                    timestamp: Date.now()
                 }]);
                 currentInputTransRef.current = '';
              }
              if (currentOutputTransRef.current.trim()) {
                 setTranscript(prev => [...prev, {
                    id: generateId(),
                    role: 'model',
                    text: currentOutputTransRef.current,
                    timestamp: Date.now()
                 }]);
                 currentOutputTransRef.current = '';
              }
            }

            // Handle Audio
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current && outputNodeRef.current) {
               try {
                   const ctx = outputAudioContextRef.current;
                   nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                   
                   const audioBuffer = await decodeAudioData(
                       decode(base64Audio),
                       ctx,
                       24000,
                       1
                   );
                   
                   const source = ctx.createBufferSource();
                   source.buffer = audioBuffer;
                   source.connect(outputNodeRef.current);
                   
                   source.addEventListener('ended', () => {
                       sourcesRef.current.delete(source);
                   });
                   
                   source.start(nextStartTimeRef.current);
                   nextStartTimeRef.current += audioBuffer.duration;
                   sourcesRef.current.add(source);
               } catch (err) {
                   console.error("Audio decode error", err);
               }
            }
            
            // Handle Interrupt
            if (message.serverContent?.interrupted) {
                // Clear audio queue
                sourcesRef.current.forEach(s => {
                    try { s.stop(); } catch(e){}
                });
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            console.log("Gemini Live Closed");
            setIsConnected(false);
          },
          onerror: (err) => {
            console.error("Gemini Live Error", err);
            setIsConnected(false);
          }
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (err) {
      console.error("Connection failed", err);
    }
  };

  const disconnect = () => {
    // 1. Close session
    if (sessionRef.current) {
       // There isn't a direct .close() on the promise, 
       // but strictly speaking we just stop sending and close our context.
       // The SDK manages the websocket.
       // We can signal end via logic if needed, but mostly we just kill client side.
       // NOTE: The TS definition for session might have close, but checking docs, usually just closing context/sockets works.
       // Actually the example shows `onclose` callback but not explicit close method call on session object in the simple snippet.
       // We will just assume dropping it and closing contexts is enough for now or use `session.close()` if available in the resolved object.
       sessionRef.current.then((s: any) => {
          if (s.close) s.close();
       });
       sessionRef.current = null;
    }
    
    // 2. Stop audio tracks
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    }

    // 3. Close contexts
    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
        outputAudioContextRef.current.close();
        outputAudioContextRef.current = null;
    }
    
    setIsConnected(false);
  };

  const handleEndSession = () => {
    disconnect();
    const sessionId = saveBotSession(transcript, duration);
    navigate(`/interview/bot/results?session=${sessionId}`);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col gap-4">
      {/* Header */}
      <Card className="flex-shrink-0">
        <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full animate-pulse", isConnected ? "bg-green-500" : "bg-red-500")} />
                <div>
                   <h2 className="font-semibold text-slate-900">{activeConfig.topic} Interview</h2>
                   <p className="text-xs text-slate-500">{isConnected ? "Live Connection Active" : "Disconnected"}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="font-mono text-lg font-medium text-slate-700">
                    {Math.floor(duration/60)}:{(duration%60).toString().padStart(2,'0')}
                </div>
                {!isConnected ? (
                    <Button onClick={connect} className="bg-green-600 hover:bg-green-700">
                        Start Connection
                    </Button>
                ) : (
                    <Button variant="destructive" onClick={handleEndSession}>
                        <PhoneOff className="mr-2 h-4 w-4" />
                        End Call
                    </Button>
                )}
            </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-4 overflow-hidden">
         {/* Visualizer / Avatar */}
         <div className="w-1/3 flex flex-col gap-4">
            <Card className="flex-1 flex flex-col items-center justify-center bg-slate-900 text-white relative overflow-hidden border-none shadow-xl">
               {/* Background effects */}
               <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-slate-900 z-0" />
               
               <div className="relative z-10 flex flex-col items-center gap-6">
                   <div className="relative">
                       <div className={cn("absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 transition-all duration-100", volumeLevel > 10 ? "scale-150" : "scale-100")} />
                       <div className="h-24 w-24 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 relative">
                          <Bot className="h-12 w-12 text-indigo-400" />
                          {/* Speaking Indicator for Bot - simplistic approximation */}
                          {transcript.length > 0 && transcript[transcript.length-1].role === 'model' && (
                              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                              </span>
                          )}
                       </div>
                   </div>
                   
                   <div className="text-center">
                       <h3 className="text-lg font-medium text-indigo-100">Gemini Interviewer</h3>
                       <p className="text-sm text-indigo-300/60">AI Agent</p>
                   </div>

                   {/* User Mic Status */}
                   <div className="mt-8">
                       <Button 
                         onClick={() => setIsMicOn(!isMicOn)}
                         className={cn(
                            "rounded-full w-14 h-14 p-0 flex items-center justify-center transition-all",
                            isMicOn ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                         )}
                       >
                         {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                       </Button>
                   </div>
               </div>

               {/* Waveform Visualizer (Simple CSS based) */}
               <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center gap-1 pb-4 opacity-50">
                  {[...Array(10)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-2 bg-indigo-500 rounded-t-full transition-all duration-75"
                        style={{ height: `${Math.max(10, volumeLevel * Math.random() * 2 + 10)}%` }} 
                      />
                  ))}
               </div>
            </Card>
         </div>

         {/* Transcript */}
         <Card className="w-2/3 flex flex-col bg-white">
            <div className="p-4 border-b border-slate-100 font-medium text-slate-700 flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Live Transcript
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
               {transcript.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center text-slate-400 italic">
                       Waiting for conversation to start...
                   </div>
               )}
               {transcript.map((msg) => (
                   <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                       <div className={cn(
                           "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                           msg.role === 'user' ? "bg-blue-100 text-blue-600" : "bg-indigo-100 text-indigo-600"
                       )}>
                           {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                       </div>
                       <div className={cn(
                           "p-3 rounded-lg max-w-[80%] text-sm leading-relaxed",
                           msg.role === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm"
                       )}>
                           {msg.text}
                       </div>
                   </div>
               ))}
               {/* Streaming placeholders */}
               {currentInputTransRef.current && (
                   <div className="flex gap-3 flex-row-reverse opacity-60">
                       <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                           <User className="h-4 w-4 text-blue-600" />
                       </div>
                       <div className="p-3 rounded-lg max-w-[80%] text-sm leading-relaxed bg-blue-600 text-white rounded-tr-none">
                           {currentInputTransRef.current}...
                       </div>
                   </div>
               )}
               {currentOutputTransRef.current && (
                   <div className="flex gap-3 opacity-60">
                       <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                           <Bot className="h-4 w-4 text-indigo-600" />
                       </div>
                       <div className="p-3 rounded-lg max-w-[80%] text-sm leading-relaxed bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm">
                           {currentOutputTransRef.current}...
                       </div>
                   </div>
               )}
            </div>
         </Card>
      </div>
    </div>
  );
};