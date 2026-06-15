'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GoogleLogin,
  useGoogleOAuth,
  type CredentialResponse,
} from '@react-oauth/google';
import { toast } from 'sonner';
import { GoogleButton } from '@/components/auth/SocialButtons';
import { useGoogleAuth } from '@/hooks/useAuth';

interface GoogleLoginButtonProps {
  text?: 'signin_with' | 'signup_with';
}

function GoogleLoginButtonUnavailable({
  isPending,
  onClick,
}: {
  isPending: boolean;
  onClick: () => void;
}) {
  return (
    <div className="relative h-11 w-full">
      <div className={`pointer-events-none ${isPending ? 'opacity-60' : ''}`}>
        <GoogleButton onClick={() => undefined} />
      </div>
      <button
        type="button"
        className="absolute inset-0 z-10 cursor-pointer rounded-md"
        onClick={onClick}
        aria-label="Sign in with Google"
        data-testid="google-login-fallback"
      />
    </div>
  );
}

function GoogleLoginButtonInner({ text = 'signin_with' }: GoogleLoginButtonProps) {
  const { mutate: googleAuth, isPending } = useGoogleAuth();
  const { scriptLoadedSuccessfully } = useGoogleOAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState(0);

  const googleReady = scriptLoadedSuccessfully;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const updateWidth = () => {
      setButtonWidth(element.offsetWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleSuccess = useCallback(
    (credentialResponse: CredentialResponse) => {
      if (!credentialResponse.credential) {
        toast.error('Google sign-in failed. Please try again.');
        return;
      }
      googleAuth({ id_token: credentialResponse.credential });
    },
    [googleAuth]
  );

  const handleError = useCallback(() => {
    toast.error('Google sign-in failed. Please try again.');
  }, []);

  const handleUnavailableClick = () => {
    if (!scriptLoadedSuccessfully) {
      toast.error(
        'Google sign-in could not load. Confirm this domain is listed under Authorized JavaScript origins in Google Cloud Console.'
      );
      return;
    }

    toast.error('Google sign-in is still loading. Please try again in a moment.');
  };

  return (
    <div ref={containerRef} className="relative h-11 w-full">
      <div className={`pointer-events-none ${isPending ? 'opacity-60' : ''}`}>
        <GoogleButton onClick={() => undefined} />
      </div>

      {googleReady && buttonWidth > 0 ? (
        <div
          className={`absolute inset-0 z-10 ${isPending ? 'pointer-events-none opacity-50' : ''}`}
          aria-label="Sign in with Google"
        >
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            text={text}
            size="large"
            theme="outline"
            width={buttonWidth}
            containerProps={{
              className: 'h-full w-full',
              style: { width: '100%', height: '100%' },
            }}
          />
        </div>
      ) : (
        <button
          type="button"
          className="absolute inset-0 z-10 cursor-pointer rounded-md"
          onClick={handleUnavailableClick}
          aria-label="Sign in with Google"
          data-testid="google-login-fallback"
        />
      )}
    </div>
  );
}

export function GoogleLoginButton(props: GoogleLoginButtonProps) {
  const { isPending } = useGoogleAuth();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <GoogleLoginButtonUnavailable
        isPending={isPending}
        onClick={() =>
          toast.error(
            'Google sign-in is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID on Vercel.'
          )
        }
      />
    );
  }

  return <GoogleLoginButtonInner {...props} />;
}
