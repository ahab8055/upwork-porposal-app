'use client';

import { useRef, useCallback } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { toast } from 'sonner';
import { GoogleButton } from '@/components/auth/SocialButtons';
import { useGoogleAuth } from '@/hooks/useAuth';

interface GoogleLoginButtonProps {
  text?: 'signin_with' | 'signup_with';
}

export function GoogleLoginButton({ text = 'signin_with' }: GoogleLoginButtonProps) {
  const { mutate: googleAuth, isPending } = useGoogleAuth();
  const hiddenContainerRef = useRef<HTMLDivElement>(null);

  const handleSuccess = useCallback(
    (credentialResponse: CredentialResponse) => {
      if (!credentialResponse.credential) {
        toast.error('Google sign-in failed. Please try again.');
        return;
      }
      googleAuth({ id_token: credentialResponse.credential });
    },
    [googleAuth],
  );

  const handleError = () => {
    toast.error('Google sign-in failed. Please try again.');
  };

  const handleClick = () => {
    if (isPending) return;
    const container = hiddenContainerRef.current;
    if (!container) return;
    // Click the Google-rendered button inside the hidden container
    const btn =
      container.querySelector<HTMLElement>('div[role="button"]') ??
      container.querySelector<HTMLElement>('button') ??
      (container.firstElementChild as HTMLElement | null);
    if (!btn) {
      toast.error('Google sign-in is temporarily unavailable. Please refresh and try again.');
      return;
    }
    btn.click();
  };

  return (
    <>
      {/* Hidden GoogleLogin — @react-oauth/google handles GIS script timing internally.
          Clicking it opens the account-selection popup (no third-party cookies needed). */}
      <div
        ref={hiddenContainerRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
      >
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} text={text} size="large" />
      </div>

      <div className={isPending ? 'opacity-60 pointer-events-none' : ''}>
        <GoogleButton onClick={handleClick} />
      </div>
    </>
  );
}

