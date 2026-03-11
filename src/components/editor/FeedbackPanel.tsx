"use client";

import { motion } from "framer-motion";

export interface FeedbackData {
  score: number; // 0-100
  correctness: string;
  approach: string;
  style: string;
  efficiency: string;
  suggestions: string[];
  isLoading?: boolean;
}

interface Props {
  feedback: FeedbackData | null;
  dark: boolean;
}

function ScoreMeter({ score, dark }: { score: number; dark: boolean }) {
  const color =
    score >= 80
      ? "#16a34a"
      : score >= 60
      ? "#d97706"
      : score >= 40
      ? "#e8590c"
      : "#dc2626";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      {/* Circular score */}
      <div style={{ position: "relative", width: "80px", height: "80px" }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          {/* Track */}
          <circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke={
              dark ? "rgba(226,232,240,0.08)" : "rgba(26,26,46,0.08)"
            }
            strokeWidth="6"
          />
          {/* Progress arc */}
          <motion.circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 32}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 32 * (1 - score / 100),
            }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontSize: "1.375rem",
            fontWeight: 700,
            color,
          }}
        >
          {score}
        </div>
      </div>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          color: dark ? "rgba(226,232,240,0.4)" : "rgba(26,26,46,0.4)",
        }}
      >
        out of 100
      </span>
    </div>
  );
}

interface SectionProps {
  title: string;
  content: string;
  dark: boolean;
  icon: string;
}

function FeedbackSection({ title, content, dark, icon }: SectionProps) {
  return (
    <div
      style={{
        padding: "0.875rem",
        borderRadius: "8px",
        border: dark
          ? "1px solid rgba(226,232,240,0.06)"
          : "1px solid rgba(26,26,46,0.06)",
        background: dark ? "rgba(226,232,240,0.02)" : "rgba(26,26,46,0.02)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          marginBottom: "0.375rem",
        }}
      >
        <span style={{ fontSize: "0.875rem" }}>{icon}</span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: dark ? "rgba(226,232,240,0.6)" : "rgba(26,26,46,0.55)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.84375rem",
          lineHeight: 1.6,
          color: dark ? "rgba(226,232,240,0.75)" : "rgba(26,26,46,0.75)",
          margin: 0,
        }}
      >
        {content}
      </p>
    </div>
  );
}

function LoadingSkeleton({ dark }: { dark: boolean }) {
  const shimmer = dark ? "#1e293b" : "#f0ece4";
  const shimmerAlt = dark ? "#263548" : "#e8e4dc";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {[80, 60, 70, 55].map((w, i) => (
        <div
          key={i}
          style={{
            height: "68px",
            borderRadius: "8px",
            background: shimmer,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(90deg, transparent 0%, ${shimmerAlt} 50%, transparent 100%)`,
              animation: `shimmer 1.5s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export function FeedbackPanel({ feedback, dark }: Props) {
  const textPrimary = dark ? "#e2e8f0" : "#1a1a2e";
  const borderBase = dark ? "rgba(226,232,240,0.08)" : "rgba(26,26,46,0.08)";

  if (!feedback) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: dark ? "rgba(226,232,240,0.35)" : "rgba(26,26,46,0.35)",
          border: `1px dashed ${borderBase}`,
          borderRadius: "10px",
        }}
      >
        Submit your solution to receive AI feedback.
      </div>
    );
  }

  if (feedback.isLoading) {
    return (
      <div
        style={{
          padding: "1.25rem",
          borderRadius: "12px",
          border: `1px solid ${borderBase}`,
          background: dark ? "#1e293b" : "#ffffff",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: dark ? "rgba(226,232,240,0.4)" : "rgba(26,26,46,0.4)",
            margin: "0 0 1rem",
          }}
        >
          Analyzing your solution...
        </p>
        <LoadingSkeleton dark={dark} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        padding: "1.25rem",
        borderRadius: "12px",
        border: `1px solid ${borderBase}`,
        background: dark ? "#1e293b" : "#ffffff",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Header + score */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.0625rem",
              color: textPrimary,
              margin: "0 0 0.25rem",
            }}
          >
            AI Feedback
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: dark ? "rgba(226,232,240,0.4)" : "rgba(26,26,46,0.4)",
              margin: 0,
            }}
          >
            Detailed analysis of your solution
          </p>
        </div>
        <ScoreMeter score={feedback.score} dark={dark} />
      </div>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <FeedbackSection
          title="Correctness"
          content={feedback.correctness}
          dark={dark}
          icon="✓"
        />
        <FeedbackSection
          title="Approach"
          content={feedback.approach}
          dark={dark}
          icon="◈"
        />
        <FeedbackSection
          title="Style"
          content={feedback.style}
          dark={dark}
          icon="◇"
        />
        <FeedbackSection
          title="Efficiency"
          content={feedback.efficiency}
          dark={dark}
          icon="⚡"
        />
      </div>

      {/* Suggestions */}
      {feedback.suggestions.length > 0 && (
        <div>
          <h4
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: dark ? "rgba(226,232,240,0.45)" : "rgba(26,26,46,0.45)",
              margin: "0 0 0.5rem",
            }}
          >
            Suggestions
          </h4>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            {feedback.suggestions.map((s, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.84375rem",
                  lineHeight: 1.5,
                  color: dark ? "rgba(226,232,240,0.7)" : "rgba(26,26,46,0.7)",
                }}
              >
                <span
                  style={{
                    color: "#e8590c",
                    flexShrink: 0,
                    fontWeight: 700,
                    marginTop: "1px",
                  }}
                >
                  →
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
