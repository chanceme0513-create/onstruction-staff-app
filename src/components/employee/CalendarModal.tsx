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

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function CalendarModal({ isOpen, onClose }: Props) {
  const [currentDate] = useState(new Date(2026, 5, 1)); // 2026年6月
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  if (!isOpen) return null;

  // カレンダーの日付を生成
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // 週の開始（日曜日）

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
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

  const selectedSchedules = selectedDate ? getSchedulesForDate(selectedDate) : [];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">📅 親方の予定</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4 text-center">
          <p className="text-xl font-bold text-gray-800">
            {year}年{month + 1}月
          </p>
        </div>

        {/* カレンダー */}
        <div className="grid grid-cols-7 gap-1 mb-6">
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
            const isSelected =
              selectedDate?.toDateString() === date.toDateString();

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`min-h-12 border rounded-lg p-1 transition-all ${
                  isCurrentMonth ? "bg-white" : "bg-gray-50"
                } ${hasSchedule ? "ring-2 ring-blue-300" : "border-gray-100"} ${
                  isSelected ? "bg-blue-100 ring-2 ring-blue-500" : ""
                } hover:bg-blue-50`}
              >
                <div
                  className={`text-xs font-medium ${
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
                {hasSchedule && (
                  <div className="mt-0.5 flex justify-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 選択日の予定 */}
        {selectedDate && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日（
              {weekDays[selectedDate.getDay()]}）の予定
            </h3>
            {selectedSchedules.length > 0 ? (
              <div className="flex flex-col gap-2">
                {selectedSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-semibold text-blue-700 shrink-0 min-w-12">
                        {schedule.time}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {schedule.title}
                        </p>
                        {schedule.location && (
                          <p className="text-xs text-gray-600 mt-1">
                            📍 {schedule.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                予定はありません
              </p>
            )}
          </div>
        )}

        {!selectedDate && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
            <p className="text-sm text-gray-600">
              📅 日付をタップして予定を確認してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
