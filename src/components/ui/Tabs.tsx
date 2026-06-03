"use client";

type Tab<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  tabs: Tab<T>[];
  current: T;
  onChange: (value: T) => void;
  variant?: "pill" | "underline";
};

export function Tabs<T extends string>({
  tabs,
  current,
  onChange,
  variant = "pill",
}: Props<T>) {
  if (variant === "underline") {
    return (
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              current === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
            current === tab.value
              ? "bg-primary text-white shadow-sm"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
