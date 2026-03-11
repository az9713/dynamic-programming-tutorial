"use client";

import type { Difficulty } from "@/lib/dp-engine/types";

interface Props {
  difficulty: Difficulty;
  size?: "sm" | "md";
}

const CONFIG: Record<
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

const FONT_SIZES: Record<"sm" | "md", string> = {
  sm: "0.6875rem",
  md: "0.75rem",
};

const PADDING: Record<"sm" | "md", string> = {
  sm: "0.175rem 0.5rem",
  md: "0.25rem 0.625rem",
};

export function DifficultyBadge({ difficulty, size = "md" }: Props) {
  const cfg = CONFIG[difficulty];

  return (
    <span
      style={{
        display: "inline-block",
        padding: PADDING[size],
        borderRadius: "20px",
        background: cfg.bg,
        color: cfg.text,
        border: `1px solid ${cfg.border}`,
        fontFamily: "var(--font-body)",
        fontSize: FONT_SIZES[size],
        fontWeight: 600,
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
        lineHeight: 1.4,
      }}
    >
      {cfg.label}
    </span>
  );
}
