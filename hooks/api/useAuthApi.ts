import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../../lib/api/auth.api';
import { queryKeys } from '../../lib/query/queryKeys';
import { useAuthStore } from '../../store/authStore';
import type { LoginRequest, SignupRequest, ProfileUpdateRequest } from '../../lib/api/types';
import { getApiError } from '../../lib/api/client';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      // Get role from organizations array if available, default to 'user'
      const role = data.user.organizations?.[0]?.role || data.user.role || 'user';
      // Get organization from response or construct from user.organizations
      const organization = data.organization || (data.user.organizations?.[0] ? {
        id: data.user.organizations[0].id,
        name: data.user.organizations[0].name,
      } : undefined);

      setAuth(
        {
          id: String(data.user.id),
          name: data.user.name || '',
          email: data.user.email,
          role: role as 'user' | 'admin',
          status: 'active',
          joinedAt: Date.now(),
        },
        data.token,
        organization
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
    onError: (error) => {
      console.error('Login error:', getApiError(error));
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: SignupRequest) => authApi.signup(data),
    onSuccess: (data) => {
      // New users default to 'user' role
      setAuth(
        {
          id: String(data.user.id),
          name: data.user.name || '',
          email: data.user.email,
          role: 'user',
          status: 'active',
          joinedAt: Date.now(),
        },
        data.token,
        data.organization
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
    onError: (error) => {
      console.error('Signup error:', getApiError(error));
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout: clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
    onError: () => {
      // Even on error, clear local state
      clearAuth();
      queryClient.clear();
    },
  });
};

export const useProfile = () => {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: () => authApi.getProfile(),
    enabled: !!token,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileUpdateRequest) => authApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
  });
};

export const useSwitchOrganization = () => {
  const queryClient = useQueryClient();
  const { setOrganization, setToken } = useAuthStore();

  return useMutation({
    mutationFn: (organizationId: number) => authApi.switchOrganization({ organizationId }),
    onSuccess: (data) => {
      if (data.token) {
        setToken(data.token);
      }
      setOrganization({ id: String(data.organizationId), name: '' });
      queryClient.invalidateQueries();
    },
  });
};
