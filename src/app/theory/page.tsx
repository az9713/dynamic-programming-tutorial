"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { problems } from "@/data/problems";

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

// Simple markdown renderer
function renderMarkdown(content: string, dark: boolean): string {
  const textColor = dark ? "rgba(226,232,240,0.82)" : "rgba(26,26,46,0.82)";
  const headingColor = dark ? "#e2e8f0" : "#1a1a2e";
  const codeInlineBg = dark ? "rgba(226,232,240,0.08)" : "rgba(26,26,46,0.08)";
  const codeInlineColor = dark ? "#93c5fd" : "#1d4ed8";
  const codeBg = dark ? "#0f172a" : "#1e293b";

  return content
    .replace(/^#### (.+)$/gm, `<h4 style="font-family:var(--font-display);font-size:1rem;font-weight:700;color:${headingColor};margin:1.25rem 0 0.5rem">\$1</h4>`)
    .replace(/^### (.+)$/gm, `<h3 style="font-family:var(--font-display);font-size:1.125rem;font-weight:700;color:${headingColor};margin:1.75rem 0 0.625rem">\$1</h3>`)
    .replace(/^## (.+)$/gm, `<h2 style="font-family:var(--font-display);font-size:1.375rem;font-weight:700;color:${headingColor};margin:2.25rem 0 0.75rem">\$1</h2>`)
    .replace(/```[\w]*\n([\s\S]*?)```/g, `<pre style="background:${codeBg};color:#e2e8f0;padding:1rem 1.25rem;border-radius:8px;overflow-x:auto;font-family:var(--font-mono);font-size:0.8125rem;line-height:1.7;margin:1.25rem 0"><code>$1</code></pre>`)
    .replace(/`([^`]+)`/g, `<code style="background:${codeInlineBg};color:${codeInlineColor};padding:0.1em 0.35em;border-radius:4px;font-family:var(--font-mono);font-size:0.875em">\$1</code>`)
    .replace(/\*\*(.+?)\*\*/g, `<strong style="font-weight:700;color:${headingColor}">\$1</strong>`)
    .replace(/^- (.+)$/gm, `<li style="margin:0.25rem 0;line-height:1.65;color:${textColor}">\$1</li>`)
    .replace(/\n\n/g, `<p style="margin:0.75rem 0"></p>`);
}

export default function TheoryPage() {
  const dark = useTheme();
  const [activeSlug, setActiveSlug] = useState<string>(problems[0].slug);
  const contentRef = useRef<HTMLDivElement>(null);

  const textPrimary = dark ? "#e2e8f0" : "#1a1a2e";
  const textMuted = dark ? "rgba(226,232,240,0.5)" : "rgba(26,26,46,0.5)";
  const borderBase = dark ? "rgba(226,232,240,0.08)" : "rgba(26,26,46,0.08)";
  const cardBg = dark ? "#1e293b" : "#ffffff";
  const sidebarBg = dark ? "#0f172a" : "#faf8f5";

  const activeProblem = problems.find((p) => p.slug === activeSlug) ?? problems[0];

  function scrollToTop() {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#0f172a" : "#faf8f5", transition: "background 0.2s" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ padding: "2.5rem 0 2rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: textPrimary, letterSpacing: "-0.025em", margin: "0 0 0.5rem" }}>
            Theory
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: textMuted, margin: 0 }}>
            In-depth explanations for all 10 problems. Select a topic from the sidebar.
          </p>
        </motion.div>

        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", paddingBottom: "5rem" }}>

          {/* Sidebar TOC */}
          <nav style={{ width: "240px", flexShrink: 0, position: "sticky", top: "80px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {problems.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => { setActiveSlug(p.slug); scrollToTop(); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "8px",
                    border: "none",
                    background: activeSlug === p.slug ? "rgba(232,89,12,0.1)" : "transparent",
                    color: activeSlug === p.slug ? "#e8590c" : dark ? "rgba(226,232,240,0.6)" : "rgba(26,26,46,0.6)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    fontWeight: activeSlug === p.slug ? 600 : 400,
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", opacity: 0.5, flexShrink: 0, minWidth: "20px" }}>
                    {String(p.number).padStart(2, "0")}
                  </span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Main content */}
          <motion.div
            key={activeSlug}
            ref={contentRef}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, minWidth: 0 }}
          >
            {/* Problem header */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: textMuted, letterSpacing: "0.04em" }}>
                  Problem {activeProblem.number}
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600, padding: "0.2rem 0.65rem", borderRadius: "20px", background: "rgba(232,89,12,0.1)", color: "#e8590c", border: "1px solid rgba(232,89,12,0.25)" }}>
                  {activeProblem.difficulty}
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: textMuted }}>
                  {activeProblem.category}
                </span>
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: textPrimary, letterSpacing: "-0.025em", margin: "0 0 0.5rem" }}>
                {activeProblem.title}
              </h2>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Link href={`/problems/${activeProblem.slug}`} style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#e8590c", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                  Open problem
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>

            {/* Quick reference */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
              {[
                { label: "Recurrence", value: activeProblem.recurrence },
                { label: "State", value: activeProblem.stateDefinition },
                { label: "Time", value: activeProblem.timeComplexity },
                { label: "Space", value: activeProblem.spaceComplexity },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: "0.875rem", borderRadius: "8px", background: "rgba(232,89,12,0.05)", border: "1px solid rgba(232,89,12,0.12)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em", color: "#e8590c", textTransform: "uppercase", marginBottom: "0.375rem" }}>{label}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: textPrimary, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Theory content */}
            <div style={{ padding: "1.75rem 2rem", borderRadius: "12px", border: `1px solid ${borderBase}`, background: cardBg }}>
              <div
                style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", lineHeight: 1.8, color: dark ? "rgba(226,232,240,0.8)" : "rgba(26,26,46,0.8)" }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(activeProblem.theoryContent, dark) }}
              />
            </div>

            {/* Navigation between problems */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", gap: "1rem" }}>
              {activeProblem.number > 1 && (
                <button
                  onClick={() => { setActiveSlug(problems[activeProblem.number - 2].slug); scrollToTop(); }}
                  style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.625rem 1rem", borderRadius: "8px", border: `1px solid ${borderBase}`, background: "transparent", color: textMuted, fontFamily: "var(--font-body)", fontSize: "0.875rem", cursor: "pointer" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                  Previous
                </button>
              )}
              <div style={{ flex: 1 }} />
              {activeProblem.number < problems.length && (
                <button
                  onClick={() => { setActiveSlug(problems[activeProblem.number].slug); scrollToTop(); }}
                  style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.625rem 1rem", borderRadius: "8px", border: `1px solid ${borderBase}`, background: "transparent", color: textMuted, fontFamily: "var(--font-body)", fontSize: "0.875rem", cursor: "pointer" }}
                >
                  Next
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
