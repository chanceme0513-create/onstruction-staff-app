"use client";

type StatItem = {
  label: string;
  value: string;
  trend: number;
  icon: string;
  color: string;
};

const STATS: StatItem[] = [
  {
    label: "チーム感謝数",
    value: "156",
    trend: 25,
    icon: "💚",
    color: "green",
  },
  {
    label: "コンディション提出率",
    value: "92%",
    trend: 8,
    icon: "📊",
    color: "blue",
  },
  {
    label: "平均モチベーション",
    value: "4.1",
    trend: -3,
    icon: "🔥",
    color: "orange",
  },
  {
    label: "安全スコア",
    value: "4.5",
    trend: 12,
    icon: "⚠️",
    color: "yellow",
  },
];

export function TeamStats() {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">📊 チーム統計（今週）</h2>

      <div className="grid grid-cols-2 gap-4">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${
              stat.color === "green"
                ? "from-green-50 to-green-100"
                : stat.color === "blue"
                  ? "from-blue-50 to-blue-100"
                  : stat.color === "orange"
                    ? "from-orange-50 to-orange-100"
                    : "from-yellow-50 to-yellow-100"
            } rounded-xl p-4 border ${
              stat.color === "green"
                ? "border-green-200"
                : stat.color === "blue"
                  ? "border-blue-200"
                  : stat.color === "orange"
                    ? "border-orange-200"
                    : "border-yellow-200"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-3xl">{stat.icon}</span>
              <div
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.trend > 0
                    ? "bg-green-100 text-green-700"
                    : stat.trend < 0
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                {stat.trend > 0 ? "↑" : stat.trend < 0 ? "↓" : "→"}
                {Math.abs(stat.trend)}%
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
