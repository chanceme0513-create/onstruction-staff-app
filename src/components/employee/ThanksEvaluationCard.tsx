type ThanksItem = {
  from: string;
  tag: string;
  emoji: string;
  comment?: string;
  date: string;
};

const TAG_SUMMARY = [
  { tag: "頼りになる", emoji: "💪", count: 12 },
  { tag: "技術が高い", emoji: "🔨", count: 8 },
  { tag: "教え方が上手", emoji: "📚", count: 6 },
  { tag: "サポートが上手", emoji: "🤝", count: 4 },
];

const RECENT_THANKS: ThanksItem[] = [
  {
    from: "山田リーダー",
    tag: "頼りになる",
    emoji: "💪",
    comment: "いつも率先して動いてくれて助かります。本当に頼りにしています。",
    date: "今日",
  },
  {
    from: "佐藤",
    tag: "技術が高い",
    emoji: "🔨",
    comment: "丁寧な仕上がりで毎回勉強になります。",
    date: "昨日",
  },
  {
    from: "鈴木",
    tag: "教え方が上手",
    emoji: "📚",
    comment: "先日の作業、わかりやすく教えてもらえて助かりました。",
    date: "2日前",
  },
  {
    from: "高橋",
    tag: "サポートが上手",
    emoji: "🤝",
    comment: "困った時にすぐ助けてくれました。ありがとうございます。",
    date: "3日前",
  },
];

const TOTAL_THIS_MONTH = TAG_SUMMARY.reduce((sum, t) => sum + t.count, 0);

export function ThanksEvaluationCard() {
  return (
    <section className="flex flex-col gap-3">
      {/* サマリーバナー */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-5 text-white shadow-sm">
        <p className="text-xs font-semibold opacity-80 mb-1">今月受け取った感謝</p>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-4xl font-bold">{TOTAL_THIS_MONTH}</span>
          <span className="text-sm opacity-80 mb-1">件</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {TAG_SUMMARY.map((t) => (
            <div
              key={t.tag}
              className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1"
            >
              <span className="text-sm">{t.emoji}</span>
              <span className="text-xs font-medium">{t.tag}</span>
              <span className="text-xs font-bold bg-white/30 rounded-full px-1.5">{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 最近の感謝コメント */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-xs font-semibold text-gray-500 px-1">最近のメッセージ</h3>
        {RECENT_THANKS.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              {/* アバター */}
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-base shrink-0 font-bold text-gray-500">
                {item.from[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-800">{item.from}</span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
                {/* タグ */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-base">{item.emoji}</span>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    {item.tag}
                  </span>
                </div>
                {/* コメント */}
                {item.comment && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
