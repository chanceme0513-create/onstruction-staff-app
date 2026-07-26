"use client";

const TOP_PERFORMERS = [
  { name: "山田 次郎", avatar: "👨‍💼", category: "最高スコア", value: "5.0" },
  { name: "田中 太郎", avatar: "🧑‍💼", category: "感謝送信数", value: "18回" },
  { name: "鈴木 誠",   avatar: "👨‍💼", category: "職場環境",   value: "5.0" },
];

export function TopPerformers() {
  return (
    <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">今週のMVP</h2>
      </div>

      <div className="divide-y divide-slate-100">
        {TOP_PERFORMERS.map((p, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm shrink-0">
              {p.avatar}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">{p.name}</p>
              <p className="text-[11px] text-slate-400">{p.category}</p>
            </div>
            <span className="text-sm font-bold text-slate-900">{p.value}</span>
          </div>
        ))}
      </div>

      <div className="px-4 py-2.5 bg-blue-50 border-t border-blue-100">
        <p className="text-xs text-blue-600">月末に表彰式を開催してモチベーションを高めましょう</p>
      </div>
    </section>
  );
}
