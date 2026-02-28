import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuthCookie, removeAuthCookie } from '@/lib/cookies';

export interface User {
  id: string;
  email: string;
  name?: string;
  user_id?: string;
  role?: string;
  picture?: string;
  onboarding_completed?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, accessToken?: string | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false,
      
      login: (userData: User, accessToken?: string | null) => {
        set({
          user: userData,
          token: accessToken || null,
          isAuthenticated: true,
        });
        if (accessToken) {
          localStorage.setItem('token', accessToken);
          setAuthCookie(accessToken);
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('token');
        removeAuthCookie();
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
