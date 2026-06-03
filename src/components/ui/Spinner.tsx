type Size = "sm" | "md" | "lg";
type Color = "primary" | "white" | "gray";

type Props = {
  size?: Size;
  color?: Color;
  label?: string;
};

const sizeClasses: Record<Size, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-3",
  lg: "w-12 h-12 border-4",
};

const colorClasses: Record<Color, string> = {
  primary: "border-orange-200 border-t-primary",
  white:   "border-white/30 border-t-white",
  gray:    "border-gray-200 border-t-gray-500",
};

export function Spinner({ size = "md", color = "primary", label }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        aria-label={label ?? "読み込み中"}
      />
      {label && <p className="text-sm text-gray-400">{label}</p>}
    </div>
  );
}

export function FullPageSpinner({ label = "読み込み中..." }: { label?: string }) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <Spinner size="lg" label={label} />
    </div>
  );
}
