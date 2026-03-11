"use client";

import { motion } from "framer-motion";

export interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

interface Props {
  badges: Badge[];
  dark: boolean;
}

const BADGE_COLORS: Record<number, string> = {
  0: "#e8590c",
  1: "#0d9488",
  2: "#7c3aed",
  3: "#d97706",
  4: "#dc2626",
};

export function BadgeGrid({ badges, dark }: Props) {
  const borderBase = dark ? "rgba(226,232,240,0.08)" : "rgba(26,26,46,0.08)";

  if (badges.length === 0) {
    return (
      <div
        style={{
          padding: "1.5rem",
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: dark ? "rgba(226,232,240,0.3)" : "rgba(26,26,46,0.3)",
          border: `1px dashed ${borderBase}`,
          borderRadius: "10px",
        }}
      >
        Complete problems to earn badges.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: "0.75rem",
      }}
    >
      {badges.map((badge, i) => {
        const color = BADGE_COLORS[i % 5];

        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            title={badge.description}
            style={{
              padding: "1rem 0.75rem",
              borderRadius: "10px",
              border: badge.earned
                ? `1px solid ${color}33`
                : `1px solid ${borderBase}`,
              background: badge.earned
                ? `${color}0d`
                : dark
                ? "rgba(226,232,240,0.02)"
                : "rgba(26,26,46,0.02)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              opacity: badge.earned ? 1 : 0.4,
              filter: badge.earned ? "none" : "grayscale(1)",
              transition: "opacity 0.2s, filter 0.2s",
              cursor: "default",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>
              {badge.icon}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: badge.earned
                  ? color
                  : dark
                  ? "rgba(226,232,240,0.4)"
                  : "rgba(26,26,46,0.4)",
                lineHeight: 1.3,
              }}
            >
              {badge.label}
            </span>
            {badge.earned && badge.earnedDate && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.625rem",
                  color: dark ? "rgba(226,232,240,0.3)" : "rgba(26,26,46,0.3)",
                }}
              >
                {badge.earnedDate}
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
