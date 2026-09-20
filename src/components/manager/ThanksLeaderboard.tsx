"use client";

const LEADERBOARD = [
  { rank: 1, name: "田中 太郎", avatar: "🧑‍💼", sent: 18, received: 15 },
  { rank: 2, name: "山田 次郎", avatar: "👨‍💼", sent: 15, received: 24 },
  { rank: 3, name: "佐藤 健", avatar: "👩‍💼", sent: 12, received: 8 },
  { rank: 4, name: "鈴木 誠", avatar: "👨‍💼", sent: 10, received: 12 },
];

const RANK_STYLE: Record<number, string> = {
  1: "bg-amber-100 text-amber-700",
  2: "bg-slate-200 text-slate-700",
  3: "bg-orange-100 text-orange-700",
};

export function ThanksLeaderboard() {
  const totalSent = LEADERBOARD.reduce((sum, item) => sum + item.sent, 0);
  const avgSent = (totalSent / LEADERBOARD.length).toFixed(1);

  return (
    <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">感謝ランキング（今週）</h2>
      </div>

      <div className="divide-y divide-slate-100">
        {LEADERBOARD.map((item) => (
          <div key={item.rank} className="flex items-center gap-3 px-4 py-3">
            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 ${RANK_STYLE[item.rank] ?? "bg-slate-100 text-slate-500"}`}>
              {item.rank}
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-sm shrink-0">
              {item.avatar}
            </div>
            <p className="text-sm font-medium text-slate-800 flex-1">{item.name}</p>
            <div className="flex gap-4 text-right text-xs">
              <div>
                <p className="text-slate-400">送信</p>
                <p className="font-bold text-slate-700">{item.sent}</p>
              </div>
              <div>
                <p className="text-slate-400">受信</p>
                <p className="font-bold text-slate-700">{item.received}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex gap-6 text-xs text-slate-500">
        <span>総送信数 <strong className="text-slate-800">{totalSent}</strong></span>
        <span>1人平均 <strong className="text-slate-800">{avgSent}</strong></span>
      </div>
    </section>
  );
}
