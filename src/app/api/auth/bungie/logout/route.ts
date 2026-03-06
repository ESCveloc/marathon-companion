// ---------------------------------------------------------------------------
// POST /api/auth/bungie/logout
// Clears Bungie auth cookies.
// ---------------------------------------------------------------------------

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies();
  cookieStore.delete('bungie_access_token');
  cookieStore.delete('bungie_refresh_token');
  cookieStore.delete('bungie_membership_id');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return NextResponse.redirect(`${appUrl}/`);
}
