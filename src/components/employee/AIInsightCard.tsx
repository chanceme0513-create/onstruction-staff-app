"use client";

type Props = {
  userName?: string;
};

export function AIInsightCard({ userName = "あなた" }: Props) {
  return (
    <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-100 flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-[#fde8e2] flex items-center justify-center">
          <svg className="w-3 h-3 text-[#e8836e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-slate-800">AI 分析サマリー</span>
        <span className="ml-auto text-[10px] text-slate-400">過去30日間</span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* 総合評価 */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 shrink-0">
            <span className="text-xs font-bold text-emerald-600">A+</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">総合パフォーマンス：優秀</p>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
              顧客・チーム両面でスコアが高く、今月は特に評価が伸びています。
            </p>
          </div>
        </div>

        {/* インサイト一覧 */}
        <div className="flex flex-col gap-2.5">
          <InsightRow
            icon="customer"
            label="顧客対応"
            value="上位10%"
            detail="「説明の丁寧さ」が先月比+12%"
            color="orange"
          />
          <InsightRow
            icon="team"
            label="チーム連携"
            value="安定高評価"
            detail="同僚からのサンクス受信数が平均の2.1倍"
            color="blue"
          />
          <InsightRow
            icon="trend"
            label="コンディション"
            value="週平均 4.1"
            detail="先週比 +0.3。水曜のスコアが改善傾向"
            color="emerald"
          />
        </div>

        {/* AIコメント */}
        <div className="mt-1 bg-[#fdf1ee] rounded-lg px-3 py-2.5 border border-[#f5c9be]">
          <p className="text-[11px] text-[#b85e48] leading-relaxed">
            <span className="font-bold">AIコメント：</span>
            {userName.split(" ")[0]}さんの「親切な対応」タグ獲得数は先月から継続増加中です。この強みをチーム内で共有する機会を設けることで、チーム全体のスコア向上が期待できます。
          </p>
        </div>
      </div>
    </section>
  );
}

type InsightRowProps = {
  icon: "customer" | "team" | "trend";
  label: string;
  value: string;
  detail: string;
  color: "orange" | "blue" | "emerald";
};

function InsightRow({ icon, label, value, detail, color }: InsightRowProps) {
  const colorMap = {
    orange: "text-orange-500 bg-orange-50",
    blue: "text-blue-500 bg-blue-50",
    emerald: "text-emerald-500 bg-emerald-50",
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        {icon === "customer" && (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
        {icon === "team" && (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
        {icon === "trend" && (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-700">{label}</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colorMap[color]}`}>{value}</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">{detail}</p>
      </div>
    </div>
  );
}
