"use client";

import { StatBar } from "@/components/ui/StatBar";
import { STAT_LABELS } from "@/lib/constants";

interface StatSummaryProps {
  stats: Record<string, number>;
  title?: string;
}

export function StatSummary({ stats, title }: StatSummaryProps) {
  const sortedStats = Object.entries(stats).sort(([a], [b]) => a.localeCompare(b));

  if (sortedStats.length === 0) {
    return (
      <div className="card">
        {title && (
          <h3 className="text-lg font-bold text-marathon-text mb-3">{title}</h3>
        )}
        <p className="text-sm text-marathon-muted">No stats to display.</p>
      </div>
    );
  }

  return (
    <div className="card">
      {title && (
        <h3 className="text-lg font-bold text-marathon-text mb-4">{title}</h3>
      )}
      <div className="space-y-3">
        {sortedStats.map(([stat, value]) => (
          <StatBar
            key={stat}
            label={STAT_LABELS[stat] || stat}
            value={value}
          />
        ))}
      </div>
    </div>
  );
}
