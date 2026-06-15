import { NextRequest, NextResponse } from 'next/server';

const AUTH_TOKEN_KEY = 'auth-token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function redirectToLogin(request: NextRequest, error: string) {
  return NextResponse.redirect(
    new URL(`/login?error=${encodeURIComponent(error)}`, request.nextUrl.origin)
  );
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const credential = formData.get('credential');
  const csrfTokenBody = formData.get('g_csrf_token');
  const csrfTokenCookie = request.cookies.get('g_csrf_token')?.value;

  if (
    !csrfTokenCookie ||
    !csrfTokenBody ||
    csrfTokenCookie !== String(csrfTokenBody)
  ) {
    return redirectToLogin(request, 'google_csrf');
  }

  if (!credential || typeof credential !== 'string') {
    return redirectToLogin(request, 'google_no_credential');
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    return redirectToLogin(request, 'google_misconfigured');
  }

  let authResponse: { access_token?: string };
  try {
    const response = await fetch(`${backendUrl}/api/v1/auth/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: credential }),
    });

    if (!response.ok) {
      return redirectToLogin(request, 'google_auth_failed');
    }

    authResponse = await response.json();
  } catch {
    return redirectToLogin(request, 'google_auth_failed');
  }

  const accessToken = authResponse.access_token;
  if (!accessToken) {
    return redirectToLogin(request, 'google_auth_failed');
  }

  const redirectResponse = NextResponse.redirect(
    new URL('/google-callback', request.nextUrl.origin)
  );

  redirectResponse.cookies.set(AUTH_TOKEN_KEY, accessToken, {
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
  });

  return redirectResponse;
}
