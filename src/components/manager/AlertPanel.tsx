"use client";

type Alert = {
  id: string;
  type: "warning" | "info" | "danger";
  icon: string;
  title: string;
  description: string;
  employeeName?: string;
};

const ALERTS: Alert[] = [
  {
    id: "1",
    type: "danger",
    icon: "🚨",
    title: "要注意：佐藤 健",
    description: "3日連続でスコア3.0未満。体調不良の可能性があります。",
    employeeName: "佐藤 健",
  },
  {
    id: "2",
    type: "warning",
    icon: "⚠️",
    title: "コンディション低下傾向",
    description: "チーム平均スコアが昨日より0.3ポイント低下しています。",
  },
  {
    id: "3",
    type: "info",
    icon: "💡",
    title: "感謝の活性化",
    description: "今週の感謝送信回数が先週比+25%。チームの雰囲気が良好です。",
  },
];

export function AlertPanel() {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">🔔 注意事項・インサイト</h2>

      <div className="flex flex-col gap-3">
        {ALERTS.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-xl px-4 py-3 border-l-4 ${
              alert.type === "danger"
                ? "bg-red-50 border-red-400"
                : alert.type === "warning"
                  ? "bg-yellow-50 border-yellow-400"
                  : "bg-blue-50 border-blue-400"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{alert.icon}</span>
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold mb-1 ${
                    alert.type === "danger"
                      ? "text-red-700"
                      : alert.type === "warning"
                        ? "text-yellow-700"
                        : "text-blue-700"
                  }`}
                >
                  {alert.title}
                </p>
                <p
                  className={`text-xs ${
                    alert.type === "danger"
                      ? "text-red-600"
                      : alert.type === "warning"
                        ? "text-yellow-600"
                        : "text-blue-600"
                  }`}
                >
                  {alert.description}
                </p>
              </div>
              {alert.employeeName && (
                <button className="text-xs bg-white hover:bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 font-medium text-gray-700 transition-colors">
                  確認
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
