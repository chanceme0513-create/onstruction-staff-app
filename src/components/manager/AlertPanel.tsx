"use client";

type Alert = {
  id: string;
  type: "warning" | "info" | "danger";
  title: string;
  description: string;
  hasAction?: boolean;
};

const ALERTS: Alert[] = [
  {
    id: "1",
    type: "danger",
    title: "要注意：佐藤 健",
    description: "3日連続でスコア3.0未満。体調不良の可能性があります。",
    hasAction: true,
  },
  {
    id: "2",
    type: "warning",
    title: "コンディション低下傾向",
    description: "チーム平均スコアが昨日より0.3ポイント低下しています。",
  },
  {
    id: "3",
    type: "info",
    title: "感謝の活性化",
    description: "今週の感謝送信回数が先週比+25%。チームの雰囲気が良好です。",
  },
];

const TYPE_STYLES = {
  danger: {
    bar: "bg-red-500",
    title: "text-red-700",
    desc: "text-red-600",
    wrap: "bg-red-50 border-red-100",
  },
  warning: {
    bar: "bg-amber-400",
    title: "text-amber-700",
    desc: "text-amber-600",
    wrap: "bg-amber-50 border-amber-100",
  },
  info: {
    bar: "bg-blue-400",
    title: "text-blue-700",
    desc: "text-blue-600",
    wrap: "bg-blue-50 border-blue-100",
  },
};

export function AlertPanel() {
  return (
    <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">インサイト</h2>
      </div>
      <div className="p-4 flex flex-col gap-2">
        {ALERTS.map((alert) => {
          const s = TYPE_STYLES[alert.type];
          return (
            <div key={alert.id} className={`flex gap-0 rounded border overflow-hidden ${s.wrap}`}>
              <div className={`w-1 shrink-0 ${s.bar}`} />
              <div className="flex-1 px-3 py-2.5 flex items-start justify-between gap-2">
                <div>
                  <p className={`text-xs font-semibold ${s.title}`}>{alert.title}</p>
                  <p className={`text-xs mt-0.5 ${s.desc}`}>{alert.description}</p>
                </div>
                {alert.hasAction && (
                  <button className="text-xs border border-slate-200 bg-white text-slate-600 px-2 py-1 rounded hover:bg-slate-50 shrink-0">
                    確認
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
