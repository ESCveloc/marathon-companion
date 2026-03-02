"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useMemo, useEffect } from "react";
import type { GearCategory, Shell, Weapon, WeaponMod, Core, Implant } from "@/lib/types";
import {
  RARITY_COLORS,
  ROLE_COLORS,
  WEAPON_TYPE_LABELS,
  MOD_SLOT_LABELS,
  IMPLANT_SLOT_LABELS,
  STAT_LABELS,
} from "@/lib/constants";
import { RarityBadge } from "@/components/ui/RarityBadge";
import { StatBar } from "@/components/ui/StatBar";
import { StatDelta } from "@/components/ui/StatDelta";
import { trackEvent } from "@/lib/analytics";
import gearData from "../../../../seed/gear-data.json";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Build lookup maps with IDs
const allItems: { item: any; category: GearCategory }[] = [
  ...gearData.shells.map((s) => ({
    item: { ...s, id: slugify(s.name) },
    category: "shells" as GearCategory,
  })),
  ...gearData.weapons.map((w) => ({
    item: { ...w, id: slugify(w.name) },
    category: "weapons" as GearCategory,
  })),
  ...gearData.weaponMods.map((m) => ({
    item: { ...m, id: slugify(m.name) },
    category: "mods" as GearCategory,
  })),
  ...gearData.cores.map((c) => ({
    item: { ...c, id: slugify(c.name) },
    category: "cores" as GearCategory,
  })),
  ...gearData.implants.map((i) => ({
    item: { ...i, id: slugify(i.name) },
    category: "implants" as GearCategory,
  })),
];

