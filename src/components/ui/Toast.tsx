"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

type ToastData = { message: string; type: ToastType };

type Props = {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
};

const CONFIG: Record<ToastType, { bg: string; icon: string }> = {
  success: { bg: "bg-gray-900", icon: "✓" },
  error:   { bg: "bg-red-600",  icon: "✕" },
  info:    { bg: "bg-gray-700", icon: "ℹ" },
};

export function Toast({ message, type = "success", duration = 3000, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const { bg, icon } = CONFIG[type];

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2.5 px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-xl animate-fade-in ${bg}`}
    >
      <span className="text-base leading-none">{icon}</span>
      <span>{message}</span>
    </div>
  );
}

// 使い勝手のよいフック
export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null);

  function showToast(message: string, type: ToastType = "success") {
    setToast({ message, type });
  }

  function hideToast() {
    setToast(null);
  }

  return { toast, showToast, hideToast };
}
