"use client";

import { useState } from "react";
import { BottomTabBar, Tab } from "@/components/employee/BottomTabBar";
import { DailyReport } from "@/components/employee/DailyReport";
import { TeamMood } from "@/components/employee/TeamMood";
import { TodayInfo } from "@/components/employee/TodayInfo";
import { NoticeboardScreen } from "@/components/employee/NoticeboardScreen";
import { ManagerCalendarWidget } from "@/components/employee/ManagerCalendarWidget";
import { ThanksEvaluationCard } from "@/components/employee/ThanksEvaluationCard";

const PAGE_TITLES: Record<Tab, string> = {
  home: "ホーム",
  report: "業務報告",
  noticeboard: "掲示板",
};

export default function DemoEmployeePage() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

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
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl shrink-0">
                👷
              </div>
              <div>
                <p className="text-sm opacity-80">お疲れ様です！</p>
                <p className="text-xl font-bold">田中 太郎 さん</p>
                <p className="text-xs opacity-70 mt-0.5">施工スタッフ · 本日も安全第一で</p>
              </div>
            </div>

            {/* 親方の予定（カレンダー） */}
            <ManagerCalendarWidget />

            {/* あなたへの感謝・評価 */}
            <ThanksEvaluationCard />

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

      </main>

      {/* ボトムタブナビ（3タブ） */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
