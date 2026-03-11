"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { problems } from "@/data/problems";
import { useProgress } from "@/hooks/useProgress";
import type { Difficulty, DPCategory } from "@/lib/dp-engine/types";

// ─── Theme hook ───────────────────────────────────────────────────────────────

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

// ─── Difficulty config ────────────────────────────────────────────────────────

const DIFF_CONFIG: Record<Difficulty, { label: string; bg: string; text: string; border: string }> = {
  Intro: { label: "Intro", bg: "rgba(13,148,136,0.12)", text: "#0d9488", border: "rgba(13,148,136,0.25)" },
  Easy: { label: "Easy", bg: "rgba(22,163,74,0.12)", text: "#16a34a", border: "rgba(22,163,74,0.25)" },
  "Easy-Medium": { label: "Easy-Med", bg: "rgba(101,163,13,0.12)", text: "#65a30d", border: "rgba(101,163,13,0.25)" },
  Medium: { label: "Medium", bg: "rgba(217,119,6,0.12)", text: "#d97706", border: "rgba(217,119,6,0.25)" },
  "Medium-Hard": { label: "Med-Hard", bg: "rgba(232,89,12,0.12)", text: "#e8590c", border: "rgba(232,89,12,0.25)" },
  Hard: { label: "Hard", bg: "rgba(220,38,38,0.12)", text: "#dc2626", border: "rgba(220,38,38,0.25)" },
};

const ALL_DIFFICULTIES: Difficulty[] = ["Intro", "Easy", "Easy-Medium", "Medium", "Medium-Hard", "Hard"];
const ALL_CATEGORIES: DPCategory[] = ["Linear DP", "Choice DP", "2D DP", "String DP", "Interval DP", "LIS-style", "Grid DP"];

// ─── Problem card ─────────────────────────────────────────────────────────────

function ProblemCard({
  problem,
  index,
  completed,
  dark,
}: {
  problem: (typeof problems)[0];
  index: number;
  completed: boolean;
  dark: boolean;
}) {
  const cfg = DIFF_CONFIG[problem.difficulty];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
    >
      <Link href={`/problems/${problem.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
        <div
          style={{
            height: "100%",
            padding: "1.25rem",
            borderRadius: "12px",
            border: dark ? "1px solid rgba(226,232,240,0.08)" : "1px solid rgba(26,26,46,0.08)",
            background: dark ? "#1e293b" : "#ffffff",
            boxShadow: dark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(26,26,46,0.06)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            position: "relative",
            transition: "box-shadow 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.boxShadow = dark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 8px 24px rgba(26,26,46,0.1)";
            el.style.borderColor = dark ? "rgba(226,232,240,0.14)" : "rgba(232,89,12,0.2)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.boxShadow = dark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(26,26,46,0.06)";
            el.style.borderColor = dark ? "rgba(226,232,240,0.08)" : "rgba(26,26,46,0.08)";
          }}
        >
          {/* Completion badge */}
          {completed && (
            <div
              style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}

          {/* Header row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 600, color: dark ? "rgba(226,232,240,0.3)" : "rgba(26,26,46,0.3)", letterSpacing: "0.04em" }}>
              {String(problem.number).padStart(2, "0")}
            </span>
            <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.55rem", borderRadius: "20px", background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, whiteSpace: "nowrap", marginRight: completed ? "28px" : "0" }}>
              {cfg.label}
            </span>
          </div>

          {/* Title + category */}
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: dark ? "#e2e8f0" : "#1a1a2e", lineHeight: 1.3, margin: 0 }}>
              {problem.title}
            </h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 500, color: dark ? "rgba(226,232,240,0.4)" : "rgba(26,26,46,0.4)", margin: "0.2rem 0 0", letterSpacing: "0.03em" }}>
              {problem.category}
            </p>
          </div>

          {/* Description */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", lineHeight: 1.6, color: dark ? "rgba(226,232,240,0.6)" : "rgba(26,26,46,0.6)", margin: 0, flexGrow: 1 }}>
            {problem.description}
          </p>

          {/* CTA */}
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 600, color: "#e8590c", display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "auto" }}>
            {completed ? "Review" : "Solve"}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Filter pill ──────────────────────────────────────────────────────────────

function FilterPill({
  label,
  active,
  onClick,
  dark,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  dark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.3rem 0.875rem",
        borderRadius: "20px",
        border: active ? "1px solid #e8590c" : dark ? "1px solid rgba(226,232,240,0.12)" : "1px solid rgba(26,26,46,0.12)",
        background: active ? "rgba(232,89,12,0.12)" : "transparent",
        color: active ? "#e8590c" : dark ? "rgba(226,232,240,0.55)" : "rgba(26,26,46,0.55)",
        fontFamily: "var(--font-body)",
        fontSize: "0.8125rem",
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProblemsPage() {
  const dark = useTheme();
  const { progress } = useProgress();
  const [diffFilter, setDiffFilter] = useState<Difficulty | "All">("All");
  const [catFilter, setCatFilter] = useState<DPCategory | "All">("All");

  const filtered = problems.filter((p) => {
    if (diffFilter !== "All" && p.difficulty !== diffFilter) return false;
    if (catFilter !== "All" && p.category !== catFilter) return false;
    return true;
  });

  const completedCount = progress.completedProblems.length;

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#0f172a" : "#faf8f5", transition: "background 0.2s" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: dark ? "#e2e8f0" : "#1a1a2e", letterSpacing: "-0.025em", margin: "0 0 0.5rem" }}>
            Problem Set
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: dark ? "rgba(226,232,240,0.55)" : "rgba(26,26,46,0.55)", margin: 0 }}>
            {completedCount} of {problems.length} completed — work through them in order for the best experience.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }} style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
          <FilterPill label="All" active={diffFilter === "All" && catFilter === "All"} onClick={() => { setDiffFilter("All"); setCatFilter("All"); }} dark={dark} />
          <div style={{ width: "1px", background: dark ? "rgba(226,232,240,0.1)" : "rgba(26,26,46,0.1)", margin: "0 0.25rem" }} />
          {ALL_DIFFICULTIES.map((d) => (
            <FilterPill key={d} label={DIFF_CONFIG[d].label} active={diffFilter === d} onClick={() => { setDiffFilter(d === diffFilter ? "All" : d); setCatFilter("All"); }} dark={dark} />
          ))}
          <div style={{ width: "1px", background: dark ? "rgba(226,232,240,0.1)" : "rgba(26,26,46,0.1)", margin: "0 0.25rem" }} />
          {ALL_CATEGORIES.map((c) => (
            <FilterPill key={c} label={c} active={catFilter === c} onClick={() => { setCatFilter(c === catFilter ? "All" : c); setDiffFilter("All"); }} dark={dark} />
          ))}
        </motion.div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: dark ? "rgba(226,232,240,0.35)" : "rgba(26,26,46,0.35)", fontFamily: "var(--font-body)" }}>
            No problems match the selected filters.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {filtered.map((problem, i) => (
              <ProblemCard
                key={problem.slug}
                problem={problem}
                index={i}
                completed={progress.completedProblems.includes(problem.slug)}
                dark={dark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
