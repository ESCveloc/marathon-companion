export const RARITY_COLORS: Record<string, string> = {
  COMMON: "#9ca3af",
  UNCOMMON: "#2ecc71",
  RARE: "#3b82f6",
  LEGENDARY: "#a855f7",
  EXOTIC: "#f5a623",
};

export const RARITY_ORDER = ["COMMON", "UNCOMMON", "RARE", "LEGENDARY", "EXOTIC"] as const;

export const ROLE_COLORS: Record<string, string> = {
  TANK: "#e63946",
  DPS: "#e87d0d",
  SUPPORT: "#2ecc71",
  RECON: "#3b82f6",
  UTILITY: "#a855f7",
};

export const WEAPON_TYPE_LABELS: Record<string, string> = {
  ASSAULT_RIFLE: "Assault Rifle",
  SMG: "SMG",
  SNIPER: "Sniper Rifle",
  SHOTGUN: "Shotgun",
  SIDEARM: "Sidearm",
  LMG: "LMG",
  ROCKET_LAUNCHER: "Rocket Launcher",
  GRENADE_LAUNCHER: "Grenade Launcher",
  FUSION_RIFLE: "Fusion Rifle",
};

export const MOD_SLOT_LABELS: Record<string, string> = {
  BARREL: "Barrel",
  MAGAZINE: "Magazine",
  GRIP: "Grip",
  SCOPE: "Scope",
  STOCK: "Stock",
  MUZZLE: "Muzzle",
};

export const IMPLANT_SLOT_LABELS: Record<string, string> = {
  HEAD: "Head",
  CHEST: "Chest",
  ARMS: "Arms",
  LEGS: "Legs",
  CLASS_ITEM: "Class Item",
};

export const STAT_LABELS: Record<string, string> = {
  health: "Health",
  shield: "Shield",
  speed: "Speed",
  resilience: "Resilience",
  recovery: "Recovery",
  heatCapacity: "Heat Capacity",
  lootSpeed: "Loot Speed",
  range: "Range",
  stability: "Stability",
  handling: "Handling",
  reloadSpeed: "Reload Speed",
  damage: "Damage",
  fireRate: "Fire Rate",
};

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/gear", label: "Gear Database" },
  { href: "/builds", label: "Build Planner" },
  { href: "/builds/compare", label: "Compare" },
] as const;
