import { apiClient } from '@/lib/axios';
import type { LoginRequest, RegisterRequest, User } from '@/types/auth';

export const authService = {
  login: async (credentials: LoginRequest) => {
    const response = await apiClient.post<{
      user: User;
      access_token: string;
    }>('/auth/login', credentials);
    return response.data;
  },

  signup: async (data: RegisterRequest) => {
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
