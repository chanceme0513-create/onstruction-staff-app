"use client";

type Recommendation = {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action: string;
  icon: string;
};

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "1",
    priority: "high",
    title: "佐藤 健へのフォローアップ",
    description: "3日連続で低スコア。個別面談を実施し、負担軽減を検討してください。",
    action: "面談スケジュール",
    icon: "🚨",
  },
  {
    id: "2",
    priority: "medium",
    title: "モチベーション向上施策",
    description: "チーム全体のモチベーションが低下傾向。チームビルディングイベントの開催を検討。",
    action: "イベント計画",
    icon: "🎉",
  },
  {
    id: "3",
    priority: "low",
    title: "感謝文化の定着",
    description: "感謝送信回数が増加中。この流れを維持するため、月間MVPの表彰を。",
    action: "表彰準備",
    icon: "🏆",
  },
];

export function ActionRecommendations() {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">
        💡 推奨アクション
      </h2>

      <div className="flex flex-col gap-3">
        {RECOMMENDATIONS.map((rec) => (
          <div
            key={rec.id}
            className={`rounded-xl px-4 py-3 border ${
              rec.priority === "high"
                ? "bg-red-50 border-red-200"
                : rec.priority === "medium"
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{rec.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p
                    className={`text-sm font-semibold ${
                      rec.priority === "high"
                        ? "text-red-700"
                        : rec.priority === "medium"
                          ? "text-yellow-700"
                          : "text-blue-700"
                    }`}
                  >
                    {rec.title}
                  </p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      rec.priority === "high"
                        ? "bg-red-200 text-red-700"
                        : rec.priority === "medium"
                          ? "bg-yellow-200 text-yellow-700"
                          : "bg-blue-200 text-blue-700"
                    }`}
                  >
                    {rec.priority === "high"
                      ? "優先度:高"
                      : rec.priority === "medium"
                        ? "優先度:中"
                        : "優先度:低"}
                  </span>
                </div>
                <p
                  className={`text-xs mb-2 ${
                    rec.priority === "high"
                      ? "text-red-600"
                      : rec.priority === "medium"
                        ? "text-yellow-600"
                        : "text-blue-600"
                  }`}
                >
                  {rec.description}
                </p>
                <button className="text-xs bg-white hover:bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-300 font-medium text-gray-700 transition-colors">
                  {rec.action}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
