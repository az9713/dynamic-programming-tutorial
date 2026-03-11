"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { problemsBySlug } from "@/data/problems";
import { quizzesBySlug } from "@/data/quizzes";
import { useProgress } from "@/hooks/useProgress";
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

export default function QuizPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const dark = useTheme();
  const { progress, saveQuizScore, markProblemComplete } = useProgress();

  const problem = problemsBySlug[slug];
  const questions = quizzesBySlug[slug] ?? [];
  const previousBest = progress.quizScores[slug];

  function handleComplete(score: number, total: number) {
    const pct = Math.round((score / total) * 100);
    saveQuizScore(slug, pct);
    if (pct >= 70) {
      markProblemComplete(slug);
    }
  }

  if (!problem) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "#0f172a" : "#faf8f5" }}>
        <div style={{ textAlign: "center", fontFamily: "var(--font-body)" }}>
          <p style={{ fontSize: "1.25rem", fontWeight: 600, color: dark ? "#e2e8f0" : "#1a1a2e", margin: "0 0 1rem" }}>Problem not found</p>
          <Link href="/problems" style={{ color: "#e8590c", textDecoration: "none", fontWeight: 600 }}>Back to Problems</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#0f172a" : "#faf8f5", transition: "background 0.2s" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <Link href={`/problems/${slug}`} style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: dark ? "rgba(226,232,240,0.45)" : "rgba(26,26,46,0.45)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            {problem.title}
          </Link>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 700, color: dark ? "#e2e8f0" : "#1a1a2e", letterSpacing: "-0.025em", margin: "0 0 0.5rem" }}>
            Quiz: {problem.title}
          </h1>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: dark ? "rgba(226,232,240,0.5)" : "rgba(26,26,46,0.5)" }}>
              {questions.length} questions
            </span>
            {previousBest !== undefined && (
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#e8590c", fontWeight: 600 }}>
                Best: {previousBest}%
              </span>
            )}
          </div>
        </motion.div>

        {/* Quiz */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}>
          <QuizRunner
            questions={questions}
            dark={dark}
            onComplete={handleComplete}
          />
        </motion.div>

        {/* Back link */}
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link href={`/problems/${slug}`} style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: dark ? "rgba(226,232,240,0.4)" : "rgba(26,26,46,0.4)", textDecoration: "none" }}>
            Back to problem
          </Link>
        </div>
      </div>
    </div>
  );
}
