import React, { useState, useEffect, useRef } from 'react';
import { Room, RoomEvent, RemoteParticipant, Track, RemoteTrack, RemoteAudioTrack, DisconnectReason } from 'livekit-client';
import { Mic, Square, Volume2, VolumeX, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { generateLiveKitToken, getLiveKitUrl } from '../../services/livekitService';
import { useToast } from '../ui/Toast';

interface LiveKitVoiceProps {
  roomName?: string;
  participantName?: string;
  onTranscript?: (text: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const LiveKitVoice: React.FC<LiveKitVoiceProps> = ({
  roomName = 'default-room',
  participantName = 'User',
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

  const roomRef = useRef<Room | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioTracksRef = useRef<Map<string, RemoteAudioTrack>>(new Map());

  // Periodic room state logging when connected
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isConnected && roomRef.current) {
      console.log('🔄 Starting periodic room state monitoring...');
      intervalId = setInterval(() => {
        const room = roomRef.current;
        if (room && room.state === 'connected') {
          console.log('📊 Periodic room state check:', {
            roomName: room.name,
            roomSid: room.sid,
            state: room.state,
            participants: room.participants ? Array.from(room.participants.values()).map(p => ({
              identity: p.identity,
              name: p.name,
              isLocal: p.isLocal,
              audioTracks: p.audioTrackPublications ? Array.from(p.audioTrackPublications.values()).map(t => ({
                source: t.source,
                subscribed: t.isSubscribed,
                muted: t.isMuted,
                trackSid: t.trackSid,
              })) : [],
            })) : [],
            localTracks: room.localParticipant?.trackPublications ? Array.from(room.localParticipant.trackPublications.values()).map(t => ({
              source: t.source,
              kind: t.kind,
              trackSid: t.trackSid,
            })) : [],
            connectionState: room.state,
          });
        } else {
          console.warn('⚠️ Room not connected during periodic check:', room?.state);
        }
      }, 5000); // Log every 5 seconds
    }
    
    // Cleanup: only clear interval, don't disconnect
    return () => {
      if (intervalId) {
        console.log('🛑 Clearing periodic room state interval');
        clearInterval(intervalId);
      }
    };
  }, [isConnected]);

  // Cleanup on component unmount - disconnect room if still connected
  useEffect(() => {
    return () => {
      console.log('🧹 Component unmounting, cleaning up room connection...');
      if (roomRef.current && roomRef.current.state === 'connected') {
        console.log('🔌 Disconnecting room on component unmount');
        disconnect();
      }
    };
  }, []); // Empty dependency array - only run on mount/unmount

  const connect = async () => {
    if (isConnecting || isConnected) {
      console.log('⚠️ Connect called but already connecting/connected:', { isConnecting, isConnected });
      return;
    }

    console.log('🚀 Starting connection process...');
    setIsConnecting(true);
    setError(null);

    try {
      // Generate access token
      const { token, url } = await generateLiveKitToken(roomName, participantName);
      const livekitUrl = url || getLiveKitUrl();

      // Ensure token is a string
      if (typeof token !== 'string' || !token) {
        throw new Error(`Invalid token format received from server. Token type: ${typeof token}`);
      }

      console.log('Connecting to LiveKit:', {
        url: livekitUrl,
        tokenLength: token.length,
        tokenPreview: token.substring(0, 20) + '...',
      });

      // Create room instance
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        // Configure reconnection policy
        reconnectPolicy: {
          maxRetries: 5,
          timeout: 10000, // 10 seconds
        },
      });

      roomRef.current = room;

      // Set up event listeners BEFORE connecting
      console.log('📡 Setting up room event listeners...');
      
      room.on(RoomEvent.Connected, async () => {
        console.log('✅ Connected to LiveKit room:', {
          name: room.name,
          sid: room.sid,
          state: room.state,
          localParticipant: room.localParticipant ? {
            identity: room.localParticipant.identity,
            name: room.localParticipant.name,
          } : null,
          participantsCount: room.participants ? room.participants.size : 0,
        });
        
        setIsConnected(true);
        setIsConnecting(false);
        addToast('Connected to voice assistant', 'success');
        
        // Small delay to ensure connection is fully stable
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Double-check room is still connected
        if (room.state !== 'connected') {
          console.error('❌ Room disconnected before enabling microphone. State:', room.state);
          return;
        }
        
        // Enable microphone immediately when connected
        // Use LiveKit's built-in method which handles track creation and publishing
        try {
          console.log('🎤 Enabling microphone...');
          const micEnabled = await room.localParticipant.setMicrophoneEnabled(true);
          console.log('✅ Microphone enabled successfully:', {
            micEnabled,
            trackPublications: room.localParticipant.trackPublications ? Array.from(room.localParticipant.trackPublications.values()).map(t => ({
              source: t.source,
              kind: t.kind,
              trackSid: t.trackSid,
            })) : [],
          });
          setIsMuted(false);
          addToast('Microphone enabled - you can now speak!', 'success');
        } catch (err) {
          console.error('❌ Error enabling microphone:', err);
          addToast('Failed to enable microphone. Please check permissions.', 'error');
        }
      });

      room.on(RoomEvent.Disconnected, (reason) => {
        const reasonText = reason === DisconnectReason.CLIENT_INITIATED 
          ? 'Client initiated'
          : reason === DisconnectReason.DUPLICATE_IDENTITY
          ? 'Duplicate identity'
          : reason === DisconnectReason.PARTICIPANT_REMOVED
          ? 'Participant removed'
          : reason === DisconnectReason.ROOM_DELETED
          ? 'Room deleted'
          : reason === DisconnectReason.STATE_MISMATCH
          ? 'State mismatch'
          : reason === DisconnectReason.JOIN_FAILURE
          ? 'Join failure'
          : reason === DisconnectReason.MIGRATION
          ? 'Migration'
          : `Unknown (${reason})`;
        
        console.log('❌ Disconnected from LiveKit room:', {
          reason: reason,
          reasonText: reasonText,
          roomName: room.name,
          roomSid: room.sid,
          state: room.state,
          stackTrace: new Error().stack, // Log stack trace to see what triggered disconnect
        });
        
        setIsConnected(false);
        setIsConnecting(false);
        
        // Set error message for specific disconnect reasons
        if (reason === DisconnectReason.JOIN_FAILURE || reason === DisconnectReason.STATE_MISMATCH) {
          const errorMsg = `Connection failed: ${reasonText}`;
          setError(errorMsg);
          onError?.(new Error(errorMsg));
          addToast(errorMsg, 'error');
        } else if (reason === DisconnectReason.CLIENT_INITIATED) {
          console.log('ℹ️ Disconnect was client-initiated (expected)');
          // Don't show error for client-initiated disconnects
        } else {
          // Only show toast if not already showing an error
          if (!error) {
            addToast(`Disconnected: ${reasonText}`, 'info');
          }
        }
      });

      room.on(RoomEvent.Reconnecting, () => {
        console.log('🔄 Reconnecting to LiveKit room...');
        addToast('Reconnecting to voice assistant...', 'info');
      });

      room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication: any, participant: RemoteParticipant) => {
        console.log('🎵 Track subscribed:', {
          kind: track.kind,
          participant: participant.identity,
          participantName: participant.name,
          trackSid: track.sid,
          source: publication.source,
          muted: publication.isMuted,
        });
        
        if (track.kind === Track.Kind.Audio) {
          const audioTrack = track as RemoteAudioTrack;
          audioTracksRef.current.set(participant.identity, audioTrack);
          
          console.log('🔊 Setting up audio playback for:', participant.identity);
          
          // Attach audio track to audio element
          if (audioRef.current) {
            audioTrack.attach(audioRef.current);
            console.log('✅ Attached audio track to existing audio element');
            // Try to play on existing audio element
            audioRef.current.play().catch(err => {
              console.error('❌ Failed to play audio on existing element:', err);
            });
          } else {
            // Create audio element if it doesn't exist
            const audio = document.createElement('audio');
            audio.autoplay = true;
            audio.playsInline = true;
            
            audio.onloadedmetadata = () => {
              console.log('📻 Audio metadata loaded, ready to play');
            };
            
            audio.onplay = () => {
              console.log('▶️ Audio playback started for:', participant.identity);
            };
            
            audio.onerror = (e) => {
              console.error('❌ Audio playback error:', e);
            };
            
            audio.oncanplay = () => {
              console.log('🎵 Audio can play, attempting playback...');
              audio.play().catch(err => {
                console.error('❌ Failed to auto-play audio:', err);
                console.log('💡 User interaction may be required to start playback');
              });
            };
            
            audioTrack.attach(audio);
            document.body.appendChild(audio);
            audioRef.current = audio;
            console.log('✅ Created and attached audio element for:', participant.identity);
            
            // Try to play immediately
            audio.play().catch(err => {
              console.warn('⚠️ Auto-play blocked (may need user interaction):', err);
            });
          }
        }
      });

      room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack, publication: any, participant: RemoteParticipant) => {
        console.log('🔇 Track unsubscribed:', {
          kind: track.kind,
          participant: participant.identity,
          trackSid: track.sid,
        });
        
        if (track.kind === Track.Kind.Audio) {
          audioTracksRef.current.delete(participant.identity);
          track.detach();
        }
      });

      room.on(RoomEvent.DataReceived, (payload: Uint8Array, participant?: RemoteParticipant) => {
        try {
          const text = new TextDecoder().decode(payload);
          console.log('📝 Data received:', {
            text,
            participant: participant?.identity,
            participantName: participant?.name,
            payloadLength: payload.length,
          });
          setTranscript(prev => prev + text + ' ');
          onTranscript?.(text);
        } catch (err) {
          console.error('❌ Error decoding transcript:', err);
        }
      });

      room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        console.log('👤 Participant connected:', {
          identity: participant.identity,
          name: participant.name,
          isLocal: participant.isLocal,
          audioTracks: participant.audioTrackPublications ? Array.from(participant.audioTrackPublications.values()).map(t => ({
            trackSid: t.trackSid,
            source: t.source,
            muted: t.isMuted,
            subscribed: t.isSubscribed,
          })) : [],
          videoTracks: participant.videoTrackPublications ? Array.from(participant.videoTrackPublications.values()).length : 0,
        });
        if (!participant.isLocal) {
          addToast(`${participant.name || participant.identity} joined the room`, 'info');
        }
      });

      room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
        console.log('👋 Participant disconnected:', {
          identity: participant.identity,
          name: participant.name,
        });
        if (!participant.isLocal) {
          addToast(`${participant.name || participant.identity} left the room`, 'info');
        }
      });

      room.on(RoomEvent.TrackMuted, (publication: any, participant: RemoteParticipant) => {
        console.log('🔇 Track muted:', {
          participant: participant.identity,
          source: publication.source,
          trackSid: publication.trackSid,
        });
        
        // Update mute state for local participant's microphone
        if (participant.isLocal && publication.source === Track.Source.Microphone) {
          setIsMuted(true);
        }
      });

      room.on(RoomEvent.TrackUnmuted, (publication: any, participant: RemoteParticipant) => {
        console.log('🔊 Track unmuted:', {
          participant: participant.identity,
          source: publication.source,
          trackSid: publication.trackSid,
        });
        
        // Update mute state for local participant's microphone
        if (participant.isLocal && publication.source === Track.Source.Microphone) {
          setIsMuted(false);
        }
      });

      room.on(RoomEvent.TrackPublished, (publication: any, participant: RemoteParticipant) => {
        console.log('📤 Track published:', {
          participant: participant.identity,
          source: publication.source,
          trackSid: publication.trackSid,
          kind: publication.kind,
        });
      });

      room.on(RoomEvent.TrackUnpublished, (publication: any, participant: RemoteParticipant) => {
        console.log('📥 Track unpublished:', {
          participant: participant.identity,
          source: publication.source,
          trackSid: publication.trackSid,
        });
      });

      room.on(RoomEvent.LocalTrackPublished, (publication: any, participant: any) => {
        console.log('📤 Local track published:', {
          source: publication.source,
          trackSid: publication.trackSid,
          kind: publication.kind,
        });
        
        // Update mute state when microphone track is published
        if (publication.source === Track.Source.Microphone) {
          setIsMuted(publication.isMuted);
        }
      });

      room.on(RoomEvent.LocalTrackUnpublished, (publication: any, participant: any) => {
        console.log('📥 Local track unpublished:', {
          source: publication.source,
          trackSid: publication.trackSid,
        });
        
        // Update mute state when microphone track is unpublished
        if (publication.source === Track.Source.Microphone) {
          setIsMuted(true);
        }
      });

      // Connect to room - ensure token is definitely a string
      const tokenString = String(token);
      if (!tokenString || tokenString === '[object Object]') {
        throw new Error('Token is not a valid string');
      }
      
      console.log('🔌 Connecting to room:', {
        url: livekitUrl,
        roomName,
        participantName,
        tokenLength: tokenString.length,
      });
      
      // Connect to room - the Connected event will be fired when connection is established
      try {
        await room.connect(livekitUrl, tokenString);
        console.log('✅ Room.connect() completed, waiting for Connected event...');
      } catch (connectError) {
        console.error('❌ Error during room.connect():', connectError);
        throw connectError;
      }
    } catch (err) {
      console.error('Error connecting to LiveKit:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to voice assistant';
      setError(errorMessage);
      setIsConnecting(false);
      onError?.(err as Error);
      addToast(errorMessage, 'error');
    }
  };


  const disconnect = async () => {
    console.log('🔌 Disconnect called, current state:', {
      isConnected,
      roomExists: !!roomRef.current,
      roomState: roomRef.current?.state,
    });
    
    if (roomRef.current) {
      // Disable microphone before disconnecting
      try {
        console.log('🔇 Disabling microphone...');
        await roomRef.current.localParticipant.setMicrophoneEnabled(false);
        console.log('✅ Microphone disabled');
      } catch (err) {
        console.warn('⚠️ Error disabling microphone on disconnect:', err);
      }
      
      console.log('🔌 Calling room.disconnect()...');
      roomRef.current.disconnect();
      roomRef.current = null;
      console.log('✅ Room disconnected and reference cleared');
    }

    // Clean up audio tracks
    audioTracksRef.current.forEach(track => {
      track.detach();
    });
    audioTracksRef.current.clear();

    // Clean up audio element
    if (audioRef.current) {
      audioRef.current.remove();
      audioRef.current = null;
    }

    setIsConnected(false);
    setIsMuted(false);
    setTranscript('');
    console.log('✅ Disconnect cleanup complete');
  };

  const toggleMute = async () => {
    if (!roomRef.current || !isConnected) return;

    try {
      const localParticipant = roomRef.current.localParticipant;
      
      if (isMuted) {
        await localParticipant.setMicrophoneEnabled(true);
        setIsMuted(false);
        addToast('Microphone unmuted', 'info');
      } else {
        await localParticipant.setMicrophoneEnabled(false);
        setIsMuted(true);
        addToast('Microphone muted', 'info');
      }
    } catch (err) {
      console.error('Error toggling mute:', err);
      addToast('Failed to toggle microphone', 'error');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("flex flex-col items-center space-y-8 w-full", className)}>
      {/* Connection Status */}
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

