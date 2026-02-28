export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  onboarding_completed?: boolean;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface InviteDetails {
  email: string;
  workspace_name: string;
  invited_by: string;
  role: string;
}

export interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}
