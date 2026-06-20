"use client";

import { useState } from "react";
import { PostNoticeForm } from "./PostNoticeForm";

type Notice = {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  postedAt: string;
  isPinned?: boolean;
};

const DUMMY_NOTICES: Notice[] = [
  {
    id: "1",
    title: "【重要】安全講習会のお知らせ",
    content: "6月10日(月) 15:00より本社にて安全講習会を実施します。全員参加でお願いします。",
    postedBy: "親方",
    postedAt: "今日 08:30",
    isPinned: true,
  },
  {
    id: "2",
    title: "A現場 進捗状況",
    content: "本日午前中に基礎工事が完了しました。明日から鉄骨組み立てに入ります。",
    postedBy: "山田リーダー",
    postedAt: "今日 11:20",
  },
  {
    id: "3",
    title: "資材納品の遅延について",
    content: "B現場の資材納品が6/5→6/7に変更となりました。作業スケジュールを調整します。",
    postedBy: "親方",
    postedAt: "昨日 16:45",
  },
  {
    id: "4",
    title: "今週の天気予報",
    content: "今週は晴れが続く見込みです。熱中症対策を忘れずに！",
    postedBy: "事務担当",
    postedAt: "昨日 09:00",
  },
  {
    id: "5",
    title: "C現場 完工予定",
    content: "C現場は予定通り6月15日に完工の見込みです。最終チェックをお願いします。",
    postedBy: "山田リーダー",
    postedAt: "2日前",
  },
];

export function NoticeboardScreen() {
  const [showPostForm, setShowPostForm] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* 投稿ボタン */}
      <button
        onClick={() => setShowPostForm(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        新しい連絡を投稿
      </button>

      {/* お知らせ一覧 */}
      <div className="flex flex-col gap-3">
        {DUMMY_NOTICES.map((notice) => (
          <div
            key={notice.id}
            className={`bg-white rounded-2xl border px-5 py-4 shadow-sm ${
              notice.isPinned ? "border-yellow-300 bg-yellow-50" : "border-gray-100"
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              {notice.isPinned && (
                <span className="text-yellow-600 text-sm mt-0.5 shrink-0">📍</span>
              )}
              <h3 className="text-sm font-semibold text-gray-800 flex-1 leading-snug">
                {notice.title}
              </h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">{notice.content}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium">{notice.postedBy}</span>
              <span>{notice.postedAt}</span>
            </div>
          </div>
        ))}
      </div>

      <PostNoticeForm isOpen={showPostForm} onClose={() => setShowPostForm(false)} />
    </div>
  );
}
