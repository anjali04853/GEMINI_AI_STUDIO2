import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../lib/api/admin.api';
import { queryKeys } from '../../lib/query/queryKeys';
import type {
  DatasetFilters,
  CreateDatasetRequest,
  AdminQuestionFilters,
  CreateQuestionRequest,
  AdminUserFilters,
  SystemConfig,
} from '../../lib/api/types';

// ===== Datasets Hooks =====
export const useDatasets = (filters?: DatasetFilters) => {
  return useQuery({
    queryKey: queryKeys.admin.datasets.list(filters),
    queryFn: () => adminApi.datasets.list(filters),
  });
};

export const useDatasetDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.admin.datasets.detail(id),
    queryFn: () => adminApi.datasets.getById(id),
    enabled: !!id,
  });
};

export const useCreateDataset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDatasetRequest) => adminApi.datasets.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.datasets.all() });
    },
  });
};

export const useUpdateDataset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDatasetRequest> }) =>
      adminApi.datasets.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.datasets.all() });
    },
  });
};

export const useDeleteDataset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.datasets.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.datasets.all() });
    },
  });
};

// ===== Questions Hooks =====
export const useAdminQuestions = (filters?: AdminQuestionFilters) => {
  return useQuery({
    queryKey: queryKeys.admin.questions.list(filters),
    queryFn: () => adminApi.questions.list(filters),
  });
};

export const useQuestionDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.admin.questions.detail(id),
    queryFn: () => adminApi.questions.getById(id),
    enabled: !!id,
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuestionRequest) => adminApi.questions.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.questions.all() });
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateQuestionRequest> }) =>
      adminApi.questions.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.questions.all() });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.questions.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.questions.all() });
    },
  });
};

// ===== Users Hooks =====
export const useAdminUsers = (filters?: AdminUserFilters) => {
  return useQuery({
    queryKey: queryKeys.admin.users.list(filters),
    queryFn: () => adminApi.users.list(filters),
  });
};

export const useAdminUserDetail = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.admin.users.detail(userId),
    queryFn: () => adminApi.users.getById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: 'active' | 'blocked' }) =>
      adminApi.users.updateStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all() });
    },
  });
};

// ===== Reports Hooks =====
export const useAdminReports = () => {
  return useQuery({
    queryKey: queryKeys.admin.reports.all(),
    queryFn: () => adminApi.reports.list(),
  });
};

export const useAdminReportDetail = (reportId: string) => {
  return useQuery({
    queryKey: queryKeys.admin.reports.detail(reportId),
    queryFn: () => adminApi.reports.getById(reportId),
    enabled: !!reportId,
  });
};

// ===== Config Hooks =====
export const useSystemConfig = () => {
  return useQuery({
    queryKey: queryKeys.admin.config(),
    queryFn: () => adminApi.config.get(),
  });
};

export const useUpdateSystemConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SystemConfig>) => adminApi.config.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.config() });
    },
  });
};
