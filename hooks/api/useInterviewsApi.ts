import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { interviewsApi } from '../../lib/api/interviews.api';
import { queryKeys } from '../../lib/query/queryKeys';
import type {
  StartQuizRequest,
  StartInterviewRequest,
  SubmitQuizRequest,
  TextAnswerRequest,
  BotMessageRequest,
} from '../../lib/api/types';

// ===== Quiz Hooks =====
export const useStartQuiz = () => {
  return useMutation({
    mutationFn: (config: StartQuizRequest) => interviewsApi.quiz.start(config),
  });
};

export const useQuizSession = (sessionId: string) => {
  return useQuery({
    queryKey: queryKeys.interviews.quiz.session(sessionId),
    queryFn: () => interviewsApi.quiz.getSession(sessionId),
    enabled: !!sessionId,
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data: SubmitQuizRequest;
    }) => interviewsApi.quiz.submit(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
};

// ===== Text Interview Hooks =====
export const useStartTextInterview = () => {
  return useMutation({
    mutationFn: (config: StartInterviewRequest) => interviewsApi.text.start(config),
  });
};

export const useSubmitTextAnswer = () => {
  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data: TextAnswerRequest;
    }) => interviewsApi.text.answer(sessionId, data),
  });
};

export const useSubmitTextInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => interviewsApi.text.submit(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
};

// ===== Voice Interview Hooks =====
export const useStartVoiceInterview = () => {
  return useMutation({
    mutationFn: (config: StartInterviewRequest) => interviewsApi.voice.start(config),
  });
};

export const useUploadVoiceRecording = () => {
  return useMutation({
    mutationFn: ({
      sessionId,
      file,
      questionId,
    }: {
      sessionId: string;
      file: Blob;
      questionId: string;
    }) => interviewsApi.voice.uploadRecording(sessionId, file, questionId),
  });
};

export const useSubmitVoiceInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => interviewsApi.voice.submit(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
};

// ===== Bot Interview Hooks =====
export const useStartBotInterview = () => {
  return useMutation({
    mutationFn: (config: StartInterviewRequest) => interviewsApi.bot.start(config),
  });
};

export const useSendBotMessage = () => {
  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data: BotMessageRequest;
    }) => interviewsApi.bot.sendMessage(sessionId, data),
  });
};

export const useSaveBotInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      durationSeconds,
    }: {
      sessionId: string;
      durationSeconds?: number;
    }) => interviewsApi.bot.save(sessionId, { durationSeconds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
};
