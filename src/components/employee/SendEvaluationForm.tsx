"use client";

import { useState } from "react";

type Employee = {
  id: string;
  name: string;
};

const EMPLOYEES: Employee[] = [
  { id: "1", name: "山田リーダー" },
  { id: "2", name: "佐藤" },
  { id: "3", name: "鈴木" },
  { id: "4", name: "高橋" },
  { id: "5", name: "伊藤" },
];

const THANKS_TAGS = [
  { label: "頼りになる", emoji: "💪" },
  { label: "サポートが上手", emoji: "🤝" },
  { label: "教え方が上手", emoji: "📚" },
  { label: "気配りができる", emoji: "✨" },
  { label: "チームワーク", emoji: "👥" },
];

const SKILL_TAGS = [
  { label: "技術が高い", emoji: "🔨" },
  { label: "仕上がりが丁寧", emoji: "⭐" },
  { label: "作業が速い", emoji: "⚡" },
  { label: "段取りが上手", emoji: "📋" },
  { label: "安全意識が高い", emoji: "⚠️" },
];

export function SendEvaluationForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [type, setType] = useState<"thanks" | "skill">("thanks");
  const [selectedTag, setSelectedTag] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedEmployee || !selectedTag) {
      alert("従業員とタグを選択してください");
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setSelectedEmployee("");
      setSelectedTag("");
      setComment("");
    }, 2000);
  };

  const tags = type === "thanks" ? THANKS_TAGS : SKILL_TAGS;

  return (
    <>
      {/* フローティングボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-all z-20"
      >
        👍
      </button>

      {/* モーダル */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">評価・感謝を送る</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {!submitted ? (
              <div className="flex flex-col gap-4">
                {/* 従業員選択 */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    送る相手
                  </label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">選択してください</option>
                    {EMPLOYEES.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* タイプ選択 */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    種類
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setType("thanks");
                        setSelectedTag("");
                      }}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        type === "thanks"
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      感謝
                    </button>
                    <button
                      onClick={() => {
                        setType("skill");
                        setSelectedTag("");
                      }}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        type === "skill"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      スキル
                    </button>
                  </div>
                </div>

                {/* タグ選択 */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    タグを選択
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedTag(tag.label)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTag === tag.label
                            ? "bg-blue-500 text-white ring-2 ring-blue-300"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {tag.emoji} {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* コメント */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    コメント（任意）
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="一言メッセージを添えましょう..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                    rows={3}
                  />
                </div>

                {/* 送信ボタン */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  送信する
                </button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-lg font-bold text-gray-800 mb-2">送信しました！</p>
                <p className="text-sm text-gray-600">
                  {EMPLOYEES.find((e) => e.id === selectedEmployee)?.name}さんに届けられました
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
