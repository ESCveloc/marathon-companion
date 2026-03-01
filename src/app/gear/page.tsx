"use client";

import { useState, useMemo, useCallback } from "react";
import type { FilterState, GearCategory, Weapon, WeaponMod, Implant, Shell, Core } from "@/lib/types";
import { GearFilters } from "@/components/gear/GearFilters";
import { GearGrid } from "@/components/gear/GearGrid";
import { fuzzyMatch } from "@/utils/search";
import { trackEvent } from "@/lib/analytics";
import gearData from "../../../seed/gear-data.json";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Add IDs to all gear items
const allGear = {
  shells: gearData.shells.map((s) => ({ ...s, id: slugify(s.name) })) as Shell[],
  weapons: gearData.weapons.map((w) => ({ ...w, id: slugify(w.name) })) as Weapon[],
  mods: gearData.weaponMods.map((m) => ({ ...m, id: slugify(m.name) })) as unknown as WeaponMod[],
  cores: gearData.cores.map((c) => ({ ...c, id: slugify(c.name) })) as unknown as Core[],
  implants: gearData.implants.map((i) => ({ ...i, id: slugify(i.name) })) as unknown as Implant[],
};

const DEFAULT_FILTERS: FilterState = {
  category: "weapons",
  rarity: "ALL",
  role: "ALL",
  weaponType: "ALL",
  modSlot: "ALL",
  implantSlot: "ALL",
  search: "",
  page: 1,
  pageSize: 24,
};

export default function GearDatabasePage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    // Reset page when filters change (but not when page itself changes)
    if (
      newFilters.category !== filters.category ||
      newFilters.rarity !== filters.rarity ||
      newFilters.role !== filters.role ||
      newFilters.weaponType !== filters.weaponType ||
      newFilters.modSlot !== filters.modSlot ||
      newFilters.implantSlot !== filters.implantSlot ||
      newFilters.search !== filters.search
    ) {
      newFilters = { ...newFilters, page: 1 };
    }

    // Track search events
    if (newFilters.search && newFilters.search !== filters.search) {
      const start = performance.now();
      // Defer tracking until after the filter is applied
      setTimeout(() => {
        trackEvent({
          type: "search_performed",
          query: newFilters.search,
          filters: { category: newFilters.category, rarity: newFilters.rarity },
          resultCount: 0, // Will be updated in the memo
          latencyMs: Math.round(performance.now() - start),
        });
      }, 0);
    }

    setFilters(newFilters);
  }, [filters]);

  const filteredItems = useMemo(() => {
    const category = filters.category;
    let items: any[] = allGear[category] || [];

    // Apply search filter
    if (filters.search) {
      items = items.filter((item: any) => fuzzyMatch(filters.search, item.name));
    }

    // Apply category-specific filters
    switch (category) {
      case "weapons": {
        if (filters.rarity !== "ALL") {
          items = items.filter((item: any) => item.rarity === filters.rarity);
        }
        if (filters.weaponType !== "ALL") {
          items = items.filter((item: any) => item.type === filters.weaponType);
        }
        break;
      }
      case "mods": {
        if (filters.rarity !== "ALL") {
          items = items.filter((item: any) => item.rarity === filters.rarity);
        }
        if (filters.modSlot !== "ALL") {
          items = items.filter((item: any) => item.slot === filters.modSlot);
        }
        break;
      }
      case "implants": {
        if (filters.rarity !== "ALL") {
          items = items.filter((item: any) => item.rarity === filters.rarity);
        }
        if (filters.implantSlot !== "ALL") {
          items = items.filter((item: any) => item.slot === filters.implantSlot);
        }
        break;
      }
      case "shells": {
        if (filters.role !== "ALL") {
          items = items.filter((item: any) => item.role === filters.role);
        }
        break;
      }
      case "cores": {
        if (filters.rarity !== "ALL") {
          items = items.filter((item: any) => item.rarity === filters.rarity);
        }
        break;
      }
    }

    return items;
  }, [filters]);

  // Pagination
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / filters.pageSize));
  const startIdx = (filters.page - 1) * filters.pageSize;
  const paginatedItems = filteredItems.slice(startIdx, startIdx + filters.pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-marathon-text">Gear Database</h1>
        <p className="mt-1 text-marathon-text-dim">
          Browse and filter all Runner gear. Select an item for full details.
        </p>
      </div>

      {/* Filters */}
      <GearFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-marathon-muted">
          Showing{" "}
          <span className="text-marathon-text font-medium">
            {paginatedItems.length}
          </span>{" "}
          of{" "}
          <span className="text-marathon-text font-medium">{totalItems}</span>{" "}
          items
        </p>
      </div>

      {/* Grid */}
      <GearGrid items={paginatedItems} category={filters.category} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
            }
            disabled={filters.page <= 1}
            className="btn-secondary px-4 py-2 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setFilters((prev) => ({ ...prev, page: pageNum }))}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  filters.page === pageNum
                    ? "bg-marathon-orange text-black"
                    : "bg-marathon-slate text-marathon-text-dim hover:text-marathon-text hover:bg-marathon-navy"
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: Math.min(totalPages, prev.page + 1),
              }))
            }
            disabled={filters.page >= totalPages}
            className="btn-secondary px-4 py-2 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
