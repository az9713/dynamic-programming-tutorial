"use client";

import type { QuizQuestion } from "@/lib/dp-engine/types";

interface Props {
  question: QuizQuestion;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  showResult: boolean;
  dark: boolean;
}

export function MultipleChoice({
  question,
  selectedAnswer,
  onSelect,
  showResult,
  dark,
}: Props) {
  const options = question.options ?? [];
  const correct = String(question.correctAnswer);

  const borderBase = dark
    ? "rgba(226,232,240,0.08)"
    : "rgba(26,26,46,0.08)";

  function optionStyle(opt: string) {
    const isSelected = selectedAnswer === opt;
    const isCorrect = opt === correct;

    let bg = "transparent";
    let border = borderBase;
    let color = dark ? "rgba(226,232,240,0.8)" : "rgba(26,26,46,0.8)";

    if (showResult) {
      if (isCorrect) {
        bg = "rgba(22,163,74,0.1)";
        border = "rgba(22,163,74,0.4)";
        color = "#16a34a";
      } else if (isSelected && !isCorrect) {
        bg = "rgba(220,38,38,0.1)";
        border = "rgba(220,38,38,0.35)";
        color = "#dc2626";
      }
    } else if (isSelected) {
      bg = "rgba(232,89,12,0.1)";
      border = "rgba(232,89,12,0.4)";
      color = "#e8590c";
    }

    return {
      display: "flex",
      alignItems: "center",
      gap: "0.625rem",
      width: "100%",
      padding: "0.625rem 0.875rem",
      borderRadius: "8px",
      border: `1px solid ${border}`,
      background: bg,
      color,
      fontFamily: "var(--font-body)",
      fontSize: "0.875rem",
      lineHeight: 1.5,
      cursor: showResult ? "default" : "pointer",
      textAlign: "left" as const,
      transition: "border-color 0.15s, background 0.15s",
    };
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.9375rem",
          lineHeight: 1.65,
          color: dark ? "#e2e8f0" : "#1a1a2e",
          margin: "0 0 0.75rem",
          fontWeight: 500,
        }}
      >
        {question.question}
      </p>

      {options.map((opt, i) => {
        const label = String.fromCharCode(65 + i); // A, B, C, D
        const isSelected = selectedAnswer === opt;
        const isCorrect = opt === correct;

        return (
          <button
            key={opt}
            onClick={() => !showResult && onSelect(opt)}
            style={optionStyle(opt)}
          >
            {/* Label circle */}
            <span
              style={{
                flexShrink: 0,
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                border: `1.5px solid currentColor`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.6875rem",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
              }}
            >
              {showResult && isCorrect ? "✓" : showResult && isSelected ? "✗" : label}
            </span>
            {opt}
          </button>
        );
      })}

      {/* Explanation after reveal */}
      {showResult && (
        <div
          style={{
            marginTop: "0.5rem",
            padding: "0.75rem",
            borderRadius: "8px",
            background: dark
              ? "rgba(226,232,240,0.04)"
              : "rgba(26,26,46,0.03)",
            border: `1px solid ${borderBase}`,
          }}
        >
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
