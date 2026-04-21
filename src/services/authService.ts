import { apiClient } from "@/lib/axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailResponse,
  User,
  InviteDetails,
} from "@/types/auth";

export const authService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    const response = await apiClient.post<VerifyEmailResponse>(
      `/auth/verify-email?token=${encodeURIComponent(token)}`
    );
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },

  getInviteDetails: async (code: string): Promise<InviteDetails> => {
    const response = await apiClient.get<InviteDetails>(`/team/invite/${code}`);
    return response.data;
  },

  acceptInvite: async (code: string): Promise<void> => {
    await apiClient.post(`/team/invite/${code}/accept`);
  },

  googleLogin: async (data: { id_token: string }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/google-login', data);
    return response.data;
  },
};
