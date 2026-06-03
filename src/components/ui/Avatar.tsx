type Size = "sm" | "md" | "lg" | "xl";

type Props = {
  name: string;
  src?: string | null;
  size?: Size;
  color?: "orange" | "teal" | "indigo" | "auto";
};

const sizeClasses: Record<Size, { wrapper: string; text: string }> = {
  sm: { wrapper: "w-8  h-8  text-sm",  text: "text-sm"  },
  md: { wrapper: "w-10 h-10 text-base", text: "text-base" },
  lg: { wrapper: "w-14 h-14 text-xl",  text: "text-xl"  },
  xl: { wrapper: "w-20 h-20 text-3xl", text: "text-3xl" },
};

// 名前の先頭文字から自動で色を決定
function autoColor(name: string): string {
  const colors = [
    "bg-orange-100 text-orange-600",
    "bg-teal-100 text-teal-600",
    "bg-indigo-100 text-indigo-600",
    "bg-amber-100 text-amber-600",
    "bg-pink-100 text-pink-600",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

const colorClasses: Record<string, string> = {
  orange: "bg-orange-100 text-orange-600",
  teal:   "bg-teal-100 text-teal-600",
  indigo: "bg-indigo-100 text-indigo-600",
};

export function Avatar({ name, src, size = "md", color = "auto" }: Props) {
  const { wrapper } = sizeClasses[size];
  const colorClass = color === "auto" ? autoColor(name) : (colorClasses[color] ?? autoColor(name));

  return (
    <div
      className={`${wrapper} rounded-full flex items-center justify-center font-bold overflow-hidden shrink-0 ${colorClass}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <span>{name[0]}</span>
      )}
    </div>
  );
}
