"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type Difficulty =
  | "Intro"
  | "Easy"
  | "Easy-Medium"
  | "Medium"
  | "Medium-Hard"
  | "Hard";

interface Problem {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  description: string;
}

// ─── Problem Data ─────────────────────────────────────────────────────────────

const PROBLEMS: Problem[] = [
  {
    id: 1,
    title: "Fibonacci Numbers",
    slug: "fibonacci",
    difficulty: "Intro",
    category: "Linear DP",
    description:
      "The canonical entry point into DP. Learn memoization and tabulation by computing the n-th Fibonacci number in O(n) time.",
  },
  {
    id: 2,
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    difficulty: "Easy",
    category: "Linear DP",
    description:
      "Count the number of ways to climb n stairs taking 1 or 2 steps at a time. A natural extension of Fibonacci.",
  },
  {
    id: 3,
    title: "Coin Change",
    slug: "coin-change",
    difficulty: "Easy-Medium",
    category: "Choice DP",
    description:
      "Given coin denominations and a target amount, find the minimum number of coins needed to make change.",
  },
  {
    id: 4,
    title: "0/1 Knapsack",
    slug: "knapsack",
    difficulty: "Medium",
    category: "2D DP",
    description:
      "Pack items with weights and values into a knapsack of limited capacity to maximize total value.",
  },
  {
    id: 5,
    title: "Longest Common Subsequence",
    slug: "lcs",
    difficulty: "Medium",
    category: "String DP",
    description:
      "Find the longest subsequence common to two strings. Foundational for diff algorithms and bioinformatics.",
  },
  {
    id: 6,
    title: "Edit Distance",
    slug: "edit-distance",
    difficulty: "Medium-Hard",
    category: "String DP",
    description:
      "Minimum operations (insert, delete, replace) to transform one string into another. Powers spell-checkers.",
  },
  {
    id: 7,
    title: "Matrix Chain Multiplication",
    slug: "matrix-chain",
    difficulty: "Hard",
    category: "Interval DP",
    description:
      "Find the optimal parenthesization of a chain of matrices to minimize scalar multiplications.",
  },
  {
    id: 8,
    title: "Longest Increasing Subsequence",
    slug: "lis",
    difficulty: "Hard",
    category: "LIS-style",
    description:
      "Find the length of the longest strictly increasing subsequence. Solvable in O(n log n) with patience sorting.",
  },
  {
    id: 9,
    title: "Rod Cutting",
    slug: "rod-cutting",
    difficulty: "Hard",
    category: "Choice DP",
    description:
      "Given a rod and prices for each length, determine how to cut the rod for maximum revenue.",
  },
  {
    id: 10,
    title: "Unique Paths in Grid",
    slug: "unique-paths",
    difficulty: "Hard",
    category: "Grid DP",
    description:
      "Count the number of unique paths from the top-left to bottom-right corner of an m×n grid.",
  },
];

// ─── Difficulty Config ────────────────────────────────────────────────────────

const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; bg: string; text: string; border: string }
> = {
  Intro: {
    label: "Intro",
    bg: "rgba(13,148,136,0.12)",
    text: "#0d9488",
    border: "rgba(13,148,136,0.25)",
  },
  Easy: {
    label: "Easy",
    bg: "rgba(22,163,74,0.12)",
    text: "#16a34a",
    border: "rgba(22,163,74,0.25)",
  },
  "Easy-Medium": {
    label: "Easy-Med",
    bg: "rgba(101,163,13,0.12)",
    text: "#65a30d",
    border: "rgba(101,163,13,0.25)",
  },
  Medium: {
    label: "Medium",
    bg: "rgba(217,119,6,0.12)",
    text: "#d97706",
    border: "rgba(217,119,6,0.25)",
  },
  "Medium-Hard": {
    label: "Med-Hard",
    bg: "rgba(232,89,12,0.12)",
    text: "#e8590c",
    border: "rgba(232,89,12,0.25)",
  },
  Hard: {
    label: "Hard",
    bg: "rgba(220,38,38,0.12)",
    text: "#dc2626",
    border: "rgba(220,38,38,0.25)",
  },
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const check = () =>
      setDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);
  return dark;
}

