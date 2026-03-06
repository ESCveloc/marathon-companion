// ---------------------------------------------------------------------------
// GET /api/auth/bungie
// Initiates the Bungie OAuth flow.
// Generates a CSRF state token, stores it in a cookie, then redirects the
// user to the Bungie authorization page.
// ---------------------------------------------------------------------------

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { generateState, getAuthorizationUrl } from '@/lib/bungie/auth';

export async function GET(): Promise<NextResponse> {
  const state = generateState();

  const cookieStore = await cookies();

  // Store state in a short-lived, httpOnly, sameSite=lax cookie for CSRF verification
  cookieStore.set('bungie_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

  const authUrl = getAuthorizationUrl(state);
  return NextResponse.redirect(authUrl);
}
