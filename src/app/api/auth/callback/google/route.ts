import { NextRequest, NextResponse } from 'next/server';

function loginRedirect(request: NextRequest, error: string) {
  return NextResponse.redirect(
    new URL(`/login?error=${encodeURIComponent(error)}`, request.nextUrl.origin),
    303
  );
}

function handoffHtml(credential: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Signing in…</title>
</head>
<body>
  <p>Signing you in with Google…</p>
  <script>
    (function () {
      try {
        sessionStorage.setItem('google_id_token', ${JSON.stringify(credential)});
        window.location.replace('/google-callback');
      } catch (e) {
        window.location.replace('/login?error=google_handoff_failed');
      }
    })();
  </script>
</body>
</html>`;
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
    return loginRedirect(request, 'google_csrf');
  }

  if (!credential || typeof credential !== 'string') {
    return loginRedirect(request, 'google_no_credential');
  }

  return new NextResponse(handoffHtml(credential), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
