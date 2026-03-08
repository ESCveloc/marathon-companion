// ---------------------------------------------------------------------------
// GET /api/auth/bungie/me
// Returns the current user's Bungie.net profile and platform memberships.
// Requires a valid bungie_access_token cookie.
// ---------------------------------------------------------------------------

import { NextResponse } from 'next/server';
import { getBungieSession } from '@/lib/bungie/session';
import { getMembershipsForCurrentUser } from '@/lib/bungie/user';

export async function GET(): Promise<NextResponse> {
  const session = await getBungieSession();

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const data = await getMembershipsForCurrentUser(session.accessToken);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[/api/auth/bungie/me]', err);
    return NextResponse.json({ error: 'Failed to fetch Bungie profile' }, { status: 502 });
  }
}
