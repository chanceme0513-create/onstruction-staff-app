type Variant = "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  dot?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary:   "bg-orange-100 text-orange-700",
  secondary: "bg-teal-100 text-teal-700",
  success:   "bg-green-100 text-green-700",
  warning:   "bg-amber-100 text-amber-700",
  danger:    "bg-red-100 text-red-700",
  neutral:   "bg-gray-100 text-gray-600",
};

const dotClasses: Record<Variant, string> = {
  primary:   "bg-orange-500",
  secondary: "bg-teal-500",
  success:   "bg-green-500",
  warning:   "bg-amber-500",
  danger:    "bg-red-500",
  neutral:   "bg-gray-400",
};

export function Badge({ children, variant = "neutral", dot = false }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${variantClasses[variant]}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClasses[variant]}`} />
      )}
      {children}
    </span>
  );
}

// 数値通知バッジ（ヘッダーアイコン等に重ねるタイプ）
export function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
      {count > 99 ? "99+" : count}
    </span>
  );
}
