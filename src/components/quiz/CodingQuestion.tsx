"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/dp-engine/types";

interface Props {
  question: QuizQuestion;
  answer: string;
  onChange: (value: string) => void;
  showResult: boolean;
  dark: boolean;
}

export function CodingQuestion({
  question,
  answer,
  onChange,
  showResult,
  dark,
}: Props) {
  const [focused, setFocused] = useState(false);
  const correct = String(question.correctAnswer);

  const borderBase = dark
    ? "rgba(226,232,240,0.1)"
    : "rgba(26,26,46,0.1)";

  let borderColor = focused ? "#e8590c" : borderBase;
  if (showResult) {
    const trimmed = answer.trim();
    borderColor =
      trimmed === correct
        ? "rgba(22,163,74,0.5)"
        : "rgba(220,38,38,0.5)";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.9375rem",
          lineHeight: 1.65,
          color: dark ? "#e2e8f0" : "#1a1a2e",
          margin: 0,
          fontWeight: 500,
        }}
      >
        {question.question}
      </p>

      <div
        style={{
          borderRadius: "8px",
          border: `1px solid ${borderColor}`,
          overflow: "hidden",
          transition: "border-color 0.15s",
        }}
      >
        {/* Fake editor header */}
        <div
          style={{
            padding: "0.4rem 0.75rem",
            background: dark ? "#0f172a" : "#f0ece4",
            borderBottom: `1px solid ${borderBase}`,
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            color: dark ? "rgba(226,232,240,0.3)" : "rgba(26,26,46,0.3)",
          }}
        >
          TypeScript
        </div>

        <textarea
          value={answer}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={showResult}
          spellCheck={false}
          rows={6}
          style={{
            display: "block",
            width: "100%",
            padding: "0.75rem",
            background: dark ? "#1e293b" : "#ffffff",
            border: "none",
            outline: "none",
            resize: "vertical",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
            lineHeight: 1.6,
            color: dark ? "#e2e8f0" : "#1a1a2e",
            cursor: showResult ? "default" : "text",
          }}
        />
      </div>

      {showResult && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              background:
                answer.trim() === correct
                  ? "rgba(22,163,74,0.1)"
                  : "rgba(220,38,38,0.1)",
              border:
                answer.trim() === correct
                  ? "1px solid rgba(22,163,74,0.3)"
                  : "1px solid rgba(220,38,38,0.3)",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: answer.trim() === correct ? "#16a34a" : "#dc2626",
              fontWeight: 600,
            }}
          >
            {answer.trim() === correct ? "Correct!" : `Expected: ${correct}`}
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              lineHeight: 1.6,
              color: dark ? "rgba(226,232,240,0.65)" : "rgba(26,26,46,0.65)",
              margin: 0,
            }}
          >
            <strong
              style={{ color: dark ? "rgba(226,232,240,0.9)" : "#1a1a2e" }}
            >
              Explanation:{" "}
            </strong>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
