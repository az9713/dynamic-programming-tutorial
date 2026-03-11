"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAITutor } from "@/hooks/useAITutor";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import type { TutorContextParams } from "@/lib/ai/context-builder";

interface Props {
  open: boolean;
  onClose: () => void;
  dark: boolean;
  problemContext?: TutorContextParams;
  apiKey?: string;
}

export function TutorSidebar({ open, onClose, dark, problemContext, apiKey }: Props) {
  const { messages, isLoading, error, send, clear } = useAITutor({
    problemContext,
    apiKey,
  });
  const [officeHours, setOfficeHours] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  // Build placeholder based on mode
  const placeholder = officeHours
    ? "Ask anything about DP..."
    : "Ask about this problem...";

  const bg = dark ? "#0f172a" : "#faf8f5";
  const borderColor = dark
    ? "rgba(226,232,240,0.08)"
    : "rgba(26,26,46,0.08)";
  const textPrimary = dark ? "#e2e8f0" : "#1a1a2e";
  const textMuted = dark ? "rgba(226,232,240,0.45)" : "rgba(26,26,46,0.45)";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop (mobile only) */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 49,
            }}
            className="tutor-backdrop"
          />

          {/* Sidebar panel */}
          <motion.aside
            key="sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(420px, 100vw)",
              background: bg,
              borderLeft: `1px solid ${borderColor}`,
              display: "flex",
              flexDirection: "column",
              zIndex: 50,
              boxShadow: dark
                ? "-8px 0 32px rgba(0,0,0,0.5)"
                : "-8px 0 32px rgba(26,26,46,0.12)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1rem 0.875rem",
                borderBottom: `1px solid ${borderColor}`,
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #e8590c, #d97706)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    color: "#fff",
                    fontFamily: "var(--font-mono)",
                    flexShrink: 0,
                  }}
                >
                  AI
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      color: textPrimary,
                      lineHeight: 1.2,
                    }}
                  >
                    DP Tutor
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.6875rem",
                      color: textMuted,
                    }}
                  >
                    {officeHours ? "Office Hours — any question" : "Problem-focused mode"}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                {/* Office Hours toggle */}
                <button
                  onClick={() => setOfficeHours((v) => !v)}
                  title={officeHours ? "Switch to problem mode" : "Switch to office hours"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.3rem 0.625rem",
                    borderRadius: "6px",
                    border: officeHours
                      ? "1px solid rgba(13,148,136,0.4)"
                      : `1px solid ${borderColor}`,
                    background: officeHours
                      ? "rgba(13,148,136,0.1)"
                      : "transparent",
                    color: officeHours ? "#0d9488" : textMuted,
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Office Hours
                </button>

                {/* Clear */}
                {messages.length > 0 && (
                  <button
                    onClick={clear}
                    title="Clear conversation"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "6px",
                      border: `1px solid ${borderColor}`,
                      background: "transparent",
                      color: textMuted,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                )}

                {/* Close */}
                <button
                  onClick={onClose}
                  aria-label="Close tutor"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "6px",
                    border: `1px solid ${borderColor}`,
                    background: "transparent",
                    color: textMuted,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              {messages.length === 0 && (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    textAlign: "center",
                    padding: "2rem",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #e8590c, #d97706)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                    }}
                  >
                    🎓
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: textPrimary,
                        margin: "0 0 0.375rem",
                      }}
                    >
                      Ask me anything
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8125rem",
                        color: textMuted,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {officeHours
                        ? "Office Hours mode — ask any DP question."
                        : "I know this problem in detail. Ask about the recurrence, trace a step, or explain your approach."}
                    </p>
                  </div>

                  {/* Suggestion chips */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.375rem",
                      justifyContent: "center",
                      marginTop: "0.5rem",
                    }}
                  >
                    {[
                      "Explain the recurrence",
                      "Trace step by step",
                      "What are the base cases?",
                      "Give me a hint",
                    ].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => send(chip)}
                        style={{
                          padding: "0.3rem 0.75rem",
                          borderRadius: "20px",
                          border: `1px solid ${borderColor}`,
                          background: "transparent",
                          color: textMuted,
                          fontFamily: "var(--font-body)",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          transition: "border-color 0.15s, color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor =
                            "#e8590c";
                          (e.currentTarget as HTMLButtonElement).style.color = "#e8590c";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor =
                            borderColor;
                          (e.currentTarget as HTMLButtonElement).style.color = textMuted;
                        }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} dark={dark} />
              ))}
            </div>

            {/* Error banner */}
            {error && (
              <div
                style={{
                  margin: "0 0.75rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  background: "rgba(220,38,38,0.1)",
                  border: "1px solid rgba(220,38,38,0.2)",
                  color: "#dc2626",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                }}
              >
                {error}
              </div>
            )}

            {/* Input */}
            <ChatInput
              onSend={send}
              disabled={isLoading}
              dark={dark}
              placeholder={placeholder}
            />
          </motion.aside>

          <style>{`
            @media (min-width: 768px) {
              .tutor-backdrop { display: none !important; }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
