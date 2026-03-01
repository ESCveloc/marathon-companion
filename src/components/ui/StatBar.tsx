interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

export function StatBar({ label, value, maxValue = 100, color }: StatBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-marathon-text-dim">{label}</span>
        <span className="text-marathon-text font-medium">{value}</span>
      </div>
      <div className="h-2 bg-marathon-navy rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: color || "#e87d0d",
          }}
        />
      </div>
    </div>
  );
}
