"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { StaffUser, STAFF_LIST } from "./UserSelectScreen";

type Schedule = {
  id: string;
  staff_id: string;
  staff_name: string;
  schedule_date: string;
  time: string;
  title: string;
  location: string | null;
};

type Props = {
  currentUser: StaffUser;
};

const WEEK_DAYS = ["日", "月", "火", "水", "木", "金", "土"];

const STAFF_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  "staff-1": { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-400" },
  "staff-2": { bg: "bg-blue-100",   text: "text-blue-700",   dot: "bg-blue-400" },
  "staff-3": { bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-400" },
  "staff-4": { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-400" },
  "staff-5": { bg: "bg-rose-100",   text: "text-rose-700",   dot: "bg-rose-400" },
  "staff-test": { bg: "bg-gray-100", text: "text-gray-600",  dot: "bg-gray-400" },
};

function getColor(staffId: string) {
  return STAFF_COLORS[staffId] ?? { bg: "bg-stone-100", text: "text-stone-600", dot: "bg-stone-400" };
}

function toDateStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function ManagerCalendarWidget({ currentUser }: Props) {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(now);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // 予定追加フォームstate
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [saving, setSaving] = useState(false);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  useEffect(() => {
    fetchSchedules();
  }, []);

  async function fetchSchedules() {
    setLoadingSchedules(true);
    const { data } = await supabase
      .from("schedules")
      .select("*")
      .order("schedule_date", { ascending: true })
      .order("time", { ascending: true });
    if (data) setSchedules(data as Schedule[]);
    setLoadingSchedules(false);
  }

  async function handleAddSchedule() {
    if (!selectedDate || !newTitle.trim()) return;
    setSaving(true);
    const timeValue = newStartTime && newEndTime
      ? `${newStartTime} - ${newEndTime}`
      : newStartTime
      ? newStartTime
      : "終日";
    const { error } = await supabase.from("schedules").insert({
      staff_id: currentUser.id,
      staff_name: currentUser.name,
      schedule_date: toDateStr(selectedDate),
      time: timeValue,
      title: newTitle.trim(),
      location: newLocation.trim() || null,
    });
    setSaving(false);
    if (error) { alert("保存に失敗しました"); return; }
    setNewStartTime(""); setNewEndTime(""); setNewTitle(""); setNewLocation("");
    setShowAddForm(false);
    await fetchSchedules();
  }

  async function handleDeleteSchedule(id: string) {
    await supabase.from("schedules").delete().eq("id", id);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }

  // カレンダー生成
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  function getSchedulesForDate(date: Date) {
    return schedules.filter((s) => s.schedule_date === toDateStr(date));
  }

  const todayStr = toDateStr(now);
  const selectedSchedules = selectedDate ? getSchedulesForDate(selectedDate) : [];

  return (
    <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      {/* ヘッダー */}
      <div className="px-5 py-4 flex items-center border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#fdf1ee] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-[#e8836e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-stone-800">チームカレンダー</h2>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} className="p-1 text-stone-400 hover:text-stone-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-xs text-stone-500 font-medium w-14 text-center">{year}年{month + 1}月</span>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className="p-1 text-stone-400 hover:text-stone-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* メンバー凡例 */}
      <div className="px-3 pt-3 flex flex-wrap gap-1.5">
        {STAFF_LIST.filter(s => s.id !== "staff-test").map((s) => {
          const c = getColor(s.id);
          return (
            <span key={s.id} className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
              {s.name.split(" ")[0]}
            </span>
          );
        })}
      </div>

      {/* カレンダーグリッド */}
      <div className="px-3 pt-2 pb-2">
        <div className="grid grid-cols-7 mb-1">
          {WEEK_DAYS.map((day, i) => (
            <div key={i} className={`text-center text-[10px] font-semibold py-1 ${i === 0 ? "text-red-400" : i === 6 ? "text-sky-400" : "text-stone-400"}`}>
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-0.5">
          {days.map((date, i) => {
            const isCurrentMonth = date.getMonth() === month;
            const dateStr = toDateStr(date);
            const daySchedules = getSchedulesForDate(date);
            const isSelected = selectedDate && toDateStr(selectedDate) === dateStr;
            const isToday = dateStr === todayStr;
            const isSun = date.getDay() === 0;
            const isSat = date.getDay() === 6;

            // その日にいるスタッフのID（重複除去）
            const presentStaffIds = [...new Set(daySchedules.map(s => s.staff_id))];

            return (
              <button
                key={i}
                onClick={() => { setSelectedDate(date); setShowAddForm(false); }}
                className={`flex flex-col items-center py-1 rounded-lg transition-all ${
                  isSelected ? "bg-[#e8836e]" : isToday ? "bg-orange-50" : "hover:bg-stone-50"
                }`}
              >
                <span className={`text-xs font-medium leading-none mb-1 ${
                  !isCurrentMonth ? "text-stone-200" :
                  isSelected ? "text-white font-bold" :
                  isToday ? "text-[#e8836e] font-bold" :
                  isSun ? "text-red-400" :
                  isSat ? "text-sky-400" : "text-stone-700"
                }`}>
                  {date.getDate()}
                </span>
                <div className="h-3 flex gap-0.5 justify-center flex-wrap">
                  {isCurrentMonth && presentStaffIds.slice(0, 3).map((sid) => {
                    const c = getColor(sid);
                    return <div key={sid} className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/70" : c.dot}`} />;
                  })}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 選択日の予定 */}
      <div className="border-t border-stone-100 px-5 py-4">
        {selectedDate ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-stone-600">
                {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日（{WEEK_DAYS[selectedDate.getDay()]}）の予定
              </p>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1 text-xs font-medium text-[#e8836e] hover:text-[#d4705c] border border-[#e8836e]/30 rounded-lg px-2.5 py-1 hover:bg-[#fdf1ee] transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                予定追加
              </button>
            </div>

            {/* 追加フォーム */}
            {showAddForm && (
              <div className="mb-3 bg-[#fdf8f5] border border-stone-200 rounded-xl p-4 flex flex-col gap-3">
                <p className="text-xs font-bold text-stone-600">
                  {currentUser.name} の予定を追加
                </p>

                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">
                    予定の内容 <span className="text-red-400">*必須</span>
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="例：A現場 作業、資材発注、安全会議"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">
                    時刻
                    <span className="text-stone-400 font-normal ml-1">（任意・未入力で「終日」になります）</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                      className="flex-1 border border-stone-200 rounded-lg px-3 py-2.5 text-base text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                    <span className="text-stone-400 text-sm shrink-0">〜</span>
                    <input
                      type="time"
                      value={newEndTime}
                      onChange={(e) => setNewEndTime(e.target.value)}
                      className="flex-1 border border-stone-200 rounded-lg px-3 py-2.5 text-base text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">開始のみ入力も可。両方未入力で「終日」になります</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">
                    場所・現場名
                    <span className="text-stone-400 font-normal ml-1">（任意）</span>
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="例：中央区3丁目、本社"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-stone-200 text-stone-500 hover:bg-stone-50"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleAddSchedule}
                    disabled={!newTitle.trim() || saving}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                      newTitle.trim() && !saving ? "bg-[#e8836e] text-white hover:bg-[#d4705c]" : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    {saving ? "保存中..." : "追加する"}
                  </button>
                </div>
              </div>
            )}

            {loadingSchedules ? (
              <div className="flex justify-center py-4">
                <div className="w-4 h-4 rounded-full border-2 border-stone-200 border-t-[#e8836e] animate-spin" />
              </div>
            ) : selectedSchedules.length > 0 ? (
              <div className="flex flex-col gap-2">
                {selectedSchedules.map((s) => {
                  const c = getColor(s.staff_id);
                  const isOwn = s.staff_id === currentUser.id;
                  return (
                    <div key={s.id} className="flex items-start gap-3 bg-[#fdf8f5] border border-stone-100 rounded-xl px-3 py-2.5">
                      <span className="text-xs font-bold text-[#e8836e] min-w-[40px] shrink-0 pt-0.5">{s.time || "終日"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-stone-800">{s.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${c.bg} ${c.text}`}>
                            {s.staff_name}
                          </span>
                          {s.location && (
                            <span className="text-[10px] text-stone-400">{s.location}</span>
                          )}
                        </div>
                      </div>
                      {isOwn && (
                        <button
                          onClick={() => handleDeleteSchedule(s.id)}
                          className="shrink-0 text-stone-300 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
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
