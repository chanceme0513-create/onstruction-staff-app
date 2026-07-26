export function TodayInfo() {
  const items = [
    { label: "天気", value: "晴れ", sub: "最高 28°C" },
    { label: "進行中プロジェクト", value: "3件", sub: "進行中" },
    { label: "出勤人数", value: "12名", sub: "全員出勤" },
    { label: "進捗状況", value: "順調", sub: "予定通り" },
  ];

  return (
    <section className="bg-white rounded-lg border border-slate-200 p-4">
      <h2 className="text-sm font-semibold text-slate-800 mb-3">本日の業務概況</h2>

      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item.label} className="border border-slate-100 rounded p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">{item.label}</p>
            <p className="text-base font-bold text-slate-800">{item.value}</p>
            <p className="text-[11px] text-slate-400">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded px-3 py-2">
        <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        今日は気温が高めです。こまめに水分補給をしましょう
      </div>
    </section>
  );
}
