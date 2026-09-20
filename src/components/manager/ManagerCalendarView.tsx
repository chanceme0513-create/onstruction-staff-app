"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Schedule = {
  id: string;
  staff_id: string;
  staff_name: string;
  schedule_date: string;
  time: string;
  title: string;
  location: string | null;
};

const STAFF_COLORS: Record<string, { dot: string; card: string }> = {};
const COLOR_PALETTE = [
  { dot: "bg-blue-400", card: "bg-blue-50 border-blue-200 text-blue-800" },
  { dot: "bg-emerald-400", card: "bg-emerald-50 border-emerald-200 text-emerald-800" },
  { dot: "bg-violet-400", card: "bg-violet-50 border-violet-200 text-violet-800" },
  { dot: "bg-amber-400", card: "bg-amber-50 border-amber-200 text-amber-800" },
  { dot: "bg-rose-400", card: "bg-rose-50 border-rose-200 text-rose-800" },
  { dot: "bg-sky-400", card: "bg-sky-50 border-sky-200 text-sky-800" },
];

function getStaffColor(name: string, staffNames: string[]) {
  const idx = staffNames.indexOf(name);
  return COLOR_PALETTE[idx % COLOR_PALETTE.length];
}

function dateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function ManagerCalendarView() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const first = dateStr(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();
    const last = dateStr(year, month, lastDay);
    supabase
      .from("schedules")
      .select("*")
      .gte("schedule_date", first)
      .lte("schedule_date", last)
      .order("schedule_date", { ascending: true })
      .order("time", { ascending: true })
      .then(({ data }) => {
        setSchedules(data || []);
        setLoading(false);
      });
  }, [year, month]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDow = new Date(year, month, 1).getDay();
  const todayStr = dateStr(now.getFullYear(), now.getMonth(), now.getDate());
  const monthLabel = new Date(year, month).toLocaleDateString("ja-JP", { year: "numeric", month: "long" });

  const byDate: Record<string, Schedule[]> = {};
  for (const s of schedules) {
    if (!byDate[s.schedule_date]) byDate[s.schedule_date] = [];
    byDate[s.schedule_date].push(s);
  }

  const staffNames = Array.from(new Set(schedules.map(s => s.staff_name)));

  const prevMonth = () => {
    setSelectedDate(null);
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    setSelectedDate(null);
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedSchedules = selectedDate ? (byDate[selectedDate] || []) : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Calendar card */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-colors">
            <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-sm font-bold text-stone-800">{monthLabel}</h2>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-colors">
            <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7">
          {["日", "月", "火", "水", "木", "金", "土"].map((d, i) => (
            <div key={d} className={`py-2 text-center text-[10px] font-semibold ${i === 0 ? "text-red-400" : i === 6 ? "text-sky-400" : "text-stone-400"}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 border-t border-stone-50">
          {cells.map((day, i) => {
            if (!day) return <div key={i} className="h-14 border-b border-r border-stone-50 last:border-r-0" />;
            const ds = dateStr(year, month, day);
            const daySchedules = byDate[ds] || [];
            const isToday = ds === todayStr;
            const isSelected = ds === selectedDate;
            const dow = (startDow + day - 1) % 7;
            const isWeekend = dow === 0 || dow === 6;

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(isSelected ? null : ds)}
                className={`h-14 border-b border-r border-stone-50 last:border-r-0 flex flex-col items-center pt-1.5 gap-0.5 transition-colors ${
                  isSelected ? "bg-[#e8836e]/10" : "hover:bg-stone-50"
                }`}
              >
                <span className={`text-[11px] font-semibold w-5 h-5 flex items-center justify-center rounded-full ${
                  isToday ? "bg-[#e8836e] text-white" :
                  isWeekend ? (dow === 0 ? "text-red-400" : "text-sky-400") :
                  "text-stone-700"
                }`}>
                  {day}
                </span>
                <div className="flex gap-0.5 flex-wrap justify-center px-0.5">
                  {daySchedules.slice(0, 4).map((s, si) => (
                    <div key={si} className={`w-1.5 h-1.5 rounded-full ${getStaffColor(s.staff_name, staffNames).dot}`} />
                  ))}
                  {daySchedules.length > 4 && <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Staff color legend */}
      {staffNames.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {staffNames.map((name) => {
            const color = getStaffColor(name, staffNames);
            return (
              <div key={name} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${color.card}`}>
                <div className={`w-2 h-2 rounded-full ${color.dot}`} />
                {name}
              </div>
            );
          })}
        </div>
      )}

      {/* Selected date detail */}
      {selectedDate && (
        <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100">
            <p className="text-sm font-bold text-stone-800">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" })}
              の予定
            </p>
          </div>
          <div className="p-4 flex flex-col gap-2">
            {selectedSchedules.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-4">この日の予定はありません</p>
            ) : (
              selectedSchedules.map((s) => {
                const color = getStaffColor(s.staff_name, staffNames);
                return (
                  <div key={s.id} className={`rounded-xl border px-4 py-3 ${color.card}`}>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${color.dot} bg-opacity-20 text-current`}>
                        {s.staff_name}
                      </span>
                      {s.time && s.time !== "終日" && <span className="text-xs opacity-70">{s.time}</span>}
                      {s.time === "終日" && <span className="text-xs opacity-70">終日</span>}
                      {s.location && <span className="text-xs opacity-70">📍 {s.location}</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* Monthly schedule list */}
      {!selectedDate && (
        <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100">
            <p className="text-sm font-bold text-stone-800">今月の予定一覧</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 rounded-full border-2 border-stone-200 border-t-[#e8836e] animate-spin" />
            </div>
          ) : schedules.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-stone-400">今月の予定はありません</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-50">
              {schedules.map((s) => {
                const color = getStaffColor(s.staff_name, staffNames);
                const d = new Date(s.schedule_date + "T00:00:00");
                return (
                  <div key={s.id} className="px-5 py-3 flex items-start gap-3">
                    <div className="text-center shrink-0 w-8 pt-0.5">
                      <p className="text-base font-black text-stone-700 leading-none">{d.getDate()}</p>
                      <p className="text-[10px] text-stone-400">
                        {"日月火水木金土"[d.getDay()]}
                      </p>
                    </div>
                    <div className={`w-1 self-stretch rounded-full mt-1 ${color.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-800">{s.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${color.card}`}>
                          {s.staff_name}
                        </span>
                        {s.time && s.time !== "終日" && <span className="text-xs text-stone-400">{s.time}</span>}
                        {s.location && <span className="text-xs text-stone-400">📍 {s.location}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
