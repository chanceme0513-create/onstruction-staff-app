"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** "center"（デフォルト）または "bottom"（ボトムシート） */
  position?: "center" | "bottom";
  maxWidth?: "sm" | "md" | "lg";
};

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  position = "center",
  maxWidth = "md",
}: Props) {
  // ESC キーで閉じる
  const closeFnRef = useRef(onClose);
  closeFnRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeFnRef.current();
    }
    document.addEventListener("keydown", handleKey);
    // body スクロール抑制
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const content =
    position === "bottom" ? (
      <div
        className="fixed inset-0 bg-black/40 z-50 flex items-end"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className={`bg-white w-full rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up ${maxWidthClasses[maxWidth]} mx-auto`}>
          <ModalInner title={title} onClose={onClose}>{children}</ModalInner>
        </div>
      </div>
    ) : (
      <div
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className={`bg-white w-full rounded-2xl shadow-xl flex flex-col animate-fade-in ${maxWidthClasses[maxWidth]}`}>
          <ModalInner title={title} onClose={onClose}>{children}</ModalInner>
        </div>
      </div>
    );

  return createPortal(content, document.body);
}

function ModalInner({
  title,
  onClose,
  children,
}: {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      {title && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>
      )}
      <div className="overflow-y-auto flex-1">{children}</div>
    </>
  );
}
