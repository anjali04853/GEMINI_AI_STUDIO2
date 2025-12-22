import { apiClient } from './client';
import type {
  DatasetFilters,
  Dataset,
  DatasetListResponse,
  CreateDatasetRequest,
  AdminQuestionFilters,
  AdminQuestion,
  AdminQuestionListResponse,
  CreateQuestionRequest,
  AdminUserFilters,
  AdminUser,
  AdminUserListResponse,
  AdminReportListResponse,
  AdminReportDetail,
  SystemConfig,
} from './types';

export const adminApi = {
  // Datasets
  datasets: {
    list: async (filters?: DatasetFilters): Promise<DatasetListResponse> => {
      const response = await apiClient.get<DatasetListResponse>('/skillforge/admin/datasets', {
        params: filters,
      });
      return response.data;
    },

    getById: async (id: string): Promise<Dataset> => {
      const response = await apiClient.get<Dataset>(`/skillforge/admin/datasets/${id}`);
      return response.data;
    },

    create: async (data: CreateDatasetRequest): Promise<Dataset> => {
      const response = await apiClient.post<Dataset>('/skillforge/admin/datasets', data);
      return response.data;
    },

    update: async (id: string, data: Partial<CreateDatasetRequest>): Promise<Dataset> => {
      const response = await apiClient.put<Dataset>(`/skillforge/admin/datasets/${id}`, data);
      return response.data;
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      const response = await apiClient.delete<{ success: boolean }>(`/skillforge/admin/datasets/${id}`);
      return response.data;
    },
  },

  // Questions
  questions: {
    list: async (filters?: AdminQuestionFilters): Promise<AdminQuestionListResponse> => {
      const response = await apiClient.get<AdminQuestionListResponse>('/skillforge/admin/questions', {
        params: filters,
      });
      return response.data;
    },

    getById: async (id: string): Promise<AdminQuestion> => {
      const response = await apiClient.get<AdminQuestion>(`/skillforge/admin/questions/${id}`);
      return response.data;
    },

    create: async (data: CreateQuestionRequest): Promise<AdminQuestion> => {
      const response = await apiClient.post<AdminQuestion>('/skillforge/admin/questions', data);
      return response.data;
    },

    update: async (id: string, data: Partial<CreateQuestionRequest>): Promise<AdminQuestion> => {
      const response = await apiClient.put<AdminQuestion>(`/skillforge/admin/questions/${id}`, data);
      return response.data;
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      const response = await apiClient.delete<{ success: boolean }>(`/skillforge/admin/questions/${id}`);
      return response.data;
    },
  },

  // Users
  users: {
    list: async (filters?: AdminUserFilters): Promise<AdminUserListResponse> => {
      const response = await apiClient.get<AdminUserListResponse>('/skillforge/admin/users', {
        params: filters,
      });
      return response.data;
    },

    getById: async (userId: string): Promise<AdminUser> => {
      const response = await apiClient.get<AdminUser>(`/skillforge/admin/users/${userId}`);
      return response.data;
    },

    updateStatus: async (
      userId: string,
      status: 'active' | 'blocked'
    ): Promise<AdminUser> => {
      const response = await apiClient.patch<AdminUser>(`/skillforge/admin/users/${userId}`, {
        status,
      });
      return response.data;
    },
  },

  // Reports
  reports: {
    list: async (): Promise<AdminReportListResponse> => {
      const response = await apiClient.get<AdminReportListResponse>('/skillforge/admin/reports');
      return response.data;
    },

    getById: async (reportId: string): Promise<AdminReportDetail> => {
      const response = await apiClient.get<AdminReportDetail>(`/skillforge/admin/reports/${reportId}`);
      return response.data;
    },
  },

  // Config
  config: {
    get: async (): Promise<SystemConfig> => {
      const response = await apiClient.get<SystemConfig>('/skillforge/admin/config');
      return response.data;
    },

    update: async (data: Partial<SystemConfig>): Promise<SystemConfig> => {
      const response = await apiClient.put<SystemConfig>('/skillforge/admin/config', data);
      return response.data;
    },
  },
};
