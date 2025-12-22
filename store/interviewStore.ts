import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InterviewQuestion, InterviewSession, QuizConfig } from '../types';
import { generateId } from '../lib/utils';

interface InterviewStore {
  // Session History
  sessions: InterviewSession[];

  // Active Quiz State
  sessionId: string | null; // API session ID
  activeConfig: QuizConfig | null;
  activeQuestions: InterviewQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, number>; // questionId -> optionIndex
  isQuizActive: boolean;
  startTime: number;

  // Actions
  setActiveQuiz: (sessionId: string, config: QuizConfig, questions: InterviewQuestion[]) => void;
  answerQuestion: (questionId: string, optionIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  finishQuiz: () => void; // Mark quiz as finished (results come from API)
  resetQuiz: () => void;

  // Computed
  getScore: () => { correct: number; total: number; percentage: number };
  getAnswersArray: () => { questionId: string; answer: number }[];
}

export const useInterviewStore = create<InterviewStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      sessionId: null,
      activeConfig: null,
      activeQuestions: [],
      currentQuestionIndex: 0,
      answers: {},
      isQuizActive: false,
      startTime: 0,

      setActiveQuiz: (sessionId, config, questions) => {
        set({
          sessionId,
          activeConfig: config,
          activeQuestions: questions,
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

      finishQuiz: () => {
        const state = get();
        const endTime = Date.now();
        const durationSeconds = Math.floor((endTime - state.startTime) / 1000);

        // Store session locally for history (actual score comes from API)
        const newSession: InterviewSession = {
          id: state.sessionId || generateId(),
          date: Date.now(),
          config: state.activeConfig!,
          score: 0, // Will be updated from API response
          totalQuestions: state.activeQuestions.length,
          correctCount: 0, // Will be updated from API response
          durationSeconds,
          answers: state.answers,
        };

        set((prevState) => ({
          sessions: [newSession, ...prevState.sessions],
          isQuizActive: false
        }));
      },

      resetQuiz: () => set({
        sessionId: null,
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
      },

      getAnswersArray: () => {
        const state = get();
        return Object.entries(state.answers).map(([questionId, answer]) => ({
          questionId,
          answer
        }));
      }
    }),
    {
      name: 'interview-store',
      partialize: (state) => ({ sessions: state.sessions }), // Only persist sessions history
    }
  )
);