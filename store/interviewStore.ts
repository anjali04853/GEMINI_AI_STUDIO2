import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InterviewQuestion, InterviewSession, QuizConfig } from '../types';
import { mockInterviewQuestions } from '../data/mockInterviewData';
import { generateId } from '../lib/utils';

interface InterviewStore {
  // Session History
  sessions: InterviewSession[];
  
  // Active Quiz State
  activeConfig: QuizConfig | null;
  activeQuestions: InterviewQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, number>; // questionId -> optionIndex
  isQuizActive: boolean;
  startTime: number;
  
  // Actions
  startQuiz: (config: QuizConfig) => void;
  answerQuestion: (questionId: string, optionIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitQuiz: () => string; // returns session ID
  resetQuiz: () => void;
  
  // Computed
  getScore: () => { correct: number; total: number; percentage: number };
}

export const useInterviewStore = create<InterviewStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeConfig: null,
      activeQuestions: [],
      currentQuestionIndex: 0,
      answers: {},
      isQuizActive: false,
      startTime: 0,

      startQuiz: (config) => {
        // Filter questions based on config
        let filtered = mockInterviewQuestions.filter(q => 
          config.topics.includes(q.topic)
        );
        
        // Filter by difficulty if not mixed (assuming logic can be expanded)
        // For simplicity, we include all difficulties if matching topic, 
        // or we could filter strictly. Let's do a simple shuffle and slice.
        
        // Shuffle
        filtered = filtered.sort(() => 0.5 - Math.random());
        
        // Slice to count
        const selectedQuestions = filtered.slice(0, config.questionCount);
        
        set({
          activeConfig: config,
          activeQuestions: selectedQuestions,
          currentQuestionIndex: 0,
          answers: {},
          isQuizActive: true,
          startTime: Date.now(),
        });
      },

      answerQuestion: (questionId, optionIndex) => set((state) => ({
        answers: { ...state.answers, [questionId]: optionIndex }
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

      submitQuiz: () => {
        const state = get();
        const endTime = Date.now();
        const durationSeconds = Math.floor((endTime - state.startTime) / 1000);
        
        let correctCount = 0;
        state.activeQuestions.forEach(q => {
          if (state.answers[q.id] === q.correctOptionIndex) {
            correctCount++;
          }
        });

        const score = Math.round((correctCount / state.activeQuestions.length) * 100);

        const newSession: InterviewSession = {
          id: generateId(),
          date: Date.now(),
          config: state.activeConfig!,
          score,
          totalQuestions: state.activeQuestions.length,
          correctCount,
          durationSeconds,
          answers: state.answers,
        };

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          isQuizActive: false
        }));

        return newSession.id;
      },

      resetQuiz: () => set({
        activeConfig: null,
        activeQuestions: [],
        currentQuestionIndex: 0,
        answers: {},
        isQuizActive: false,
        startTime: 0,
      }),

      getScore: () => {
        const state = get();
        let correct = 0;
        state.activeQuestions.forEach(q => {
          if (state.answers[q.id] === q.correctOptionIndex) {
            correct++;
          }
        });
        return {
          correct,
          total: state.activeQuestions.length,
          percentage: state.activeQuestions.length > 0 
            ? Math.round((correct / state.activeQuestions.length) * 100) 
            : 0
        };
      }
    }),
    {
      name: 'interview-store',
      partialize: (state) => ({ sessions: state.sessions }), // Only persist sessions history
    }
  )
);