"use client";

import { useState } from "react";

type Answer = 1 | 2 | 3 | 4 | 5;

const QUESTIONS = [
  { id: 1, text: "体調はいかがですか？" },
  { id: 2, text: "業務の進捗は順調ですか？" },
  { id: 3, text: "チーム内のコミュニケーションは取れていますか？" },
  { id: 4, text: "職場環境で気になることはありますか？（5＝問題なし）" },
  { id: 5, text: "今日のモチベーションはいかがですか？" },
];

const SCALE_LABELS = ["全く", "やや", "普通", "まあまあ", "非常に"];

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
  const progress = Math.round((Object.keys(answers).length / QUESTIONS.length) * 100);

  return (
    <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">コンディションチェック</h2>
          <p className="text-xs text-slate-400 mt-0.5">本日の状態を回答してください</p>
        </div>
        <span className="text-xs font-medium text-slate-500">
          {Object.keys(answers).length}/{QUESTIONS.length}
        </span>
      </div>

      {/* プログレスバー */}
      <div className="h-0.5 bg-slate-100">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-5 flex flex-col gap-5">
        {QUESTIONS.map((q, idx) => (
          <div key={q.id}>
            <p className="text-xs text-slate-400 mb-1.5">Q{idx + 1}</p>
            <p className="text-sm font-medium text-slate-700 mb-3">{q.text}</p>
            <div className="flex gap-1.5">
              {([1, 2, 3, 4, 5] as Answer[]).map((val) => (
                <button
                  key={val}
                  onClick={() => handleAnswer(q.id, val)}
                  disabled={saved}
                  className={`flex-1 py-2 rounded text-xs font-semibold border transition-all ${
                    answers[q.id] === val
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600"
                  } ${saved ? "cursor-not-allowed" : ""}`}
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-1 px-0.5">
              <span className="text-[10px] text-slate-400">低い</span>
              <span className="text-[10px] text-slate-400">高い</span>
            </div>
          </div>
        ))}

        {isComplete && !saved && (
          <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-600">
              相談・連絡事項（任意）
            </label>
            <textarea
              value={consultation}
              onChange={(e) => setConsultation(e.target.value)}
              placeholder="作業上の相談や連絡事項があれば入力してください"
              className="w-full rounded border border-slate-200 p-3 text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
              rows={3}
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded text-sm transition-colors"
            >
              送信する
            </button>
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded px-4 py-3 text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            回答を送信しました。お疲れ様でした。
          </div>
        )}
      </div>
    </section>
  );
}
