// ---------------------------------------------------------------------------
// GET /api/auth/bungie/callback
// Handles the OAuth redirect from Bungie after the user authorizes the app.
//
// 1. Verifies the state param matches the cookie (CSRF protection)
// 2. Exchanges the authorization code for tokens
// 3. Stores tokens in httpOnly cookies
// 4. Redirects the user back to the app
// ---------------------------------------------------------------------------

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/bungie/auth';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  // --- CSRF: verify state ---
  const cookieStore = await cookies();
  const savedState = cookieStore.get('bungie_oauth_state')?.value;

  if (!state || !savedState || state !== savedState) {
    return NextResponse.redirect(`${appUrl}/?error=oauth_state_mismatch`);
  }

  // Clear the state cookie — it's single-use
  cookieStore.delete('bungie_oauth_state');

  if (!code) {
    return NextResponse.redirect(`${appUrl}/?error=oauth_no_code`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
    };

    // Access token — short-lived (expires_in seconds, typically 3600)
    cookieStore.set('bungie_access_token', tokens.access_token, {
      ...cookieOptions,
      maxAge: tokens.expires_in,
    });

    // Bungie membership ID — useful for identifying the user
    cookieStore.set('bungie_membership_id', tokens.membership_id, {
      ...cookieOptions,
      maxAge: tokens.expires_in,
    });

    // Refresh token — long-lived (refresh_expires_in, ~90 days). Confidential clients only.
    if (tokens.refresh_token && tokens.refresh_expires_in) {
      cookieStore.set('bungie_refresh_token', tokens.refresh_token, {
        ...cookieOptions,
        maxAge: tokens.refresh_expires_in,
      });
    }

    return NextResponse.redirect(`${appUrl}/`);
  } catch (err) {
    console.error('[bungie/callback] Token exchange failed:', err);
    return NextResponse.redirect(`${appUrl}/?error=oauth_token_exchange_failed`);
  }
}
