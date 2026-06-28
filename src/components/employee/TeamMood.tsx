"use client";

type Props = {
  avgScore: number;
  totalMembers: number;
  checkedIn: number;
};

export function TeamMood({ avgScore, totalMembers, checkedIn }: Props) {
  const getLabel = (score: number) => {
    if (score >= 4.5) return "良好";
    if (score >= 4.0) return "好調";
    if (score >= 3.5) return "まずまず";
    if (score >= 3.0) return "やや低め";
    return "要注意";
  };

  const getEmoji = (score: number) => {
    if (score >= 4.5) return "😄";
    if (score >= 4.0) return "🙂";
    if (score >= 3.5) return "😐";
    if (score >= 3.0) return "😕";
    return "😟";
  };

  const barColor = avgScore >= 4.5
    ? "bg-emerald-400"
    : avgScore >= 3.5
    ? "bg-[#e8836e]"
    : "bg-red-400";

  const labelColor = avgScore >= 4.5
    ? "text-emerald-600 bg-emerald-50 border-emerald-200"
    : avgScore >= 3.5
    ? "text-[#e8836e] bg-orange-50 border-orange-200"
    : "text-red-600 bg-red-50 border-red-200";

  return (
    <section className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#fdf1ee] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-[#e8836e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-stone-800">チームの雰囲気</h2>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${labelColor}`}>
          {getLabel(avgScore)}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-end gap-1.5">
          <span className="text-4xl font-black text-stone-800">{avgScore.toFixed(1)}</span>
          <span className="text-sm text-stone-400 pb-1">/ 5.0</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-3xl">{getEmoji(avgScore)}</span>
          <p className="text-[10px] text-stone-400">{checkedIn}/{totalMembers}人 報告済み</p>
        </div>
      </div>

      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${(avgScore / 5) * 100}%` }}
        />
      </div>
    </section>
  );
}
