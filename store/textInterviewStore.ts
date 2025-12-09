import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TextInterviewConfig, TextInterviewSession, TextQuestion } from '../types';
import { mockTextQuestions } from '../data/mockInterviewData';
import { generateId } from '../lib/utils';

interface TextInterviewStore {
  sessions: TextInterviewSession[];
  
  activeConfig: TextInterviewConfig | null;
  activeQuestions: TextQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, string>; // Drafts and finals mixed here, simplistically
  isInterviewActive: boolean;
  
  startInterview: (config: TextInterviewConfig) => void;
  updateAnswer: (questionId: string, text: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitInterview: () => string; // returns session ID
  saveFeedback: (sessionId: string, feedback: Record<string, string>) => void;
  resetInterview: () => void;
}

export const useTextInterviewStore = create<TextInterviewStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeConfig: null,
      activeQuestions: [],
      currentQuestionIndex: 0,
      answers: {},
      isInterviewActive: false,

      startInterview: (config) => {
        // Filter questions based on selected types
        let filtered = mockTextQuestions.filter(q => 
          config.types.includes(q.type)
        );
        
        // Shuffle
        filtered = filtered.sort(() => 0.5 - Math.random());
        
        // Slice
        const selectedQuestions = filtered.slice(0, config.questionCount);
        
        set({
          activeConfig: config,
          activeQuestions: selectedQuestions,
          currentQuestionIndex: 0,
          answers: {}, // Reset answers
          isInterviewActive: true,
        });
      },

      updateAnswer: (questionId, text) => set((state) => ({
        answers: { ...state.answers, [questionId]: text }
      })),

      nextQuestion: () => set((state) => ({
        currentQuestionIndex: Math.min(
          state.currentQuestionIndex + 1, 
          state.activeQuestions.length - 1
        )
      })),

      prevQuestion: () => set((state) => ({
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1)
      })),

      submitInterview: () => {
        const state = get();
        const newSession: TextInterviewSession = {
          id: generateId(),
          date: Date.now(),
          config: state.activeConfig!,
          questions: state.activeQuestions,
          answers: state.answers,
          feedback: {}
        };

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          isInterviewActive: false
        }));

        return newSession.id;
      },
      
      saveFeedback: (sessionId, feedback) => set((state) => ({
        sessions: state.sessions.map(s => 
          s.id === sessionId ? { ...s, feedback: { ...s.feedback, ...feedback } } : s
        )
      })),

      resetInterview: () => set({
        activeConfig: null,
        activeQuestions: [],
        currentQuestionIndex: 0,
        answers: {},
        isInterviewActive: false
      }),
    }),
    {
      name: 'text-interview-store',
      partialize: (state) => ({ sessions: state.sessions }),
    }
  )
);