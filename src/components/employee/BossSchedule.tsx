"use client";

import { useState } from "react";

type Schedule = {
  id: string;
  date: string;
  time: string;
  title: string;
  location?: string;
};

const DUMMY_SCHEDULES: Schedule[] = [
  {
    id: "1",
    date: "6/3",
    time: "09:00",
    title: "A現場 立会い検査",
    location: "中央区3丁目",
  },
  {
    id: "2",
    date: "6/3",
    time: "14:00",
    title: "B現場 打ち合わせ",
    location: "西区12丁目",
  },
  {
    id: "3",
    date: "6/4",
    time: "10:00",
    title: "資材発注",
  },
  {
    id: "4",
    date: "6/4",
    time: "15:00",
    title: "C現場 進捗確認",
    location: "東区5丁目",
  },
  {
    id: "5",
    date: "6/5",
    time: "終日",
    title: "事務作業",
  },
];

export function BossSchedule() {
  const [expanded, setExpanded] = useState(false);

  const displaySchedules = expanded ? DUMMY_SCHEDULES : DUMMY_SCHEDULES.slice(0, 3);

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">📅 親方の予定</h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-500 hover:text-blue-600 font-medium"
        >
          {expanded ? "閉じる" : "もっと見る"}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {displaySchedules.map((schedule) => (
          <div
            key={schedule.id}
            className="flex items-start gap-3 border border-gray-100 rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="shrink-0 w-12 text-center">
              <p className="text-xs text-gray-400">{schedule.date}</p>
              <p className="text-xs font-semibold text-gray-700">{schedule.time}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{schedule.title}</p>
              {schedule.location && (
                <p className="text-xs text-gray-500 mt-0.5">📍 {schedule.location}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {DUMMY_SCHEDULES.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">予定はありません</p>
      )}
    </section>
  );
}
