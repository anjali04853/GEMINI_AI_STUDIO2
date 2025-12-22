
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Assessment, AssessmentResult, UserResponse } from '../types';
import { generateId } from '../lib/utils';

interface AssessmentState {
  // History
  history: AssessmentResult[];

  // Active State
  activeAssessment: Assessment | null;
  sessionId: string | null; // API session ID
  currentQuestionIndex: number;
  responses: Record<string, string | number | string[]>; // questionId -> answer
  flaggedQuestions: string[];
  isFinished: boolean;

  // Timer State
  timeRemaining: number; // in seconds
  timerStarted: number | null; // timestamp when started

  startAssessment: (assessment: Assessment) => void;
  setActiveAssessment: (assessment: Assessment, sessionId: string) => void;
  submitAnswer: (questionId: string, answer: string | number | string[]) => void;
  toggleFlag: (questionId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  finishAssessment: () => void;
  resetAssessment: () => void;
  updateTimer: (seconds: number) => void;

  // Computed helpers
  getProgress: () => number;
  isFlagged: (questionId: string) => boolean;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      history: [],
      activeAssessment: null,
      sessionId: null,
      currentQuestionIndex: 0,
      responses: {},
      flaggedQuestions: [],
      isFinished: false,
      timeRemaining: 0,
      timerStarted: null,

      startAssessment: (assessment) => set({
        activeAssessment: assessment,
        sessionId: null,
        currentQuestionIndex: 0,
        responses: {},
        flaggedQuestions: [],
        isFinished: false,
        timeRemaining: assessment.durationMinutes * 60,
        timerStarted: Date.now()
      }),

      setActiveAssessment: (assessment, sessionId) => set({
        activeAssessment: assessment,
        sessionId,
        currentQuestionIndex: 0,
        responses: {},
        flaggedQuestions: [],
        isFinished: false,
        timeRemaining: assessment.durationMinutes * 60,
        timerStarted: Date.now()
      }),
      
      updateTimer: (seconds) => set({ timeRemaining: seconds }),

      submitAnswer: (questionId, answer) => set((state) => ({
        responses: { ...state.responses, [questionId]: answer }
      })),

      toggleFlag: (questionId) => set((state) => ({
        flaggedQuestions: state.flaggedQuestions.includes(questionId)
          ? state.flaggedQuestions.filter(id => id !== questionId)
          : [...state.flaggedQuestions, questionId]
      })),

      nextQuestion: () => set((state) => {
        if (!state.activeAssessment) return state;
        
        // Validation: Check if current question is required and answered
        const currentQuestion = state.activeAssessment.questions[state.currentQuestionIndex];
        const currentAnswer = state.responses[currentQuestion.id];
        
        // Check if answer is present (allow 0 as valid number, but not empty string, undefined, or empty array)
        let isAnswered = currentAnswer !== undefined && currentAnswer !== '' && currentAnswer !== null;
        if (Array.isArray(currentAnswer) && currentAnswer.length === 0) {
            isAnswered = false;
        }
        
        if (currentQuestion.required && !isAnswered) {
            return state; // Prevent moving to next question if required and unanswered
        }

        const nextIndex = state.currentQuestionIndex + 1;
        if (nextIndex >= state.activeAssessment.questions.length) {
          return state; // Can't go past last question
        }
        return { currentQuestionIndex: nextIndex };
      }),

      prevQuestion: () => set((state) => ({
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1)
      })),

      finishAssessment: () => {
        const state = get();
        if (state.activeAssessment && !state.isFinished) {
          
          // Validation: Ensure all required questions are answered before finishing
          const hasUnansweredRequired = state.activeAssessment.questions.some(q => {
             const ans = state.responses[q.id];
             const isEmpty = ans === undefined || ans === '' || ans === null || (Array.isArray(ans) && ans.length === 0);
             return q.required && isEmpty;
          });

          if (hasUnansweredRequired) {
             // Block finish if validation fails
             return;
          }

          // Convert record to array for AssessmentResult
          const responseArray: UserResponse[] = Object.entries(state.responses).map(([qId, ans]) => ({
            questionId: qId,
            answer: ans as string | number | string[]
          }));
          
          // Calculate mock score for analytics (in real app, compare with correct answers)
          const mockScore = 85; 

          const result: AssessmentResult = {
            assessmentId: state.activeAssessment.id,
            responses: responseArray,
            score: mockScore,
            completedAt: Date.now(),
          };

          set((state) => ({
            isFinished: true,
            history: [result, ...state.history]
          }));
        } else {
          set({ isFinished: true });
        }
      },

      resetAssessment: () => set({
        activeAssessment: null,
        sessionId: null,
        currentQuestionIndex: 0,
        responses: {},
        flaggedQuestions: [],
        isFinished: false,
        timeRemaining: 0,
        timerStarted: null
      }),

      getProgress: () => {
        const state = get();
        if (!state.activeAssessment) return 0;
        const answeredCount = Object.keys(state.responses).length;
        return (answeredCount / state.activeAssessment.questions.length) * 100;
      },

      isFlagged: (questionId) => {
          return get().flaggedQuestions.includes(questionId);
      }
    }),
    {
      name: 'assessment-store',
      partialize: (state) => ({ history: state.history }), // Only persist history
    }
  )
);
