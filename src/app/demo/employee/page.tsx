"use client";

import { useState, useEffect } from "react";
import { BottomTabBar, Tab } from "@/components/employee/BottomTabBar";
import { DailyReport } from "@/components/employee/DailyReport";
import { TeamMood } from "@/components/employee/TeamMood";
import { NoticeboardScreen } from "@/components/employee/NoticeboardScreen";
import { ManagerCalendarWidget } from "@/components/employee/ManagerCalendarWidget";
import { EmployeePortfolio } from "@/components/employee/EmployeePortfolio";
import { AIInsightCard } from "@/components/employee/AIInsightCard";
import { UserSelectScreen, StaffUser } from "@/components/employee/UserSelectScreen";

const LOCAL_STORAGE_KEY = "staff_app_user";

const PAGE_TITLES: Record<Tab, string> = {
  home: "ホーム",
  report: "業務報告",
  noticeboard: "掲示板",
};

export default function DemoEmployeePage() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
    setLoading(false);
  }, []);

  const handleSelectUser = (user: StaffUser) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setCurrentUser(null);
    setActiveTab("home");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf8f5] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-stone-200 border-t-[#e8836e] animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <UserSelectScreen onSelect={handleSelectUser} />;
  }

  return (
    <div className="min-h-screen bg-[#fdf8f5]">
      {/* ヘッダー */}
      <header className="bg-white border-b border-stone-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#e8836e] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-sm font-bold text-stone-800 tracking-tight">STAPO</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400 font-medium">{PAGE_TITLES[activeTab]}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-stone-400 hover:text-stone-600 border border-stone-200 rounded px-2 py-1"
            >
              切替
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-5 pb-24">

        {/* ===== ホーム ===== */}
        {activeTab === "home" && (
          <div className="flex flex-col gap-4">
            {/* ポートフォリオカード */}
            <EmployeePortfolio userName={currentUser.name} userRole={currentUser.role} />

            {/* AI分析サマリー */}
            <AIInsightCard userName={currentUser.name} />

            {/* チームの雰囲気 */}
            <TeamMood avgScore={3.9} totalMembers={12} checkedIn={4} />

            {/* リーダーの予定 */}
            <ManagerCalendarWidget />
          </div>
        )}

        {/* ===== 業務報告 ===== */}
        {activeTab === "report" && (
          <DailyReport currentUser={currentUser} />
        )}

        {/* ===== 掲示板 ===== */}
        {activeTab === "noticeboard" && (
          <NoticeboardScreen postedBy={currentUser.name} />
        )}

      </main>

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
