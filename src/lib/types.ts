export type Role = "TANK" | "DPS" | "SUPPORT" | "RECON" | "UTILITY";
export type Rarity = "COMMON" | "UNCOMMON" | "RARE" | "LEGENDARY" | "EXOTIC";
export type WeaponType = "ASSAULT_RIFLE" | "SMG" | "SNIPER" | "SHOTGUN" | "SIDEARM" | "LMG" | "ROCKET_LAUNCHER" | "GRENADE_LAUNCHER" | "FUSION_RIFLE";
export type ModSlot = "BARREL" | "MAGAZINE" | "GRIP" | "SCOPE" | "STOCK" | "MUZZLE";
export type ImplantSlot = "HEAD" | "CHEST" | "ARMS" | "LEGS" | "CLASS_ITEM";

export interface BaseStats {
  [key: string]: number;
  health: number;
  shield: number;
  speed: number;
  resilience: number;
  recovery: number;
}

export interface StatModifiers {
  [key: string]: number;
}

export interface Shell {
  id: string;
  name: string;
  description: string;
  role: Role;
  primeAbilityName: string;
  primeAbilityDesc: string;
  primeCooldown: number;
  tactAbilityName: string;
  tactAbilityDesc: string;
  tactCooldown: number;
  baseStats: BaseStats;
  iconUrl: string;
}

export interface Weapon {
  id: string;
  name: string;
  type: WeaponType;
  rarity: Rarity;
  baseDamage: number;
  fireRate: number;
  range: number;
  stability: number;
  handling: number;
  reloadSpeed: number;
  description: string;
  iconUrl: string;
}

export interface WeaponMod {
  id: string;
  name: string;
  slot: ModSlot;
  statModifiers: StatModifiers;
  description: string;
  rarity: Rarity;
}

export interface Core {
  id: string;
  name: string;
  shellId: string;
  abilityModification: string;
  statModifiers: StatModifiers;
  rarity: Rarity;
}

export interface Implant {
  id: string;
  name: string;
  slot: ImplantSlot;
  statBonuses: StatModifiers;
  rarity: Rarity;
  description: string;
}

export interface BuildData {
  id: string;
  name: string;
  shellId: string;
  coreId: string | null;
  implantIds: string[];
  weaponIds: string[];
  weaponModIds: string[];
  totalStats: StatModifiers;
  createdAt: string;
  updatedAt: string;
}

export type GearCategory = "shells" | "weapons" | "mods" | "cores" | "implants";

export interface FilterState {
  category: GearCategory;
  rarity: Rarity | "ALL";
  role: Role | "ALL";
  weaponType: WeaponType | "ALL";
  modSlot: ModSlot | "ALL";
  implantSlot: ImplantSlot | "ALL";
  search: string;
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type AnalyticsEvent =
  | { type: "search_performed"; query: string; filters: Partial<FilterState>; resultCount: number; latencyMs: number }
  | { type: "item_viewed"; itemType: GearCategory; itemId: string; source: "search" | "list" | "direct" }
  | { type: "build_created"; shellId: string; slotsFilledCount: number }
  | { type: "build_saved"; storage: "localStorage" | "db" }
  | { type: "comparison_viewed"; entityType: GearCategory | "build"; leftId: string; rightId: string };
