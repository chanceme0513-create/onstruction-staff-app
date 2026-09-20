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

  const tagCounts: Record<string, number> = {};
  thanksList.forEach((t) => {
    if (t.tag) tagCounts[t.tag] = (tagCounts[t.tag] ?? 0) + 1;
  });
  const tagSummary = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const total = thanksList.length;
  const recent = thanksList.slice(0, 3);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-center h-20">
        <div className="w-4 h-4 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <section className="bg-white rounded-lg border border-slate-200 px-4 py-5 text-center">
        <p className="text-sm font-medium text-slate-600">まだ感謝は届いていません</p>
        <p className="text-xs text-slate-400 mt-1">チームメンバーから感謝が届くとここに表示されます</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">受け取った感謝</h2>
        <span className="text-xs font-bold text-blue-600">{total}件</span>
      </div>

      <div className="px-4 py-3">
        {tagSummary.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tagSummary.map(([tag, count]) => (
              <div key={tag} className="flex items-center gap-1 border border-slate-200 rounded px-2.5 py-1">
                <span className="text-xs text-slate-600">{tag}</span>
                <span className="text-xs font-bold text-blue-600 ml-1">{count}</span>
              </div>
            ))}
          </div>
        )}

        {recent.length > 0 && (
          <div className="flex flex-col gap-2">
            {recent.map((item, i) => (
              <div key={i} className="border border-slate-100 rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">{item.from}</span>
                  <span className="text-[11px] text-slate-400">{item.date}</span>
                </div>
                {item.tag && (
                  <span className="text-[11px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                    {item.tag}
                  </span>
                )}
                {item.message && (
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{item.message}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
