import { apiClient } from './client';
import type {
  StartQuizRequest,
  StartInterviewRequest,
  StartInterviewResponse,
  SubmitQuizRequest,
  QuizResultResponse,
  TextAnswerRequest,
  BotMessageRequest,
  BotMessageResponse,
  SaveBotInterviewRequest,
  InterviewResultResponse,
} from './types';

export const interviewsApi = {
  // Quiz Mode
  quiz: {
    start: async (config: StartQuizRequest): Promise<StartInterviewResponse> => {
      const response = await apiClient.post<StartInterviewResponse>(
        '/skillforge/interviews/quiz/start',
        config
      );
      return response.data;
    },

    getSession: async (sessionId: string): Promise<StartInterviewResponse> => {
      const response = await apiClient.get<StartInterviewResponse>(
        `/skillforge/interviews/quiz/${sessionId}`
      );
      return response.data;
    },

    submit: async (
      sessionId: string,
      data: SubmitQuizRequest
    ): Promise<QuizResultResponse> => {
      const response = await apiClient.post<QuizResultResponse>(
        `/skillforge/interviews/quiz/${sessionId}/submit`,
        data
      );
      return response.data;
    },
  },

  // Text Mode
  text: {
    start: async (config: StartInterviewRequest): Promise<StartInterviewResponse> => {
      const response = await apiClient.post<StartInterviewResponse>(
        '/skillforge/interviews/text/start',
        config
      );
      return response.data;
    },

    answer: async (
      sessionId: string,
      data: TextAnswerRequest
    ): Promise<{ success: boolean }> => {
      const response = await apiClient.post<{ success: boolean }>(
        `/skillforge/interviews/text/${sessionId}/answer`,
        data
      );
      return response.data;
    },

    submit: async (sessionId: string): Promise<InterviewResultResponse> => {
      const response = await apiClient.post<InterviewResultResponse>(
        `/skillforge/interviews/text/${sessionId}/submit`
      );
      return response.data;
    },
  },

  // Voice Mode
  voice: {
    start: async (config: StartInterviewRequest): Promise<StartInterviewResponse> => {
      const response = await apiClient.post<StartInterviewResponse>(
        '/skillforge/interviews/voice/start',
        config
      );
      return response.data;
    },

    uploadRecording: async (
      sessionId: string,
      file: Blob,
      questionId: string
    ): Promise<{ success: boolean; key: string }> => {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('questionId', questionId);

      const response = await apiClient.post<{ success: boolean; key: string }>(
        `/skillforge/interviews/voice/${sessionId}/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    },

    submit: async (sessionId: string): Promise<InterviewResultResponse> => {
      const response = await apiClient.post<InterviewResultResponse>(
        `/skillforge/interviews/voice/${sessionId}/submit`
      );
      return response.data;
    },
  },

  // Bot Mode
  bot: {
    start: async (config: StartInterviewRequest): Promise<StartInterviewResponse> => {
      const response = await apiClient.post<StartInterviewResponse>(
        '/skillforge/interviews/bot/start',
        config
      );
      return response.data;
    },

    sendMessage: async (
      sessionId: string,
      data: BotMessageRequest
    ): Promise<BotMessageResponse> => {
      const response = await apiClient.post<BotMessageResponse>(
        `/skillforge/interviews/bot/${sessionId}/message`,
        data
      );
      return response.data;
    },

    save: async (
      sessionId: string,
      data: SaveBotInterviewRequest
    ): Promise<InterviewResultResponse> => {
      const response = await apiClient.post<InterviewResultResponse>(
        `/skillforge/interviews/bot/${sessionId}/save`,
        data
      );
      return response.data;
    },
  },
};
