"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { examsById } from "@/data/exams";
import { useProgress } from "@/hooks/useProgress";
import { useTimer } from "@/hooks/useTimer";
import { QuizRunner } from "@/components/quiz/QuizRunner";

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

type Phase = "intro" | "exam" | "done";

export default function ExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const dark = useTheme();
  const { progress, saveExamScore } = useProgress();

  const exam = examsById[examId];
  const [phase, setPhase] = useState<Phase>("intro");
  const [finalScore, setFinalScore] = useState<{ score: number; total: number } | null>(null);

  const timer = useTimer(exam ? exam.timeLimitMinutes * 60 : 1800);

  const handleStart = useCallback(() => {
    setPhase("exam");
    timer.start();
  }, [timer]);

  const handleComplete = useCallback(
    (score: number, total: number) => {
      timer.pause();
      setFinalScore({ score, total });
      setPhase("done");
      saveExamScore(examId, score, total);
    },
    [examId, saveExamScore, timer]
  );

  // Auto-submit when timer hits zero
  useEffect(() => {
    if (phase === "exam" && timer.timeLeft === 0) {
      // QuizRunner will auto-submit via its own timer; here we just mark done if not already
      setPhase("done");
    }
  }, [timer.timeLeft, phase]);

  const textPrimary = dark ? "#e2e8f0" : "#1a1a2e";
  const textMuted = dark ? "rgba(226,232,240,0.5)" : "rgba(26,26,46,0.5)";
  const borderBase = dark ? "rgba(226,232,240,0.08)" : "rgba(26,26,46,0.08)";
  const cardBg = dark ? "#1e293b" : "#ffffff";

  if (!exam) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "#0f172a" : "#faf8f5" }}>
        <div style={{ textAlign: "center", fontFamily: "var(--font-body)" }}>
          <p style={{ fontSize: "1.25rem", fontWeight: 600, color: textPrimary, margin: "0 0 1rem" }}>Exam not found</p>
          <Link href="/exams" style={{ color: "#e8590c", textDecoration: "none", fontWeight: 600 }}>Back to Exams</Link>
        </div>
      </div>
    );
  }

  const pastScore = progress.examScores[examId];

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#0f172a" : "#faf8f5", transition: "background 0.2s" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link href="/exams" style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: textMuted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            All Exams
          </Link>
        </div>

        {/* Intro phase */}
        {phase === "intro" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: textPrimary, letterSpacing: "-0.025em", margin: "0 0 0.75rem" }}>
              {exam.title}
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.65, color: textMuted, margin: "0 0 2rem", maxWidth: "560px" }}>
              {exam.description}
            </p>

            {/* Exam details */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
              {[
                { label: "Questions", value: String(exam.questions.length) },
                { label: "Time Limit", value: `${exam.timeLimitMinutes} min` },
                { label: "Problems", value: String(exam.problemSlugs.length) },
                ...(pastScore ? [{ label: "Best Score", value: `${Math.round((pastScore.score / pastScore.total) * 100)}%` }] : []),
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: "1rem", borderRadius: "10px", border: `1px solid ${borderBase}`, background: cardBg, textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: textMuted, marginBottom: "0.375rem" }}>{label}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 700, color: textPrimary }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: "1rem 1.25rem", borderRadius: "10px", background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", marginBottom: "2rem", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#d97706", lineHeight: 1.6 }}>
              <strong>Instructions:</strong> Once started, the timer cannot be paused. The exam auto-submits when time expires. Answer as many questions as you can.
            </div>

            <button
              onClick={handleStart}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.625rem", padding: "0.9rem 2rem", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #e8590c, #c2410c)", color: "#fff", fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(232,89,12,0.35)" }}
            >
              Start Exam
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </motion.div>
        )}

        {/* Exam phase */}
        {phase === "exam" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {/* Timer banner */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", padding: "0.75rem 1.25rem", borderRadius: "10px", border: `1px solid ${borderBase}`, background: cardBg }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: textPrimary }}>{exam.title}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.125rem", fontWeight: 700, color: timer.timeLeft < 120 ? "#dc2626" : "#e8590c", letterSpacing: "0.05em" }}>
                {timer.formatTime()}
              </span>
            </div>

            <QuizRunner
              questions={exam.questions}
              dark={dark}
              timeLimitSeconds={exam.timeLimitMinutes * 60}
              onComplete={handleComplete}
            />
          </motion.div>
        )}

        {/* Done phase */}
        {phase === "done" && finalScore && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <div style={{ textAlign: "center", padding: "3rem 2rem", borderRadius: "16px", border: `1px solid ${borderBase}`, background: cardBg, marginBottom: "2rem" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "4rem", fontWeight: 700, color: "#e8590c", lineHeight: 1, marginBottom: "0.5rem" }}>
                {Math.round((finalScore.score / finalScore.total) * 100)}%
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "1.125rem", color: textMuted, marginBottom: "0.5rem" }}>
                {finalScore.score} of {finalScore.total} correct
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 600, color: textPrimary }}>
                {Math.round((finalScore.score / finalScore.total) * 100) >= 70 ? "Exam passed!" : "Keep studying and try again."}
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/exams" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "10px", border: `1px solid ${borderBase}`, background: "transparent", color: textPrimary, fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 600, textDecoration: "none" }}>
                All Exams
              </Link>
              <Link href="/progress" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "10px", background: "linear-gradient(135deg, #e8590c, #c2410c)", color: "#fff", fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(232,89,12,0.3)" }}>
                View Progress
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
