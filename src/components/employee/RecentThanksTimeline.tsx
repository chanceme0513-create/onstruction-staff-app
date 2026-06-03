"use client";

type ThanksItem = {
  id: string;
  from: string;
  to: string;
  emoji: string;
  tag: string;
  time: string;
};

const RECENT_THANKS: ThanksItem[] = [
  {
    id: "1",
    from: "山田リーダー",
    to: "佐藤",
    emoji: "💪",
    tag: "頼りになる",
    time: "5分前",
  },
  {
    id: "2",
    from: "鈴木",
    to: "田中 太郎",
    emoji: "🤝",
    tag: "サポート上手",
    time: "12分前",
  },
  {
    id: "3",
    from: "高橋",
    to: "山田リーダー",
    emoji: "✨",
    tag: "気配り",
    time: "23分前",
  },
  {
    id: "4",
    from: "佐藤",
    to: "鈴木",
    emoji: "⚡",
    tag: "作業が速い",
    time: "35分前",
  },
];

export function RecentThanksTimeline() {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        💬 最近のチーム感謝
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        チーム全体で感謝が飛び交っています！
      </p>

      <div className="flex flex-col gap-2">
        {RECENT_THANKS.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 border border-gray-100 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800">
                <span className="font-semibold">{item.from}</span>
                {" → "}
                <span className="font-semibold">{item.to}</span>
              </p>
              <p className="text-xs text-gray-500">{item.tag}</p>
            </div>
            <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          今日はチーム全体で <span className="font-bold text-blue-600">32回</span> の感謝が送られました 🎉
        </p>
      </div>
    </section>
  );
}
