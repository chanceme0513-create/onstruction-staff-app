"use client";

const TREND_DATA = [
  { date: "6/1", avgScore: 3.8 },
  { date: "6/2", avgScore: 4.1 },
  { date: "6/3", avgScore: 3.9 },
  { date: "6/4", avgScore: 4.2 },
  { date: "6/5", avgScore: 3.7 },
  { date: "6/6", avgScore: 4.0 },
  { date: "6/7", avgScore: 3.9 },
];

export function ConditionTrendChart() {
  return (
    <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">週間コンディション推移</h2>
      </div>

      <div className="p-4">
        <div className="relative h-40">
          {/* Y軸 */}
          <div className="absolute left-0 top-0 bottom-6 w-6 flex flex-col justify-between text-[10px] text-slate-300">
            {[5, 4, 3, 2, 1].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>

          {/* グラフエリア */}
          <div className="ml-8 h-full relative">
            <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
              {[0,1,2,3,4].map((i) => (
                <div key={i} className="border-t border-slate-100" />
              ))}
            </div>

            <svg className="absolute inset-x-0 top-0 bottom-6 w-full" style={{ height: "calc(100% - 24px)" }}>
              <polyline
                points={TREND_DATA.map((d, i) => {
                  const x = (i / (TREND_DATA.length - 1)) * 100;
                  const y = 100 - ((d.avgScore / 5) * 100);
                  return `${x}%,${y}%`;
                }).join(" ")}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.5"
              />
              {TREND_DATA.map((d, i) => {
                const x = (i / (TREND_DATA.length - 1)) * 100;
                const y = 100 - ((d.avgScore / 5) * 100);
                return (
                  <circle key={i} cx={`${x}%`} cy={`${y}%`} r="3.5" fill="#2563eb" />
                );
              })}
            </svg>

            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-slate-400">
              {TREND_DATA.map((d, i) => (
                <span key={i}>{d.date}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 border border-slate-100 rounded">
          <div className="px-3 py-2 text-center">
            <p className="text-[11px] text-slate-400 mb-0.5">今週平均</p>
            <p className="text-base font-bold text-slate-900">3.9</p>
          </div>
          <div className="px-3 py-2 text-center">
            <p className="text-[11px] text-slate-400 mb-0.5">先週比</p>
            <p className="text-base font-bold text-emerald-600">+0.2</p>
          </div>
          <div className="px-3 py-2 text-center">
            <p className="text-[11px] text-slate-400 mb-0.5">最高スコア</p>
            <p className="text-base font-bold text-slate-900">4.2</p>
          </div>
        </div>
      </div>
    </section>
  );
}
