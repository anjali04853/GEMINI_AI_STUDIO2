
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VoiceBotConfig, VoiceBotSession, BotTranscriptItem } from '../types';
import { generateId } from '../lib/utils';

interface VoiceBotStore {
  sessions: VoiceBotSession[];
  activeConfig: VoiceBotConfig | null;
  
  startBotSession: (config: VoiceBotConfig) => void;
  saveBotSession: (transcript: BotTranscriptItem[], durationSeconds: number) => string;
  resetBotSession: () => void;
}

export const useVoiceBotStore = create<VoiceBotStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeConfig: null,

      startBotSession: (config) => {
        set({ activeConfig: config });
      },

      saveBotSession: (transcript, durationSeconds) => {
        const state = get();
        if (!state.activeConfig) return '';

        const newSession: VoiceBotSession = {
          id: generateId(),
          date: Date.now(),
          config: state.activeConfig,
          transcript,
          durationSeconds,
        };

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          activeConfig: null // Clear active config on save
        }));

        return newSession.id;
      },

      resetBotSession: () => set({ activeConfig: null }),
    }),
    {
      name: 'voice-bot-store',
      partialize: (state) => ({ sessions: state.sessions }),
    }
  )
);
