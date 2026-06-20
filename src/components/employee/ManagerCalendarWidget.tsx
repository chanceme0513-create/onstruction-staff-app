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
  { id: "1", date: "2026-06-20", time: "09:00", title: "A現場 立会い検査", location: "中央区3丁目" },
  { id: "2", date: "2026-06-20", time: "14:00", title: "B現場 打ち合わせ", location: "西区12丁目" },
  { id: "3", date: "2026-06-22", time: "10:00", title: "資材発注" },
  { id: "4", date: "2026-06-22", time: "15:00", title: "C現場 進捗確認", location: "東区5丁目" },
  { id: "5", date: "2026-06-24", time: "終日", title: "事務作業" },
  { id: "6", date: "2026-06-25", time: "13:00", title: "安全会議", location: "本社" },
  { id: "7", date: "2026-06-28", time: "10:00", title: "D現場 着工", location: "南区8丁目" },
];

const WEEK_DAYS = ["日", "月", "火", "水", "木", "金", "土"];

function toDateStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function ManagerCalendarWidget() {
  const [currentMonth] = useState(new Date(2026, 5, 1)); // 2026年6月
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 5, 20)); // 今日

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // カレンダーの日付を生成（6週分）
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  const getSchedulesForDate = (date: Date) =>
    DUMMY_SCHEDULES.filter((s) => s.date === toDateStr(date));

  const selectedSchedules = selectedDate ? getSchedulesForDate(selectedDate) : [];

  const today = toDateStr(new Date(2026, 5, 20));

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* ヘッダー */}
      <div className="px-5 pt-4 pb-3 flex items-center gap-2 border-b border-gray-100">
        <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h2 className="text-sm font-bold text-gray-800">親方の予定</h2>
        <span className="ml-auto text-sm font-semibold text-gray-600">{year}年{month + 1}月</span>
      </div>

      <div className="px-4 pt-3 pb-2">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 mb-1">
          {WEEK_DAYS.map((day, i) => (
            <div
              key={i}
              className={`text-center text-xs font-semibold py-1 ${
                i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 日付グリッド */}
        <div className="grid grid-cols-7 gap-y-1">
          {days.map((date, i) => {
            const isCurrentMonth = date.getMonth() === month;
            const dateStr = toDateStr(date);
            const schedules = getSchedulesForDate(date);
            const hasSchedule = schedules.length > 0;
            const isSelected = selectedDate && toDateStr(selectedDate) === dateStr;
            const isToday = dateStr === today;
            const isSun = date.getDay() === 0;
            const isSat = date.getDay() === 6;

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center py-1.5 rounded-xl transition-all ${
                  isSelected
                    ? "bg-blue-500"
                    : isToday
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                }`}
              >
                <span
                  className={`text-sm font-medium leading-none mb-1 ${
                    !isCurrentMonth
                      ? "text-gray-300"
                      : isSelected
                        ? "text-white"
                        : isToday
                          ? "text-blue-600 font-bold"
                          : isSun
                            ? "text-red-400"
                            : isSat
                              ? "text-blue-400"
                              : "text-gray-700"
                  }`}
                >
                  {date.getDate()}
                </span>
                {/* 予定ドット */}
                <div className="h-1.5 flex gap-0.5 justify-center">
                  {hasSchedule && isCurrentMonth && (
                    <>
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/70" : "bg-blue-400"}`} />
                      {schedules.length > 1 && (
                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/50" : "bg-blue-300"}`} />
                      )}
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 選択日の予定詳細 */}
      <div className="border-t border-gray-100 px-5 py-4">
        {selectedDate ? (
          <>
            <p className="text-xs font-semibold text-gray-500 mb-3">
              {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日（{WEEK_DAYS[selectedDate.getDay()]}）の予定
            </p>
            {selectedSchedules.length > 0 ? (
              <div className="flex flex-col gap-2">
                {selectedSchedules.map((s) => (
                  <div key={s.id} className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                    <span className="text-sm font-bold text-blue-600 min-w-[48px] shrink-0 pt-0.5">{s.time}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{s.title}</p>
                      {s.location && (
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {s.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-2">この日の予定はありません</p>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-400 text-center py-2">日付をタップして予定を確認</p>
        )}
      </div>
    </section>
  );
}
