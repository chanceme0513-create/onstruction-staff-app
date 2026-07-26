"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { PostNoticeForm } from "./PostNoticeForm";

type Notice = {
  id: string;
  title: string;
  content: string;
  posted_by: string;
  posted_at: string;
  is_pinned: boolean;
};

type Props = {
  postedBy: string;
};

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "たった今";
  if (diffMin < 60) return `${diffMin}分前`;
  if (diffHour < 24) return `今日 ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  if (diffDay === 1) return "昨日";
  return `${diffDay}日前`;
}

const DUMMY_NOTICES: Notice[] = [
  {
    id: "dummy-1",
    title: "【重要】業務マニュアル更新のお知らせ",
    content: "接客対応マニュアルを更新しました。今週中に各自確認し、お客様対応のルールを徹底してください。不明点はリーダーまで。",
    posted_by: "管理者",
    posted_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    is_pinned: true,
  },
  {
    id: "dummy-2",
    title: "プロジェクトBのスケジュール変更について",
    content: "来週月曜日のプロジェクトB打ち合わせが変更となりました。会場が第1会議室→オンライン開催に変更。詳細はリーダーから直接連絡があります。",
    posted_by: "田中 太郎",
    posted_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    is_pinned: false,
  },
  {
    id: "dummy-3",
    title: "先週のチームミーティングありがとうございました",
    content: "先週のチームミーティング、皆さん参加ありがとうございました！お客様フィードバックの共有が非常に参考になりました。来月も開催予定です。",
    posted_by: "鈴木 誠",
    posted_at: new Date(Date.now() - 26 * 3600000).toISOString(),
    is_pinned: false,
  },
  {
    id: "dummy-4",
    title: "備品・消耗品の補充について",
    content: "事務用品・消耗品を補充しました。使用後は必ず所定の場所に返却してください。不足があれば山田まで連絡を。",
    posted_by: "山田 次郎",
    posted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    is_pinned: false,
  },
];

export function NoticeboardScreen({ postedBy }: Props) {
  const [showPostForm, setShowPostForm] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotices = useCallback(async () => {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("posted_at", { ascending: false });

    if (!error && data && data.length > 0) {
      setNotices(data);
    } else {
      setNotices(DUMMY_NOTICES);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return (
    <div className="flex flex-col gap-4">
      {/* 投稿ボタン */}
      <button
        onClick={() => setShowPostForm(true)}
        className="w-full bg-[#e8836e] hover:bg-[#d4705c] text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        新しい連絡を投稿
      </button>

      {/* お知らせ一覧 */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 rounded-full border-4 border-stone-200 border-t-[#e8836e] animate-spin" />
        </div>
      ) : notices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 px-5 py-10 text-center">
          <p className="text-stone-400 text-sm">まだ投稿がありません</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl border px-5 py-4 shadow-sm ${
                notice.is_pinned ? "border-yellow-300 bg-yellow-50" : "border-stone-100"
              }`}
            >
              <div className="flex items-start gap-2 mb-2">
                {notice.is_pinned && (
                  <span className="text-yellow-600 text-sm mt-0.5 shrink-0">📍</span>
                )}
                <h3 className="text-sm font-semibold text-stone-800 flex-1 leading-snug">
                  {notice.title}
                </h3>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed mb-3">{notice.content}</p>
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="font-medium">{notice.posted_by}</span>
                <span>{formatDate(notice.posted_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <PostNoticeForm
        isOpen={showPostForm}
        postedBy={postedBy}
        onClose={() => setShowPostForm(false)}
        onPosted={fetchNotices}
      />
    </div>
  );
}
