// ---------------------------------------------------------------------------
// Seed script — pnpm db:seed
// Populates the database with placeholder Marathon gear data.
// Safe to rerun (upserts, not inserts).
// ---------------------------------------------------------------------------

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('Seeding Marathon Companion database...');

  // -------------------------------------------------------------------------
  // Runner Shells
  // -------------------------------------------------------------------------
  const shells = [
    {
      name: 'Void',
      description: 'An aggressive close-range shell built for sustained pressure.',
      role: 'DPS',
      primeAbilityName: 'Phase Dash',
      primeAbilityDescription: 'Dash forward through obstacles, dealing damage on exit.',
      primeAbilityCooldown: 12,
      tacticalAbilityName: 'Overdrive',
      tacticalAbilityDescription: 'Briefly boost movement speed and reload rate.',
      tacticalAbilityCooldown: 20,
      baseStats: { health: 200, shield: 50, speed: 120, heatCapacity: 80 },
      iconUrl: null,
    },
    {
      name: 'Aero',
      description: 'A nimble recon shell specializing in flanking and intel.',
      role: 'Recon',
      primeAbilityName: 'Glide',
      primeAbilityDescription: 'Leap and glide over terrain, evading enemy fire.',
      primeAbilityCooldown: 15,
      tacticalAbilityName: 'Pulse Scan',
      tacticalAbilityDescription: 'Send out a pulse that marks enemies through walls briefly.',
      tacticalAbilityCooldown: 25,
      baseStats: { health: 150, shield: 40, speed: 140, heatCapacity: 60 },
      iconUrl: null,
    },
    {
      name: 'Bastion',
      description: 'A heavily armored tank shell built to absorb punishment.',
      role: 'Tank',
      primeAbilityName: 'Iron Wall',
      primeAbilityDescription: 'Deploy a temporary barrier that blocks incoming projectiles.',
      primeAbilityCooldown: 18,
      tacticalAbilityName: 'Fortify',
      tacticalAbilityDescription: 'Temporarily increase shield regeneration rate.',
      tacticalAbilityCooldown: 30,
      baseStats: { health: 350, shield: 150, speed: 85, heatCapacity: 120 },
      iconUrl: null,
    },
    {
      name: 'Wraith',
      description: 'A stealth support shell that can cloak and revive allies.',
      role: 'Support',
      primeAbilityName: 'Phantom Cloak',
      primeAbilityDescription: 'Turn invisible for a short duration. Breaking cloak deals bonus damage.',
      primeAbilityCooldown: 22,
      tacticalAbilityName: 'Ghost Signal',
      tacticalAbilityDescription: 'Send a revive beacon to a downed teammate.',
      tacticalAbilityCooldown: 40,
      baseStats: { health: 175, shield: 75, speed: 115, heatCapacity: 70 },
      iconUrl: null,
    },
    {
      name: 'Surge',
      description: 'A utility shell focused on crowd control and area denial.',
      role: 'Utility',
      primeAbilityName: 'Arc Burst',
      primeAbilityDescription: 'Unleash an electric pulse that slows nearby enemies.',
      primeAbilityCooldown: 16,
      tacticalAbilityName: 'Shock Grid',
      tacticalAbilityDescription: 'Place an electric trap that stuns the first enemy to cross it.',
      tacticalAbilityCooldown: 28,
      baseStats: { health: 190, shield: 90, speed: 100, heatCapacity: 90 },
      iconUrl: null,
    },
    {
      name: 'Prism',
      description: 'A support shell that augments team damage output.',
      role: 'Support',
      primeAbilityName: 'Lensflare',
      primeAbilityDescription: 'Blind nearby enemies temporarily, interrupting their aim.',
      primeAbilityCooldown: 14,
      tacticalAbilityName: 'Amp Field',
      tacticalAbilityDescription: 'Drop a field that boosts ally damage by 15% while inside it.',
      tacticalAbilityCooldown: 35,
      baseStats: { health: 160, shield: 60, speed: 110, heatCapacity: 75 },
      iconUrl: null,
    },
    {
      name: 'Titan',
      description: 'A balanced shell with strong offensive and defensive capabilities.',
      role: 'Tank',
      primeAbilityName: 'Ground Slam',
      primeAbilityDescription: 'Slam the ground, knocking back and damaging nearby enemies.',
      primeAbilityCooldown: 20,
      tacticalAbilityName: 'Aegis',
      tacticalAbilityDescription: 'Activate a temporary damage-resistant stance.',
      tacticalAbilityCooldown: 24,
      baseStats: { health: 280, shield: 100, speed: 95, heatCapacity: 100 },
      iconUrl: null,
    },
  ];

  for (const shell of shells) {
    await db.runnerShell.upsert({
      where: { name: shell.name },
      update: shell,
      create: shell,
    });
  }
  console.log(`  ✓ ${shells.length} Runner Shells`);

  // -------------------------------------------------------------------------
  // Weapons (sample set across types)
  // -------------------------------------------------------------------------
  const weapons = [
    { name: 'Helix AR-7', type: 'Assault Rifle', rarity: 'rare', baseDamage: 32, fireRate: 720, range: 65, stability: 55, handling: 60, reloadSpeed: 2.4, description: 'Full-auto assault rifle with moderate recoil.' },
    { name: 'Apex Auto', type: 'Assault Rifle', rarity: 'legendary', baseDamage: 35, fireRate: 680, range: 70, stability: 62, handling: 58, reloadSpeed: 2.2, description: 'High-damage auto rifle with enhanced range.' },
    { name: 'Vex SMG-4', type: 'SMG', rarity: 'uncommon', baseDamage: 22, fireRate: 900, range: 35, stability: 48, handling: 75, reloadSpeed: 1.9, description: 'Rapid-fire SMG optimized for close quarters.' },
    { name: 'Riot Pulse', type: 'SMG', rarity: 'rare', baseDamage: 25, fireRate: 840, range: 40, stability: 52, handling: 72, reloadSpeed: 2.0, description: 'Burst-fire SMG with high lethality at point blank.' },
    { name: 'Long Reach', type: 'Sniper Rifle', rarity: 'legendary', baseDamage: 95, fireRate: 60, range: 100, stability: 40, handling: 35, reloadSpeed: 3.8, description: 'Precision sniper with one-hit headshot potential.' },
    { name: 'Scout Line', type: 'Sniper Rifle', rarity: 'rare', baseDamage: 80, fireRate: 75, range: 95, stability: 45, handling: 40, reloadSpeed: 3.2, description: 'Semi-auto sniper with faster follow-up shots.' },
    { name: 'Breach Mk2', type: 'Shotgun', rarity: 'rare', baseDamage: 70, fireRate: 140, range: 20, stability: 38, handling: 50, reloadSpeed: 2.8, description: 'Pump-action shotgun with devastating close range damage.' },
    { name: 'Shard Cannon', type: 'Shotgun', rarity: 'legendary', baseDamage: 85, fireRate: 120, range: 18, stability: 30, handling: 45, reloadSpeed: 3.0, description: 'Exotic flechette shotgun. Pellets pierce light cover.' },
    { name: 'Flick', type: 'Sidearm', rarity: 'common', baseDamage: 28, fireRate: 300, range: 30, stability: 70, handling: 90, reloadSpeed: 1.5, description: 'Reliable semi-auto sidearm as a backup option.' },
    { name: 'Phantom Burst', type: 'Sidearm', rarity: 'uncommon', baseDamage: 32, fireRate: 280, range: 35, stability: 65, handling: 85, reloadSpeed: 1.6, description: '3-round burst sidearm for precision follow-ups.' },
  ];

  for (const w of weapons) {
    await db.weapon.upsert({
      where: { name: w.name },
      update: { ...w, iconUrl: null },
      create: { ...w, iconUrl: null },
    });
  }
  console.log(`  ✓ ${weapons.length} Weapons`);

  // -------------------------------------------------------------------------
  // Weapon Mods (sample set)
  // -------------------------------------------------------------------------
  const mods = [
    { name: 'Extended Barrel', slot: 'Barrel', rarity: 'common', statModifiers: { range: 8, stability: -4 }, description: 'Lengthened barrel increases projectile velocity.' },
    { name: 'Fluted Barrel', slot: 'Barrel', rarity: 'uncommon', statModifiers: { handling: 10, stability: 5 }, description: 'Lightweight fluting improves weapon feel.' },
    { name: 'Hammer-Forged Rifling', slot: 'Barrel', rarity: 'rare', statModifiers: { range: 15, handling: -5 }, description: 'Hammered rifling provides exceptional range.' },
    { name: 'Appended Mag', slot: 'Magazine', rarity: 'common', statModifiers: { magazineSize: 10, reloadSpeed: -5 }, description: 'Larger magazine at the cost of reload speed.' },
    { name: 'Alloy Magazine', slot: 'Magazine', rarity: 'uncommon', statModifiers: { reloadSpeed: 10, magazineSize: -5 }, description: 'Lightweight magazine speeds up reloads.' },
    { name: 'Tactical Mag', slot: 'Magazine', rarity: 'rare', statModifiers: { stability: 5, reloadSpeed: 5, magazineSize: 5 }, description: 'Balanced tactical magazine with minor boosts to all stats.' },
    { name: 'Smooth Grip', slot: 'Grip', rarity: 'common', statModifiers: { handling: 8 }, description: 'Improves weapon handling speed.' },
    { name: 'Polymer Grip', slot: 'Grip', rarity: 'uncommon', statModifiers: { handling: 10, stability: 5 }, description: 'Textured polymer grip for better control.' },
    { name: 'Accurized Scope', slot: 'Scope', rarity: 'rare', statModifiers: { range: 12, handling: -8 }, description: 'High-magnification scope for ranged engagements.' },
    { name: 'Red Dot Sight', slot: 'Scope', rarity: 'common', statModifiers: { handling: 5, range: 3 }, description: 'Quick-acquisition red dot for mid-range targets.' },
    { name: 'Outlaw', slot: 'Trait', rarity: 'rare', statModifiers: { reloadSpeed: 20 }, description: 'Precision kills dramatically increase reload speed.' },
    { name: 'Kill Clip', slot: 'Trait', rarity: 'legendary', statModifiers: { baseDamage: 15 }, description: 'Reloading after a kill grants a damage bonus.' },
  ];

  for (const m of mods) {
    await db.weaponMod.upsert({
      where: { name: m.name },
      update: m,
      create: m,
    });
  }
  console.log(`  ✓ ${mods.length} Weapon Mods`);

  // -------------------------------------------------------------------------
  // Implants
  // -------------------------------------------------------------------------
  const implants = [
    { name: 'Neural Boost', slot: 'Head', rarity: 'uncommon', statBonuses: { heatCapacity: 10, abilityRecharge: 5 }, description: 'Enhances neural processing for faster ability cooldowns.' },
    { name: 'Targeting Matrix', slot: 'Head', rarity: 'rare', statBonuses: { range: 8, stability: 5 }, description: 'Improves weapon targeting parameters.' },
    { name: 'Reactive Plating', slot: 'Chest', rarity: 'rare', statBonuses: { shield: 25, health: 10 }, description: 'Reactive nano-plating absorbs incoming damage.' },
    { name: 'Sprint Core', slot: 'Chest', rarity: 'uncommon', statBonuses: { speed: 12, handling: 6 }, description: 'Optimizes power distribution for faster movement.' },
    { name: 'Grip Servos', slot: 'Arms', rarity: 'uncommon', statBonuses: { handling: 15, reloadSpeed: 8 }, description: 'Servo-assisted arms improve weapon handling.' },
    { name: 'Reloader Coils', slot: 'Arms', rarity: 'rare', statBonuses: { reloadSpeed: 20 }, description: 'Electromagnetic coils accelerate magazine seating.' },
    { name: 'Impact Cushions', slot: 'Legs', rarity: 'common', statBonuses: { speed: 8, stability: 5 }, description: 'Shock-absorbing leg implants reduce movement penalty.' },
    { name: 'Sprint Jets', slot: 'Legs', rarity: 'rare', statBonuses: { speed: 20, lootSpeed: 5 }, description: 'Micro-jets in the legs boost sprint speed.' },
    { name: 'Extractor Module', slot: 'Class', rarity: 'rare', statBonuses: { lootSpeed: 20, heatCapacity: 5 }, description: 'Speeds up item extraction from containers.' },
    { name: 'Guardian Protocol', slot: 'Class', rarity: 'legendary', statBonuses: { health: 30, shield: 20, abilityRecharge: 10 }, description: 'Full-body guardian protocol for elite operatives.' },
  ];

  for (const imp of implants) {
    await db.implant.upsert({
      where: { name: imp.name },
      update: imp,
      create: imp,
    });
  }
  console.log(`  ✓ ${implants.length} Implants`);

  console.log('\nDone! Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
