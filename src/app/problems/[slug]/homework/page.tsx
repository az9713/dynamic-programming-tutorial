"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { problemsBySlug } from "@/data/problems";
import { useProgress } from "@/hooks/useProgress";
import { getSettings } from "@/lib/storage/settings";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { FeedbackPanel, FeedbackData } from "@/components/editor/FeedbackPanel";

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

export default function HomeworkPage() {
  const { slug } = useParams<{ slug: string }>();
  const dark = useTheme();
  const { progress, saveHomeworkScore, markProblemComplete } = useProgress();

  const problem = problemsBySlug[slug];
  const [code, setCode] = useState(problem?.starterCode ?? "");
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const previousScore = progress.homeworkScores[slug];

  useEffect(() => {
    if (problem) setCode(problem.starterCode);
  }, [problem]);

  useEffect(() => {
    const settings = getSettings();
    setApiKey(settings.apiKey);
  }, []);

  async function handleSubmit() {
    if (!problem || !apiKey || submitting) return;

    setSubmitting(true);
    setFeedback({ score: 0, correctness: "", approach: "", style: "", efficiency: "", suggestions: [], isLoading: true });

    try {
      const res = await fetch("/api/ai/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          code,
          problemStatement: problem.problemStatement,
          starterCode: problem.starterCode,
          testCases: problem.testCases,
          apiKey,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as FeedbackData;
      setFeedback(data);
      saveHomeworkScore(slug, data.score, data.correctness);
      if (data.score >= 70) markProblemComplete(slug);
    } catch (err) {
      setFeedback({
        score: 0,
        correctness: "Could not grade — check your API key in Settings.",
        approach: "",
        style: "",
        efficiency: "",
        suggestions: [],
      });
    } finally {
      setSubmitting(false);
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
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link href={`/problems/${slug}`} style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: dark ? "rgba(226,232,240,0.45)" : "rgba(26,26,46,0.45)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            {problem.title}
          </Link>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 700, color: dark ? "#e2e8f0" : "#1a1a2e", letterSpacing: "-0.025em", margin: "0 0 0.5rem" }}>
            Homework: {problem.title}
          </h1>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: dark ? "rgba(226,232,240,0.5)" : "rgba(26,26,46,0.5)" }}>
              Implement the solution in TypeScript
            </span>
            {previousScore && (
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#e8590c", fontWeight: 600 }}>
                Previous score: {previousScore.score}/100
              </span>
            )}
          </div>
          {!apiKey && (
            <div style={{ marginTop: "0.75rem", padding: "0.625rem 1rem", borderRadius: "8px", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.25)", fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "#d97706" }}>
              No API key set. <Link href="/settings" style={{ color: "#d97706", fontWeight: 600 }}>Add it in Settings</Link> to enable AI grading.
            </div>
          )}
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          {/* Test cases hint */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.35 }}>
            <div style={{ padding: "1rem 1.25rem", borderRadius: "10px", border: dark ? "1px solid rgba(226,232,240,0.08)" : "1px solid rgba(26,26,46,0.08)", background: dark ? "#1e293b" : "#ffffff" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: dark ? "rgba(226,232,240,0.4)" : "rgba(26,26,46,0.4)", marginBottom: "0.625rem" }}>Test Cases</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                {problem.testCases.map((tc, i) => (
                  <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: dark ? "rgba(226,232,240,0.65)" : "rgba(26,26,46,0.65)", display: "flex", gap: "0.5rem" }}>
                    <span style={{ color: dark ? "rgba(226,232,240,0.3)" : "rgba(26,26,46,0.3)" }}>{i + 1}.</span>
                    <span>{tc.description}</span>
                    <span style={{ color: "#16a34a", marginLeft: "auto" }}>→ {String(tc.expected)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Code editor */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}>
            <CodeEditor value={code} onChange={setCode} dark={dark} height="380px" />
          </motion.div>

          {/* Submit button */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35 }}>
            <button
              onClick={handleSubmit}
              disabled={submitting || !apiKey}
              style={{
                width: "100%",
                padding: "0.875rem",
                borderRadius: "10px",
                border: "none",
                background: submitting || !apiKey ? (dark ? "rgba(226,232,240,0.08)" : "rgba(26,26,46,0.08)") : "linear-gradient(135deg, #e8590c, #c2410c)",
                color: submitting || !apiKey ? (dark ? "rgba(226,232,240,0.35)" : "rgba(26,26,46,0.35)") : "#ffffff",
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: submitting || !apiKey ? "not-allowed" : "pointer",
                boxShadow: submitting || !apiKey ? "none" : "0 4px 14px rgba(232,89,12,0.3)",
                transition: "opacity 0.15s",
              }}
            >
              {submitting ? "Grading..." : "Submit for AI Grading"}
            </button>
          </motion.div>

          {/* Feedback panel */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }}>
            <FeedbackPanel feedback={feedback} dark={dark} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
