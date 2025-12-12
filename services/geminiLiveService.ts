/**
 * Gemini Live API Service
 * Direct integration with Google's Gemini Live API using WebSockets
 */

import {
  GoogleGenAI,
  LiveServerMessage,
  Modality,
  Session,
} from "@google/genai";

const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;

export interface GeminiLiveCallbacks {
  onOpen?: () => void;
  onMessage?: (message: LiveServerMessage) => void;
  onError?: (error: Error) => void;
  onClose?: (reason: string) => void;
  onTranscript?: (text: string) => void;
  onAudioChunk?: (audioData: ArrayBuffer) => void;
}

export class GeminiLiveService {
  private ai: GoogleGenAI;
  private session: Session | undefined;
  private audioContext: AudioContext | null = null;
  private audioQueue: ArrayBuffer[] = [];
  private isPlaying = false;
  private callbacks: GeminiLiveCallbacks;

  constructor(callbacks: GeminiLiveCallbacks = {}) {
    if (!GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY or GOOGLE_API_KEY environment variable is required"
      );
    }

    this.ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    });

    this.callbacks = callbacks;
  }

  async connect() {
    const model = "models/gemini-2.5-flash-native-audio-preview-09-2025";

    const config = {
      responseModalities: [Modality.AUDIO],
      systemInstruction:
        "You are a helpful and friendly AI assistant. Be concise, friendly, and natural in your responses. Speak clearly and at a moderate pace.",
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: "Zephyr",
          },
        },
      },
    };

    this.session = await this.ai.live.connect({
      model,
      config,
      callbacks: {
        onopen: () => {
          console.log("✅ Connected to Gemini Live API");
          this.callbacks.onOpen?.();
        },
        onmessage: (message: LiveServerMessage) => {
          this.handleMessage(message);
          this.callbacks.onMessage?.(message);
        },
        onerror: (e: ErrorEvent) => {
          console.error("❌ Gemini Live API error:", e.message);
          this.callbacks.onError?.(new Error(e.message));
        },
        onclose: (e: CloseEvent) => {
          console.log("🔌 Gemini Live API closed:", e.reason);
          this.callbacks.onClose?.(e.reason);
        },
      },
    });

    // Initialize audio context for playback
    // Note: AudioContext might be suspended and needs user interaction to resume
    this.audioContext = new AudioContext({ sampleRate: 24000 });
    console.log("🎵 AudioContext created, state:", this.audioContext.state);

    // Resume audio context if suspended (browser autoplay policy)
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume().then(() => {
        console.log("🎵 AudioContext resumed");
      });
    }

    this.startAudioPlayback();
  }

  private handleMessage(message: LiveServerMessage) {
    console.log("📨 Handling message:", {
      hasServerContent: !!message.serverContent,
      interrupted: message.serverContent?.interrupted,
      hasModelTurn: !!message.serverContent?.modelTurn,
      turnComplete: message.serverContent?.turnComplete,
    });

    // Handle interruptions - clear audio queue
    if (message.serverContent?.interrupted) {
      console.log("⚠️ Interrupted - clearing audio queue");
      this.audioQueue = [];
      return;
    }

    // Handle model turn with audio/text
    if (message.serverContent?.modelTurn?.parts) {
      console.log(
        `📦 Model turn with ${message.serverContent.modelTurn.parts.length} parts`
      );
      for (const part of message.serverContent.modelTurn.parts) {
        // Handle text transcript
        if (part.text) {
          console.log("📝 Transcript:", part.text);
          this.callbacks.onTranscript?.(part.text);
        }

        // Handle audio data
        if (part.inlineData?.data) {
          try {
            console.log(
              "🔊 Audio chunk received, size:",
              part.inlineData.data.length
            );
            // Decode base64 audio data
            const audioData = this.base64ToArrayBuffer(part.inlineData.data);
            console.log("🔊 Decoded audio data, bytes:", audioData.byteLength);
            this.audioQueue.push(audioData);
            console.log("🔊 Audio queue length:", this.audioQueue.length);
            this.callbacks.onAudioChunk?.(audioData);
          } catch (error) {
            console.error("Error processing audio data:", error);
          }
        } else {
          console.log("📦 Part has no inlineData:", Object.keys(part));
        }
      }
    }

    // Handle turn complete
    if (message.serverContent?.turnComplete) {
      console.log("✅ Turn complete");
    }
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private async startAudioPlayback() {
    if (!this.audioContext) {
      console.error("❌ AudioContext not initialized");
      return;
    }

    const playAudioChunk = async (audioData: ArrayBuffer) => {
      try {
        // Ensure audio context is running
        if (this.audioContext!.state === "suspended") {
          await this.audioContext!.resume();
          console.log("🎵 AudioContext resumed for playback");
        }

        // Gemini returns 24kHz, 16-bit PCM mono audio
        // Convert PCM data to AudioBuffer
        const sampleCount = audioData.byteLength / 2; // 16-bit = 2 bytes per sample
        console.log(
          `🔊 Playing audio chunk: ${sampleCount} samples (${audioData.byteLength} bytes)`
        );

        const audioBuffer = this.audioContext!.createBuffer(
          1,
          sampleCount,
          24000
        );
        const channelData = audioBuffer.getChannelData(0);
        const view = new DataView(audioData);

        // Convert 16-bit PCM to float32 (-1.0 to 1.0)
        for (let i = 0; i < sampleCount; i++) {
          const sample = view.getInt16(i * 2, true); // little-endian
          channelData[i] = sample / 32768.0;
        }

        const bufferSource = this.audioContext!.createBufferSource();
        bufferSource.buffer = audioBuffer;
        bufferSource.connect(this.audioContext!.destination);

        await new Promise<void>((resolve, reject) => {
          bufferSource.onended = () => {
            console.log("✅ Audio chunk played");
            resolve();
          };
          try {
            bufferSource.start(0);
            console.log("▶️ Started playing audio chunk");
          } catch (err) {
            console.error("❌ Error starting buffer source:", err);
            reject(err);
          }
        });
      } catch (err) {
        console.error("❌ Error playing audio chunk:", err);
        this.isPlaying = false;
      }
    };

    // Playback loop
    const playbackLoop = async () => {
      console.log("🎵 Starting audio playback loop");
      while (this.session) {
        if (this.audioQueue.length > 0 && !this.isPlaying) {
          this.isPlaying = true;
          const chunk = this.audioQueue.shift();
          if (chunk) {
            await playAudioChunk(chunk);
          }
          this.isPlaying = false;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      }
      console.log("🎵 Audio playback loop ended");
    };

    playbackLoop();
  }

  sendAudio(audioData: ArrayBuffer | Blob | Uint8Array) {
    if (!this.session) {
      console.error("❌ Session not connected");
      return;
    }

    // Convert to base64
    const convertToBase64 = (
      data: ArrayBuffer | Blob | Uint8Array
    ): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (data instanceof Blob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const base64 = result.includes(",") ? result.split(",")[1] : result;
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(data);
        } else {
          // Convert ArrayBuffer or Uint8Array to base64
          const bytes =
            data instanceof Uint8Array ? data : new Uint8Array(data);
          const binary = String.fromCharCode(...bytes);
          const base64 = btoa(binary);
          resolve(base64);
        }
      });
    };

    convertToBase64(audioData)
      .then((base64data) => {
        console.log(
          `📤 Sending audio chunk: ${base64data.length} base64 chars (${
            audioData instanceof Blob
              ? "Blob"
              : audioData instanceof Uint8Array
              ? "Uint8Array"
              : "ArrayBuffer"
          }, ${audioData instanceof Blob ? "?" : audioData.byteLength} bytes)`
        );
        try {
          this.session!.sendRealtimeInput({
            audio: {
              data: base64data,
              mimeType: "audio/pcm;rate=16000",
            },
          });
        } catch (error) {
          console.error("❌ Error sending realtime input:", error);
        }
      })
      .catch((error) => {
        console.error("❌ Error converting audio to base64:", error);
      });
  }

  sendText(text: string) {
    if (!this.session) {
      console.error("Session not connected");
      return;
    }

    this.session.sendClientContent({
      turns: [text],
    });
  }

  disconnect() {
    if (this.session) {
      this.session.close();
      this.session = undefined;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.audioQueue = [];
  }

  isConnected(): boolean {
    return this.session !== undefined;
  }
}
