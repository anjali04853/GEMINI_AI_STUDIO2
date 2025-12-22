import { apiClient } from './client';
import type {
  AssessmentListFilters,
  AssessmentListResponse,
  AssessmentListItem,
  StartAssessmentResponse,
  SubmitAssessmentRequest,
  AssessmentResultResponse,
  CreateAssessmentRequest,
} from './types';

export const assessmentsApi = {
  list: async (filters?: AssessmentListFilters): Promise<AssessmentListResponse> => {
    const response = await apiClient.get<AssessmentListResponse>('/skillforge/assessments', {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string): Promise<AssessmentListItem> => {
    const response = await apiClient.get<AssessmentListItem>(`/skillforge/assessments/${id}`);
    return response.data;
  },

  start: async (id: string): Promise<StartAssessmentResponse> => {
    const response = await apiClient.post<StartAssessmentResponse>(
      `/skillforge/assessments/${id}/start`
    );
    return response.data;
  },

  submit: async (
    sessionId: string,
    data: SubmitAssessmentRequest
  ): Promise<AssessmentResultResponse> => {
    const response = await apiClient.post<AssessmentResultResponse>(
      `/skillforge/assessments/sessions/${sessionId}/submit`,
      data
    );
    return response.data;
  },

  getResults: async (sessionId: string): Promise<AssessmentResultResponse> => {
    const response = await apiClient.get<AssessmentResultResponse>(
      `/skillforge/assessments/results/${sessionId}`
    );
    return response.data;
  },

  // Admin: Create assessment
  create: async (data: CreateAssessmentRequest): Promise<AssessmentListItem> => {
    const response = await apiClient.post<AssessmentListItem>('/skillforge/assessments', data);
    return response.data;
  },
};
