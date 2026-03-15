import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuthCookie, removeAuthCookie } from '@/lib/cookies';

export interface Workspace {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

export interface User {
  id: string;
  email: string;
  name?: string;
  user_id?: string;
  picture?: string;
  onboarding_completed?: boolean;
  default_workspace_id?: string;
  workspaces?: Workspace[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  login: (userData: User, accessToken?: string | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  switchWorkspace: (workspaceId: string) => void;
  getCurrentWorkspace: () => Workspace | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false,
      workspaces: [],
      currentWorkspaceId: null,

      login: (userData: User, accessToken?: string | null) => {
        const workspaces = userData.workspaces || [];
        const currentWorkspaceId = userData.default_workspace_id || workspaces[0]?.id || null;

        set({
          user: userData,
          token: accessToken || null,
          isAuthenticated: true,
          workspaces,
          currentWorkspaceId,
        });

        if (accessToken) {
          localStorage.setItem('token', accessToken);
          setAuthCookie(accessToken);
        }

        if (currentWorkspaceId) {
          localStorage.setItem('currentWorkspaceId', currentWorkspaceId);
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          workspaces: [],
          currentWorkspaceId: null,
        });
        localStorage.removeItem('token');
        localStorage.removeItem('currentWorkspaceId');
        removeAuthCookie();
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setUser: (user: User | null) => {
        if (user) {
          const workspaces = user.workspaces || get().workspaces;
          const currentWorkspaceId = user.default_workspace_id || get().currentWorkspaceId || workspaces[0]?.id || null;

          set({
            user,
            isAuthenticated: true,
            workspaces,
            currentWorkspaceId,
          });

          if (currentWorkspaceId) {
            localStorage.setItem('currentWorkspaceId', currentWorkspaceId);
          }
        } else {
          set({ user: null, isAuthenticated: false });
        }
      },

      setWorkspaces: (workspaces: Workspace[]) => {
        set({ workspaces });
      },

      switchWorkspace: (workspaceId: string) => {
        const { workspaces } = get();
        const workspace = workspaces.find(w => w.id === workspaceId);

        if (workspace) {
          set({ currentWorkspaceId: workspaceId });
          localStorage.setItem('currentWorkspaceId', workspaceId);
        }
      },

      getCurrentWorkspace: () => {
        const { workspaces, currentWorkspaceId } = get();
        return workspaces.find(w => w.id === currentWorkspaceId) || null;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        workspaces: state.workspaces,
        currentWorkspaceId: state.currentWorkspaceId,
      }),
    }
  )
);
