'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useGoogleAuth } from '@/hooks/useAuth';

function GoogleCallbackContent() {
  const router = useRouter();
  const { mutate: googleAuth, isPending } = useGoogleAuth();
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) {
      return;
    }
    hasFired.current = true;

    const idToken = sessionStorage.getItem('google_id_token');
    sessionStorage.removeItem('google_id_token');

    if (!idToken) {
      toast.error('Google sign-in failed. No credential received.');
      router.replace('/login');
      return;
    }

    googleAuth({ id_token: idToken });
  }, [googleAuth, router]);

  return (
    <div className="text-center space-y-4">
      {isPending ? (
        <>
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-600">Signing you in with Google…</p>
        </>
      ) : (
        <p className="text-sm text-gray-600">Redirecting…</p>
      )}
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
