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
  { id: "1", date: "2026-06-20", time: "09:00", title: "プロジェクトA 確認MTG", location: "第1会議室" },
  { id: "2", date: "2026-06-20", time: "14:00", title: "プロジェクトB 定例会議", location: "オンライン" },
  { id: "3", date: "2026-06-22", time: "10:00", title: "備品発注" },
  { id: "4", date: "2026-06-22", time: "15:00", title: "プロジェクトC 進捗確認", location: "第2会議室" },
  { id: "5", date: "2026-06-24", time: "終日", title: "事務作業" },
  { id: "6", date: "2026-06-25", time: "13:00", title: "全体ミーティング", location: "本社" },
  { id: "7", date: "2026-06-28", time: "10:00", title: "プロジェクトD キックオフ", location: "第3会議室" },
];

const WEEK_DAYS = ["日", "月", "火", "水", "木", "金", "土"];

function toDateStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function ManagerCalendarWidget() {
  const [currentMonth] = useState(new Date(2026, 5, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 5, 20));

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

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
    <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 flex items-center border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#fdf1ee] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-[#e8836e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-stone-800">マネージャーの予定</h2>
        </div>
        <span className="ml-auto text-xs text-stone-400">{year}年{month + 1}月</span>
      </div>

      <div className="px-3 pt-3 pb-2">
        <div className="grid grid-cols-7 mb-1">
          {WEEK_DAYS.map((day, i) => (
            <div
              key={i}
              className={`text-center text-[10px] font-semibold py-1 ${
                i === 0 ? "text-red-400" : i === 6 ? "text-sky-400" : "text-stone-400"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-0.5">
          {days.map((date, i) => {
            const isCurrentMonth = date.getMonth() === month;
            const dateStr = toDateStr(date);
            const hasSchedule = getSchedulesForDate(date).length > 0;
            const isSelected = selectedDate && toDateStr(selectedDate) === dateStr;
            const isToday = dateStr === today;
            const isSun = date.getDay() === 0;
            const isSat = date.getDay() === 6;

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center py-1 rounded-lg transition-all ${
                  isSelected
                    ? "bg-[#e8836e]"
                    : isToday
                    ? "bg-orange-50"
                    : "hover:bg-stone-50"
                }`}
              >
                <span
                  className={`text-xs font-medium leading-none mb-1 ${
                    !isCurrentMonth
                      ? "text-stone-200"
                      : isSelected
                      ? "text-white font-bold"
                      : isToday
                      ? "text-[#e8836e] font-bold"
                      : isSun
                      ? "text-red-400"
                      : isSat
                      ? "text-sky-400"
                      : "text-stone-700"
                  }`}
                >
                  {date.getDate()}
                </span>
                <div className="h-1 flex gap-0.5 justify-center">
                  {hasSchedule && isCurrentMonth && (
                    <div className={`w-1 h-1 rounded-full ${isSelected ? "bg-white/70" : "bg-[#e8836e]/60"}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-stone-100 px-5 py-4">
        {selectedDate ? (
          <>
            <p className="text-xs text-stone-400 mb-2.5">
              {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日（{WEEK_DAYS[selectedDate.getDay()]}）の予定
            </p>
            {selectedSchedules.length > 0 ? (
              <div className="flex flex-col gap-2">
                {selectedSchedules.map((s) => (
                  <div key={s.id} className="flex items-start gap-3 bg-[#fdf8f5] border border-stone-100 rounded-xl px-3 py-2.5">
                    <span className="text-xs font-bold text-[#e8836e] min-w-[40px] shrink-0 pt-0.5">{s.time}</span>
                    <div>
                      <p className="text-xs font-semibold text-stone-800">{s.title}</p>
                      {s.location && (
                        <p className="text-[11px] text-stone-400 mt-0.5">{s.location}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-2">この日の予定はありません</p>
            )}
          </>
        ) : (
          <p className="text-xs text-stone-400 py-2">日付を選択して予定を確認</p>
        )}
      </div>
    </section>
  );
}
