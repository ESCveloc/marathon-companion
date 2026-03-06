// ---------------------------------------------------------------------------
// Marathon API stubs
//
// As of March 2026, Bungie has not published Marathon-specific API endpoints.
// This file defines the expected endpoint shapes based on the Destiny 2
// pattern, so we can plug in real implementations when Bungie ships them.
//
// Monitor for updates:
//   • https://github.com/Bungie-net/api (openapi.json version bump)
//   • https://bungie-net.github.io (interactive docs)
//   • Discord: discord.gg/E5uB4BW
// ---------------------------------------------------------------------------

import { MembershipType, MarathonProfile, MarathonCharacter } from './types';

// Placeholder — the actual namespace path Bungie will use is unknown.
// Based on Destiny 2 it will likely be /Marathon/
const MARATHON_NS = '/Marathon';

/**
 * STUB — GET /Platform/Marathon/{membershipType}/Profile/{membershipId}/
 *
 * Expected to return a player's Marathon profile once Bungie releases the API.
 */
export async function getMarathonProfile(
  _membershipType: MembershipType,
  _membershipId: string,
  _accessToken?: string,
): Promise<MarathonProfile> {
  throw new MarathonApiNotAvailableError(
    `${MARATHON_NS}/{membershipType}/Profile/{membershipId}/`,
  );
}

/**
 * STUB — GET /Platform/Marathon/{membershipType}/Account/{membershipId}/Character/{characterId}/Stats/
 */
export async function getMarathonCharacterStats(
  _membershipType: MembershipType,
  _membershipId: string,
  _characterId: string,
  _accessToken?: string,
): Promise<MarathonCharacter> {
  throw new MarathonApiNotAvailableError(
    `${MARATHON_NS}/{membershipType}/Account/{membershipId}/Character/{characterId}/Stats/`,
  );
}

/**
 * STUB — GET /Platform/Marathon/Stats/PostGameCarnageReport/{activityId}/
 */
export async function getPostGameCarnageReport(
  _activityId: string,
): Promise<unknown> {
  throw new MarathonApiNotAvailableError(
    `${MARATHON_NS}/Stats/PostGameCarnageReport/{activityId}/`,
  );
}

/**
 * STUB — GET /Platform/Marathon/Manifest/
 *
 * When available, this will return download URLs for the Marathon game content
 * database (all item definitions, ability descriptions, etc.) — same pattern
 * as the Destiny 2 manifest.
 */
export async function getMarathonManifest(): Promise<unknown> {
  throw new MarathonApiNotAvailableError(`${MARATHON_NS}/Manifest/`);
}

export class MarathonApiNotAvailableError extends Error {
  constructor(endpoint: string) {
    super(
      `Marathon API endpoint not yet available: ${endpoint}. ` +
        `Monitor https://github.com/Bungie-net/api for updates.`,
    );
    this.name = 'MarathonApiNotAvailableError';
  }
}
