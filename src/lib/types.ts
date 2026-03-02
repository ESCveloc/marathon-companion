export type Role = "ASSAULT" | "STEALTH" | "INTEL" | "MOBILITY" | "SUPPORT" | "LOOT" | "SCAVENGER";
export type Rarity = "STANDARD" | "ENHANCED" | "DELUXE" | "SUPERIOR" | "PRESTIGE";
export type WeaponType = "ASSAULT_RIFLE" | "SMG" | "PRECISION_RIFLE" | "SHOTGUN" | "PISTOL" | "MACHINE_GUN" | "SNIPER_RIFLE" | "RAILGUN" | "MELEE";
export type ModSlot = "OPTIC" | "BARREL" | "MAGAZINE" | "GRIP" | "CHIP" | "SHIELD";
export type ImplantSlot = "HEAD" | "TORSO" | "LEGS" | "SHIELD";

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
  trait1Name: string;
  trait1Desc: string;
  trait2Name: string;
  trait2Desc: string;
  baseStats: BaseStats;
  iconUrl: string;
}

export interface Weapon {
  id: string;
  name: string;
  type: WeaponType;
  rarity: Rarity;
  firepower: number;
  rateOfFire: number;
  range: number;
  accuracy: number;
  magazine: number;
  reloadSpeed: number;
  recoil: number;
  precision: number;
  fireMode: string;
  ammoType: string;
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
  perk: string;
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
