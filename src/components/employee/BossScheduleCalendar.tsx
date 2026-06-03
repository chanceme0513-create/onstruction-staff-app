"use client";

import { useState } from "react";

type Schedule = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  title: string;
  location?: string;
};

const DUMMY_SCHEDULES: Schedule[] = [
  {
    id: "1",
    date: "2026-06-03",
    time: "09:00",
    title: "A現場 立会い検査",
    location: "中央区3丁目",
  },
  {
    id: "2",
    date: "2026-06-03",
    time: "14:00",
    title: "B現場 打ち合わせ",
    location: "西区12丁目",
  },
  {
    id: "3",
    date: "2026-06-04",
    time: "10:00",
    title: "資材発注",
  },
  {
    id: "4",
    date: "2026-06-04",
    time: "15:00",
    title: "C現場 進捗確認",
    location: "東区5丁目",
  },
  {
    id: "5",
    date: "2026-06-05",
    time: "終日",
    title: "事務作業",
  },
  {
    id: "6",
    date: "2026-06-06",
    time: "13:00",
    title: "安全会議",
    location: "本社",
  },
  {
    id: "7",
    date: "2026-06-09",
    time: "10:00",
    title: "D現場 着工",
    location: "南区8丁目",
  },
];

export function BossScheduleCalendar() {
  const [currentDate] = useState(new Date(2026, 5, 1)); // 2026年6月

  // カレンダーの日付を生成
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // 週の開始（日曜日）

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    // 6週分
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    days.push(date);
  }

  // 日付ごとの予定を取得
  const getSchedulesForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return DUMMY_SCHEDULES.filter((s) => s.date === dateStr);
  };

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">📅 親方の予定</h2>
        <span className="text-sm text-gray-600 font-medium">
          {year}年{month + 1}月
        </span>
      </div>

      {/* カレンダー */}
      <div className="grid grid-cols-7 gap-1">
        {/* 曜日ヘッダー */}
        {weekDays.map((day, i) => (
          <div
            key={i}
            className={`text-center text-xs font-semibold py-2 ${
              i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-600"
            }`}
          >
            {day}
          </div>
        ))}

        {/* 日付セル */}
        {days.map((date, i) => {
          const isCurrentMonth = date.getMonth() === month;
          const schedules = getSchedulesForDate(date);
          const hasSchedule = schedules.length > 0;

          return (
            <div
              key={i}
              className={`min-h-16 border border-gray-100 rounded-lg p-1 ${
                isCurrentMonth ? "bg-white" : "bg-gray-50"
              } ${hasSchedule ? "ring-1 ring-blue-200" : ""}`}
            >
              <div
                className={`text-xs font-medium mb-1 ${
                  !isCurrentMonth
                    ? "text-gray-300"
                    : date.getDay() === 0
                      ? "text-red-500"
                      : date.getDay() === 6
                        ? "text-blue-500"
                        : "text-gray-700"
                }`}
              >
                {date.getDate()}
              </div>

              {/* 予定の表示 */}
              {schedules.slice(0, 2).map((schedule) => (
                <div
                  key={schedule.id}
                  className="text-[10px] bg-blue-100 text-blue-700 rounded px-1 py-0.5 mb-0.5 truncate"
                  title={`${schedule.time} ${schedule.title}`}
                >
                  {schedule.time.substring(0, 5)} {schedule.title}
                </div>
              ))}

              {schedules.length > 2 && (
                <div className="text-[9px] text-gray-400 px-1">+{schedules.length - 2}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* 今日の予定詳細 */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <h3 className="text-xs font-semibold text-gray-600 mb-2">📋 今日の予定</h3>
        {getSchedulesForDate(new Date(2026, 5, 3)).length > 0 ? (
          <div className="flex flex-col gap-2">
            {getSchedulesForDate(new Date(2026, 5, 3)).map((schedule) => (
              <div key={schedule.id} className="flex items-start gap-2 text-sm">
                <span className="text-xs font-semibold text-gray-700 shrink-0 w-12">
                  {schedule.time}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{schedule.title}</p>
                  {schedule.location && (
                    <p className="text-xs text-gray-500">📍 {schedule.location}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">予定はありません</p>
        )}
      </div>
    </section>
  );
}
