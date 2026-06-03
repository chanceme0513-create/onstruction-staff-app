"use client";

import { useState } from "react";

type Evaluation = {
  id: string;
  from: string;
  type: "thanks" | "skill";
  tag: string;
  emoji: string;
  comment?: string;
  date: string;
};

const DUMMY_EVALUATIONS: Evaluation[] = [
  {
    id: "1",
    from: "山田リーダー",
    type: "thanks",
    tag: "頼りになる",
    emoji: "💪",
    comment: "いつも率先して動いてくれて助かります",
    date: "今日",
  },
  {
    id: "2",
    from: "佐藤",
    type: "skill",
    tag: "技術が高い",
    emoji: "🔨",
    comment: "丁寧な仕上がりで勉強になります",
    date: "昨日",
  },
  {
    id: "3",
    from: "鈴木",
    type: "thanks",
    tag: "教え方が上手",
    emoji: "📚",
    date: "2日前",
  },
  {
    id: "4",
    from: "高橋",
    type: "thanks",
    tag: "サポートが上手",
    emoji: "🤝",
    comment: "困った時にすぐに助けてくれました",
    date: "3日前",
  },
];

const TAG_SUMMARY = [
  { tag: "頼りになる", emoji: "💪", count: 12 },
  { tag: "技術が高い", emoji: "🔨", count: 8 },
  { tag: "教え方が上手", emoji: "📚", count: 6 },
  { tag: "サポートが上手", emoji: "🤝", count: 4 },
];

export function EmployeePortfolio() {
  const [activeTab, setActiveTab] = useState<"summary" | "timeline">("summary");

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">⭐ あなたの評価</h2>

      {/* タブ */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("summary")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "summary"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          評価サマリー
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "timeline"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          タイムライン
        </button>
      </div>

      {/* 評価サマリー */}
      {activeTab === "summary" && (
        <div className="flex flex-col gap-3">
          {TAG_SUMMARY.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-3"
            >
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{item.tag}</p>
                <p className="text-xs text-gray-500">受け取った回数: {item.count}回</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* タイムライン */}
      {activeTab === "timeline" && (
        <div className="flex flex-col gap-2">
          {DUMMY_EVALUATIONS.map((evaluation) => (
            <div
              key={evaluation.id}
              className="border border-gray-100 rounded-xl px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{evaluation.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-800">{evaluation.tag}</p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        evaluation.type === "thanks"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {evaluation.type === "thanks" ? "感謝" : "スキル"}
                    </span>
                  </div>
                  {evaluation.comment && (
                    <p className="text-xs text-gray-600 mb-1">{evaluation.comment}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {evaluation.from} · {evaluation.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
