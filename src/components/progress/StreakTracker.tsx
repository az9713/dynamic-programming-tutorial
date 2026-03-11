"use client";

import { motion } from "framer-motion";

interface Props {
  current: number;
  lastDate: string;
  dark: boolean;
}

function FlameIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ display: "block" }}
    >
      <path d="M12 2C12 2 8 6.5 8 10.5C8 13 9.5 15 11 16C10.5 14.5 11 13 12 12C12 14 13.5 16 13.5 18C15 16.5 16 14.5 16 12.5C16 10 14.5 8 14.5 8C14.5 8 13.5 10 12.5 10C13.5 8.5 12 2 12 2Z" />
      <path d="M12 20C10.3 20 9 18.7 9 17C9 15.6 10 14.5 11 13.5C11.2 14.5 11.8 15.3 12.5 16C12.5 14.5 13 13 14 12C14.5 13 15 14.2 15 15.5C15 17.9 13.7 20 12 20Z" />
    </svg>
  );
}

export function StreakTracker({ current, lastDate, dark }: Props) {
  const textPrimary = dark ? "#e2e8f0" : "#1a1a2e";
  const textMuted = dark ? "rgba(226,232,240,0.45)" : "rgba(26,26,46,0.45)";
  const borderBase = dark ? "rgba(226,232,240,0.08)" : "rgba(26,26,46,0.08)";

  const isActive = current > 0;
  const streakColor = isActive ? "#e8590c" : textMuted;

  // Build last 7 day indicators
  const today = new Date();
  const last = lastDate ? new Date(lastDate) : null;
  const dayDots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    // A day is "active" if it falls within the streak window ending on lastDate
    const daysAgo = last
      ? Math.floor(
          (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 999;
    const withinStreak =
      last &&
      d.getTime() <=
        new Date(last.getTime() + 24 * 60 * 60 * 1000).getTime() &&
      daysAgo < current;

    return {
      date: d,
      active: Boolean(withinStreak),
    };
  });

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div
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
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: textMuted,
              marginBottom: "0.25rem",
            }}
          >
            Current Streak
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            <motion.span
              key={current}
              initial={{ scale: 1.4, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.5rem",
                fontWeight: 700,
                color: streakColor,
                lineHeight: 1,
              }}
            >
              {current}
            </motion.span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: textMuted,
              }}
            >
              {current === 1 ? "day" : "days"}
            </span>
          </div>
        </div>

        <div
          style={{
            color: streakColor,
            opacity: isActive ? 1 : 0.25,
          }}
        >
          <FlameIcon size={40} />
        </div>
      </div>

      {/* 7-day dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "4px",
        }}
      >
        {dayDots.map((dot, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: dot.active
                  ? "linear-gradient(135deg, #e8590c, #d97706)"
                  : dark
                  ? "rgba(226,232,240,0.06)"
                  : "rgba(26,26,46,0.06)",
                border: dot.active
                  ? "none"
                  : `1px solid ${borderBase}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
            >
              {dot.active && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.625rem",
                color: textMuted,
              }}
            >
              {dayLabels[dot.date.getDay()]}
            </span>
          </div>
        ))}
      </div>

      {/* Last activity */}
      {lastDate && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            color: textMuted,
            margin: 0,
          }}
        >
          Last active:{" "}
          {new Date(lastDate).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      )}
    </div>
  );
}
