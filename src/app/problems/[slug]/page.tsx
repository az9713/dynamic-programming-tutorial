"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { problemsBySlug } from "@/data/problems";
import algorithms from "@/lib/dp-engine/algorithms";
import { useProgress } from "@/hooks/useProgress";
import { getSettings } from "@/lib/storage/settings";
import DPVisualizer from "@/components/visualizer/DPVisualizer";
import { TutorSidebar } from "@/components/tutor/TutorSidebar";

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

// ─── Markdown renderer (simple) ───────────────────────────────────────────────

function TheoryContent({ content, dark }: { content: string; dark: boolean }) {
  // Basic markdown: headers, code blocks, bold, inline code
  const rendered = content
    .replace(/^### (.+)$/gm, `<h3 style="font-family:var(--font-display);font-size:1.125rem;font-weight:700;color:${dark ? "#e2e8f0" : "#1a1a2e"};margin:1.5rem 0 0.5rem">$1</h3>`)
    .replace(/^## (.+)$/gm, `<h2 style="font-family:var(--font-display);font-size:1.375rem;font-weight:700;color:${dark ? "#e2e8f0" : "#1a1a2e"};margin:2rem 0 0.75rem">$1</h2>`)
    .replace(/```[\w]*\n([\s\S]*?)```/g, `<pre style="background:${dark ? "#0f172a" : "#1e293b"};color:#e2e8f0;padding:1rem;border-radius:8px;overflow-x:auto;font-family:var(--font-mono);font-size:0.8125rem;line-height:1.6;margin:1rem 0"><code>$1</code></pre>`)
    .replace(/`([^`]+)`/g, `<code style="background:${dark ? "rgba(226,232,240,0.08)" : "rgba(26,26,46,0.08)"};color:${dark ? "#93c5fd" : "#1d4ed8"};padding:0.1em 0.35em;border-radius:4px;font-family:var(--font-mono);font-size:0.875em">$1</code>`)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, `<li style="margin:0.25rem 0;line-height:1.6">$1</li>`)
    .replace(/\n\n/g, `<br/><br/>`);

  return (
    <div
      style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", lineHeight: 1.75, color: dark ? "rgba(226,232,240,0.8)" : "rgba(26,26,46,0.8)" }}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({ title, dark, children }: { title: string; dark: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: dark ? "#e2e8f0" : "#1a1a2e", marginBottom: "1.25rem", letterSpacing: "-0.02em" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProblemPage() {
  const { slug } = useParams<{ slug: string }>();
  const dark = useTheme();
  const { progress, markProblemComplete, updateStreak } = useProgress();
  const [tutorOpen, setTutorOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const problem = problemsBySlug[slug];
  const algorithm = algorithms[slug];

  useEffect(() => {
    const settings = getSettings();
    setApiKey(settings.apiKey);
  }, []);

  useEffect(() => {
    if (problem) {
      updateStreak();
    }
  }, [problem, updateStreak]);

  if (!problem || !algorithm) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "#0f172a" : "#faf8f5" }}>
        <div style={{ textAlign: "center", fontFamily: "var(--font-body)" }}>
          <p style={{ fontSize: "1.25rem", fontWeight: 600, color: dark ? "#e2e8f0" : "#1a1a2e", margin: "0 0 1rem" }}>Problem not found</p>
          <Link href="/problems" style={{ color: "#e8590c", textDecoration: "none", fontWeight: 600 }}>Back to Problems</Link>
        </div>
      </div>
    );
  }

  const isCompleted = progress.completedProblems.includes(slug);

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#0f172a" : "#faf8f5", transition: "background 0.2s" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: "1.5rem" }}>
          <Link href="/problems" style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: dark ? "rgba(226,232,240,0.45)" : "rgba(26,26,46,0.45)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            All Problems
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 600, color: dark ? "rgba(226,232,240,0.35)" : "rgba(26,26,46,0.35)", letterSpacing: "0.04em" }}>
              Problem {problem.number}
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600, padding: "0.2rem 0.65rem", borderRadius: "20px", background: "rgba(232,89,12,0.1)", color: "#e8590c", border: "1px solid rgba(232,89,12,0.25)" }}>
              {problem.difficulty}
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 500, padding: "0.2rem 0.65rem", borderRadius: "20px", background: dark ? "rgba(226,232,240,0.06)" : "rgba(26,26,46,0.06)", color: dark ? "rgba(226,232,240,0.55)" : "rgba(26,26,46,0.55)", border: dark ? "1px solid rgba(226,232,240,0.1)" : "1px solid rgba(26,26,46,0.1)" }}>
              {problem.category}
            </span>
            {isCompleted && (
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600, padding: "0.2rem 0.65rem", borderRadius: "20px", background: "rgba(22,163,74,0.1)", color: "#16a34a", border: "1px solid rgba(22,163,74,0.25)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                Completed
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: dark ? "#e2e8f0" : "#1a1a2e", letterSpacing: "-0.03em", margin: "0 0 0.75rem" }}>
            {problem.title}
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.65, color: dark ? "rgba(226,232,240,0.6)" : "rgba(26,26,46,0.6)", margin: 0, maxWidth: "680px" }}>
            {problem.description}
          </p>
        </motion.div>

        {/* Problem Statement */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}>
          <Section title="Problem Statement" dark={dark}>
            <div style={{ padding: "1.25rem", borderRadius: "12px", border: dark ? "1px solid rgba(226,232,240,0.08)" : "1px solid rgba(26,26,46,0.08)", background: dark ? "#1e293b" : "#ffffff" }}>
              <pre style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", lineHeight: 1.7, color: dark ? "rgba(226,232,240,0.8)" : "rgba(26,26,46,0.8)", whiteSpace: "pre-wrap", margin: 0 }}>
                {problem.problemStatement}
              </pre>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginTop: "1rem" }}>
              {[
                { label: "State", value: problem.stateDefinition },
                { label: "Recurrence", value: problem.recurrence },
                { label: "Base Cases", value: problem.baseCases },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: "0.875rem", borderRadius: "8px", background: dark ? "rgba(232,89,12,0.06)" : "rgba(232,89,12,0.04)", border: "1px solid rgba(232,89,12,0.15)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em", color: "#e8590c", textTransform: "uppercase", marginBottom: "0.375rem" }}>{label}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: dark ? "#e2e8f0" : "#1a1a2e", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{value}</div>
                </div>
              ))}
            </div>
          </Section>
        </motion.div>

        {/* Visualizer */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35 }}>
          <Section title="Interactive Visualizer" dark={dark}>
            <div style={{ padding: "1.25rem", borderRadius: "12px", border: dark ? "1px solid rgba(226,232,240,0.08)" : "1px solid rgba(26,26,46,0.08)", background: dark ? "#1e293b" : "#ffffff" }}>
              <DPVisualizer problem={problem} algorithm={algorithm} />
            </div>
          </Section>
        </motion.div>

        {/* Theory */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }}>
          <Section title="Theory" dark={dark}>
            <div style={{ padding: "1.5rem", borderRadius: "12px", border: dark ? "1px solid rgba(226,232,240,0.08)" : "1px solid rgba(26,26,46,0.08)", background: dark ? "#1e293b" : "#ffffff" }}>
              <TheoryContent content={problem.theoryContent} dark={dark} />
            </div>
          </Section>
        </motion.div>

        {/* Complexity */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.35 }}>
          <Section title="Complexity" dark={dark}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
              {[
                { label: "Time", value: problem.timeComplexity },
                { label: "Space", value: problem.spaceComplexity },
                ...(problem.complexityNotes ? [{ label: "Notes", value: problem.complexityNotes }] : []),
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: "1rem", borderRadius: "10px", border: dark ? "1px solid rgba(226,232,240,0.08)" : "1px solid rgba(26,26,46,0.08)", background: dark ? "#1e293b" : "#ffffff" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: dark ? "rgba(226,232,240,0.4)" : "rgba(26,26,46,0.4)", marginBottom: "0.375rem" }}>{label}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.9375rem", fontWeight: 700, color: dark ? "#e2e8f0" : "#1a1a2e" }}>{value}</div>
                </div>
              ))}
            </div>
          </Section>
        </motion.div>

        {/* Action buttons */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35 }} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <Link href={`/problems/${slug}/quiz`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "10px", background: "linear-gradient(135deg, #e8590c, #c2410c)", color: "#fff", fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(232,89,12,0.3)" }}>
            Take Quiz
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <Link href={`/problems/${slug}/homework`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "10px", border: dark ? "1px solid rgba(226,232,240,0.15)" : "1px solid rgba(26,26,46,0.15)", background: "transparent", color: dark ? "#e2e8f0" : "#1a1a2e", fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 600, textDecoration: "none" }}>
            Homework
          </Link>
          {!isCompleted && (
            <button
              onClick={() => markProblemComplete(slug)}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "10px", border: "1px solid rgba(22,163,74,0.3)", background: "rgba(22,163,74,0.08)", color: "#16a34a", fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 600, cursor: "pointer" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              Mark Complete
            </button>
          )}
        </motion.div>
      </div>

      {/* Floating AI Tutor button */}
      <button
        onClick={() => setTutorOpen(true)}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1.25rem",
          borderRadius: "50px",
          border: "none",
          background: "linear-gradient(135deg, #e8590c, #d97706)",
          color: "#fff",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(232,89,12,0.4)",
          zIndex: 40,
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(232,89,12,0.5)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(232,89,12,0.4)"; }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        Ask AI Tutor
      </button>

      <TutorSidebar
        open={tutorOpen}
        onClose={() => setTutorOpen(false)}
        dark={dark}
        problemContext={{
          problemName: problem.title,
          problemStatement: problem.problemStatement,
          recurrence: problem.recurrence,
          stateDefinition: problem.stateDefinition,
        }}
        apiKey={apiKey}
      />
    </div>
  );
}
