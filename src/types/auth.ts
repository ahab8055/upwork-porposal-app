export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Workspace {
  id: string;
  name: string;
  role: WorkspaceRole;
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  onboarding_completed?: boolean;
  default_workspace_id?: string;
  workspaces?: Workspace[];
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface RegisterResponse {
  message: string;
}

export interface VerifyEmailResponse {
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
  role: WorkspaceRole;
}

export interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  switchWorkspace: (workspaceId: string) => void;
}
