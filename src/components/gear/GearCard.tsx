"use client";

import Link from "next/link";
import type { GearCategory, Weapon, WeaponMod, Core, Implant, Shell } from "@/lib/types";
import { RarityBadge } from "@/components/ui/RarityBadge";
import { StatDelta } from "@/components/ui/StatDelta";
import { WEAPON_TYPE_LABELS, MOD_SLOT_LABELS, IMPLANT_SLOT_LABELS, ROLE_COLORS } from "@/lib/constants";

interface GearCardProps {
  item: any;
  category: GearCategory;
  onClick?: () => void;
}

function WeaponStats({ item }: { item: Weapon }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-marathon-text-dim mt-2">
      <span>DMG <span className="text-marathon-text font-medium">{item.baseDamage}</span></span>
      <span>RPM <span className="text-marathon-text font-medium">{item.fireRate}</span></span>
      <span>RNG <span className="text-marathon-text font-medium">{item.range}</span></span>
    </div>
  );
}

function ModStats({ item }: { item: WeaponMod }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
      {Object.entries(item.statModifiers).map(([stat, value]) => (
        <StatDelta key={stat} label={stat} value={value} />
      ))}
    </div>
  );
}

function ImplantStats({ item }: { item: Implant }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
      {Object.entries(item.statBonuses).map(([stat, value]) => (
        <StatDelta key={stat} label={stat} value={value} />
      ))}
    </div>
  );
}

function CoreStats({ item }: { item: Core }) {
  return (
    <p className="text-xs text-marathon-text-dim mt-2 line-clamp-2">
      {item.abilityModification}
    </p>
  );
}

function ShellStats({ item }: { item: Shell }) {
  const roleColor = ROLE_COLORS[item.role] || "#9ca3af";

  return (
    <div className="mt-2">
      <span
        className="inline-block text-xs font-semibold rounded-full px-2 py-0.5 mb-1"
        style={{ color: roleColor, backgroundColor: `${roleColor}20` }}
      >
        {item.role}
      </span>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-marathon-text-dim">
        <span>HP <span className="text-marathon-text font-medium">{item.baseStats.health}</span></span>
        <span>SHD <span className="text-marathon-text font-medium">{item.baseStats.shield}</span></span>
        <span>SPD <span className="text-marathon-text font-medium">{item.baseStats.speed}</span></span>
      </div>
    </div>
  );
}

export function GearCard({ item, category, onClick }: GearCardProps) {
  const hasRarity = "rarity" in item;

  const renderStats = () => {
    switch (category) {
      case "weapons":
        return <WeaponStats item={item as Weapon} />;
      case "mods":
        return <ModStats item={item as WeaponMod} />;
      case "implants":
        return <ImplantStats item={item as Implant} />;
      case "cores":
        return <CoreStats item={item as Core} />;
      case "shells":
        return <ShellStats item={item as Shell} />;
      default:
        return null;
    }
  };

  const getSubtitle = () => {
    switch (category) {
      case "weapons":
        return WEAPON_TYPE_LABELS[(item as Weapon).type] || (item as Weapon).type;
      case "mods":
        return MOD_SLOT_LABELS[(item as WeaponMod).slot] || (item as WeaponMod).slot;
      case "implants":
        return IMPLANT_SLOT_LABELS[(item as Implant).slot] || (item as Implant).slot;
      default:
        return null;
    }
  };

  const subtitle = getSubtitle();

  return (
    <Link href={`/gear/${item.id}`} onClick={onClick}>
      <div className="card cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-marathon-text truncate">{item.name}</h3>
            {subtitle && (
              <p className="text-xs text-marathon-muted mt-0.5">{subtitle}</p>
            )}
          </div>
          {hasRarity && <RarityBadge rarity={item.rarity} />}
        </div>
        {renderStats()}
      </div>
    </Link>
  );
}
