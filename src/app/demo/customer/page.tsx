"use client";

import { useState } from "react";

type Staff = {
  id: string;
  name: string;
  role: string;
  initials: string;
};

const STAFF_LIST: Staff[] = [
  { id: "1", name: "田中 太郎", role: "シニアスタッフ", initials: "田中" },
  { id: "2", name: "鈴木 花子", role: "スタッフ", initials: "鈴木" },
  { id: "3", name: "佐藤 健", role: "スタッフ", initials: "佐藤" },
  { id: "4", name: "山田 次郎", role: "スタッフ", initials: "山田" },
];

const EVAL_TAGS = [
  "笑顔が素敵",
  "説明が丁寧",
  "対応が速い",
  "また来たい",
  "提案が良い",
  "清潔感がある",
  "親切な対応",
  "頼りになる",
];

type Step = "select" | "rate" | "done";

export default function CustomerEvalPage() {
  const [step, setStep] = useState<Step>("select");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleSelectStaff(staff: Staff) {
    setSelectedStaff(staff);
    setStep("rate");
  }

  async function handleSubmit() {
    if (!selectedStaff || rating === 0) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setStep("done");
  }

  const starLabel = ["", "残念だった", "もう少し", "普通", "良かった", "とても良かった"][rating] || "";

  if (step === "done") {
    return (
      <div className="min-h-screen bg-[#fdf8f5] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">ありがとうございました！</p>
            <p className="text-sm text-slate-500 mt-1">
              {selectedStaff?.name}への評価を送信しました。
            </p>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            いただいたご意見はスタッフの成長に活用されます。またのご利用をお待ちしております。
          </p>
          <button
            onClick={() => {
              setStep("select");
              setSelectedStaff(null);
              setRating(0);
              setSelectedTags([]);
              setMessage("");
            }}
            className="mt-2 w-full py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            別のスタッフを評価する
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f5]">
      {/* ヘッダー */}
      <header className="bg-white border-b border-stone-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-sm mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#e8836e] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">STAPO</span>
          <span className="text-xs text-slate-400 ml-1">顧客評価</span>
        </div>
      </header>

      <main className="max-w-sm mx-auto px-4 py-6">

        {/* ===== スタッフ選択 ===== */}
        {step === "select" && (
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-base font-bold text-slate-900">担当スタッフを選択</h1>
              <p className="text-xs text-slate-500 mt-1">本日対応したスタッフを選んでください</p>
            </div>

            <div className="flex flex-col gap-2">
              {STAFF_LIST.map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => handleSelectStaff(staff)}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {staff.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{staff.name}</p>
                    <p className="text-xs text-slate-400">{staff.role}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== 評価入力 ===== */}
        {step === "rate" && selectedStaff && (
          <div className="flex flex-col gap-5">
            {/* 選択中スタッフ */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setStep("select"); setRating(0); setSelectedTags([]); }}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {selectedStaff.initials}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{selectedStaff.name}</p>
                <p className="text-xs text-slate-400">{selectedStaff.role}</p>
              </div>
            </div>

            {/* 星評価 */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm font-semibold text-slate-800 mb-1">総合評価</p>
              <p className="text-xs text-slate-400 mb-4">星をタップして評価してください</p>
              <div className="flex justify-center gap-3 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <svg
                      className={`w-9 h-9 transition-colors ${
                        star <= (hoveredStar || rating)
                          ? "text-amber-400"
                          : "text-slate-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm font-medium text-amber-600">{starLabel}</p>
              )}
            </div>

            {/* タグ選択 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-800 mb-1">良かった点</p>
              <p className="text-xs text-slate-400 mb-3">当てはまるものをすべて選んでください（任意）</p>
              <div className="flex flex-wrap gap-2">
                {EVAL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-[#e8836e] text-white border-[#e8836e]"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* メッセージ */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-800 mb-3">コメント（任意）</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="スタッフへのメッセージをご自由にお書きください"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
                rows={3}
              />
            </div>

            {/* 送信 */}
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || submitting}
              className={`w-full py-3.5 rounded-xl text-sm font-bold transition-colors ${
                rating > 0 && !submitting
                  ? "bg-[#e8836e] hover:bg-[#d4705c] text-white"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              {submitting ? "送信中..." : "評価を送信する"}
            </button>
            {rating === 0 && (
              <p className="text-xs text-slate-400 text-center -mt-3">評価（星）を選択してください</p>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
