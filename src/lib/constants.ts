export const RARITY_COLORS: Record<string, string> = {
  STANDARD: "#9ca3af",
  ENHANCED: "#2ecc71",
  DELUXE: "#3b82f6",
  SUPERIOR: "#a855f7",
  PRESTIGE: "#f5a623",
};

export const RARITY_ORDER = ["STANDARD", "ENHANCED", "DELUXE", "SUPERIOR", "PRESTIGE"] as const;

export const ROLE_COLORS: Record<string, string> = {
  ASSAULT: "#e63946",
  STEALTH: "#6b21a8",
  INTEL: "#3b82f6",
  MOBILITY: "#e87d0d",
  SUPPORT: "#2ecc71",
  LOOT: "#eab308",
  SCAVENGER: "#78716c",
};

export const WEAPON_TYPE_LABELS: Record<string, string> = {
  ASSAULT_RIFLE: "Assault Rifle",
  SMG: "SMG",
  PRECISION_RIFLE: "Precision Rifle",
  SHOTGUN: "Shotgun",
  PISTOL: "Pistol",
  MACHINE_GUN: "Machine Gun",
  SNIPER_RIFLE: "Sniper Rifle",
  RAILGUN: "Railgun",
  MELEE: "Melee",
};

export const MOD_SLOT_LABELS: Record<string, string> = {
  OPTIC: "Optic",
  BARREL: "Barrel",
  MAGAZINE: "Magazine",
  GRIP: "Grip",
  CHIP: "Chip",
  SHIELD: "Shield",
};

export const IMPLANT_SLOT_LABELS: Record<string, string> = {
  HEAD: "Head",
  TORSO: "Torso",
  LEGS: "Legs",
  SHIELD: "Shield",
};

export const STAT_LABELS: Record<string, string> = {
  health: "Health",
  shield: "Shield",
  speed: "Speed",
  resilience: "Resilience",
  recovery: "Recovery",
  heatCapacity: "Heat Capacity",
  agility: "Agility",
  lootSpeed: "Loot Speed",
  meleeDamage: "Melee Damage",
  primeRecovery: "Prime Recovery",
  tacticalRecovery: "Tactical Recovery",
  selfRepairSpeed: "Self-Repair Speed",
  firewall: "Firewall",
  fallResistance: "Fall Resistance",
  pingDuration: "Ping Duration",
  finisherSiphon: "Finisher Siphon",
  reviveSpeed: "Revive Speed",
  hardware: "Hardware",
  firepower: "Firepower",
  accuracy: "Accuracy",
  range: "Range",
  magazine: "Magazine",
  reloadSpeed: "Reload Speed",
  rateOfFire: "Rate of Fire",
  recoil: "Recoil",
  precision: "Precision",
};

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/gear", label: "Gear Database" },
  { href: "/builds", label: "Build Planner" },
  { href: "/builds/compare", label: "Compare" },
] as const;
