"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type ThanksItem = {
  from: string;
  tag: string | null;
  message: string | null;
  date: string;
};

type Props = {
  userName: string;
};

const TAG_EMOJIS: Record<string, string> = {
  "助かりました": "🙏",
  "ありがとう": "😊",
  "お疲れ様でした": "💪",
  "よく頑張りました": "⭐",
};

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffDay = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDay === 0) return "今日";
  if (diffDay === 1) return "昨日";
  return `${diffDay}日前`;
}

export function ThanksEvaluationCard({ userName }: Props) {
  const [thanksList, setThanksList] = useState<ThanksItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("daily_reports")
      .select("staff_name, thanks_tag, thanks_message, submitted_at")
      .eq("thanks_sent_to", userName)
      .not("thanks_tag", "is", null)
      .order("submitted_at", { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (!error && data) {
          setThanksList(
            data.map((r) => ({
              from: r.staff_name,
              tag: r.thanks_tag,
              message: r.thanks_message,
              date: formatDate(r.submitted_at),
            }))
          );
        }
        setLoading(false);
      });
  }, [userName]);

  // タグ別の集計
  const tagCounts: Record<string, number> = {};
  thanksList.forEach((t) => {
    if (t.tag) tagCounts[t.tag] = (tagCounts[t.tag] ?? 0) + 1;
  });
  const tagSummary = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const total = thanksList.length;
  const recent = thanksList.slice(0, 4);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-5 flex items-center justify-center h-24">
        <div className="w-5 h-5 rounded-full border-4 border-white/40 border-t-white animate-spin" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-6 text-center">
        <p className="text-2xl mb-2">🙏</p>
        <p className="text-sm font-semibold text-gray-700">まだ感謝は届いていません</p>
        <p className="text-xs text-gray-400 mt-1">チームメンバーから感謝が届くとここに表示されます</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      {/* サマリーバナー */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-5 text-white shadow-sm">
        <p className="text-xs font-semibold opacity-80 mb-1">受け取った感謝</p>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-4xl font-bold">{total}</span>
          <span className="text-sm opacity-80 mb-1">件</span>
        </div>
        {tagSummary.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tagSummary.map(([tag, count]) => (
              <div key={tag} className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
                <span className="text-sm">{TAG_EMOJIS[tag] ?? "👍"}</span>
                <span className="text-xs font-medium">{tag}</span>
                <span className="text-xs font-bold bg-white/30 rounded-full px-1.5">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 最近の感謝コメント */}
      {recent.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h3 className="text-xs font-semibold text-gray-500 px-1">最近のメッセージ</h3>
          {recent.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-base shrink-0 font-bold text-gray-500">
                  {item.from[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-800">{item.from}</span>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                  {item.tag && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-base">{TAG_EMOJIS[item.tag] ?? "👍"}</span>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    </div>
                  )}
                  {item.message && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      &ldquo;{item.message}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
