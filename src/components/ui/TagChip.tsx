"use client";

type Props = {
  emoji: string;
  label: string;
  selected?: boolean;
  count?: number;
  onClick?: () => void;
  readonly?: boolean;
};

export function TagChip({ emoji, label, selected = false, count, onClick, readonly = false }: Props) {
  const base = `
    inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium
    transition-all duration-150
  `;

  const interactive = !readonly
    ? "cursor-pointer active:scale-95"
    : "cursor-default";

  const appearance = selected
    ? "border-2 border-primary bg-primary text-white shadow-sm"
    : readonly
    ? "border border-gray-200 bg-white text-gray-600"
    : "border-2 border-gray-200 bg-white text-gray-600 hover:border-primary-light hover:bg-orange-50";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={readonly && !onClick}
      className={`${base} ${interactive} ${appearance}`}
    >
      <span className="text-base leading-none">{emoji}</span>
      <span>{label}</span>
      {selected && !count && <span className="opacity-80 text-xs">✓</span>}
      {count !== undefined && (
        <span
          className={`ml-0.5 text-xs font-bold tabular-nums ${
            selected ? "text-white/80" : "text-primary"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
