"use client";

import { useState, useMemo, useCallback } from "react";
import type { Shell, Core, Implant, BuildData, ImplantSlot, StatModifiers } from "@/lib/types";
import { ROLE_COLORS, IMPLANT_SLOT_LABELS, STAT_LABELS } from "@/lib/constants";
import { RarityBadge } from "@/components/ui/RarityBadge";
import { StatSummary } from "@/components/builds/StatSummary";
import { mergeStats } from "@/utils/optimizer";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { trackEvent } from "@/lib/analytics";
import gearData from "../../../seed/gear-data.json";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Add IDs to all gear items
const shells: Shell[] = gearData.shells.map((s) => ({ ...s, id: slugify(s.name) })) as Shell[];
const cores: Core[] = gearData.cores.map((c) => ({ ...c, id: slugify(c.name) })) as unknown as Core[];
const implants: Implant[] = gearData.implants.map((i) => ({ ...i, id: slugify(i.name) })) as unknown as Implant[];

const IMPLANT_SLOTS: ImplantSlot[] = ["HEAD", "CHEST", "ARMS", "LEGS", "CLASS_ITEM"];

function generateId(): string {
  return `build-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export default function BuildPlannerPage() {
  const [savedBuilds, setSavedBuilds, isLoaded] = useLocalStorage<BuildData[]>(
    "marathon-builds",
    []
  );

  // Build state
  const [buildName, setBuildName] = useState("");
  const [selectedShellId, setSelectedShellId] = useState<string>("");
  const [selectedCoreId, setSelectedCoreId] = useState<string>("");
  const [selectedImplants, setSelectedImplants] = useState<Record<ImplantSlot, string>>({
    HEAD: "",
    CHEST: "",
    ARMS: "",
    LEGS: "",
    CLASS_ITEM: "",
  });

  // Derived data
  const selectedShell = useMemo(
    () => shells.find((s) => s.id === selectedShellId) || null,
    [selectedShellId]
  );

  const availableCores = useMemo(() => {
    if (!selectedShell) return [];
    return cores.filter(
      (c) => c.shellId === selectedShell.name || c.shellId === selectedShell.id
    );
  }, [selectedShell]);

  const selectedCore = useMemo(
    () => cores.find((c) => c.id === selectedCoreId) || null,
    [selectedCoreId]
  );

  const implantsBySlot = useMemo(() => {
    const bySlot: Record<ImplantSlot, Implant[]> = {
      HEAD: [],
      CHEST: [],
      ARMS: [],
      LEGS: [],
      CLASS_ITEM: [],
    };
    for (const implant of implants) {
      if (bySlot[implant.slot]) {
        bySlot[implant.slot].push(implant);
      }
    }
    return bySlot;
  }, []);

  const selectedImplantItems = useMemo(() => {
    return Object.values(selectedImplants)
      .filter((id) => id !== "")
      .map((id) => implants.find((i) => i.id === id))
      .filter(Boolean) as Implant[];
  }, [selectedImplants]);

  // Compute merged stats
  const totalStats: StatModifiers = useMemo(() => {
    const sources: (StatModifiers | Record<string, number>)[] = [];

    if (selectedShell) {
      sources.push(selectedShell.baseStats);
    }
    if (selectedCore) {
      sources.push(selectedCore.statModifiers);
    }
    for (const implant of selectedImplantItems) {
      sources.push(implant.statBonuses);
    }

    return sources.length > 0 ? mergeStats(...sources) : {};
  }, [selectedShell, selectedCore, selectedImplantItems]);

  // Count filled slots
  const filledSlots = useMemo(() => {
    let count = 0;
    if (selectedShellId) count++;
    if (selectedCoreId) count++;
    count += selectedImplantItems.length;
    return count;
  }, [selectedShellId, selectedCoreId, selectedImplantItems]);

  // Handle shell change -- reset core and implants
  const handleShellChange = useCallback((shellId: string) => {
    setSelectedShellId(shellId);
    setSelectedCoreId("");
    setSelectedImplants({ HEAD: "", CHEST: "", ARMS: "", LEGS: "", CLASS_ITEM: "" });
  }, []);

  // Handle implant selection
  const handleImplantChange = useCallback((slot: ImplantSlot, implantId: string) => {
    setSelectedImplants((prev) => ({ ...prev, [slot]: implantId }));
  }, []);

  // Save build
  const handleSaveBuild = useCallback(() => {
    if (!selectedShellId) return;

    const now = new Date().toISOString();
    const build: BuildData = {
      id: generateId(),
      name: buildName.trim() || `Build ${(savedBuilds?.length || 0) + 1}`,
      shellId: selectedShellId,
      coreId: selectedCoreId || null,
      implantIds: Object.values(selectedImplants).filter((id) => id !== ""),
      weaponIds: [],
      weaponModIds: [],
      totalStats,
      createdAt: now,
      updatedAt: now,
    };

    setSavedBuilds((prev) => [...prev, build]);

    trackEvent({ type: "build_created", shellId: selectedShellId, slotsFilledCount: filledSlots });
    trackEvent({ type: "build_saved", storage: "localStorage" });

    // Clear form
    setBuildName("");
  }, [
    buildName,
    selectedShellId,
    selectedCoreId,
    selectedImplants,
    totalStats,
    filledSlots,
    savedBuilds,
    setSavedBuilds,
  ]);

  // Delete a saved build
  const handleDeleteBuild = useCallback(
    (buildId: string) => {
      setSavedBuilds((prev) => prev.filter((b) => b.id !== buildId));
    },
    [setSavedBuilds]
  );

  // Load a saved build
  const handleLoadBuild = useCallback(
    (build: BuildData) => {
      setBuildName(build.name);
      setSelectedShellId(build.shellId);
      setSelectedCoreId(build.coreId || "");

      const implantMap: Record<ImplantSlot, string> = {
        HEAD: "",
        CHEST: "",
        ARMS: "",
        LEGS: "",
        CLASS_ITEM: "",
      };
      for (const implantId of build.implantIds) {
        const implant = implants.find((i) => i.id === implantId);
        if (implant) {
          implantMap[implant.slot] = implant.id;
        }
      }
      setSelectedImplants(implantMap);
    },
    []
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-marathon-text">Build Planner</h1>
        <p className="mt-1 text-marathon-text-dim">
          Craft your Runner loadout. Select a shell, core, and implants to see
          real-time stat calculations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column -- Build Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Build Name */}
          <div>
            <label className="block text-xs font-medium text-marathon-text-dim uppercase tracking-wide mb-1">
              Build Name
            </label>
            <input
              type="text"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              placeholder="My Runner Build"
              className="input-field w-full"
            />
          </div>

          {/* Shell Selection */}
          <div className="card">
            <h2 className="text-lg font-bold text-marathon-text mb-4">
              1. Select Shell
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shells.map((shell) => {
                const roleColor = ROLE_COLORS[shell.role] || "#9ca3af";
                const isSelected = selectedShellId === shell.id;

                return (
                  <button
                    key={shell.id}
                    onClick={() => handleShellChange(shell.id)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-marathon-orange bg-marathon-orange/10"
                        : "border-marathon-slate bg-marathon-dark hover:border-marathon-navy"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-marathon-text">
                        {shell.name}
                      </span>
                      <span
                        className="text-xs font-semibold rounded-full px-2 py-0.5"
                        style={{
                          color: roleColor,
                          backgroundColor: `${roleColor}20`,
                        }}
                      >
                        {shell.role}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 text-xs text-marathon-text-dim">
                      <span>HP {shell.baseStats.health}</span>
                      <span>SHD {shell.baseStats.shield}</span>
                      <span>SPD {shell.baseStats.speed}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Selection */}
          <div className="card">
            <h2 className="text-lg font-bold text-marathon-text mb-4">
              2. Select Core
              {selectedShell && (
                <span className="text-sm text-marathon-muted font-normal ml-2">
                  (for {selectedShell.name})
                </span>
              )}
            </h2>
            {!selectedShell ? (
              <p className="text-sm text-marathon-muted">
                Select a Shell first to see available Cores.
              </p>
            ) : availableCores.length === 0 ? (
              <p className="text-sm text-marathon-muted">
                No cores available for {selectedShell.name}.
              </p>
            ) : (
              <div className="space-y-3">
                {/* None option */}
                <button
                  onClick={() => setSelectedCoreId("")}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedCoreId === ""
                      ? "border-marathon-orange bg-marathon-orange/10"
                      : "border-marathon-slate bg-marathon-dark hover:border-marathon-navy"
                  }`}
                >
                  <span className="text-sm text-marathon-muted">No Core</span>
                </button>
                {availableCores.map((core) => {
                  const isSelected = selectedCoreId === core.id;
                  return (
                    <button
                      key={core.id}
                      onClick={() => setSelectedCoreId(core.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? "border-marathon-orange bg-marathon-orange/10"
                          : "border-marathon-slate bg-marathon-dark hover:border-marathon-navy"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-marathon-text">
                          {core.name}
                        </span>
                        <RarityBadge rarity={core.rarity} />
                      </div>
                      <p className="text-xs text-marathon-text-dim line-clamp-2 mb-2">
                        {core.abilityModification}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(core.statModifiers).map(([stat, value]) => (
                          <span
                            key={stat}
                            className={`text-xs font-medium ${
                              value > 0
                                ? "text-marathon-green"
                                : value < 0
                                ? "text-marathon-red"
                                : "text-marathon-muted"
                            }`}
                          >
                            {STAT_LABELS[stat] || stat}{" "}
                            {value > 0 ? `+${value}` : value}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Implant Selection */}
          <div className="card">
            <h2 className="text-lg font-bold text-marathon-text mb-4">
              3. Select Implants
            </h2>
            <div className="space-y-4">
              {IMPLANT_SLOTS.map((slot) => (
                <div key={slot}>
                  <label className="block text-xs font-medium text-marathon-text-dim uppercase tracking-wide mb-1">
                    {IMPLANT_SLOT_LABELS[slot]}
                  </label>
                  <select
                    value={selectedImplants[slot]}
                    onChange={(e) => handleImplantChange(slot, e.target.value)}
                    className="select-field w-full"
                  >
                    <option value="">-- None --</option>
                    {implantsBySlot[slot].map((implant) => {
                      const bonusPreview = Object.entries(implant.statBonuses)
                        .map(([s, v]) => `${STAT_LABELS[s] || s} ${v > 0 ? "+" : ""}${v}`)
                        .join(", ");
                      return (
                        <option key={implant.id} value={implant.id}>
                          {implant.name} ({implant.rarity}) -- {bonusPreview}
                        </option>
                      );
                    })}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSaveBuild}
              disabled={!selectedShellId}
              className="btn-primary px-6 py-3 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save Build
            </button>
            <span className="text-sm text-marathon-muted">
              {filledSlots} slot{filledSlots !== 1 ? "s" : ""} filled
            </span>
          </div>
        </div>

        {/* Right Column -- Stat Summary */}
        <div className="space-y-6">
          <div className="lg:sticky lg:top-24">
            <StatSummary
              stats={totalStats}
              title={
                buildName.trim() ||
                (selectedShell ? `${selectedShell.name} Build` : "Build Stats")
              }
            />

            {/* Quick stat breakdown */}
            {selectedShell && (
              <div className="card mt-4">
                <h3 className="text-sm font-bold text-marathon-text-dim uppercase tracking-wide mb-3">
                  Sources
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-marathon-text">{selectedShell.name}</span>
                    <span className="text-marathon-muted">Base Stats</span>
                  </div>
                  {selectedCore && (
                    <div className="flex items-center justify-between">
                      <span className="text-marathon-text">{selectedCore.name}</span>
                      <span className="text-marathon-muted">Core</span>
                    </div>
                  )}
                  {selectedImplantItems.map((imp) => (
                    <div key={imp.id} className="flex items-center justify-between">
                      <span className="text-marathon-text">{imp.name}</span>
                      <span className="text-marathon-muted">
                        {IMPLANT_SLOT_LABELS[imp.slot]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Builds */}
      <section className="border-t border-marathon-slate pt-8">
        <h2 className="text-2xl font-bold text-marathon-text mb-6">Saved Builds</h2>
        {!isLoaded ? (
          <p className="text-sm text-marathon-muted">Loading saved builds...</p>
        ) : savedBuilds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-marathon-muted">No saved builds yet.</p>
            <p className="text-sm text-marathon-text-dim mt-1">
              Configure a loadout above and click Save Build.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedBuilds.map((build) => {
              const shell = shells.find((s) => s.id === build.shellId);
              const core = cores.find((c) => c.id === (build.coreId || ""));
              const roleColor = shell
                ? ROLE_COLORS[shell.role] || "#9ca3af"
                : "#9ca3af";

              return (
                <div key={build.id} className="card">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-marathon-text truncate">
                        {build.name}
                      </h3>
                      {shell && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-marathon-text-dim">
                            {shell.name}
                          </span>
                          <span
                            className="text-xs font-semibold rounded-full px-1.5 py-0.5"
                            style={{
                              color: roleColor,
                              backgroundColor: `${roleColor}20`,
                            }}
                          >
                            {shell.role}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-marathon-muted flex-shrink-0">
                      {new Date(build.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {core && (
                    <p className="text-xs text-marathon-text-dim mb-2">
                      Core: {core.name}
                    </p>
                  )}
                  <p className="text-xs text-marathon-muted mb-4">
                    {build.implantIds.length} implant
                    {build.implantIds.length !== 1 ? "s" : ""} equipped
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLoadBuild(build)}
                      className="btn-secondary px-3 py-1.5 rounded text-xs"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDeleteBuild(build.id)}
                      className="px-3 py-1.5 rounded text-xs text-marathon-red hover:bg-marathon-red/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
