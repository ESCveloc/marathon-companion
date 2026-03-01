import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import type { GearCategory } from "@/lib/types";

interface GearItem {
  name: string;
  rarity?: string;
  [key: string]: unknown;
}

interface GearData {
  shells: GearItem[];
  weapons: GearItem[];
  weaponMods: GearItem[];
  cores: GearItem[];
  implants: GearItem[];
}

interface SearchResult {
  id: string;
  name: string;
  category: GearCategory;
  rarity?: string;
}

function loadGearData(): GearData {
  const filePath = path.join(process.cwd(), "seed", "gear-data.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as GearData;
}

const MAX_RESULTS = 20;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase().trim() || "";

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const data = loadGearData();
    const results: SearchResult[] = [];

    const categoryMap: { key: keyof GearData; category: GearCategory; prefix: string }[] = [
      { key: "shells", category: "shells", prefix: "shell" },
      { key: "weapons", category: "weapons", prefix: "weapon" },
      { key: "weaponMods", category: "mods", prefix: "mod" },
      { key: "cores", category: "cores", prefix: "core" },
      { key: "implants", category: "implants", prefix: "implant" },
    ];

    for (const { key, category, prefix } of categoryMap) {
      if (results.length >= MAX_RESULTS) break;

      const items = data[key];
      for (let i = 0; i < items.length; i++) {
        if (results.length >= MAX_RESULTS) break;

        const item = items[i];
        if (item.name.toLowerCase().includes(query)) {
          results.push({
            id: `${prefix}-${i}`,
            name: item.name,
            category,
            ...(item.rarity ? { rarity: item.rarity } : {}),
          });
        }
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error in /api/search:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
