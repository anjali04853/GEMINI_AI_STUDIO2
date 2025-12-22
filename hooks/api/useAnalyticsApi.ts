import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../../lib/api/analytics.api';
import { queryKeys } from '../../lib/query/queryKeys';
import type { ActivityHistoryFilters } from '../../lib/api/types';

export const useAnalyticsSummary = () => {
  return useQuery({
    queryKey: queryKeys.analytics.summary(),
    queryFn: () => analyticsApi.getSummary(),
  });
};

export const useActivityHistory = (filters?: ActivityHistoryFilters) => {
  return useQuery({
    queryKey: queryKeys.analytics.history(filters),
    queryFn: () => analyticsApi.getHistory(filters),
  });
};

export const useSkillsData = () => {
  return useQuery({
    queryKey: queryKeys.analytics.skills(),
    queryFn: () => analyticsApi.getSkills(),
  });
};

export const useActivityData = (days?: number) => {
  return useQuery({
    queryKey: queryKeys.analytics.activity(days),
    queryFn: () => analyticsApi.getActivity(days),
  });
};

export const useAnalyticsReport = () => {
  return useQuery({
    queryKey: queryKeys.analytics.report(),
    queryFn: () => analyticsApi.getReport(),
  });
};
