"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { exams } from "@/data/exams";
import { useProgress } from "@/hooks/useProgress";

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

export default function ExamsPage() {
  const dark = useTheme();
  const { progress } = useProgress();

  const textPrimary = dark ? "#e2e8f0" : "#1a1a2e";
  const textMuted = dark ? "rgba(226,232,240,0.5)" : "rgba(26,26,46,0.5)";
  const borderBase = dark ? "rgba(226,232,240,0.08)" : "rgba(26,26,46,0.08)";
  const cardBg = dark ? "#1e293b" : "#ffffff";

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#0f172a" : "#faf8f5", transition: "background 0.2s" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: textPrimary, letterSpacing: "-0.025em", margin: "0 0 0.5rem" }}>
            Exams
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: textMuted, margin: 0 }}>
            Test your mastery under timed conditions. Scores are saved to your progress.
          </p>
        </motion.div>

        {/* Exam cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {exams.map((exam, i) => {
            const pastScore = progress.examScores[exam.id];
            const pct = pastScore ? Math.round((pastScore.score / pastScore.total) * 100) : null;

            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y: -2, transition: { duration: 0.18 } }}
              >
                <div style={{ padding: "1.75rem", borderRadius: "16px", border: `1px solid ${borderBase}`, background: cardBg, boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.25)" : "0 2px 8px rgba(26,26,46,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 700, color: textPrimary, margin: 0 }}>
                          {exam.title}
                        </h2>
                        {pct !== null && (
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", fontWeight: 700, padding: "0.2rem 0.625rem", borderRadius: "20px", background: pct >= 70 ? "rgba(22,163,74,0.12)" : "rgba(232,89,12,0.12)", color: pct >= 70 ? "#16a34a" : "#e8590c", border: pct >= 70 ? "1px solid rgba(22,163,74,0.25)" : "1px solid rgba(232,89,12,0.25)" }}>
                            {pct}%
                          </span>
                        )}
                      </div>

                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", lineHeight: 1.6, color: textMuted, margin: "0 0 1rem" }}>
                        {exam.description}
                      </p>

                      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", letterSpacing: "0.05em", textTransform: "uppercase", color: textMuted, marginBottom: "0.25rem" }}>Questions</div>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: textPrimary }}>{exam.questions.length}</div>
                        </div>
                        <div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", letterSpacing: "0.05em", textTransform: "uppercase", color: textMuted, marginBottom: "0.25rem" }}>Time Limit</div>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: textPrimary }}>{exam.timeLimitMinutes} min</div>
                        </div>
                        <div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", letterSpacing: "0.05em", textTransform: "uppercase", color: textMuted, marginBottom: "0.25rem" }}>Problems</div>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: textPrimary }}>{exam.problemSlugs.length}</div>
                        </div>
                        {pastScore && (
                          <div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", letterSpacing: "0.05em", textTransform: "uppercase", color: textMuted, marginBottom: "0.25rem" }}>Last Taken</div>
                            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 600, color: textPrimary }}>{pastScore.date}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Start button */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
                      <Link
                        href={`/exams/${exam.id}`}
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "10px", background: "linear-gradient(135deg, #e8590c, #c2410c)", color: "#fff", fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(232,89,12,0.3)", whiteSpace: "nowrap" }}
                      >
                        {pastScore ? "Retake" : "Start Exam"}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
