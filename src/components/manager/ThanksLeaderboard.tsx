"use client";

type LeaderItem = {
  rank: number;
  name: string;
  avatar: string;
  sent: number;
  received: number;
};

const LEADERBOARD: LeaderItem[] = [
  { rank: 1, name: "田中 太郎", avatar: "👷", sent: 18, received: 15 },
  { rank: 2, name: "山田 次郎", avatar: "👨‍🔧", sent: 15, received: 24 },
  { rank: 3, name: "佐藤 健", avatar: "🧑‍🔧", sent: 12, received: 8 },
  { rank: 4, name: "鈴木 誠", avatar: "👨‍💼", sent: 10, received: 12 },
];

export function ThanksLeaderboard() {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">
        🎖️ 感謝ランキング（今週）
      </h2>

      <div className="flex flex-col gap-2">
        {LEADERBOARD.map((item) => (
          <div
            key={item.rank}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
              item.rank === 1
                ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300"
                : "bg-gray-50 border border-gray-100"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                item.rank === 1
                  ? "bg-yellow-400 text-yellow-900"
                  : item.rank === 2
                    ? "bg-gray-300 text-gray-700"
                    : item.rank === 3
                      ? "bg-orange-300 text-orange-900"
                      : "bg-gray-200 text-gray-600"
              }`}
            >
              {item.rank}
            </div>
            <span className="text-2xl">{item.avatar}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">{item.name}</p>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500">送信</p>
                <p className="text-lg font-bold text-green-600">{item.sent}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">受信</p>
                <p className="text-lg font-bold text-blue-600">{item.received}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-green-50 rounded-lg px-3 py-2 text-center">
          <p className="text-xs text-gray-600 mb-1">総送信数</p>
          <p className="text-2xl font-bold text-green-600">
            {LEADERBOARD.reduce((sum, item) => sum + item.sent, 0)}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg px-3 py-2 text-center">
          <p className="text-xs text-gray-600 mb-1">1人平均</p>
          <p className="text-2xl font-bold text-blue-600">
            {(LEADERBOARD.reduce((sum, item) => sum + item.sent, 0) / LEADERBOARD.length).toFixed(1)}
          </p>
        </div>
      </div>
    </section>
  );
}
