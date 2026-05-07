import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const baseUrl = request.nextUrl.origin;

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`/github-callback?error=${error ?? 'no_code'}`, baseUrl),
    );
  }

  return NextResponse.redirect(
    new URL(`/github-callback?code=${encodeURIComponent(code)}`, baseUrl),
  );
}
