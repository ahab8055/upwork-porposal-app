import { apiClient } from '@/lib/api-client';
import type { LoginFormData, SignupFormData, User } from '@/types/auth';

export const authService = {
  login: async (credentials: LoginFormData) => {
    const response = await apiClient.post<{
      user: User;
      access_token: string;
    }>('/auth/login', credentials);
    return response.data;
  },

  signup: async (data: SignupFormData) => {
    const response = await apiClient.post<{
      user: User;
      access_token: string;
    }>('/auth/signup', data);
    return response.data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  checkAuth: async () => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  exchangeSession: async (sessionId: string) => {
    const response = await apiClient.post<User>('/auth/session', {
      session_id: sessionId,
    });
    return response.data;
  },
};
