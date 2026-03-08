// ---------------------------------------------------------------------------
// Server-side session helpers — reads Bungie auth cookies
// Only call these from Server Components or Route Handlers (uses next/headers).
// ---------------------------------------------------------------------------

import { cookies } from 'next/headers';

export interface BungieSession {
  accessToken: string;
  membershipId: string;
  refreshToken?: string;
}

/**
 * Returns the current Bungie session from cookies, or null if not logged in.
 */
export async function getBungieSession(): Promise<BungieSession | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('bungie_access_token')?.value;
  const membershipId = cookieStore.get('bungie_membership_id')?.value;

  if (!accessToken || !membershipId) return null;

  return {
    accessToken,
    membershipId,
    refreshToken: cookieStore.get('bungie_refresh_token')?.value,
  };
}

/** True if the user has a valid Bungie session cookie. */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getBungieSession();
  return session !== null;
}
