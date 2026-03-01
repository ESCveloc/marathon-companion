interface StatDeltaProps {
  value: number;
  label?: string;
}

export function StatDelta({ value, label }: StatDeltaProps) {
  let colorClass: string;
  let displayValue: string;

  if (value > 0) {
    colorClass = "text-marathon-green";
    displayValue = `+${value}`;
  } else if (value < 0) {
    colorClass = "text-marathon-red";
    displayValue = `${value}`;
  } else {
    colorClass = "text-marathon-muted";
    displayValue = "0";
  }

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${colorClass}`}>
      {label && <span className="text-marathon-text-dim">{label}</span>}
      <span>{displayValue}</span>
    </span>
  );
}
