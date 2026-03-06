export const BUNGIE_ROOT = 'https://www.bungie.net/Platform';

export const RARITY_ORDER = ['common', 'uncommon', 'rare', 'legendary', 'exotic'] as const;
export type Rarity = (typeof RARITY_ORDER)[number];

export const RARITY_COLOR: Record<Rarity, string> = {
  common: '#c2c2c2',
  uncommon: '#4ade80',   // green
  rare: '#60a5fa',       // blue
  legendary: '#a855f7',  // purple
  exotic: '#f59e0b',     // amber/gold
};

export const SHELL_ROLES = ['Tank', 'DPS', 'Support', 'Recon', 'Utility'] as const;
export type ShellRole = (typeof SHELL_ROLES)[number];

export const WEAPON_TYPES = [
  'Assault Rifle',
  'SMG',
  'Sniper Rifle',
  'Shotgun',
  'Sidearm',
  'LMG',
  'Marksman Rifle',
  'Rocket Launcher',
] as const;
export type WeaponType = (typeof WEAPON_TYPES)[number];

export const MOD_SLOTS = ['Barrel', 'Magazine', 'Grip', 'Scope', 'Trait'] as const;
export type ModSlot = (typeof MOD_SLOTS)[number];

export const IMPLANT_SLOTS = ['Head', 'Chest', 'Arms', 'Legs', 'Class'] as const;
export type ImplantSlot = (typeof IMPLANT_SLOTS)[number];
