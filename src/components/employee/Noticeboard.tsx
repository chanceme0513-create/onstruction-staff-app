"use client";

import { useState } from "react";

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
];

export function Noticeboard() {
  const [expanded, setExpanded] = useState(false);

  const displayNotices = expanded ? DUMMY_NOTICES : DUMMY_NOTICES.slice(0, 2);

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">📌 掲示板（事務連絡）</h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-500 hover:text-blue-600 font-medium"
        >
          {expanded ? "閉じる" : "すべて見る"}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {displayNotices.map((notice) => (
          <div
            key={notice.id}
            className={`border rounded-xl px-4 py-3 ${
              notice.isPinned
                ? "border-yellow-300 bg-yellow-50"
                : "border-gray-100 bg-white hover:bg-gray-50"
            } transition-colors`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-sm font-semibold text-gray-800 flex-1">
                {notice.isPinned && <span className="text-yellow-600 mr-1">📍</span>}
                {notice.title}
              </h3>
            </div>
            <p className="text-xs text-gray-600 mb-2">{notice.content}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{notice.postedBy}</span>
              <span>{notice.postedAt}</span>
            </div>
          </div>
        ))}
      </div>

      {DUMMY_NOTICES.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">お知らせはありません</p>
      )}
    </section>
  );
}
