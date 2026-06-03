"use client";

type Props = {
  onCalendarClick: () => void;
  onNoticeClick: () => void;
};

export function QuickAccessBar({ onCalendarClick, onNoticeClick }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-20">
      <div className="max-w-md mx-auto px-4 py-3 grid grid-cols-2 gap-3">
        <button
          onClick={onCalendarClick}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
        >
          <span className="text-xl">📅</span>
          <span>親方の予定</span>
        </button>
        <button
          onClick={onNoticeClick}
          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
        >
          <span className="text-xl">📌</span>
          <span>掲示板</span>
        </button>
      </div>
    </div>
  );
}
