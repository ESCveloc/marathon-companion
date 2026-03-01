import { StatModifiers, BaseStats } from "@/lib/types";

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
