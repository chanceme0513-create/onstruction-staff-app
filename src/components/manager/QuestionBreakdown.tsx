"use client";

type QuestionScore = {
  question: string;
  avgScore: number;
  emoji: string;
};

const QUESTION_SCORES: QuestionScore[] = [
  { question: "体調", avgScore: 4.2, emoji: "💪" },
  { question: "進捗", avgScore: 4.0, emoji: "🔨" },
  { question: "コミュニケーション", avgScore: 3.8, emoji: "💬" },
  { question: "安全面", avgScore: 4.5, emoji: "⚠️" },
  { question: "モチベーション", avgScore: 3.6, emoji: "🔥" },
];

export function QuestionBreakdown() {
  const maxScore = 5;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">
        📋 質問別スコア分析
      </h2>

      <div className="flex flex-col gap-3">
        {QUESTION_SCORES.map((item, i) => {
          const percentage = (item.avgScore / maxScore) * 100;
          const isLow = item.avgScore < 3.5;

          return (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.emoji}</span>
                  <p className="text-sm font-medium text-gray-700">{item.question}</p>
                </div>
                <p
                  className={`text-sm font-bold ${
                    isLow ? "text-red-600" : "text-gray-700"
                  }`}
                >
                  {item.avgScore.toFixed(1)}
                </p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isLow ? "bg-red-400" : percentage >= 80 ? "bg-green-400" : "bg-blue-400"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
        <p className="text-xs text-yellow-700">
          ⚠️ <span className="font-semibold">モチベーション</span>が低下傾向です。
          チームビルディング活動を検討しましょう。
        </p>
      </div>
    </section>
  );
}
