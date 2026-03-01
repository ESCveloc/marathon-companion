import { StatModifiers, BaseStats, Implant, Core } from "@/lib/types";

export function mergeStats(...sources: (StatModifiers | BaseStats)[]): StatModifiers {
  const result: StatModifiers = {};
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      result[key] = (result[key] || 0) + value;
    }
  }
  return result;
}

export function computeStatDelta(a: StatModifiers, b: StatModifiers): StatModifiers {
  const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const delta: StatModifiers = {};
  for (const key of allKeys) {
    delta[key] = (b[key] || 0) - (a[key] || 0);
  }
  return delta;
}

export function formatStatValue(value: number): string {
  if (value > 0) return `+${value}`;
  return `${value}`;
}

/**
 * Phase 2 optimizer stub: pruning/heuristics/branch-and-bound.
 * Brute-force only as fallback for small search spaces.
 *
 * Given target stat thresholds and an inventory of gear, find the
 * top N loadouts that meet or exceed targets while maximizing a
 * scoring function. Phase 1 only computes totals from manually
 * selected gear — this auto-optimizer activates in Phase 2 when
 * live inventory is available via Bungie API.
 */
export interface OptimizerTargets {
  [statName: string]: number; // minimum threshold per stat
}

export interface OptimizerResult {
  coreId: string | null;
  implantIds: string[];
  totalStats: StatModifiers;
  score: number;
}

export function scoreLoadout(stats: StatModifiers, targets: OptimizerTargets): number {
  let score = 0;
  for (const [stat, threshold] of Object.entries(targets)) {
    const value = stats[stat] || 0;
    if (value >= threshold) {
      score += value;
    } else {
      score -= (threshold - value) * 2; // penalize unmet targets
    }
  }
  return score;
}

export function optimizeLoadout(
  baseStats: BaseStats,
  cores: Core[],
  implants: Implant[],
  targets: OptimizerTargets,
  topN: number = 5
): OptimizerResult[] {
  // Phase 2: implement branch-and-bound with pruning.
  // For now, return empty — the manual build planner handles Phase 1.
  void baseStats;
  void cores;
  void implants;
  void targets;
  void topN;
  return [];
}
