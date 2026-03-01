import { RARITY_COLORS } from "@/lib/constants";

interface RarityBadgeProps {
  rarity: string;
  className?: string;
}

export function RarityBadge({ rarity, className = "" }: RarityBadgeProps) {
  const color = RARITY_COLORS[rarity] || "#9ca3af";

  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}
      style={{
        color: color,
        backgroundColor: `${color}20`,
      }}
    >
      {rarity}
    </span>
  );
}
