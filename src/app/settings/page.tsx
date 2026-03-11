"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSettings, saveSettings, AppSettings } from "@/lib/storage/settings";
import { AVAILABLE_MODELS } from "@/lib/ai/models";
import { useProgress } from "@/hooks/useProgress";

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

function Section({ title, description, dark, children }: { title: string; description?: string; dark: boolean; children: React.ReactNode }) {
  const textPrimary = dark ? "#e2e8f0" : "#1a1a2e";
  const textMuted = dark ? "rgba(226,232,240,0.5)" : "rgba(26,26,46,0.5)";
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: textPrimary, margin: 0 }}>{title}</h2>
        {description && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: textMuted, margin: "0.25rem 0 0" }}>{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const dark = useTheme();
  const { resetProgress } = useProgress();

  const [settings, setSettings] = useState<AppSettings>(() => getSettings());
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const textPrimary = dark ? "#e2e8f0" : "#1a1a2e";
  const textMuted = dark ? "rgba(226,232,240,0.5)" : "rgba(26,26,46,0.5)";
  const borderBase = dark ? "rgba(226,232,240,0.08)" : "rgba(26,26,46,0.08)";
  const cardBg = dark ? "#1e293b" : "#ffffff";
  const inputBg = dark ? "#0f172a" : "#f8f6f2";
  const inputBorder = dark ? "rgba(226,232,240,0.12)" : "rgba(26,26,46,0.12)";

  function handleSave() {
    saveSettings(settings);
    // Also sync theme to document
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dp-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dp-theme", "light");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    resetProgress();
    setConfirmReset(false);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.625rem 0.875rem",
    borderRadius: "8px",
    border: `1px solid ${inputBorder}`,
    background: inputBg,
    color: textPrimary,
    fontFamily: "var(--font-body)",
    fontSize: "0.9375rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#0f172a" : "#faf8f5", transition: "background 0.2s" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: textPrimary, letterSpacing: "-0.025em", margin: "0 0 0.5rem" }}>
            Settings
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: textMuted, margin: 0 }}>
            Configure your API key, model, and theme preferences.
          </p>
        </motion.div>

        <div style={{ padding: "1.75rem", borderRadius: "16px", border: `1px solid ${borderBase}`, background: cardBg, display: "flex", flexDirection: "column", gap: "0" }}>

          {/* AI Configuration */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.35 }}>
            <Section title="AI Configuration" description="Required for AI tutor and homework grading." dark={dark}>
              {/* API Key */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600, color: textPrimary, marginBottom: "0.5rem" }}>
                  OpenRouter API Key
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showKey ? "text" : "password"}
                    value={settings.apiKey}
                    onChange={(e) => setSettings((s) => ({ ...s, apiKey: e.target.value }))}
                    placeholder="sk-or-..."
                    style={inputStyle}
                    onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#e8590c"; }}
                    onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = inputBorder; }}
                  />
                  <button
                    onClick={() => setShowKey((v) => !v)}
                    style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: textMuted, padding: "0.25rem" }}
                    aria-label={showKey ? "Hide key" : "Show key"}
                  >
                    {showKey ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: textMuted, margin: "0.375rem 0 0" }}>
                  Get your API key from openrouter.ai. Stored locally in your browser only.
                </p>
              </div>

              {/* Model */}
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600, color: textPrimary, marginBottom: "0.5rem" }}>
                  AI Model
                </label>
                <select
                  value={settings.model}
                  onChange={(e) => setSettings((s) => ({ ...s, model: e.target.value }))}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                >
                  {AVAILABLE_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.provider}) — {m.description}
                    </option>
                  ))}
                </select>
              </div>
            </Section>
          </motion.div>

          <div style={{ height: "1px", background: borderBase, margin: "0.5rem 0 1.5rem" }} />

          {/* Appearance */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}>
            <Section title="Appearance" dark={dark}>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {(["light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSettings((s) => ({ ...s, theme: t }))}
                    style={{
                      flex: 1,
                      padding: "0.875rem",
                      borderRadius: "10px",
                      border: settings.theme === t ? "2px solid #e8590c" : `1px solid ${borderBase}`,
                      background: settings.theme === t ? "rgba(232,89,12,0.08)" : "transparent",
                      color: settings.theme === t ? "#e8590c" : textMuted,
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9375rem",
                      fontWeight: settings.theme === t ? 700 : 400,
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "all 0.15s",
                    }}
                  >
                    {t === "light" ? "Light" : "Dark"}
                  </button>
                ))}
              </div>
            </Section>
          </motion.div>

          <div style={{ height: "1px", background: borderBase, margin: "0.5rem 0 1.5rem" }} />

          {/* Save button */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35 }}>
            <button
              onClick={handleSave}
              style={{
                width: "100%",
                padding: "0.875rem",
                borderRadius: "10px",
                border: saved ? "1px solid rgba(22,163,74,0.3)" : "none",
                background: saved ? "rgba(22,163,74,0.15)" : "linear-gradient(135deg, #e8590c, #c2410c)",
                color: saved ? "#16a34a" : "#ffffff",
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: saved ? "none" : "0 4px 14px rgba(232,89,12,0.3)",
                transition: "all 0.2s",
              }}
            >
              {saved ? "Saved!" : "Save Settings"}
            </button>
          </motion.div>
        </div>

        {/* Danger zone */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }} style={{ marginTop: "2rem", padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(220,38,38,0.2)", background: dark ? "rgba(220,38,38,0.04)" : "rgba(220,38,38,0.02)" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "#dc2626", margin: "0 0 0.375rem" }}>
            Danger Zone
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: textMuted, margin: "0 0 1.25rem" }}>
            This will erase all your progress, quiz scores, and exam records. This action cannot be undone.
          </p>
          <button
            onClick={handleReset}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "1px solid rgba(220,38,38,0.4)",
              background: confirmReset ? "rgba(220,38,38,0.12)" : "transparent",
              color: "#dc2626",
              fontFamily: "var(--font-body)",
              fontSize: "0.9375rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {confirmReset ? "Click again to confirm" : "Reset All Progress"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
