"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

type ReportRow = {
  id: string;
  staff_name: string;
  report_date: string;
  site_name: string;
  start_time: string;
  end_time: string;
  hours_worked: number;
  submitted_at: string;
};

type StaffSummary = {
  name: string;
  days: number;
  totalHours: number;
};

const DUMMY_ROWS: ReportRow[] = [
  { id: "1", staff_name: "田中 太郎", report_date: "2026-07-11", site_name: "A現場 鉄筋組み立て", start_time: "08:00", end_time: "17:00", hours_worked: 9.0, submitted_at: "2026-07-11T17:05:00Z" },
  { id: "2", staff_name: "山田 次郎", report_date: "2026-07-11", site_name: "B現場 型枠設置", start_time: "07:30", end_time: "17:00", hours_worked: 9.5, submitted_at: "2026-07-11T17:10:00Z" },
  { id: "3", staff_name: "佐藤 健",   report_date: "2026-07-11", site_name: "C現場 左官作業", start_time: "08:00", end_time: "17:00", hours_worked: 9.0, submitted_at: "2026-07-11T17:02:00Z" },
  { id: "4", staff_name: "鈴木 誠",   report_date: "2026-07-11", site_name: "D現場 基礎工事", start_time: "08:00", end_time: "17:00", hours_worked: 9.0, submitted_at: "2026-07-11T17:08:00Z" },
  { id: "5", staff_name: "田中 太郎", report_date: "2026-07-10", site_name: "A現場 配筋検査", start_time: "08:00", end_time: "16:30", hours_worked: 8.5, submitted_at: "2026-07-10T16:35:00Z" },
  { id: "6", staff_name: "山田 次郎", report_date: "2026-07-10", site_name: "B現場 型枠設置", start_time: "07:30", end_time: "17:30", hours_worked: 10.0, submitted_at: "2026-07-10T17:35:00Z" },
  { id: "7", staff_name: "高橋 浩",   report_date: "2026-07-10", site_name: "E現場 内装工事", start_time: "09:00", end_time: "18:00", hours_worked: 9.0, submitted_at: "2026-07-10T18:05:00Z" },
  { id: "8", staff_name: "田中 太郎", report_date: "2026-07-09", site_name: "A現場 鉄筋組み立て", start_time: "08:00", end_time: "17:00", hours_worked: 9.0, submitted_at: "2026-07-09T17:05:00Z" },
  { id: "9", staff_name: "佐藤 健",   report_date: "2026-07-09", site_name: "C現場 左官作業", start_time: "08:30", end_time: "17:30", hours_worked: 9.0, submitted_at: "2026-07-09T17:35:00Z" },
  { id: "10", staff_name: "鈴木 誠",  report_date: "2026-07-09", site_name: "F現場 外壁工事", start_time: "08:00", end_time: "16:00", hours_worked: 8.0, submitted_at: "2026-07-09T16:05:00Z" },
  { id: "11", staff_name: "山田 次郎", report_date: "2026-07-08", site_name: "B現場 型枠解体", start_time: "07:30", end_time: "16:30", hours_worked: 9.0, submitted_at: "2026-07-08T16:35:00Z" },
  { id: "12", staff_name: "高橋 浩",  report_date: "2026-07-08", site_name: "E現場 内装工事", start_time: "09:00", end_time: "17:00", hours_worked: 8.0, submitted_at: "2026-07-08T17:05:00Z" },
  { id: "13", staff_name: "田中 太郎", report_date: "2026-07-07", site_name: "A現場 コンクリート打設", start_time: "07:00", end_time: "17:00", hours_worked: 10.0, submitted_at: "2026-07-07T17:05:00Z" },
  { id: "14", staff_name: "佐藤 健",  report_date: "2026-07-07", site_name: "C現場 仕上げ", start_time: "08:00", end_time: "17:00", hours_worked: 9.0, submitted_at: "2026-07-07T17:02:00Z" },
  { id: "15", staff_name: "鈴木 誠",  report_date: "2026-07-07", site_name: "D現場 基礎工事", start_time: "08:00", end_time: "17:00", hours_worked: 9.0, submitted_at: "2026-07-07T17:08:00Z" },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}（${"日月火水木金土"[d.getDay()]}）`;
}

function buildSummary(rows: ReportRow[]): StaffSummary[] {
  const map = new Map<string, { days: Set<string>; totalHours: number }>();
  for (const r of rows) {
    if (!map.has(r.staff_name)) map.set(r.staff_name, { days: new Set(), totalHours: 0 });
    const entry = map.get(r.staff_name)!;
    entry.days.add(r.report_date);
    entry.totalHours += r.hours_worked;
  }
  return Array.from(map.entries())
    .map(([name, v]) => ({ name, days: v.days.size, totalHours: Math.round(v.totalHours * 10) / 10 }))
    .sort((a, b) => b.totalHours - a.totalHours);
}

function downloadCSV(rows: ReportRow[], year: number, month: number) {
  const header = ["日付", "スタッフ名", "現場名・業務内容", "出勤時刻", "退勤時刻", "勤務時間(h)"];
  const lines = rows
    .sort((a, b) => a.report_date.localeCompare(b.report_date) || a.staff_name.localeCompare(b.staff_name))
    .map((r) => [r.report_date, r.staff_name, r.site_name, r.start_time, r.end_time, r.hours_worked].join(","));

  const bom = "﻿";
  const csv = bom + [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `勤怠_${year}年${month}月.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AccountingPage() {
  const now = new Date(2026, 6, 1);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStaff, setFilterStaff] = useState<string>("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const from = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const to = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    const { data, error } = await supabase
      .from("daily_reports")
      .select("id, staff_name, report_date, site_name, start_time, end_time, hours_worked, submitted_at")
      .gte("report_date", from)
      .lte("report_date", to)
      .order("report_date", { ascending: false });

    if (!error && data && data.length > 0) {
      setRows(data as ReportRow[]);
    } else {
      const dummy = DUMMY_ROWS.filter((r) => {
        const d = new Date(r.report_date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      });
      setRows(dummy);
    }
    setLoading(false);
  }, [year, month]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
    setFilterStaff("all");
  };
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
    setFilterStaff("all");
  };

  const summary = buildSummary(rows);
  const staffNames = Array.from(new Set(rows.map(r => r.staff_name))).sort();
  const filtered = filterStaff === "all" ? rows : rows.filter(r => r.staff_name === filterStaff);
  const totalHours = rows.reduce((s, r) => s + r.hours_worked, 0);

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      {/* ヘッダー */}
      <header className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#e8836e] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-stone-800">勤怠集計</p>
              <p className="text-xs text-stone-400">経理担当者向け</p>
            </div>
          </div>
          <button
            onClick={() => downloadCSV(rows, year, month)}
            disabled={rows.length === 0}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSVダウンロード
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-6 flex flex-col gap-6">

        {/* 月選択 */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-5 py-4 flex items-center justify-between">
          <button onClick={prevMonth} className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <p className="text-xl font-black text-stone-800">{year}年{month}月</p>
            {!loading && (
              <p className="text-xs text-stone-400 mt-0.5">{rows.length}件のデータ・合計 {Math.round(totalHours * 10) / 10}h</p>
            )}
          </div>
          <button onClick={nextMonth} className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-4 border-stone-200 border-t-[#e8836e] animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-5 py-16 text-center">
            <p className="text-stone-400">この月のデータはありません</p>
          </div>
        ) : (
          <>
            {/* スタッフ別サマリー */}
            <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100">
                <h2 className="text-sm font-bold text-stone-800">スタッフ別集計</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500">スタッフ名</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-stone-500">勤務日数</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-stone-500">総勤務時間</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-stone-500">平均/日</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {summary.map((s) => (
                      <tr
                        key={s.name}
                        onClick={() => setFilterStaff(filterStaff === s.name ? "all" : s.name)}
                        className={`cursor-pointer transition-colors ${filterStaff === s.name ? "bg-orange-50" : "hover:bg-stone-50"}`}
                      >
                        <td className="px-5 py-3 font-medium text-stone-800">
                          <div className="flex items-center gap-2">
                            {filterStaff === s.name && <span className="w-1.5 h-1.5 rounded-full bg-[#e8836e] shrink-0" />}
                            {s.name}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right text-stone-600">{s.days}日</td>
                        <td className="px-5 py-3 text-right font-bold text-stone-800">{s.totalHours}h</td>
                        <td className="px-5 py-3 text-right text-stone-500">{Math.round((s.totalHours / s.days) * 10) / 10}h</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-stone-50 border-t border-stone-200">
                      <td className="px-5 py-3 text-xs font-bold text-stone-600">合計</td>
                      <td className="px-5 py-3 text-right text-xs font-bold text-stone-600">{rows.length}件</td>
                      <td className="px-5 py-3 text-right text-sm font-black text-[#e8836e]">{Math.round(totalHours * 10) / 10}h</td>
                      <td className="px-5 py-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="px-5 py-2 text-[11px] text-stone-400 border-t border-stone-50">
                ※ 行をクリックすると下の明細を絞り込めます
              </p>
            </section>

            {/* 日別明細 */}
            <section className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-stone-800">
                  日別明細
                  {filterStaff !== "all" && (
                    <span className="ml-2 text-xs font-normal text-[#e8836e]">（{filterStaff}）</span>
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  <select
                    value={filterStaff}
                    onChange={(e) => setFilterStaff(e.target.value)}
                    className="text-xs border border-stone-200 rounded-lg px-2 py-1.5 text-stone-600 focus:outline-none"
                  >
                    <option value="all">全員</option>
                    {staffNames.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[560px]">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500">日付</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500">スタッフ名</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500">現場名・業務内容</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-stone-500">出勤</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-stone-500">退勤</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-stone-500">勤務時間</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {filtered
                      .sort((a, b) => b.report_date.localeCompare(a.report_date) || a.staff_name.localeCompare(b.staff_name))
                      .map((r) => (
                        <tr key={r.id} className="hover:bg-stone-50 transition-colors">
                          <td className="px-5 py-3 text-stone-600 whitespace-nowrap">{formatDate(r.report_date)}</td>
                          <td className="px-4 py-3 font-medium text-stone-800 whitespace-nowrap">{r.staff_name}</td>
                          <td className="px-4 py-3 text-stone-600 max-w-[200px] truncate">{r.site_name}</td>
                          <td className="px-4 py-3 text-center text-stone-600 whitespace-nowrap">{r.start_time}</td>
                          <td className="px-4 py-3 text-center text-stone-600 whitespace-nowrap">{r.end_time}</td>
                          <td className="px-5 py-3 text-right font-bold text-stone-800 whitespace-nowrap">{r.hours_worked}h</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
