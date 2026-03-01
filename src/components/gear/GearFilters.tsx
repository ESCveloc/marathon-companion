"use client";

import type { FilterState, GearCategory } from "@/lib/types";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterSelect } from "@/components/ui/FilterSelect";
import {
  RARITY_ORDER,
  WEAPON_TYPE_LABELS,
  MOD_SLOT_LABELS,
  IMPLANT_SLOT_LABELS,
  ROLE_COLORS,
} from "@/lib/constants";

interface GearFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const CATEGORY_TABS: { value: GearCategory; label: string }[] = [
  { value: "shells", label: "Shells" },
  { value: "weapons", label: "Weapons" },
  { value: "mods", label: "Mods" },
  { value: "cores", label: "Cores" },
  { value: "implants", label: "Implants" },
];

const rarityOptions = [
  { value: "ALL", label: "All Rarities" },
  ...RARITY_ORDER.map((r) => ({ value: r, label: r.charAt(0) + r.slice(1).toLowerCase() })),
];

const weaponTypeOptions = [
  { value: "ALL", label: "All Types" },
  ...Object.entries(WEAPON_TYPE_LABELS).map(([value, label]) => ({ value, label })),
];

const modSlotOptions = [
  { value: "ALL", label: "All Slots" },
  ...Object.entries(MOD_SLOT_LABELS).map(([value, label]) => ({ value, label })),
];

const implantSlotOptions = [
  { value: "ALL", label: "All Slots" },
  ...Object.entries(IMPLANT_SLOT_LABELS).map(([value, label]) => ({ value, label })),
];

const roleOptions = [
  { value: "ALL", label: "All Roles" },
  ...Object.keys(ROLE_COLORS).map((role) => ({
    value: role,
    label: role.charAt(0) + role.slice(1).toLowerCase(),
  })),
];

export function GearFilters({ filters, onFilterChange }: GearFiltersProps) {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const renderCategoryFilters = () => {
    switch (filters.category) {
      case "weapons":
        return (
          <>
            <FilterSelect
              label="Weapon Type"
              value={filters.weaponType}
              options={weaponTypeOptions}
              onChange={(v) => updateFilter("weaponType", v as FilterState["weaponType"])}
            />
            <FilterSelect
              label="Rarity"
              value={filters.rarity}
              options={rarityOptions}
              onChange={(v) => updateFilter("rarity", v as FilterState["rarity"])}
            />
          </>
        );
      case "mods":
        return (
          <>
            <FilterSelect
              label="Mod Slot"
              value={filters.modSlot}
              options={modSlotOptions}
              onChange={(v) => updateFilter("modSlot", v as FilterState["modSlot"])}
            />
            <FilterSelect
              label="Rarity"
              value={filters.rarity}
              options={rarityOptions}
              onChange={(v) => updateFilter("rarity", v as FilterState["rarity"])}
            />
          </>
        );
      case "implants":
        return (
          <>
            <FilterSelect
              label="Implant Slot"
              value={filters.implantSlot}
              options={implantSlotOptions}
              onChange={(v) => updateFilter("implantSlot", v as FilterState["implantSlot"])}
            />
            <FilterSelect
              label="Rarity"
              value={filters.rarity}
              options={rarityOptions}
              onChange={(v) => updateFilter("rarity", v as FilterState["rarity"])}
            />
          </>
        );
      case "shells":
        return (
          <FilterSelect
            label="Role"
            value={filters.role}
            options={roleOptions}
            onChange={(v) => updateFilter("role", v as FilterState["role"])}
          />
        );
      case "cores":
        return (
          <FilterSelect
            label="Rarity"
            value={filters.rarity}
            options={rarityOptions}
            onChange={(v) => updateFilter("rarity", v as FilterState["rarity"])}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <SearchInput
        value={filters.search}
        onChange={(v) => updateFilter("search", v)}
        placeholder="Search gear by name..."
      />

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => updateFilter("category", tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.category === tab.value
                ? "bg-marathon-orange text-black"
                : "bg-marathon-slate text-marathon-text-dim hover:text-marathon-text hover:bg-marathon-navy"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conditional Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {renderCategoryFilters()}
      </div>
    </div>
  );
}
