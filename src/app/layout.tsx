"use client";

import "./globals.css";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import Link from "next/link";

// ─── Fonts ───────────────────────────────────────────────────────────────────

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// ─── Theme Context ────────────────────────────────────────────────────────────

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "light", toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dp-theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("dp-theme", theme);
  }, [theme, mounted]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/problems", label: "Problems" },
  { href: "/theory", label: "Theory" },
  { href: "/exams", label: "Exams" },
  { href: "/progress", label: "Progress" },
  { href: "/settings", label: "Settings" },
];

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}

function Navbar() {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      style={{
        backgroundColor:
          theme === "dark"
            ? "rgba(15,23,42,0.95)"
            : "rgba(250,248,245,0.95)",
        borderBottom:
          theme === "dark"
            ? "1px solid rgba(226,232,240,0.08)"
            : "1px solid rgba(26,26,46,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.375rem",
            fontWeight: 700,
            color: theme === "dark" ? "#e2e8f0" : "#1a1a2e",
            textDecoration: "none",
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #e8590c, #d97706)",
              borderRadius: "6px",
              width: "28px",
              height: "28px",
              flexShrink: 0,
            }}
          />
          DP Mastery
        </Link>

        {/* Desktop nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
          className="hidden-mobile"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color:
                  theme === "dark"
                    ? "rgba(226,232,240,0.7)"
                    : "rgba(26,26,46,0.65)",
                textDecoration: "none",
                padding: "0.375rem 0.75rem",
                borderRadius: "6px",
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color =
                  theme === "dark" ? "#e2e8f0" : "#1a1a2e";
                (e.target as HTMLAnchorElement).style.background =
                  theme === "dark"
                    ? "rgba(226,232,240,0.06)"
                    : "rgba(26,26,46,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color =
                  theme === "dark"
                    ? "rgba(226,232,240,0.7)"
                    : "rgba(26,26,46,0.65)";
                (e.target as HTMLAnchorElement).style.background = "transparent";
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            style={{
              marginLeft: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              border:
                theme === "dark"
                  ? "1px solid rgba(226,232,240,0.12)"
                  : "1px solid rgba(26,26,46,0.12)",
              background: "transparent",
              color: theme === "dark" ? "#e2e8f0" : "#1a1a2e",
              cursor: "pointer",
              transition: "border-color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                theme === "dark"
                  ? "rgba(226,232,240,0.08)"
                  : "rgba(26,26,46,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
            }}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </nav>

        {/* Mobile controls */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          className="show-mobile"
        >
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              border:
                theme === "dark"
                  ? "1px solid rgba(226,232,240,0.12)"
                  : "1px solid rgba(26,26,46,0.12)",
              background: "transparent",
              color: theme === "dark" ? "#e2e8f0" : "#1a1a2e",
              cursor: "pointer",
            }}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              border:
                theme === "dark"
                  ? "1px solid rgba(226,232,240,0.12)"
                  : "1px solid rgba(26,26,46,0.12)",
              background: "transparent",
              color: theme === "dark" ? "#e2e8f0" : "#1a1a2e",
              cursor: "pointer",
            }}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="show-mobile"
          style={{
            borderTop:
              theme === "dark"
                ? "1px solid rgba(226,232,240,0.08)"
                : "1px solid rgba(26,26,46,0.08)",
            padding: "0.75rem 1.5rem 1rem",
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                fontWeight: 500,
                color:
                  theme === "dark"
                    ? "rgba(226,232,240,0.8)"
                    : "rgba(26,26,46,0.75)",
                textDecoration: "none",
                padding: "0.625rem 0.5rem",
                borderBottom:
                  theme === "dark"
                    ? "1px solid rgba(226,232,240,0.05)"
                    : "1px solid rgba(26,26,46,0.05)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <title>DP Mastery | Dynamic Programming Course</title>
        <meta
          name="description"
          content="Master Dynamic Programming from first principles. Interactive visualizations, AI tutor, and 10 carefully crafted problems."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
