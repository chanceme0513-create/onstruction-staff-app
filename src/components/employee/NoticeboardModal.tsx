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
    title: "【重要】全社研修のお知らせ",
    content: "6月10日(月) 15:00より本社にて全社研修を実施します。全員参加でお願いします。",
    postedBy: "マネージャー",
    postedAt: "今日 08:30",
    isPinned: true,
  },
  {
    id: "2",
    title: "プロジェクトA 進捗報告",
    content: "本日午前中に初期フェーズが完了しました。明日から次フェーズに移行します。",
    postedBy: "山田リーダー",
    postedAt: "今日 11:20",
  },
  {
    id: "3",
    title: "備品納入の遅延について",
    content: "プロジェクトBの備品納入が6/5→6/7に変更となりました。スケジュールを調整します。",
    postedBy: "マネージャー",
    postedAt: "昨日 16:45",
  },
  {
    id: "4",
    title: "今週の天気予報",
    content: "今週は晴れが続く見込みです。体調管理に気をつけましょう！",
    postedBy: "事務担当",
    postedAt: "昨日 09:00",
  },
  {
    id: "5",
    title: "プロジェクトC 完了予定",
    content: "プロジェクトCは予定通り6月15日に完了の見込みです。最終確認をお願いします。",
    postedBy: "山田リーダー",
    postedAt: "2日前",
  },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function NoticeboardModal({ isOpen, onClose }: Props) {
  const [showPostForm, setShowPostForm] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">📌 掲示板（事務連絡）</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* 投稿ボタン */}
          <button
            onClick={() => setShowPostForm(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg mb-4 transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-xl">✍️</span>
            <span>新しい連絡を投稿</span>
          </button>

          <div className="flex flex-col gap-3">
            {DUMMY_NOTICES.map((notice) => (
              <div
                key={notice.id}
                className={`border rounded-xl px-4 py-4 ${
                  notice.isPinned
                    ? "border-yellow-300 bg-yellow-50"
                    : "border-gray-100 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-gray-800 flex-1">
                    {notice.isPinned && <span className="text-yellow-600 mr-1">📍</span>}
                    {notice.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  {notice.content}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium">{notice.postedBy}</span>
                  <span>{notice.postedAt}</span>
                </div>
              </div>
            ))}
          </div>

          {DUMMY_NOTICES.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">お知らせはありません</p>
            </div>
          )}
        </div>
      </div>

      {/* 投稿フォーム */}
      <PostNoticeForm isOpen={showPostForm} postedBy="スタッフ" onClose={() => setShowPostForm(false)} onPosted={() => {}} />
    </>
  );
}
