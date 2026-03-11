"use client";

import { useState, useRef, KeyboardEvent } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
  dark: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  dark,
  placeholder = "Ask about this problem...",
}: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  const borderColor = dark
    ? "rgba(226,232,240,0.1)"
    : "rgba(26,26,46,0.1)";
  const focusBorder = "#e8590c";

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        padding: "0.75rem",
        borderTop: `1px solid ${borderColor}`,
        background: dark ? "#0f172a" : "#faf8f5",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          flex: 1,
          borderRadius: "10px",
          border: `1px solid ${borderColor}`,
          background: dark ? "#1e293b" : "#ffffff",
          overflow: "hidden",
          transition: "border-color 0.15s",
        }}
        onFocusCapture={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = focusBorder;
        }}
        onBlurCapture={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = borderColor;
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
          placeholder={disabled ? "Waiting for response..." : placeholder}
          rows={1}
          style={{
            display: "block",
            width: "100%",
            padding: "0.625rem 0.75rem",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            lineHeight: 1.5,
            color: dark ? "#e2e8f0" : "#1a1a2e",
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "text",
          }}
        />
      </div>

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        style={{
          flexShrink: 0,
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          border: "none",
          background:
            disabled || !value.trim()
              ? dark
                ? "rgba(226,232,240,0.08)"
                : "rgba(26,26,46,0.08)"
              : "linear-gradient(135deg, #e8590c, #c2410c)",
          color:
            disabled || !value.trim()
              ? dark
                ? "rgba(226,232,240,0.25)"
                : "rgba(26,26,46,0.25)"
              : "#ffffff",
          cursor: disabled || !value.trim() ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.15s, transform 0.1s",
          transform: "translateY(0)",
        }}
        onMouseEnter={(e) => {
          if (!disabled && value.trim()) {
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform =
            "translateY(0)";
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
        </svg>
      </button>
    </div>
  );
}
