"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizQuestion } from "@/lib/dp-engine/types";
import { MultipleChoice } from "./MultipleChoice";
import { CodingQuestion } from "./CodingQuestion";

interface Props {
  questions: QuizQuestion[];
  dark: boolean;
  timeLimitSeconds?: number;
  onComplete?: (score: number, total: number) => void;
}

type AnswerMap = Record<string, string>;

export function QuizRunner({
  questions,
  dark,
  timeLimitSeconds,
  onComplete,
}: Props) {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds ?? null);
  const [direction, setDirection] = useState(1);

  const textPrimary = dark ? "#e2e8f0" : "#1a1a2e";
  const textMuted = dark ? "rgba(226,232,240,0.45)" : "rgba(26,26,46,0.45)";
  const borderBase = dark ? "rgba(226,232,240,0.08)" : "rgba(26,26,46,0.08)";

  // Timer
  useEffect(() => {
    if (!timeLimitSeconds || submitted) return;
    if (timeLeft === null || timeLeft <= 0) return;

    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null || t <= 1) {
          clearInterval(id);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLimitSeconds, submitted]);

  const score = questions.reduce((acc, q) => {
    const ans = answers[q.id];
    if (!ans) return acc;
    return ans.trim() === String(q.correctAnswer) ? acc + 1 : acc;
  }, 0);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    const s = questions.reduce((acc, q) => {
      const ans = answers[q.id];
      return ans?.trim() === String(q.correctAnswer) ? acc + 1 : acc;
    }, 0);
    onComplete?.(s, questions.length);
  }, [answers, questions, onComplete]);

  function navigate(delta: number) {
    setDirection(delta);
    setCurrentIndex((i) => Math.max(0, Math.min(questions.length - 1, i + delta)));
  }

  const current = questions[currentIndex];
  const answered = Object.keys(answers).length;
  const progress = (answered / questions.length) * 100;

  if (questions.length === 0) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: textMuted,
          fontFamily: "var(--font-body)",
        }}
      >
        No questions available.
      </div>
    );
  }

  if (submitted) {
    const pct = Math.round((score / questions.length) * 100);
    const excellent = pct >= 80;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        {/* Score card */}
        <div
          style={{
            textAlign: "center",
            padding: "2rem 1.5rem",
            borderRadius: "16px",
            border: `1px solid ${borderBase}`,
            background: dark ? "#1e293b" : "#ffffff",
          }}
        >
          <div
            style={{
              fontSize: "3.5rem",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: excellent ? "#16a34a" : "#e8590c",
              lineHeight: 1,
              marginBottom: "0.5rem",
            }}
          >
            {pct}%
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: textMuted,
            }}
          >
            {score} of {questions.length} correct
          </div>
          <div
            style={{
              marginTop: "0.75rem",
              fontFamily: "var(--font-display)",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: textPrimary,
            }}
          >
            {pct >= 90
              ? "Outstanding!"
              : pct >= 70
              ? "Well done!"
              : pct >= 50
              ? "Keep practicing."
              : "Review the theory and try again."}
          </div>
        </div>

        {/* Review all questions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {questions.map((q, i) => (
            <div
              key={q.id}
              style={{
                padding: "1.25rem",
                borderRadius: "12px",
                border: `1px solid ${borderBase}`,
                background: dark ? "#1e293b" : "#ffffff",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6875rem",
                  color: textMuted,
                  marginBottom: "0.75rem",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Q{i + 1} · {q.difficulty}
              </div>
              {q.type === "multiple-choice" ? (
                <MultipleChoice
                  question={q}
                  selectedAnswer={answers[q.id] ?? null}
                  onSelect={() => {}}
                  showResult
                  dark={dark}
                />
              ) : (
                <CodingQuestion
                  question={q}
                  answer={answers[q.id] ?? ""}
                  onChange={() => {}}
                  showResult
                  dark={dark}
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Progress bar + meta */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            flex: 1,
            height: "4px",
            borderRadius: "2px",
            background: dark ? "rgba(226,232,240,0.08)" : "rgba(26,26,46,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #e8590c, #d97706)",
              borderRadius: "2px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: textMuted,
            whiteSpace: "nowrap",
          }}
        >
          {currentIndex + 1} / {questions.length}
        </span>
        {timeLeft !== null && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: timeLeft < 30 ? "#dc2626" : textMuted,
              whiteSpace: "nowrap",
              fontWeight: timeLeft < 30 ? 700 : 400,
            }}
          >
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* Question card */}
      <div style={{ overflow: "hidden", borderRadius: "12px" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ x: direction * 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -40, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              padding: "1.5rem",
              borderRadius: "12px",
              border: `1px solid ${borderBase}`,
              background: dark ? "#1e293b" : "#ffffff",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                color: textMuted,
                marginBottom: "1rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Question {currentIndex + 1} · {current.type === "multiple-choice" ? "Multiple Choice" : "Code"} · {current.difficulty}
            </div>

            {current.type === "multiple-choice" ? (
              <MultipleChoice
                question={current}
                selectedAnswer={answers[current.id] ?? null}
                onSelect={(ans) =>
                  setAnswers((prev) => ({ ...prev, [current.id]: ans }))
                }
                showResult={false}
                dark={dark}
              />
            ) : (
              <CodingQuestion
                question={current}
                answer={answers[current.id] ?? ""}
                onChange={(val) =>
                  setAnswers((prev) => ({ ...prev, [current.id]: val }))
                }
                showResult={false}
                dark={dark}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          disabled={currentIndex === 0}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: `1px solid ${borderBase}`,
            background: "transparent",
            color: currentIndex === 0 ? textMuted : textPrimary,
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            opacity: currentIndex === 0 ? 0.4 : 1,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Prev
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => navigate(1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.5rem 1.25rem",
              borderRadius: "8px",
              border: `1px solid ${borderBase}`,
              background: "transparent",
              color: textPrimary,
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={answered === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.5rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              background:
                answered === 0
                  ? dark
                    ? "rgba(226,232,240,0.08)"
                    : "rgba(26,26,46,0.08)"
                  : "linear-gradient(135deg, #e8590c, #c2410c)",
              color: answered === 0 ? textMuted : "#ffffff",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: answered === 0 ? "not-allowed" : "pointer",
              boxShadow:
                answered > 0 ? "0 2px 8px rgba(232,89,12,0.3)" : "none",
            }}
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}
