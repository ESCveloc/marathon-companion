// ---------------------------------------------------------------------------
// Bungie API — shared response envelope and common types
// All Bungie API responses are wrapped in this envelope.
// ErrorCode 1 = Success. Anything else is an error.
// ---------------------------------------------------------------------------

export interface BungieResponse<T> {
  Response: T;
  ErrorCode: number;
  ThrottleSeconds: number;
  ErrorStatus: string;
  Message: string;
  MessageData: Record<string, string>;
}

// ---------------------------------------------------------------------------
// OAuth token response
// Public clients do NOT receive refresh_token or refresh_expires_in.
// ---------------------------------------------------------------------------
export interface TokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  /** Seconds until the refresh token expires (~90 days). Confidential clients only. */
  refresh_expires_in?: number;
  /** Confidential clients only. */
  refresh_token?: string;
  /** The authenticated user's Bungie.net membership ID. */
  membership_id: string;
}

// ---------------------------------------------------------------------------
// User / membership types
// ---------------------------------------------------------------------------

export interface BungieNetUser {
  membershipId: string;
  uniqueName: string;
  displayName: string;
  profilePicturePath: string;
  profileThemeName: string;
  userTitle: number;
  successMessageFlags: string;
  isDeleted: boolean;
  about: string;
  firstAccess?: string;
  lastUpdate?: string;
  psnDisplayName?: string;
  xboxDisplayName?: string;
  fbDisplayName?: string;
  steamDisplayName?: string;
  stadiaDisplayName?: string;
  egsDisplayName?: string;
  twitchDisplayName?: string;
  locale: string;
  localeInheritDefault: boolean;
  showActivity: boolean;
  showGroupMessaging: boolean;
  profilePicture: number;
  profileTheme: number;
  userTitleDisplay: string;
  statusText: string;
  statusDate: string;
}

export interface UserMembership {
  membershipType: MembershipType;
  membershipId: string;
  bungieGlobalDisplayName: string;
  bungieGlobalDisplayNameCode: number;
  displayName: string;
  iconPath: string;
  crossSaveOverride: MembershipType;
  applicableMembershipTypes: MembershipType[];
  isPublic: boolean;
}

export interface UserMembershipData {
  destinyMemberships: UserMembership[];
  primaryMembershipId?: string;
  bungieNetUser: BungieNetUser;
}

// ---------------------------------------------------------------------------
// Platform membership types
// ---------------------------------------------------------------------------
export enum MembershipType {
  None = 0,
  TigerXbox = 1,
  TigerPsn = 2,
  TigerSteam = 3,
  TigerBlizzard = 4,
  TigerStadia = 5,
  TigerEgs = 6,
  TigerDemon = 10,
  BungieNext = 254,
  All = -1,
}

// ---------------------------------------------------------------------------
// Destiny 2 / expected Marathon profile component types
// ---------------------------------------------------------------------------

/** Component codes for ?components= query param */
export enum DestinyComponentType {
  Profiles = 100,
  VendorReceipts = 101,
  ProfileInventories = 102,
  ProfileCurrencies = 103,
  ProfileProgression = 104,
  Characters = 200,
  CharacterInventories = 201,
  CharacterProgressions = 202,
  CharacterRenderData = 203,
  CharacterActivities = 204,
  CharacterEquipment = 205,
  ItemInstances = 300,
  ItemObjectives = 301,
  ItemPerks = 302,
  ItemRenderData = 303,
  ItemStats = 304,
  ItemSockets = 305,
  ItemTalentGrids = 306,
  ItemCommonData = 307,
  ItemPlugStates = 308,
  Records = 900,
  Collectibles = 800,
}

// ---------------------------------------------------------------------------
// Marathon API stubs
// These will be filled in once Bungie publishes Marathon-specific endpoints.
// Based on the Destiny pattern, expect:
//   GET /Platform/Marathon/{membershipType}/Profile/{membershipId}/
//   GET /Platform/Marathon/Stats/PostGameCarnageReport/{activityId}/
//   GET /Platform/Marathon/Manifest/
// ---------------------------------------------------------------------------

/** Placeholder — replace with real schema when Bungie releases Marathon endpoints. */
export interface MarathonProfile {
  membershipId: string;
  membershipType: MembershipType;
  // TODO: expand when Marathon API is published
}

export interface MarathonCharacter {
  characterId: string;
  // TODO: expand when Marathon API is published
}
