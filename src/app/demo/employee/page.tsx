"use client";

import { useState } from "react";
import { BottomTabBar, Tab } from "@/components/employee/BottomTabBar";
import { DailyReport } from "@/components/employee/DailyReport";
import { EmployeePortfolio } from "@/components/employee/EmployeePortfolio";
import { TeamMood } from "@/components/employee/TeamMood";
import { TodayInfo } from "@/components/employee/TodayInfo";
import { NoticeboardScreen } from "@/components/employee/NoticeboardScreen";
import { CalendarModal } from "@/components/employee/CalendarModal";

const PAGE_TITLES: Record<Tab, string> = {
  home: "ホーム",
  report: "業務報告",
  noticeboard: "掲示板",
  mypage: "マイページ",
};

export default function DemoEmployeePage() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-base font-bold text-gray-800">建築会社スタッフアプリ</h1>
          <span className="text-sm text-gray-500">{PAGE_TITLES[activeTab]}</span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">

        {/* ===== ホーム ===== */}
        {activeTab === "home" && (
          <div className="flex flex-col gap-5">
            {/* ウェルカムバナー */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-sm">
              <p className="text-sm opacity-80 mb-1">お疲れ様です！</p>
              <p className="text-xl font-bold">田中 太郎 さん</p>
              <p className="text-sm opacity-80 mt-1">本日も安全第一でお願いします</p>
            </div>

            {/* 親方の予定 */}
            <button
              onClick={() => setShowCalendar(true)}
              className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-800">親方の予定</p>
                <p className="text-xs text-gray-500 mt-0.5">今月のスケジュールを確認</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* チームのコンディション */}
            <TeamMood avgScore={3.9} totalMembers={12} checkedIn={4} />

            {/* 今日の現場情報 */}
            <TodayInfo />
          </div>
        )}

        {/* ===== 業務報告 ===== */}
        {activeTab === "report" && (
          <DailyReport />
        )}

        {/* ===== 掲示板 ===== */}
        {activeTab === "noticeboard" && (
          <NoticeboardScreen />
        )}

        {/* ===== マイページ ===== */}
        {activeTab === "mypage" && (
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                👷
              </div>
              <div>
                <p className="text-base font-bold text-gray-800">田中 太郎</p>
                <p className="text-sm text-gray-500">施工スタッフ</p>
              </div>
            </div>
            <EmployeePortfolio />
          </div>
        )}

      </main>

      {/* ボトムタブナビ */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 親方の予定モーダル */}
      <CalendarModal isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
    </div>
  );
}
