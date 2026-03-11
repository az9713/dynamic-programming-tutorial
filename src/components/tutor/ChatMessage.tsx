"use client";

import { useEffect, useState } from "react";
import type { TutorMessage } from "@/hooks/useAITutor";

interface Props {
  message: TutorMessage;
  dark: boolean;
}

// Minimal markdown renderer: bold, inline code, code blocks, paragraphs
function renderMarkdown(text: string, dark: boolean): React.ReactNode {
  // Split on fenced code blocks first
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const lines = part.slice(3, -3).split("\n");
      // First line may be language hint
      const code = lines[0].match(/^[a-z]+$/) ? lines.slice(1).join("\n") : lines.join("\n");
      return (
        <pre
          key={i}
          style={{
            background: dark ? "rgba(0,0,0,0.35)" : "rgba(26,26,46,0.05)",
            border: dark
              ? "1px solid rgba(226,232,240,0.08)"
              : "1px solid rgba(26,26,46,0.08)",
            borderRadius: "6px",
            padding: "0.625rem 0.75rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            lineHeight: 1.6,
            overflowX: "auto",
            margin: "0.5rem 0",
            color: dark ? "#e2e8f0" : "#1a1a2e",
            whiteSpace: "pre",
          }}
        >
          {code}
        </pre>
      );
    }

    // Inline formatting within normal text
    const lines = part.split("\n");
    return (
      <span key={i}>
        {lines.map((line, li) => {
          const segments = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
          return (
            <span key={li}>
              {segments.map((seg, si) => {
                if (seg.startsWith("`") && seg.endsWith("`")) {
                  return (
                    <code
                      key={si}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.78em",
                        background: dark
                          ? "rgba(226,232,240,0.1)"
                          : "rgba(26,26,46,0.08)",
                        borderRadius: "3px",
                        padding: "0.1em 0.35em",
                        color: dark ? "#e2e8f0" : "#1a1a2e",
                      }}
                    >
                      {seg.slice(1, -1)}
                    </code>
                  );
                }
                if (seg.startsWith("**") && seg.endsWith("**")) {
                  return <strong key={si}>{seg.slice(2, -2)}</strong>;
                }
                return seg;
              })}
              {li < lines.length - 1 && <br />}
            </span>
          );
        })}
      </span>
    );
  });
}

function TypingIndicator({ dark }: { dark: boolean }) {
  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}
      aria-label="Typing..."
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: dark ? "rgba(226,232,240,0.4)" : "rgba(26,26,46,0.35)",
            display: "inline-block",
            animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes typing-dot {
          0%, 80%, 100% { transform: scale(1); opacity: 0.5; }
          40% { transform: scale(1.25); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatMessage({ message, dark }: Props) {
  const isUser = message.role === "user";
  const isEmpty = message.content.trim() === "" && message.isStreaming;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: "0.5rem",
        padding: "0.25rem 0",
      }}
    >
      {/* Avatar */}
      {!isUser && (
        <div
          aria-hidden
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e8590c, #d97706)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.65rem",
            fontWeight: 700,
            color: "#fff",
            fontFamily: "var(--font-mono)",
          }}
        >
          DP
        </div>
      )}

      {/* Bubble */}
      <div
        style={{
          maxWidth: "78%",
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
          gap: "3px",
        }}
      >
        <div
          style={{
            padding: "0.625rem 0.875rem",
            borderRadius: isUser ? "14px 14px 4px 14px" : "4px 14px 14px 14px",
            background: isUser
              ? "linear-gradient(135deg, #e8590c, #c2410c)"
              : dark
              ? "#1e293b"
              : "#f0ece4",
            color: isUser
              ? "#ffffff"
              : dark
              ? "#e2e8f0"
              : "#1a1a2e",
            fontFamily: "var(--font-body)",
            fontSize: "0.84375rem",
            lineHeight: 1.6,
            border: isUser
              ? "none"
              : dark
              ? "1px solid rgba(226,232,240,0.07)"
              : "1px solid rgba(26,26,46,0.07)",
            wordBreak: "break-word",
          }}
        >
          {isEmpty ? (
            <TypingIndicator dark={dark} />
          ) : (
            renderMarkdown(message.content, dark && !isUser)
          )}
        </div>

        {/* Timestamp */}
        <span
          style={{
            fontSize: "0.6875rem",
            color: dark ? "rgba(226,232,240,0.25)" : "rgba(26,26,46,0.3)",
            fontFamily: "var(--font-body)",
          }}
        >
          {formatTime(message.timestamp)}
          {message.isStreaming && !isEmpty && (
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "10px",
                background: dark ? "rgba(226,232,240,0.5)" : "rgba(26,26,46,0.4)",
                borderRadius: "1px",
                marginLeft: "3px",
                animation: "cursor-blink 1s step-end infinite",
              }}
            />
          )}
        </span>
      </div>

      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
