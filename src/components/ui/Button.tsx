"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  dark?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const SIZE_STYLES: Record<Size, { padding: string; fontSize: string; height: string }> = {
  sm: { padding: "0.3rem 0.75rem", fontSize: "0.8125rem", height: "30px" },
  md: { padding: "0.5rem 1.125rem", fontSize: "0.875rem", height: "36px" },
  lg: { padding: "0.6875rem 1.75rem", fontSize: "0.9375rem", height: "44px" },
};

function variantStyle(
  variant: Variant,
  dark: boolean,
  disabled: boolean
): React.CSSProperties {
  if (disabled) {
    return {
      background: dark ? "rgba(226,232,240,0.06)" : "rgba(26,26,46,0.06)",
      color: dark ? "rgba(226,232,240,0.25)" : "rgba(26,26,46,0.25)",
      border: "1px solid transparent",
      cursor: "not-allowed",
    };
  }
  switch (variant) {
    case "primary":
      return {
        background: "linear-gradient(135deg, #e8590c, #c2410c)",
        color: "#ffffff",
        border: "1px solid transparent",
        boxShadow: "0 2px 8px rgba(232,89,12,0.3)",
        cursor: "pointer",
      };
    case "secondary":
      return {
        background: "transparent",
        color: dark ? "#e2e8f0" : "#1a1a2e",
        border: dark
          ? "1px solid rgba(226,232,240,0.15)"
          : "1px solid rgba(26,26,46,0.15)",
        cursor: "pointer",
      };
    case "ghost":
      return {
        background: "transparent",
        color: dark ? "rgba(226,232,240,0.7)" : "rgba(26,26,46,0.65)",
        border: "1px solid transparent",
        cursor: "pointer",
      };
    case "danger":
      return {
        background: "rgba(220,38,38,0.1)",
        color: "#dc2626",
        border: "1px solid rgba(220,38,38,0.25)",
        cursor: "pointer",
      };
  }
}

export function Button({
  variant = "primary",
  size = "md",
  dark = false,
  loading = false,
  icon,
  children,
  disabled,
  style,
  ...props
}: Props) {
  const isDisabled = disabled || loading;
  const sizeStyles = SIZE_STYLES[size];
  const vStyle = variantStyle(variant, dark, Boolean(isDisabled));

  return (
    <button
      disabled={isDisabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.375rem",
        borderRadius: "8px",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        lineHeight: 1,
        transition: "transform 0.1s, box-shadow 0.15s, opacity 0.15s",
        outline: "none",
        ...sizeStyles,
        ...vStyle,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled && variant === "primary") {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 4px 12px rgba(232,89,12,0.4)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled && variant === "primary") {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 2px 8px rgba(232,89,12,0.3)";
        }
      }}
      {...props}
    >
      {loading ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ animation: "spin 0.8s linear infinite" }}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </svg>
      ) : icon ? (
        <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
