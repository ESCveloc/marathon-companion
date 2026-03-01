import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import type {
  GearCategory,
  Rarity,
  WeaponType,
  ModSlot,
  ImplantSlot,
  Role,
  Shell,
  Weapon,
  WeaponMod,
  Core,
  Implant,
  PaginatedResponse,
} from "@/lib/types";

interface GearData {
  shells: Shell[];
  weapons: Weapon[];
  weaponMods: WeaponMod[];
  cores: Core[];
  implants: Implant[];
}

function loadGearData(): GearData {
  const filePath = path.join(process.cwd(), "seed", "gear-data.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as GearData;
}

function addIds(items: Record<string, unknown>[], prefix: string): Record<string, unknown>[] {
  return items.map((item, index) => ({
    ...item,
    id: `${prefix}-${index}`,
  }));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = (searchParams.get("category") || "shells") as GearCategory;
    const search = searchParams.get("search")?.toLowerCase() || "";
    const rarity = searchParams.get("rarity") || "";
    const weaponType = searchParams.get("weaponType") || "";
    const modSlot = searchParams.get("modSlot") || "";
    const implantSlot = searchParams.get("implantSlot") || "";
    const role = searchParams.get("role") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.max(1, Math.min(100, parseInt(searchParams.get("pageSize") || "24", 10)));

    const data = loadGearData();

    let items: Record<string, unknown>[];

    switch (category) {
      case "shells":
        items = addIds(data.shells as unknown as Record<string, unknown>[], "shell");
        break;
      case "weapons":
        items = addIds(data.weapons as unknown as Record<string, unknown>[], "weapon");
        break;
      case "mods":
        items = addIds(data.weaponMods as unknown as Record<string, unknown>[], "mod");
        break;
      case "cores":
        items = addIds(data.cores as unknown as Record<string, unknown>[], "core");
        break;
      case "implants":
        items = addIds(data.implants as unknown as Record<string, unknown>[], "implant");
        break;
      default:
        return NextResponse.json(
          { error: `Invalid category: ${category}` },
          { status: 400 }
        );
    }

    // Apply search filter
    if (search) {
      items = items.filter((item) => {
        const name = (item.name as string)?.toLowerCase() || "";
        const description = (item.description as string)?.toLowerCase() || "";
        return name.includes(search) || description.includes(search);
      });
    }

    // Apply rarity filter (weapons, mods, cores, implants)
    if (rarity && category !== "shells") {
      items = items.filter(
        (item) => (item.rarity as string) === (rarity as Rarity)
      );
    }

    // Apply role filter (shells only)
    if (role && category === "shells") {
      items = items.filter((item) => (item.role as string) === (role as Role));
    }

    // Apply weaponType filter (weapons only)
    if (weaponType && category === "weapons") {
      items = items.filter(
        (item) => (item.type as string) === (weaponType as WeaponType)
      );
    }

    // Apply modSlot filter (mods only)
    if (modSlot && category === "mods") {
      items = items.filter(
        (item) => (item.slot as string) === (modSlot as ModSlot)
      );
    }

    // Apply implantSlot filter (implants only)
    if (implantSlot && category === "implants") {
      items = items.filter(
        (item) => (item.slot as string) === (implantSlot as ImplantSlot)
      );
    }

    const total = items.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const paginatedItems = items.slice(start, start + pageSize);

    const response: PaginatedResponse<unknown> = {
      items: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in /api/gear:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
