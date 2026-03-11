"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { problems } from "@/data/problems";
import { exams } from "@/data/exams";
import { useProgress } from "@/hooks/useProgress";
import { RadarChart } from "@/components/progress/RadarChart";
import { BadgeGrid, Badge } from "@/components/progress/BadgeGrid";
import { StreakTracker } from "@/components/progress/StreakTracker";
import type { DPCategory } from "@/lib/dp-engine/types";

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

// All possible badges
const ALL_BADGES: Omit<Badge, "earned" | "earnedDate">[] = [
  { id: "first-steps", label: "First Steps", description: "Complete your first problem", icon: "🎯" },
  { id: "fibonacci-master", label: "Fib Master", description: "Complete Fibonacci", icon: "🌀" },
  { id: "halfway", label: "Halfway", description: "Complete 5 problems", icon: "⭐" },
  { id: "completionist", label: "Completionist", description: "Complete all 10 problems", icon: "🏆" },
  { id: "quiz-ace", label: "Quiz Ace", description: "Score 100% on any quiz", icon: "💯" },
  { id: "exam-pass", label: "Exam Passed", description: "Pass any exam with 70%+", icon: "🎓" },
  { id: "streak-7", label: "7-Day Streak", description: "Study 7 days in a row", icon: "🔥" },
  { id: "string-dp", label: "String Wizard", description: "Complete both string DP problems", icon: "🧵" },
];

function Section({ title, dark, children }: { title: string; dark: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: dark ? "#e2e8f0" : "#1a1a2e", marginBottom: "1.25rem", letterSpacing: "-0.02em" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function ProgressPage() {
  const dark = useTheme();
  const { progress } = useProgress();

  const textPrimary = dark ? "#e2e8f0" : "#1a1a2e";
  const textMuted = dark ? "rgba(226,232,240,0.5)" : "rgba(26,26,46,0.5)";
  const borderBase = dark ? "rgba(226,232,240,0.08)" : "rgba(26,26,46,0.08)";
  const cardBg = dark ? "#1e293b" : "#ffffff";

  const completedCount = progress.completedProblems.length;
  const totalProblems = problems.length;
  const pctComplete = Math.round((completedCount / totalProblems) * 100);

  // Build badges with earned status
  const earnedSet = new Set(progress.badges);
  const computedBadges: Badge[] = ALL_BADGES.map((b) => ({
    ...b,
    earned: earnedSet.has(b.id),
  }));

  // Default category scores for radar
  const defaultSkillScores: Record<DPCategory, number> = {
    "Linear DP": 0,
    "Choice DP": 0,
    "2D DP": 0,
    "String DP": 0,
    "Interval DP": 0,
    "LIS-style": 0,
    "Grid DP": 0,
  };
  const skillScores = { ...defaultSkillScores, ...progress.skillScores };

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#0f172a" : "#faf8f5", transition: "background 0.2s" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: textPrimary, letterSpacing: "-0.025em", margin: "0 0 0.5rem" }}>
            Your Progress
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: textMuted, margin: 0 }}>
            {completedCount} of {totalProblems} problems completed ({pctComplete}%)
          </p>
        </motion.div>

        {/* Overview stats */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.35 }} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem", marginBottom: "2.5rem" }}>
          {[
            { label: "Problems Solved", value: `${completedCount}/${totalProblems}` },
            { label: "Quizzes Taken", value: String(Object.keys(progress.quizScores).length) },
            { label: "Avg Quiz Score", value: (() => { const scores = Object.values(progress.quizScores); return scores.length > 0 ? `${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}%` : "—"; })() },
            { label: "Exams Passed", value: String(Object.values(progress.examScores).filter((s) => Math.round((s.score / s.total) * 100) >= 70).length) },
            { label: "Day Streak", value: String(progress.streak.current) },
          ].map(({ label, value }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.04 }} style={{ padding: "1rem", borderRadius: "10px", border: `1px solid ${borderBase}`, background: cardBg, textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: textMuted, marginBottom: "0.375rem" }}>{label}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: textPrimary }}>{value}</div>
            </motion.div>
          ))}
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
          {/* Radar chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}>
            <Section title="Skill Map" dark={dark}>
              <div style={{ padding: "1.25rem", borderRadius: "12px", border: `1px solid ${borderBase}`, background: cardBg }}>
                <RadarChart skillScores={skillScores} dark={dark} />
              </div>
            </Section>
          </motion.div>

          {/* Streak */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35 }}>
            <Section title="Streak" dark={dark}>
              <StreakTracker current={progress.streak.current} lastDate={progress.streak.lastDate} dark={dark} />
            </Section>
          </motion.div>
        </div>

        {/* Badges */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }}>
          <Section title="Badges" dark={dark}>
            <BadgeGrid badges={computedBadges} dark={dark} />
          </Section>
        </motion.div>

        {/* Problem completion list */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.35 }}>
          <Section title="Problem Progress" dark={dark}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {problems.map((p) => {
                const done = progress.completedProblems.includes(p.slug);
                const quizScore = progress.quizScores[p.slug];
                const hwScore = progress.homeworkScores[p.slug];
                return (
                  <Link key={p.slug} href={`/problems/${p.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 1rem", borderRadius: "10px", border: `1px solid ${borderBase}`, background: cardBg, transition: "border-color 0.15s" }}>
                      {/* Status dot */}
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: done ? "#16a34a" : dark ? "rgba(226,232,240,0.15)" : "rgba(26,26,46,0.12)", flexShrink: 0 }} />

                      {/* Number + title */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 600, color: textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.number}. {p.title}
                        </div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: textMuted }}>{p.category}</div>
                      </div>

                      {/* Scores */}
                      <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
                        {quizScore !== undefined && (
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", color: textMuted, letterSpacing: "0.04em" }}>QUIZ</div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 700, color: quizScore >= 70 ? "#16a34a" : "#e8590c" }}>{quizScore}%</div>
                          </div>
                        )}
                        {hwScore && (
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", color: textMuted, letterSpacing: "0.04em" }}>HW</div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 700, color: hwScore.score >= 70 ? "#16a34a" : "#e8590c" }}>{hwScore.score}</div>
                          </div>
                        )}
                      </div>

                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Section>
        </motion.div>

        {/* Exam scores */}
        {Object.keys(progress.examScores).length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35 }}>
            <Section title="Exam Scores" dark={dark}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {exams.map((exam) => {
                  const score = progress.examScores[exam.id];
                  if (!score) return null;
                  const pct = Math.round((score.score / score.total) * 100);
                  return (
                    <div key={exam.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 1rem", borderRadius: "10px", border: `1px solid ${borderBase}`, background: cardBg }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 600, color: textPrimary }}>{exam.title}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: textMuted }}>Taken {score.date}</div>
                      </div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: pct >= 70 ? "#16a34a" : "#e8590c" }}>{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </Section>
          </motion.div>
        )}
      </div>
    </div>
  );
}
