"use client";

import { ReactNode, CSSProperties } from "react";

interface Props {
  children: ReactNode;
  dark?: boolean;
  padding?: string;
  style?: CSSProperties;
  className?: string;
  hoverable?: boolean;
}

export function Card({
  children,
  dark = false,
  padding = "1.25rem",
  style,
  className,
  hoverable = false,
}: Props) {
  const base: CSSProperties = {
    padding,
    borderRadius: "12px",
    border: dark
      ? "1px solid rgba(226,232,240,0.08)"
      : "1px solid rgba(26,26,46,0.08)",
    background: dark ? "#1e293b" : "#ffffff",
    transition: hoverable
      ? "box-shadow 0.2s ease, border-color 0.2s ease, transform 0.15s ease"
      : undefined,
    ...style,
  };

  if (!hoverable) {
    return (
      <div style={base} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      style={base}
      className={className}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = dark
          ? "0 8px 24px rgba(0,0,0,0.4)"
          : "0 8px 24px rgba(26,26,46,0.1)";
        el.style.borderColor = dark
          ? "rgba(226,232,240,0.14)"
          : "rgba(26,26,46,0.12)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "none";
        el.style.borderColor = dark
          ? "rgba(226,232,240,0.08)"
          : "rgba(26,26,46,0.08)";
        el.style.transform = "translateY(0)";
      }}
    >
      {children}
    </div>
  );
}
