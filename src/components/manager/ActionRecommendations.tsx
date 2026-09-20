"use client";

type Recommendation = {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action: string;
};

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "1",
    priority: "high",
    title: "佐藤 健へのフォローアップ",
    description: "3日連続で低スコア。個別面談を実施し、負担軽減を検討してください。",
    action: "面談スケジュール",
  },
  {
    id: "2",
    priority: "medium",
    title: "モチベーション向上施策",
    description: "チーム全体のモチベーションが低下傾向。チームビルディングイベントの開催を検討。",
    action: "イベント計画",
  },
  {
    id: "3",
    priority: "low",
    title: "感謝文化の定着",
    description: "感謝送信回数が増加中。この流れを維持するため、月間MVPの表彰を。",
    action: "表彰準備",
  },
];

const PRIORITY_LABEL: Record<string, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

const PRIORITY_BADGE: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

export function ActionRecommendations() {
  return (
    <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">推奨アクション</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {RECOMMENDATIONS.map((rec) => (
          <div key={rec.id} className="px-4 py-3 flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-slate-800">{rec.title}</p>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${PRIORITY_BADGE[rec.priority]}`}>
                  優先度:{PRIORITY_LABEL[rec.priority]}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">{rec.description}</p>
              <button className="text-xs border border-slate-200 text-slate-600 px-3 py-1 rounded hover:bg-slate-50">
                {rec.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