// ─── Problem Card ─────────────────────────────────────────────────────────────

function ProblemCard({ problem, index }: { problem: Problem; index: number }) {
  const dark = useTheme();
  const cfg = DIFFICULTY_CONFIG[problem.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 + index * 0.055, duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
    >
      <Link
        href={`/problems/${problem.slug}`}
        style={{ textDecoration: "none", display: "block", height: "100%" }}
      >
        <div
          style={{
            height: "100%",
            padding: "1.375rem 1.25rem",
            borderRadius: "12px",
            border: dark
              ? "1px solid rgba(226,232,240,0.08)"
              : "1px solid rgba(26,26,46,0.08)",
            background: dark ? "#1e293b" : "#ffffff",
            boxShadow: dark
              ? "0 1px 3px rgba(0,0,0,0.3)"
              : "0 1px 3px rgba(26,26,46,0.06), 0 0 0 0px rgba(232,89,12,0)",
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.boxShadow = dark
              ? "0 8px 24px rgba(0,0,0,0.4)"
              : "0 8px 24px rgba(26,26,46,0.1), 0 0 0 1px rgba(232,89,12,0.15)";
            el.style.borderColor = dark
              ? "rgba(226,232,240,0.14)"
              : "rgba(232,89,12,0.2)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.boxShadow = dark
              ? "0 1px 3px rgba(0,0,0,0.3)"
              : "0 1px 3px rgba(26,26,46,0.06)";
            el.style.borderColor = dark
              ? "rgba(226,232,240,0.08)"
              : "rgba(26,26,46,0.08)";
          }}
        >
          {/* Card header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: dark ? "rgba(226,232,240,0.3)" : "rgba(26,26,46,0.3)",
                letterSpacing: "0.04em",
              }}
            >
              {String(problem.id).padStart(2, "0")}
            </span>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                padding: "0.2rem 0.55rem",
                borderRadius: "20px",
                background: cfg.bg,
                color: cfg.text,
                border: `1px solid ${cfg.border}`,
                whiteSpace: "nowrap",
              }}
            >
              {cfg.label}
            </span>
          </div>

          {/* Title */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.0625rem",
                fontWeight: 700,
                color: dark ? "#e2e8f0" : "#1a1a2e",
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              {problem.title}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: dark ? "rgba(226,232,240,0.4)" : "rgba(26,26,46,0.4)",
                margin: "0.25rem 0 0",
                letterSpacing: "0.03em",
              }}
            >
              {problem.category}
            </p>
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              lineHeight: 1.6,
              color: dark ? "rgba(226,232,240,0.6)" : "rgba(26,26,46,0.6)",
              margin: 0,
              flexGrow: 1,
            }}
          >
            {problem.description}
          </p>

          {/* CTA */}
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "#e8590c",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              marginTop: "auto",
            }}
          >
            Solve problem
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatItem({
  value,
  label,
  dark,
  delay,
}: {
  value: string;
  label: string;
  dark: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      style={{ textAlign: "center" }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          fontWeight: 700,
          color: dark ? "#e2e8f0" : "#1a1a2e",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: dark ? "rgba(226,232,240,0.5)" : "rgba(26,26,46,0.5)",
          marginTop: "0.375rem",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const dark = useTheme();
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  const bgBase = dark ? "#0f172a" : "#faf8f5";
  const textPrimary = dark ? "#e2e8f0" : "#1a1a2e";
  const textMuted = dark
    ? "rgba(226,232,240,0.55)"
    : "rgba(26,26,46,0.55)";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bgBase,
        transition: "background-color 0.2s ease",
      }}
    >
      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "5rem 1.5rem 4.5rem",
        }}
      >
        {/* Background decoration */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: dark
              ? `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(232,89,12,0.12) 0%, transparent 60%),
                 radial-gradient(ellipse 50% 40% at 80% 80%, rgba(13,148,136,0.08) 0%, transparent 55%)`
              : `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(232,89,12,0.1) 0%, transparent 60%),
                 radial-gradient(ellipse 50% 40% at 80% 80%, rgba(13,148,136,0.07) 0%, transparent 55%)`,
            pointerEvents: "none",
          }}
        />

        {/* Subtle dot grid */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: dark
              ? "radial-gradient(circle, rgba(226,232,240,0.06) 1px, transparent 1px)"
              : "radial-gradient(circle, rgba(26,26,46,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "860px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.375rem 1rem",
              borderRadius: "20px",
              border: dark
                ? "1px solid rgba(232,89,12,0.3)"
                : "1px solid rgba(232,89,12,0.25)",
              background: dark
                ? "rgba(232,89,12,0.1)"
                : "rgba(232,89,12,0.07)",
              marginBottom: "2rem",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#e8590c",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "#e8590c",
                textTransform: "uppercase",
              }}
            >
              Interactive Course
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55, ease: "easeOut" }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.75rem, 7vw, 5rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: textPrimary,
              margin: "0 0 1.5rem",
            }}
          >
            Master{" "}
            <span
              style={{
                background: "linear-gradient(120deg, #e8590c 0%, #d97706 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Dynamic
            </span>
            <br />
            Programming
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              lineHeight: 1.7,
              color: textMuted,
              maxWidth: "580px",
              margin: "0 auto 2.75rem",
            }}
          >
            From Fibonacci to Matrix Chain Multiplication — build deep intuition
            through interactive visualizations, step-by-step traces, and an AI
            tutor that explains every decision.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45, ease: "easeOut" }}
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/problems/fibonacci"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.8125rem 1.75rem",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #e8590c, #c2410c)",
                color: "#ffffff",
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(232,89,12,0.35)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 6px 20px rgba(232,89,12,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 4px 14px rgba(232,89,12,0.35)";
              }}
            >
              Start Learning
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/problems"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.8125rem 1.75rem",
                borderRadius: "10px",
                border: dark
                  ? "1px solid rgba(226,232,240,0.15)"
                  : "1px solid rgba(26,26,46,0.15)",
                background: "transparent",
                color: textPrimary,
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "border-color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = dark
                  ? "rgba(226,232,240,0.06)"
                  : "rgba(26,26,46,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent";
              }}
            >
              Browse All Problems
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "0 1.5rem 4rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: dark
              ? "rgba(226,232,240,0.08)"
              : "rgba(26,26,46,0.08)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {[
            { value: "10", label: "Curated Problems", delay: 0.4 },
            { value: "4", label: "Difficulty Levels", delay: 0.48 },
            { value: "AI", label: "Tutor Included", delay: 0.56 },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: dark ? "#1e293b" : "#ffffff",
                padding: "1.75rem 1rem",
              }}
            >
              <StatItem {...stat} dark={dark} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Problem Grid ── */}
      <section
        ref={gridRef}
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem 6rem",
        }}
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={gridInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ marginBottom: "2.5rem" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
              fontWeight: 700,
              color: textPrimary,
              letterSpacing: "-0.025em",
              margin: "0 0 0.625rem",
            }}
          >
            The Problem Set
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: textMuted,
              margin: 0,
              maxWidth: "480px",
              lineHeight: 1.6,
            }}
          >
            Ten problems, carefully ordered from first principles to advanced
            techniques. Each builds on the last.
          </p>
        </motion.div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {PROBLEMS.map((problem, index) => (
            <ProblemCard key={problem.id} problem={problem} index={index} />
          ))}
        </div>
      </section>

      {/* ── Footer strip ── */}
      <footer
        style={{
          borderTop: dark
            ? "1px solid rgba(226,232,240,0.07)"
            : "1px solid rgba(26,26,46,0.07)",
          padding: "2rem 1.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: dark ? "rgba(226,232,240,0.3)" : "rgba(26,26,46,0.3)",
            margin: 0,
          }}
        >
          DP Mastery — built to teach you how to think, not just to memorize.
        </p>
      </footer>
    </div>
  );
}
