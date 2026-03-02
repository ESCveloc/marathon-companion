"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type {
  GearCategory,
  Shell,
  Weapon,
  WeaponMod,
  Core,
  Implant,
  BuildData,
  StatModifiers,
} from "@/lib/types";
import {
  STAT_LABELS,
  RARITY_COLORS,
  ROLE_COLORS,
  WEAPON_TYPE_LABELS,
  MOD_SLOT_LABELS,
  IMPLANT_SLOT_LABELS,
} from "@/lib/constants";
import { StatBar } from "@/components/ui/StatBar";
import { StatDelta } from "@/components/ui/StatDelta";
import { RarityBadge } from "@/components/ui/RarityBadge";
import { computeStatDelta } from "@/utils/optimizer";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { trackEvent } from "@/lib/analytics";
import gearData from "../../../../seed/gear-data.json";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Add IDs to all gear items
const allGear: Record<GearCategory, any[]> = {
  shells: gearData.shells.map((s) => ({ ...s, id: slugify(s.name) })),
  weapons: gearData.weapons.map((w) => ({ ...w, id: slugify(w.name) })),
  mods: gearData.weaponMods.map((m) => ({ ...m, id: slugify(m.name) })),
  cores: gearData.cores.map((c) => ({ ...c, id: slugify(c.name) })),
  implants: gearData.implants.map((i) => ({ ...i, id: slugify(i.name) })),
};

type CompareType = GearCategory | "build";

const COMPARE_TYPE_OPTIONS: { value: CompareType; label: string }[] = [
  { value: "weapons", label: "Weapons" },
  { value: "shells", label: "Shells" },
  { value: "mods", label: "Weapon Mods" },
  { value: "cores", label: "Cores" },
  { value: "implants", label: "Implants" },
  { value: "build", label: "Saved Builds" },
];

function getStatsForItem(item: any, category: GearCategory): StatModifiers {
  switch (category) {
    case "shells":
      return { ...(item as Shell).baseStats };
    case "weapons":
      return {
        firepower: (item as Weapon).firepower,
        rateOfFire: (item as Weapon).rateOfFire,
        range: (item as Weapon).range,
        accuracy: (item as Weapon).accuracy,
        magazine: (item as Weapon).magazine,
        reloadSpeed: (item as Weapon).reloadSpeed,
        recoil: (item as Weapon).recoil,
        precision: (item as Weapon).precision,
      };
    case "mods":
      return { ...(item as WeaponMod).statModifiers };
    case "cores":
      return { ...(item as Core).statModifiers };
    case "implants":
      return { ...(item as Implant).statBonuses };
    default:
      return {};
  }
}

