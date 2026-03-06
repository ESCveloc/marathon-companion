import type { Rarity, ShellRole, WeaponType, ModSlot, ImplantSlot } from './constants';

// ---------------------------------------------------------------------------
// App-level types — mirrors the Prisma schema for use in components/API layer
// ---------------------------------------------------------------------------

export interface RunnerShell {
  id: string;
  name: string;
  description: string;
  role: ShellRole;
  primeAbilityName: string;
  primeAbilityDescription: string;
  primeAbilityCooldown: number;
  tacticalAbilityName: string;
  tacticalAbilityDescription: string;
  tacticalAbilityCooldown: number;
  baseStats: Record<string, number>;
  iconUrl: string | null;
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
  iconUrl: string | null;
}

export interface WeaponMod {
  id: string;
  name: string;
  slot: ModSlot;
  statModifiers: Record<string, number>;
  description: string;
  rarity: Rarity;
}

export interface Core {
  id: string;
  name: string;
  shellId: string;
  abilityModification: string;
  statModifiers: Record<string, number>;
  rarity: Rarity;
}

export interface Implant {
  id: string;
  name: string;
  slot: ImplantSlot;
  statBonuses: Record<string, number>;
  rarity: Rarity;
  description: string;
}

export interface Build {
  id: string;
  name: string;
  shellId: string;
  coreId: string | null;
  implantIds: string[];
  weaponIds: string[];
  weaponModIds: string[];
  totalStats: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}
