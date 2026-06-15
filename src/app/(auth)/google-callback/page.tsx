'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/auth-store';
import { getAuthCookie } from '@/lib/cookies';

function GoogleCallbackContent() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) {
      return;
    }
    hasFired.current = true;

    async function completeGoogleSignIn() {
      const token = getAuthCookie();
      if (!token) {
        toast.error('Google sign-in failed. No session token received.');
        router.replace('/login');
        return;
      }

      localStorage.setItem('token', token);

      try {
        const user = await authService.getCurrentUser();
        login(user, token);
        toast.success('Signed in with Google!');

        const hasWorkspace =
          user.default_workspace_id ||
          (user.workspaces && user.workspaces.length > 0);
        const canAccessDashboard = user.onboarding_completed && hasWorkspace;

        router.replace(canAccessDashboard ? '/dashboard' : '/onboarding');
      } catch {
        toast.error('Google sign-in failed. Please try again.');
        router.replace('/login');
      }
    }

    void completeGoogleSignIn();
  }, [login, router]);

  return (
    <div className="text-center space-y-4">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto" />
      <p className="text-sm text-gray-600">Signing you in with Google…</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense
        fallback={
          <div className="text-center space-y-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-600">Loading…</p>
          </div>
        }
      >
        <GoogleCallbackContent />
      </Suspense>
    </div>
  );
}
