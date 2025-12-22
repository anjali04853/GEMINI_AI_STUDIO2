import { apiClient } from './client';
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  ProfileUpdateRequest,
  AuthUser,
  SwitchOrganizationRequest,
  SwitchOrganizationResponse,
} from './types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  logout: async (): Promise<{ success: boolean }> => {
    const response = await apiClient.post<{ success: boolean }>('/auth/logout');
    return response.data;
  },

  getProfile: async (): Promise<AuthUser> => {
    const response = await apiClient.get<AuthUser>('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: ProfileUpdateRequest): Promise<{ success: boolean }> => {
    const response = await apiClient.put<{ success: boolean }>('/auth/profile', data);
    return response.data;
  },

  switchOrganization: async (data: SwitchOrganizationRequest): Promise<SwitchOrganizationResponse> => {
    const response = await apiClient.post<SwitchOrganizationResponse>('/organization/switch', data);
    return response.data;
  },
};
