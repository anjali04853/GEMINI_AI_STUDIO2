import { create } from 'zustand';
import { Assessment, UserResponse } from '../types';

interface AssessmentState {
  activeAssessment: Assessment | null;
  currentQuestionIndex: number;
  responses: Record<string, string | number>; // questionId -> answer
  isFinished: boolean;
  
  startAssessment: (assessment: Assessment) => void;
  submitAnswer: (questionId: string, answer: string | number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  finishAssessment: () => void;
  resetAssessment: () => void;
  
  // Computed helpers could be done via selectors, but methods work for simplicity
  getProgress: () => number;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  activeAssessment: null,
  currentQuestionIndex: 0,
  responses: {},
  isFinished: false,

  startAssessment: (assessment) => set({
    activeAssessment: assessment,
    currentQuestionIndex: 0,
    responses: {},
    isFinished: false
  }),

  submitAnswer: (questionId, answer) => set((state) => ({
    responses: { ...state.responses, [questionId]: answer }
  })),

  nextQuestion: () => set((state) => {
    if (!state.activeAssessment) return state;
    const nextIndex = state.currentQuestionIndex + 1;
    if (nextIndex >= state.activeAssessment.questions.length) {
      return state; // Can't go past last question
    }
    return { currentQuestionIndex: nextIndex };
  }),

  prevQuestion: () => set((state) => ({
    currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1)
  })),

  finishAssessment: () => set({ isFinished: true }),

  resetAssessment: () => set({
    activeAssessment: null,
    currentQuestionIndex: 0,
    responses: {},
    isFinished: false
  }),

  getProgress: () => {
    const state = get();
    if (!state.activeAssessment) return 0;
    const answeredCount = Object.keys(state.responses).length;
    return (answeredCount / state.activeAssessment.questions.length) * 100;
  }
}));