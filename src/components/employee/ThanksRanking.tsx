"use client";

type RankingItem = {
  rank: number;
  name: string;
  avatar: string;
  thanksCount: number;
  isMe?: boolean;
};

const DUMMY_RANKING: RankingItem[] = [
  { rank: 1, name: "山田リーダー", avatar: "👨‍🔧", thanksCount: 24 },
  { rank: 2, name: "田中 太郎", avatar: "👷", thanksCount: 18, isMe: true },
  { rank: 3, name: "佐藤", avatar: "🧑‍🔧", thanksCount: 15 },
  { rank: 4, name: "鈴木", avatar: "👨‍💼", thanksCount: 12 },
  { rank: 5, name: "高橋", avatar: "🧑‍🏭", thanksCount: 9 },
];

export function ThanksRanking() {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">🏆 今週の感謝ランキング</h2>
      <p className="text-xs text-gray-500 mb-4">
        感謝を送った数でランキング！上位を目指そう
      </p>

      <div className="flex flex-col gap-2">
        {DUMMY_RANKING.map((item) => (
          <div
            key={item.rank}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
              item.isMe
                ? "bg-blue-50 border-2 border-blue-300"
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
              <p className={`text-sm font-semibold ${item.isMe ? "text-blue-700" : "text-gray-800"}`}>
                {item.name} {item.isMe && "（あなた）"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-700">{item.thanksCount}</p>
              <p className="text-[10px] text-gray-500">回送信</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg px-4 py-3">
        <p className="text-xs text-center text-gray-700">
          💡 <span className="font-semibold">あと6回</span>で1位！頑張りましょう
        </p>
      </div>
    </section>
  );
}
