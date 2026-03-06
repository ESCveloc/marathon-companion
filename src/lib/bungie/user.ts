// ---------------------------------------------------------------------------
// Bungie User endpoints
// These work for any Bungie account, including Marathon players, today.
// Docs: https://bungie-net.github.io/#User
// ---------------------------------------------------------------------------

import { bungieGet, bungiePost } from './client';
import { BungieNetUser, UserMembership, UserMembershipData } from './types';

/**
 * GET /User/GetBungieNetUserById/{id}/
 * Returns public Bungie.net profile info for any user by their membership ID.
 * No auth required.
 */
export function getBungieNetUserById(membershipId: string): Promise<BungieNetUser> {
  return bungieGet(`/User/GetBungieNetUserById/${membershipId}/`);
}

/**
 * GET /User/GetMembershipsById/{membershipId}/{membershipType}/
 * Returns all platform memberships for a Bungie.net account.
 * No auth required.
 *
 * @param membershipType  Use -1 (All) to get every platform.
 */
export function getMembershipsById(
  membershipId: string,
  membershipType: number = -1,
): Promise<UserMembershipData> {
  return bungieGet(`/User/GetMembershipsById/${membershipId}/${membershipType}/`);
}

/**
 * GET /User/GetMembershipsForCurrentUser/
 * Returns the Bungie.net memberships for the currently authenticated user.
 * Requires a valid access token.
 */
export function getMembershipsForCurrentUser(
  accessToken: string,
): Promise<UserMembershipData> {
  return bungieGet('/User/GetMembershipsForCurrentUser/', { accessToken });
}

/**
 * POST /User/Search/GlobalName/{page}/
 * Searches for users by their Bungie global display name (e.g. "Guardian#1234").
 * No auth required.
 */
export function searchByGlobalName(
  displayName: string,
  page = 0,
): Promise<{ searchResults: UserMembership[]; page: number; hasMore: boolean }> {
  return bungiePost(`/User/Search/GlobalName/${page}/`, {
    displayNamePrefix: displayName,
  });
}
