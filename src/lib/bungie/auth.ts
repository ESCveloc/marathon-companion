// ---------------------------------------------------------------------------
// Bungie OAuth 2.0 helpers
//
// Bungie uses the Authorization Code grant type.
// - Do NOT include a scope param — Bungie will reject requests that include one.
// - Do NOT use in-app web views. iOS: SFSafariViewController,
//   Android: Chrome Custom Tabs, Web: standard browser redirect.
//
// Endpoints:
//   Authorization: https://www.bungie.net/en/oauth/authorize
//   Token (exchange + refresh): https://www.bungie.net/platform/app/oauth/token/
// ---------------------------------------------------------------------------

import { TokenResponse } from './types';

const AUTHORIZE_URL = 'https://www.bungie.net/en/oauth/authorize';
const TOKEN_URL = 'https://www.bungie.net/platform/app/oauth/token/';

// ---------------------------------------------------------------------------
// Step 1 — Build the authorization URL
// ---------------------------------------------------------------------------

/**
 * Returns the URL to redirect the user to for Bungie OAuth authorization.
 *
 * @param state  A cryptographically random, unguessable string. Store this in
 *               a short-lived cookie so you can verify it on callback (CSRF).
 */
export function getAuthorizationUrl(state: string): string {
  const clientId = process.env.BUNGIE_CLIENT_ID;
  if (!clientId) throw new Error('BUNGIE_CLIENT_ID is not set.');

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    state,
    // NOTE: Do NOT add a scope parameter — Bungie rejects requests that include one.
  });

  return `${AUTHORIZE_URL}?${params.toString()}`;
}

// ---------------------------------------------------------------------------
// Step 3 — Exchange authorization code for tokens
// ---------------------------------------------------------------------------

/**
 * Exchanges the authorization code (from the OAuth callback) for an
 * access token (and optionally a refresh token for confidential clients).
 */
export async function exchangeCodeForTokens(code: string): Promise<TokenResponse> {
  const clientId = process.env.BUNGIE_CLIENT_ID;
  const clientSecret = process.env.BUNGIE_CLIENT_SECRET;

  if (!clientId) throw new Error('BUNGIE_CLIENT_ID is not set.');

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
  });

  const headers: HeadersInit = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  if (clientSecret) {
    // Confidential client: use HTTP Basic auth with client_id:client_secret
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    headers['Authorization'] = `Basic ${credentials}`;
  } else {
    // Public client: pass client_id in the body
    body.append('client_id', clientId);
  }

  return fetchToken(headers, body);
}

// ---------------------------------------------------------------------------
// Step 6 — Refresh an expired access token (confidential clients only)
// ---------------------------------------------------------------------------

/**
 * Uses a refresh token to obtain a new access token.
 * Only available for confidential clients (those with BUNGIE_CLIENT_SECRET set).
 */
export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const clientId = process.env.BUNGIE_CLIENT_ID;
  const clientSecret = process.env.BUNGIE_CLIENT_SECRET;

  if (!clientId) throw new Error('BUNGIE_CLIENT_ID is not set.');
  if (!clientSecret) {
    throw new Error(
      'Token refresh requires a confidential client (BUNGIE_CLIENT_SECRET must be set).',
    );
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  return fetchToken(
    {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body,
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchToken(
  headers: HeadersInit,
  body: URLSearchParams,
): Promise<TokenResponse> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers,
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bungie token endpoint returned HTTP ${res.status}: ${text}`);
  }

  return res.json() as Promise<TokenResponse>;
}

// ---------------------------------------------------------------------------
// CSRF state helpers
// ---------------------------------------------------------------------------

/** Generates a cryptographically random hex string for use as the OAuth state param. */
export function generateState(): string {
  // Works in both Node.js and Edge Runtime
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