function ShellDetail({ shell }: { shell: Shell }) {
  const roleColor = ROLE_COLORS[shell.role] || "#9ca3af";

  return (
    <div className="space-y-8">
      {/* Role Badge */}
      <div>
        <span
          className="inline-block text-sm font-bold rounded-full px-3 py-1"
          style={{ color: roleColor, backgroundColor: `${roleColor}20` }}
        >
          {shell.role}
        </span>
      </div>

      {/* Description */}
      <p className="text-marathon-text-dim leading-relaxed">{shell.description}</p>

      {/* Base Stats */}
      <div className="card">
        <h3 className="text-lg font-bold text-marathon-text mb-4">Base Stats</h3>
        <div className="space-y-3">
          {Object.entries(shell.baseStats).map(([stat, value]) => (
            <StatBar
              key={stat}
              label={STAT_LABELS[stat] || stat}
              value={value}
            />
          ))}
        </div>
      </div>

      {/* Abilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prime Ability */}
        <div className="card border-l-4 border-l-marathon-orange">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-marathon-orange">
              {shell.primeAbilityName}
            </h3>
            <span className="text-xs text-marathon-muted bg-marathon-navy rounded-full px-2 py-1">
              {shell.primeCooldown}s cooldown
            </span>
          </div>
          <p className="text-xs text-marathon-muted uppercase tracking-wide mb-2">
            Prime Ability
          </p>
          <p className="text-sm text-marathon-text-dim leading-relaxed">
            {shell.primeAbilityDesc}
          </p>
        </div>

        {/* Tactical Ability */}
        <div className="card border-l-4 border-l-marathon-cyan">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-marathon-cyan">
              {shell.tactAbilityName}
            </h3>
            <span className="text-xs text-marathon-muted bg-marathon-navy rounded-full px-2 py-1">
              {shell.tactCooldown}s cooldown
            </span>
          </div>
          <p className="text-xs text-marathon-muted uppercase tracking-wide mb-2">
            Tactical Ability
          </p>
          <p className="text-sm text-marathon-text-dim leading-relaxed">
            {shell.tactAbilityDesc}
          </p>
        </div>

        {/* Trait 1 */}
        <div className="card border-l-4 border-l-marathon-green">
          <h3 className="text-lg font-bold text-marathon-green mb-1">
            {shell.trait1Name}
          </h3>
          <p className="text-xs text-marathon-muted uppercase tracking-wide mb-2">
            Passive Trait
          </p>
          <p className="text-sm text-marathon-text-dim leading-relaxed">
            {shell.trait1Desc}
          </p>
        </div>

        {/* Trait 2 */}
        <div className="card border-l-4 border-l-marathon-green">
          <h3 className="text-lg font-bold text-marathon-green mb-1">
            {shell.trait2Name}
          </h3>
          <p className="text-xs text-marathon-muted uppercase tracking-wide mb-2">
            Passive Trait
          </p>
          <p className="text-sm text-marathon-text-dim leading-relaxed">
            {shell.trait2Desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function WeaponDetail({ weapon }: { weapon: Weapon }) {
  const statEntries = [
    { key: "firepower", label: "Firepower", value: weapon.firepower },
    { key: "rateOfFire", label: "Rate of Fire", value: weapon.rateOfFire, max: 1200 },
    { key: "range", label: "Range", value: weapon.range, max: 200 },
    { key: "accuracy", label: "Accuracy", value: weapon.accuracy },
    { key: "magazine", label: "Magazine", value: weapon.magazine },
    { key: "reloadSpeed", label: "Reload Speed", value: weapon.reloadSpeed, max: 8 },
    { key: "recoil", label: "Recoil", value: weapon.recoil, max: 150 },
    { key: "precision", label: "Precision", value: weapon.precision, max: 3 },
  ];

  return (
    <div className="space-y-8">
      {/* Type and Rarity */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-marathon-text-dim font-medium bg-marathon-slate px-3 py-1 rounded-lg">
          {WEAPON_TYPE_LABELS[weapon.type] || weapon.type}
        </span>
        <RarityBadge rarity={weapon.rarity} />
      </div>

      {/* Description */}
      <p className="text-marathon-text-dim leading-relaxed">{weapon.description}</p>

      {/* Stats */}
      <div className="card">
        <h3 className="text-lg font-bold text-marathon-text mb-4">Weapon Stats</h3>
        <div className="space-y-3">
          {statEntries.map((stat) => (
            <StatBar
              key={stat.key}
              label={stat.label}
              value={stat.value}
              maxValue={stat.max || 100}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ModDetail({ mod }: { mod: WeaponMod }) {
  return (
    <div className="space-y-8">
      {/* Slot and Rarity */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-marathon-text-dim font-medium bg-marathon-slate px-3 py-1 rounded-lg">
          {MOD_SLOT_LABELS[mod.slot] || mod.slot}
        </span>
        <RarityBadge rarity={mod.rarity} />
      </div>

      {/* Description */}
      <p className="text-marathon-text-dim leading-relaxed">{mod.description}</p>

      {/* Stat Modifiers */}
      <div className="card">
        <h3 className="text-lg font-bold text-marathon-text mb-4">Stat Modifiers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(mod.statModifiers).map(([stat, value]) => (
            <div
              key={stat}
              className="flex items-center justify-between bg-marathon-navy rounded-lg px-4 py-3"
            >
              <span className="text-sm text-marathon-text-dim">
                {STAT_LABELS[stat] || stat}
              </span>
              <StatDelta value={value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CoreDetail({ core }: { core: Core }) {
  // Find the linked shell name
  const linkedShell = gearData.shells.find(
    (s) => slugify(s.name) === core.shellId || s.name === core.shellId
  );

  return (
    <div className="space-y-8">
      {/* Rarity and Shell Link */}
      <div className="flex items-center gap-3 flex-wrap">
        <RarityBadge rarity={core.rarity} />
        {linkedShell && (
          <Link
            href={`/gear/${slugify(linkedShell.name)}`}
            className="text-sm text-marathon-cyan hover:text-marathon-orange transition-colors font-medium"
          >
            Linked to: {linkedShell.name}
          </Link>
        )}
      </div>

      {/* Ability Modification */}
      <div className="card border-l-4 border-l-marathon-amber">
        <h3 className="text-lg font-bold text-marathon-amber mb-2">
          Ability Modification
        </h3>
        <p className="text-sm text-marathon-text-dim leading-relaxed">
          {core.abilityModification}
        </p>
      </div>

      {/* Stat Modifiers */}
      <div className="card">
        <h3 className="text-lg font-bold text-marathon-text mb-4">Stat Modifiers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(core.statModifiers).map(([stat, value]) => (
            <div
              key={stat}
              className="flex items-center justify-between bg-marathon-navy rounded-lg px-4 py-3"
            >
              <span className="text-sm text-marathon-text-dim">
                {STAT_LABELS[stat] || stat}
              </span>
              <StatDelta value={value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ImplantDetail({ implant }: { implant: Implant }) {
  return (
    <div className="space-y-8">
      {/* Slot and Rarity */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-marathon-text-dim font-medium bg-marathon-slate px-3 py-1 rounded-lg">
          {IMPLANT_SLOT_LABELS[implant.slot] || implant.slot}
        </span>
        <RarityBadge rarity={implant.rarity} />
      </div>

      {/* Description */}
      <p className="text-marathon-text-dim leading-relaxed">{implant.description}</p>

      {/* Stat Bonuses */}
      <div className="card">
        <h3 className="text-lg font-bold text-marathon-text mb-4">Stat Bonuses</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(implant.statBonuses).map(([stat, value]) => (
            <div
              key={stat}
              className="flex items-center justify-between bg-marathon-navy rounded-lg px-4 py-3"
            >
              <span className="text-sm text-marathon-text-dim">
                {STAT_LABELS[stat] || stat}
              </span>
              <StatDelta value={value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ItemDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const found = useMemo(() => {
    return allItems.find((entry) => entry.item.id === id);
  }, [id]);

  // Track item view
  useEffect(() => {
    if (found) {
      trackEvent({
        type: "item_viewed",
        itemType: found.category,
        itemId: found.item.id,
        source: "direct",
      });
    }
  }, [found]);

  if (!found) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <svg
          className="w-16 h-16 text-marathon-muted mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-marathon-text mb-2">Item Not Found</h2>
        <p className="text-marathon-text-dim mb-8">
          No gear item matches the ID &ldquo;{id}&rdquo;.
        </p>
        <Link href="/gear" className="btn-primary px-6 py-2 rounded-lg">
          Back to Gear Database
        </Link>
      </div>
    );
  }

  const { item, category } = found;

  const renderDetail = () => {
    switch (category) {
      case "shells":
        return <ShellDetail shell={item as Shell} />;
      case "weapons":
        return <WeaponDetail weapon={item as Weapon} />;
      case "mods":
        return <ModDetail mod={item as WeaponMod} />;
      case "cores":
        return <CoreDetail core={item as Core} />;
      case "implants":
        return <ImplantDetail implant={item as Implant} />;
      default:
        return null;
    }
  };

  const categoryLabels: Record<string, string> = {
    shells: "Shell",
    weapons: "Weapon",
    mods: "Weapon Mod",
    cores: "Core",
    implants: "Implant",
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/gear"
        className="inline-flex items-center gap-2 text-sm text-marathon-muted hover:text-marathon-orange transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Gear Database
      </Link>

      {/* Item Header */}
      <div>
        <p className="text-xs text-marathon-muted uppercase tracking-wide mb-1">
          {categoryLabels[category] || category}
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-marathon-text">
          {item.name}
        </h1>
      </div>

      {/* Category-specific detail */}
      {renderDetail()}

      {/* Compare Link */}
      <div className="pt-4 border-t border-marathon-slate">
        <Link
          href={`/builds/compare?type=${category}&left=${item.id}`}
          className="text-sm text-marathon-cyan hover:text-marathon-orange transition-colors"
        >
          Compare this {categoryLabels[category]?.toLowerCase() || "item"} with another &rarr;
        </Link>
      </div>
    </div>
  );
}
