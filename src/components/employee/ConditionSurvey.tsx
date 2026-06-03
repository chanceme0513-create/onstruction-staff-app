"use client";

import { useState } from "react";

type Answer = 1 | 2 | 3 | 4 | 5;

const QUESTIONS = [
  { id: 1, text: "体調は良いですか？", emoji: "💪" },
  { id: 2, text: "作業の進捗は順調ですか？", emoji: "🔨" },
  { id: 3, text: "チーム内のコミュニケーションは取れていますか？", emoji: "💬" },
  { id: 4, text: "安全面で気になることはありませんか？", emoji: "⚠️" },
  { id: 5, text: "今日のモチベーションはどうですか？", emoji: "🔥" },
];

const SCALE = [
  { value: 1, label: "悪い", color: "bg-red-500" },
  { value: 2, label: "やや悪い", color: "bg-orange-400" },
  { value: 3, label: "普通", color: "bg-yellow-400" },
  { value: 4, label: "やや良い", color: "bg-lime-400" },
  { value: 5, label: "良い", color: "bg-green-500" },
];

export function ConditionSurvey() {
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [consultation, setConsultation] = useState("");
  const [saved, setSaved] = useState(false);

  function handleAnswer(questionId: number, value: Answer) {
    if (saved) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleSubmit() {
    if (Object.keys(answers).length < QUESTIONS.length) {
      alert("すべての質問に回答してください");
      return;
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setAnswers({});
      setConsultation("");
    }, 4000);
  }

  const isComplete = Object.keys(answers).length === QUESTIONS.length;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">
        📋 今日のコンディションチェック
      </h2>

      <div className="flex flex-col gap-4">
        {QUESTIONS.map((q) => (
          <div key={q.id} className="border-b border-gray-100 pb-4 last:border-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{q.emoji}</span>
              <p className="text-sm text-gray-700 font-medium">{q.text}</p>
            </div>
            <div className="flex gap-1.5">
              {SCALE.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleAnswer(q.id, s.value as Answer)}
                  disabled={saved}
                  className={`flex-1 h-10 rounded-lg text-white text-xs font-semibold transition-all ${
                    s.color
                  } ${
                    answers[q.id] === s.value
                      ? "ring-2 ring-blue-400 ring-offset-2 scale-105"
                      : "opacity-40 hover:opacity-70"
                  } ${saved ? "cursor-not-allowed" : ""}`}
                  title={s.label}
                >
                  {s.value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 相談フィールド */}
      {isComplete && !saved && (
        <div className="mt-4 flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-700">
            💡 相談・連絡事項（任意）
          </label>
          <textarea
            value={consultation}
            onChange={(e) => setConsultation(e.target.value)}
            placeholder="作業上の相談や連絡事項があれば入力してください..."
            className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            rows={3}
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            記録する
          </button>
        </div>
      )}

      {/* 完了メッセージ */}
      {saved && (
        <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2.5 text-sm font-medium">
          ✅ 記録しました！今日も安全第一でお願いします。
        </div>
      )}
    </section>
  );
}
