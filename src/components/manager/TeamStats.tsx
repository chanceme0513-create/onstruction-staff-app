"use client";

const STATS = [
  { label: "チーム感謝数", value: "156", trend: 25 },
  { label: "コンディション提出率", value: "92%", trend: 8 },
  { label: "平均モチベーション", value: "4.1", trend: -3 },
  { label: "職場環境スコア", value: "4.5", trend: 12 },
];

export function TeamStats() {
  return (
    <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">チーム統計（今週）</h2>
      </div>
      <div className="grid grid-cols-2 divide-x divide-y divide-slate-100">
        {STATS.map((stat, i) => (
          <div key={i} className="px-4 py-3">
            <p className="text-[11px] text-slate-400 mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            <span className={`text-[11px] font-medium ${stat.trend > 0 ? "text-emerald-600" : "text-red-500"}`}>
              {stat.trend > 0 ? "↑" : "↓"} {Math.abs(stat.trend)}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