function getItemLabel(item: any, category: GearCategory): string {
  switch (category) {
    case "weapons":
      return `${item.name} (${WEAPON_TYPE_LABELS[item.type] || item.type})`;
    case "mods":
      return `${item.name} (${MOD_SLOT_LABELS[item.slot] || item.slot})`;
    case "implants":
      return `${item.name} (${IMPLANT_SLOT_LABELS[item.slot] || item.slot})`;
    default:
      return item.name;
  }
}

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [savedBuilds] = useLocalStorage<BuildData[]>("marathon-builds", []);

  // Read initial values from URL
  const initialType = (searchParams.get("type") as CompareType) || "weapons";
  const initialLeft = searchParams.get("left") || "";
  const initialRight = searchParams.get("right") || "";

  const [compareType, setCompareType] = useState<CompareType>(initialType);
  const [leftId, setLeftId] = useState(initialLeft);
  const [rightId, setRightId] = useState(initialRight);

  // Update URL when selections change
  const updateUrl = useCallback(
    (type: CompareType, left: string, right: string) => {
      const params = new URLSearchParams();
      params.set("type", type);
      if (left) params.set("left", left);
      if (right) params.set("right", right);
      router.replace(`/builds/compare?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const handleTypeChange = useCallback(
    (newType: CompareType) => {
      setCompareType(newType);
      setLeftId("");
      setRightId("");
      updateUrl(newType, "", "");
    },
    [updateUrl]
  );

  const handleLeftChange = useCallback(
    (id: string) => {
      setLeftId(id);
      updateUrl(compareType, id, rightId);
    },
    [compareType, rightId, updateUrl]
  );

  const handleRightChange = useCallback(
    (id: string) => {
      setRightId(id);
      updateUrl(compareType, leftId, id);
    },
    [compareType, leftId, updateUrl]
  );

  // Get items list for current type
  const items = useMemo(() => {
    if (compareType === "build") return [];
    return allGear[compareType] || [];
  }, [compareType]);

  // Resolve selected items
  const leftItem = useMemo(() => {
    if (!leftId) return null;
    if (compareType === "build") {
      return savedBuilds.find((b) => b.id === leftId) || null;
    }
    return items.find((item: any) => item.id === leftId) || null;
  }, [leftId, compareType, items, savedBuilds]);

  const rightItem = useMemo(() => {
    if (!rightId) return null;
    if (compareType === "build") {
      return savedBuilds.find((b) => b.id === rightId) || null;
    }
    return items.find((item: any) => item.id === rightId) || null;
  }, [rightId, compareType, items, savedBuilds]);

  // Get stats for comparison
  const leftStats = useMemo(() => {
    if (!leftItem) return {};
    if (compareType === "build") return (leftItem as BuildData).totalStats || {};
    return getStatsForItem(leftItem, compareType as GearCategory);
  }, [leftItem, compareType]);

  const rightStats = useMemo(() => {
    if (!rightItem) return {};
    if (compareType === "build") return (rightItem as BuildData).totalStats || {};
    return getStatsForItem(rightItem, compareType as GearCategory);
  }, [rightItem, compareType]);

  const statDelta = useMemo(() => {
    if (!leftItem || !rightItem) return {};
    return computeStatDelta(leftStats, rightStats);
  }, [leftItem, rightItem, leftStats, rightStats]);

  const allStatKeys = useMemo(() => {
    return Array.from(
      new Set([...Object.keys(leftStats), ...Object.keys(rightStats)])
    ).sort();
  }, [leftStats, rightStats]);

  // Track comparison viewed
  useEffect(() => {
    if (leftId && rightId) {
      trackEvent({
        type: "comparison_viewed",
        entityType: compareType === "build" ? "build" : (compareType as GearCategory),
        leftId,
        rightId,
      });
    }
  }, [leftId, rightId, compareType]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-marathon-text">Compare</h1>
        <p className="mt-1 text-marathon-text-dim">
          Side-by-side comparison with stat deltas. Share via URL.
        </p>
      </div>

      {/* Type Selector */}
      <div>
        <label className="block text-xs font-medium text-marathon-text-dim uppercase tracking-wide mb-2">
          Compare Type
        </label>
        <div className="flex flex-wrap gap-2">
          {COMPARE_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleTypeChange(opt.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                compareType === opt.value
                  ? "bg-marathon-orange text-black"
                  : "bg-marathon-slate text-marathon-text-dim hover:text-marathon-text hover:bg-marathon-navy"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Item Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left picker */}
        <div>
          <label className="block text-xs font-medium text-marathon-text-dim uppercase tracking-wide mb-1">
            Left Item
          </label>
          {compareType === "build" ? (
            <select
              value={leftId}
              onChange={(e) => handleLeftChange(e.target.value)}
              className="select-field w-full"
            >
              <option value="">-- Select a Build --</option>
              {savedBuilds.map((build) => (
                <option key={build.id} value={build.id}>
                  {build.name}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={leftId}
              onChange={(e) => handleLeftChange(e.target.value)}
              className="select-field w-full"
            >
              <option value="">-- Select --</option>
              {items.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {getItemLabel(item, compareType as GearCategory)}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Right picker */}
        <div>
          <label className="block text-xs font-medium text-marathon-text-dim uppercase tracking-wide mb-1">
            Right Item
          </label>
          {compareType === "build" ? (
            <select
              value={rightId}
              onChange={(e) => handleRightChange(e.target.value)}
              className="select-field w-full"
            >
              <option value="">-- Select a Build --</option>
              {savedBuilds.map((build) => (
                <option key={build.id} value={build.id}>
                  {build.name}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={rightId}
              onChange={(e) => handleRightChange(e.target.value)}
              className="select-field w-full"
            >
              <option value="">-- Select --</option>
              {items.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {getItemLabel(item, compareType as GearCategory)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Comparison Display */}
      {leftItem && rightItem ? (
        <div className="space-y-6">
          {/* Item Headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card border-t-4 border-t-marathon-cyan">
              <ItemHeader
                item={leftItem}
                type={compareType}
              />
            </div>
            <div className="card border-t-4 border-t-marathon-amber">
              <ItemHeader
                item={rightItem}
                type={compareType}
              />
            </div>
          </div>

          {/* Stat Comparison Table */}
          <div className="card">
            <h3 className="text-lg font-bold text-marathon-text mb-4">
              Stat Comparison
            </h3>
            <div className="space-y-3">
              {allStatKeys.map((stat) => {
                const leftVal = leftStats[stat] || 0;
                const rightVal = rightStats[stat] || 0;
                const delta = statDelta[stat] || 0;
                const maxVal =
                  stat === "rateOfFire"
                    ? 1200
                    : Math.max(leftVal, rightVal, 100);

                return (
                  <div key={stat} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-marathon-text-dim w-28">
                        {STAT_LABELS[stat] || stat}
                      </span>
                      <span className="text-marathon-text font-medium w-12 text-right">
                        {leftVal}
                      </span>
                      <div className="flex-1 mx-4">
                        <div className="relative h-4 bg-marathon-navy rounded-full overflow-hidden">
                          {/* Left bar */}
                          <div
                            className="absolute top-0 left-0 h-full rounded-full opacity-70"
                            style={{
                              width: `${Math.min(
                                (leftVal / maxVal) * 100,
                                100
                              )}%`,
                              backgroundColor: "#22d3ee",
                            }}
                          />
                          {/* Right bar overlay */}
                          <div
                            className="absolute top-0 left-0 h-full rounded-full opacity-50"
                            style={{
                              width: `${Math.min(
                                (rightVal / maxVal) * 100,
                                100
                              )}%`,
                              backgroundColor: "#f59e0b",
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-marathon-text font-medium w-12 text-left">
                        {rightVal}
                      </span>
                      <div className="w-16 text-right">
                        <StatDelta value={delta} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-marathon-slate text-xs text-marathon-muted">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#22d3ee] opacity-70" />
                <span>
                  {compareType === "build"
                    ? (leftItem as BuildData).name
                    : (leftItem as any).name}{" "}
                  (Left)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#f59e0b] opacity-50" />
                <span>
                  {compareType === "build"
                    ? (rightItem as BuildData).name
                    : (rightItem as any).name}{" "}
                  (Right)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Delta = Right - Left</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <svg
            className="w-12 h-12 text-marathon-muted mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-marathon-muted text-lg font-medium">
            Select two items to compare
          </p>
          <p className="text-sm text-marathon-text-dim mt-1">
            Pick a type above, then choose one item for each side.
          </p>
        </div>
      )}
    </div>
  );
}

function ItemHeader({
  item,
  type,
}: {
  item: any;
  type: CompareType;
}) {
  if (type === "build") {
    const build = item as BuildData;
    const shell = allGear.shells.find((s: any) => s.id === build.shellId);
    return (
      <div>
        <h3 className="text-lg font-bold text-marathon-text">{build.name}</h3>
        {shell && (
          <p className="text-sm text-marathon-text-dim mt-1">
            Shell: {shell.name}
          </p>
        )}
        <p className="text-xs text-marathon-muted mt-1">
          {build.implantIds.length} implants | Created{" "}
          {new Date(build.createdAt).toLocaleDateString()}
        </p>
      </div>
    );
  }

  const category = type as GearCategory;
  const hasRarity = "rarity" in item;
  const roleColor =
    category === "shells" ? ROLE_COLORS[item.role] || "#9ca3af" : undefined;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-marathon-text">{item.name}</h3>
        {hasRarity && <RarityBadge rarity={item.rarity} />}
      </div>
      {category === "shells" && (
        <span
          className="inline-block text-xs font-semibold rounded-full px-2 py-0.5 mt-2"
          style={{
            color: roleColor,
            backgroundColor: `${roleColor}20`,
          }}
        >
          {item.role}
        </span>
      )}
      {category === "weapons" && (
        <p className="text-sm text-marathon-text-dim mt-1">
          {WEAPON_TYPE_LABELS[item.type] || item.type}
        </p>
      )}
      {category === "mods" && (
        <p className="text-sm text-marathon-text-dim mt-1">
          {MOD_SLOT_LABELS[item.slot] || item.slot}
        </p>
      )}
      {category === "implants" && (
        <p className="text-sm text-marathon-text-dim mt-1">
          {IMPLANT_SLOT_LABELS[item.slot] || item.slot}
        </p>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-16">
          <p className="text-marathon-muted">Loading comparison...</p>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
