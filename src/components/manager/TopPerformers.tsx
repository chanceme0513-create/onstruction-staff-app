"use client";

type Performer = {
  id: string;
  name: string;
  avatar: string;
  category: string;
  value: string;
  badge: string;
};

const TOP_PERFORMERS: Performer[] = [
  {
    id: "1",
    name: "山田 次郎",
    avatar: "👨‍🔧",
    category: "最高スコア",
    value: "5.0",
    badge: "🏆",
  },
  {
    id: "2",
    name: "田中 太郎",
    avatar: "👷",
    category: "感謝送信",
    value: "18回",
    badge: "💚",
  },
  {
    id: "3",
    name: "鈴木 誠",
    avatar: "👨‍💼",
    category: "安全意識",
    value: "5.0",
    badge: "⚠️",
  },
];

export function TopPerformers() {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">⭐ 今週のMVP</h2>

      <div className="flex flex-col gap-3">
        {TOP_PERFORMERS.map((performer) => (
          <div
            key={performer.id}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{performer.avatar}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{performer.name}</p>
                <p className="text-xs text-gray-600">{performer.category}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-800">{performer.value}</p>
                <span className="text-2xl">{performer.badge}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-center">
        <p className="text-xs text-blue-700">
          💡 月末に表彰式を開催して、チームのモチベーションを高めましょう
        </p>
      </div>
    </section>
  );
}
