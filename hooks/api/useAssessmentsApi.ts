import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assessmentsApi } from '../../lib/api/assessments.api';
import { queryKeys } from '../../lib/query/queryKeys';
import type {
  AssessmentListFilters,
  SubmitAssessmentRequest,
  CreateAssessmentRequest,
} from '../../lib/api/types';

export const useAssessmentsList = (filters?: AssessmentListFilters) => {
  return useQuery({
    queryKey: queryKeys.assessments.list(filters || {}),
    queryFn: () => assessmentsApi.list(filters),
  });
};

export const useAssessmentDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.assessments.detail(id),
    queryFn: () => assessmentsApi.getById(id),
    enabled: !!id,
  });
};

export const useStartAssessment = () => {
  return useMutation({
    mutationFn: (assessmentId: string) => assessmentsApi.start(assessmentId),
  });
};

export const useSubmitAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data: SubmitAssessmentRequest;
    }) => assessmentsApi.submit(sessionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assessments.results(variables.sessionId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
};

export const useAssessmentResults = (sessionId: string) => {
  return useQuery({
    queryKey: queryKeys.assessments.results(sessionId),
    queryFn: () => assessmentsApi.getResults(sessionId),
    enabled: !!sessionId,
  });
};

export const useCreateAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssessmentRequest) => assessmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assessments.all });
    },
  });
};
