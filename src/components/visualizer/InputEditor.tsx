"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface InputEditorProps {
  /** Current input values — used as the source of truth for fields */
  inputs?: Record<string, unknown>;
  /** Called when a single field changes (controlled mode) */
  onChange?: (key: string, value: unknown) => void;
  /** Called when the Run button is clicked with the full parsed inputs */
  onRun: (input: Record<string, unknown>) => void;
  /** Called when the Reset button is clicked */
  onReset?: () => void;
  /** Fallback source used when `inputs` is not provided */
  defaultInput?: Record<string, unknown>;
}

type FieldValue = string;

function isMatrix(value: unknown): boolean {
  return Array.isArray(value) && Array.isArray((value as unknown[])[0]);
}

function serializeValue(value: unknown): FieldValue {
  if (Array.isArray(value)) {
    if (isMatrix(value)) {
      return (value as unknown[][]).map((row) => row.join(", ")).join("\n");
    }
    return (value as unknown[]).join(", ");
  }
  if (value === null || value === undefined) return "";
  return String(value);
}

function parseValue(raw: string, original: unknown): unknown {
  if (Array.isArray(original)) {
    if (isMatrix(original)) {
      return raw
        .split("\n")
        .map((line) =>
          line
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .map(Number)
        )
        .filter((row) => row.length > 0);
    }
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number);
  }
  if (typeof original === "number") {
    const n = Number(raw);
    return isNaN(n) ? original : n;
  }
  return raw;
}

export default function InputEditor({
  inputs,
  onChange,
  onRun,
  onReset,
  defaultInput,
}: InputEditorProps) {
  const source = inputs ?? defaultInput ?? {};

  const [fields, setFields] = useState<Record<string, FieldValue>>(() => {
    const init: Record<string, FieldValue> = {};
    for (const [key, val] of Object.entries(source)) {
      init[key] = serializeValue(val);
    }
    return init;
  });

  function handleChange(key: string, raw: string) {
    setFields((prev) => ({ ...prev, [key]: raw }));
    if (onChange) {
      onChange(key, parseValue(raw, source[key]));
    }
  }

  function handleRun() {
    const parsed: Record<string, unknown> = {};
    for (const [key, raw] of Object.entries(fields)) {
      parsed[key] = parseValue(raw, source[key]);
    }
    onRun(parsed);
  }

  function handleReset() {
    const reset: Record<string, FieldValue> = {};
    for (const [key, val] of Object.entries(source)) {
      reset[key] = serializeValue(val);
    }
    setFields(reset);
    if (onReset) {
      onReset();
    } else {
      onRun(source);
    }
  }

  return (
    <div className="rounded-xl border border-ink/10 dark:border-white/10 bg-parchment dark:bg-surface-dark-card p-4 space-y-4">
      <p className="text-xs font-medium text-ink-muted dark:text-text-dark-muted uppercase tracking-wide">
        Input
      </p>

      <div className="grid gap-3">
        {Object.entries(source).map(([key, original]) => {
          const matrix = isMatrix(original);
          const isArr = Array.isArray(original);

          return (
            <div key={key} className="flex flex-col gap-1">
              <label
                htmlFor={`input-${key}`}
                className="text-sm font-medium text-ink dark:text-text-dark capitalize"
              >
                {key}
                {matrix && (
                  <span className="ml-1 text-xs text-ink-muted dark:text-text-dark-muted font-normal">
                    (one row per line, comma-separated)
                  </span>
                )}
                {isArr && !matrix && (
                  <span className="ml-1 text-xs text-ink-muted dark:text-text-dark-muted font-normal">
                    (comma-separated)
                  </span>
                )}
              </label>

              {matrix ? (
                <textarea
                  id={`input-${key}`}
                  rows={3}
                  value={fields[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="rounded-lg border border-ink/10 dark:border-white/10 bg-white dark:bg-surface-dark-alt text-ink dark:text-text-dark text-sm px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
                />
              ) : (
                <input
                  id={`input-${key}`}
                  type={typeof original === "number" ? "number" : "text"}
                  value={fields[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="rounded-lg border border-ink/10 dark:border-white/10 bg-white dark:bg-surface-dark-alt text-ink dark:text-text-dark text-sm px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 pt-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleRun}
          className="flex-1 py-2 rounded-lg bg-accent text-white text-sm font-semibold shadow-sm"
        >
          Run
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleReset}
          className="px-4 py-2 rounded-lg border border-ink/10 dark:border-white/10 bg-parchment-dark dark:bg-surface-dark-alt text-ink dark:text-text-dark text-sm"
        >
          Reset
        </motion.button>
      </div>
    </div>
  );
}
