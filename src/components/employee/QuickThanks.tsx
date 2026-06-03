"use client";

import { useState } from "react";

type Employee = {
  id: string;
  name: string;
  avatar: string;
};

const TEAM_MEMBERS: Employee[] = [
  { id: "1", name: "山田リーダー", avatar: "👨‍🔧" },
  { id: "2", name: "佐藤", avatar: "🧑‍🔧" },
  { id: "3", name: "鈴木", avatar: "👨‍💼" },
  { id: "4", name: "高橋", avatar: "👷" },
  { id: "5", name: "伊藤", avatar: "🧑‍🏭" },
];

const QUICK_TAGS = [
  { emoji: "💪", label: "頼りになる" },
  { emoji: "🤝", label: "サポート" },
  { emoji: "⚡", label: "速い" },
  { emoji: "✨", label: "気配り" },
];

export function QuickThanks() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSend = (tagLabel: string) => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSelectedMember(null);
    }, 1500);
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">⚡ クイック感謝</h2>
      <p className="text-xs text-gray-500 mb-4">
        タップ2回で感謝を送れます。今日の目標達成に貢献しよう！
      </p>

      {!selectedMember ? (
        <div className="grid grid-cols-5 gap-2">
          {TEAM_MEMBERS.map((member) => (
            <button
              key={member.id}
              onClick={() => setSelectedMember(member.id)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-3xl">{member.avatar}</span>
              <span className="text-[10px] text-gray-600 text-center leading-tight">
                {member.name}
              </span>
            </button>
          ))}
        </div>
      ) : !sent ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {TEAM_MEMBERS.find((m) => m.id === selectedMember)?.avatar}
              </span>
              <p className="text-sm font-semibold text-gray-800">
                {TEAM_MEMBERS.find((m) => m.id === selectedMember)?.name}
              </p>
            </div>
            <button
              onClick={() => setSelectedMember(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-gray-600 mb-1">送る感謝を選んでください:</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag.label}
                onClick={() => handleSend(tag.label)}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg px-3 py-2.5 transition-colors"
              >
                <span className="text-xl">{tag.emoji}</span>
                <span className="text-sm font-medium text-blue-700">{tag.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-6 text-center">
          <div className="text-5xl mb-2">🎉</div>
          <p className="text-sm font-semibold text-gray-800">送信しました！</p>
        </div>
      )}
    </section>
  );
}
