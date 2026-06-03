"use client";

type Props = {
  sentToday: number;
  goal: number;
};

export function ThanksChallenge({ sentToday, goal }: Props) {
  const progress = (sentToday / goal) * 100;
  const isCompleted = sentToday >= goal;

  return (
    <section className="bg-gradient-to-r from-green-400 to-green-500 rounded-2xl p-5 text-white shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold mb-1">🎯 今日の感謝チャレンジ</h2>
          <p className="text-sm opacity-90">
            {isCompleted ? "目標達成！素晴らしい👏" : `あと${goal - sentToday}人に感謝を送ろう`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{sentToday}</p>
          <p className="text-xs opacity-80">/ {goal}人</p>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
        <div
          className="bg-white h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {isCompleted && (
        <div className="mt-3 text-center">
          <p className="text-sm font-semibold">🏆 +10ポイント獲得！</p>
        </div>
      )}
    </section>
  );
}
