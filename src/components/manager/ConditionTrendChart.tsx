"use client";

type TrendData = {
  date: string;
  avgScore: number;
};

const TREND_DATA: TrendData[] = [
  { date: "6/1", avgScore: 3.8 },
  { date: "6/2", avgScore: 4.1 },
  { date: "6/3", avgScore: 3.9 },
  { date: "6/4", avgScore: 4.2 },
  { date: "6/5", avgScore: 3.7 },
  { date: "6/6", avgScore: 4.0 },
  { date: "6/7", avgScore: 3.9 },
];

export function ConditionTrendChart() {
  const maxScore = 5;
  const minScore = 0;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">
        📈 週間コンディション推移
      </h2>

      <div className="relative h-48">
        {/* Y軸ラベル */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-400">
          {[5, 4, 3, 2, 1].map((score) => (
            <div key={score} className="text-right">
              {score}
            </div>
          ))}
        </div>

        {/* グラフエリア */}
        <div className="ml-10 h-full relative">
          {/* グリッドライン */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="border-t border-gray-100" />
            ))}
          </div>

          {/* データポイントと線 */}
          <svg className="absolute inset-0 w-full h-full">
            {/* 折れ線 */}
            <polyline
              points={TREND_DATA.map((d, i) => {
                const x = (i / (TREND_DATA.length - 1)) * 100;
                const y = 100 - ((d.avgScore - minScore) / (maxScore - minScore)) * 100;
                return `${x}%,${y}%`;
              }).join(" ")}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              className="drop-shadow-sm"
            />

            {/* ドット */}
            {TREND_DATA.map((d, i) => {
              const x = (i / (TREND_DATA.length - 1)) * 100;
              const y = 100 - ((d.avgScore - minScore) / (maxScore - minScore)) * 100;
              return (
                <circle
                  key={i}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="5"
                  fill="#3b82f6"
                  className="drop-shadow"
                />
              );
            })}
          </svg>

          {/* X軸ラベル */}
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-400">
            {TREND_DATA.map((d, i) => (
              <div key={i}>{d.date}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        <div className="bg-green-50 rounded-lg px-3 py-2 text-center">
          <p className="text-xs text-gray-500 mb-1">今週平均</p>
          <p className="text-xl font-bold text-green-600">3.9</p>
        </div>
        <div className="bg-blue-50 rounded-lg px-3 py-2 text-center">
          <p className="text-xs text-gray-500 mb-1">先週比</p>
          <p className="text-xl font-bold text-blue-600">+0.2</p>
        </div>
        <div className="bg-purple-50 rounded-lg px-3 py-2 text-center">
          <p className="text-xs text-gray-500 mb-1">最高スコア</p>
          <p className="text-xl font-bold text-purple-600">4.2</p>
        </div>
      </div>
    </section>
  );
}
