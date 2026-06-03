type Props = {
  value: number;
  max: number;
  label: string;
  size?: number;
  color?: string;
};

export function ScoreMeter({
  value,
  max,
  label,
  size = 100,
  color = "#FF7A35",
}: Props) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference * (1 - pct);
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        {/* 背景トラック */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={10}
        />
        {/* プログレス */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        {/* 中央テキスト（rotate で打ち消し） */}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="central"
          className="rotate-90"
          style={{
            transform: `rotate(90deg)`,
            transformOrigin: `${center}px ${center}px`,
            fontSize: size * 0.22,
            fontWeight: 800,
            fill: color,
          }}
        >
          {value}
        </text>
      </svg>
      <span className="text-xs font-medium text-gray-500">{label}</span>
    </div>
  );
}
