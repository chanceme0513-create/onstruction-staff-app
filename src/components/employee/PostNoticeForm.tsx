"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  isOpen: boolean;
  postedBy: string;
  onClose: () => void;
  onPosted: () => void;
};

export function PostNoticeForm({ isOpen, postedBy, onClose, onPosted }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("タイトルと内容を入力してください");
      return;
    }
    setSubmitting(true);

    const { error } = await supabase.from("notices").insert({
      title: title.trim(),
      content: content.trim(),
      posted_by: postedBy,
      is_pinned: isPinned,
    });

    setSubmitting(false);

    if (error) {
      console.error(error);
      alert("投稿に失敗しました。もう一度お試しください。");
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle("");
      setContent("");
      setIsPinned(false);
      onPosted();
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">📝 事務連絡を投稿</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        {!submitted ? (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                タイトル<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例: A現場 進捗状況"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                maxLength={50}
              />
              <p className="text-xs text-gray-400 mt-1">{title.length}/50文字</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                内容<span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="連絡事項の詳細を入力してください..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                rows={6}
                maxLength={300}
              />
              <p className="text-xs text-gray-400 mt-1">{content.length}/300文字</p>
            </div>

            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
              <input
                type="checkbox"
                id="pin-notice"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-300"
              />
              <label htmlFor="pin-notice" className="text-sm text-gray-700 cursor-pointer flex-1">
                📍 この連絡を固定する（重要なお知らせ）
              </label>
            </div>

            {(title || content) && (
              <div className="border-t pt-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">プレビュー</p>
                <div className={`border rounded-xl px-4 py-3 ${isPinned ? "border-yellow-300 bg-yellow-50" : "border-gray-100 bg-white"}`}>
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">
                    {isPinned && <span className="text-yellow-600 mr-1">📍</span>}
                    {title || "タイトルを入力してください"}
                  </h3>
                  <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
                    {content || "内容を入力してください"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-medium">{postedBy}</span>
                    <span>今</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`w-full font-semibold py-3 rounded-lg transition-colors ${
                submitting ? "bg-gray-200 text-gray-400" : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {submitting ? "投稿中..." : "投稿する"}
            </button>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-lg font-bold text-gray-800 mb-2">投稿しました！</p>
            <p className="text-sm text-gray-600">チーム全員に通知されました</p>
          </div>
        )}
      </div>
    </div>
  );
}
