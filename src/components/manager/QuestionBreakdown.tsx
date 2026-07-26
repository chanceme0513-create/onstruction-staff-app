"use client";

const QUESTION_SCORES = [
  { question: "体調",             avgScore: 4.2 },
  { question: "進捗",             avgScore: 4.0 },
  { question: "コミュニケーション", avgScore: 3.8 },
  { question: "職場環境",          avgScore: 4.5 },
  { question: "モチベーション",    avgScore: 3.6 },
];

export function QuestionBreakdown() {
  return (
    <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">質問別スコア</h2>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {QUESTION_SCORES.map((item, i) => {
          const pct = (item.avgScore / 5) * 100;
          const isLow = item.avgScore < 3.5;
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-slate-700">{item.question}</p>
                <p className={`text-xs font-bold ${isLow ? "text-red-600" : "text-slate-700"}`}>
                  {item.avgScore.toFixed(1)}
                </p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${isLow ? "bg-red-400" : pct >= 80 ? "bg-emerald-400" : "bg-blue-400"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-100">
        <p className="text-xs text-amber-700">
          <strong>モチベーション</strong>が低下傾向です。チームビルディング活動を検討しましょう。
        </p>
      </div>
    </section>
  );
}
