import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

interface ShellData {
  name: string;
  description: string;
  role: string;
  primeAbilityName: string;
  primeAbilityDesc: string;
  primeCooldown: number;
  tactAbilityName: string;
  tactAbilityDesc: string;
  tactCooldown: number;
  baseStats: Record<string, number>;
  iconUrl: string;
}

interface WeaponData {
  name: string;
  type: string;
  rarity: string;
  baseDamage: number;
  fireRate: number;
  range: number;
  stability: number;
  handling: number;
  reloadSpeed: number;
  description: string;
  iconUrl: string;
}

interface WeaponModData {
  name: string;
  slot: string;
  statModifiers: Record<string, number>;
  description: string;
  rarity: string;
}

interface CoreData {
  name: string;
  shellId: string; // Shell name string in the JSON
  abilityModification: string;
  statModifiers: Record<string, number>;
  rarity: string;
}

interface ImplantData {
  name: string;
  slot: string;
  statBonuses: Record<string, number>;
  rarity: string;
  description: string;
}

interface GearData {
  shells: ShellData[];
  weapons: WeaponData[];
  weaponMods: WeaponModData[];
  cores: CoreData[];
  implants: ImplantData[];
}

async function main() {
  console.log("Loading gear data from seed/gear-data.json...");

  const filePath = path.join(process.cwd(), "seed", "gear-data.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data: GearData = JSON.parse(raw);

  // Delete all existing records in order to handle foreign key constraints
  console.log("Clearing existing data...");
  await prisma.build.deleteMany();
  await prisma.core.deleteMany();
  await prisma.weaponMod.deleteMany();
  await prisma.weapon.deleteMany();
  await prisma.implant.deleteMany();
  await prisma.shell.deleteMany();

  // Create Shells and build a name -> id map
  console.log(`Seeding ${data.shells.length} shells...`);
  const shellNameToId: Record<string, string> = {};

  for (const shell of data.shells) {
    const created = await prisma.shell.create({
      data: {
        name: shell.name,
        description: shell.description,
        role: shell.role as "TANK" | "DPS" | "SUPPORT" | "RECON" | "UTILITY",
        primeAbilityName: shell.primeAbilityName,
        primeAbilityDesc: shell.primeAbilityDesc,
        primeCooldown: shell.primeCooldown,
        tactAbilityName: shell.tactAbilityName,
        tactAbilityDesc: shell.tactAbilityDesc,
        tactCooldown: shell.tactCooldown,
        baseStats: shell.baseStats,
        iconUrl: shell.iconUrl || "",
      },
    });
    shellNameToId[created.name] = created.id;
  }
  console.log(`  Created ${Object.keys(shellNameToId).length} shells.`);

  // Create Weapons
  console.log(`Seeding ${data.weapons.length} weapons...`);
  let weaponCount = 0;

  for (const weapon of data.weapons) {
    await prisma.weapon.create({
      data: {
        name: weapon.name,
        type: weapon.type as "ASSAULT_RIFLE" | "SMG" | "SNIPER" | "SHOTGUN" | "SIDEARM" | "LMG" | "ROCKET_LAUNCHER" | "GRENADE_LAUNCHER" | "FUSION_RIFLE",
        rarity: weapon.rarity as "COMMON" | "UNCOMMON" | "RARE" | "LEGENDARY" | "EXOTIC",
        baseDamage: weapon.baseDamage,
        fireRate: weapon.fireRate,
        range: weapon.range,
        stability: weapon.stability,
        handling: weapon.handling,
        reloadSpeed: weapon.reloadSpeed,
        description: weapon.description,
        iconUrl: weapon.iconUrl || "",
      },
    });
    weaponCount++;
  }
  console.log(`  Created ${weaponCount} weapons.`);

  // Create WeaponMods
  console.log(`Seeding ${data.weaponMods.length} weapon mods...`);
  let modCount = 0;

  for (const mod of data.weaponMods) {
    await prisma.weaponMod.create({
      data: {
        name: mod.name,
        slot: mod.slot as "BARREL" | "MAGAZINE" | "GRIP" | "SCOPE" | "STOCK" | "MUZZLE",
        statModifiers: mod.statModifiers,
        description: mod.description,
        rarity: mod.rarity as "COMMON" | "UNCOMMON" | "RARE" | "LEGENDARY" | "EXOTIC",
      },
    });
    modCount++;
  }
  console.log(`  Created ${modCount} weapon mods.`);

  // Create Cores — map shellId (name string) to actual shell.id
  console.log(`Seeding ${data.cores.length} cores...`);
  let coreCount = 0;

  for (const core of data.cores) {
    const shellId = shellNameToId[core.shellId];
    if (!shellId) {
      console.warn(`  Warning: Shell "${core.shellId}" not found for core "${core.name}", skipping.`);
      continue;
    }

    await prisma.core.create({
      data: {
        name: core.name,
        shellId,
        abilityModification: core.abilityModification,
        statModifiers: core.statModifiers,
        rarity: core.rarity as "COMMON" | "UNCOMMON" | "RARE" | "LEGENDARY" | "EXOTIC",
      },
    });
    coreCount++;
  }
  console.log(`  Created ${coreCount} cores.`);

  // Create Implants
  console.log(`Seeding ${data.implants.length} implants...`);
  let implantCount = 0;

  for (const implant of data.implants) {
    await prisma.implant.create({
      data: {
        name: implant.name,
        slot: implant.slot as "HEAD" | "CHEST" | "ARMS" | "LEGS" | "CLASS_ITEM",
        statBonuses: implant.statBonuses,
        rarity: implant.rarity as "COMMON" | "UNCOMMON" | "RARE" | "LEGENDARY" | "EXOTIC",
        description: implant.description,
      },
    });
    implantCount++;
  }
  console.log(`  Created ${implantCount} implants.`);

  console.log("\nSeed complete!");
  console.log(`  Shells:      ${Object.keys(shellNameToId).length}`);
  console.log(`  Weapons:     ${weaponCount}`);
  console.log(`  Weapon Mods: ${modCount}`);
  console.log(`  Cores:       ${coreCount}`);
  console.log(`  Implants:    ${implantCount}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
