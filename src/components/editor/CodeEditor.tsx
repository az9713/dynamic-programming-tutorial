"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import type * as MonacoType from "monaco-editor";

// Dynamic import — never SSR the editor
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  { ssr: false, loading: () => <EditorSkeleton /> }
);

function EditorSkeleton() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "300px",
        background: "rgba(15,23,42,0.98)",
        borderRadius: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: "rgba(226,232,240,0.3)",
        }}
      >
        Loading editor...
      </span>
    </div>
  );
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  dark: boolean;
  language?: string;
  height?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  dark,
  language = "typescript",
  height = "340px",
  readOnly = false,
}: Props) {
  const editorRef = useRef<MonacoType.editor.IStandaloneCodeEditor | null>(null);

  function handleMount(
    editor: MonacoType.editor.IStandaloneCodeEditor,
    monaco: typeof MonacoType
  ) {
    editorRef.current = editor;

    // TypeScript defaults
    if (language === "typescript") {
      try {
        const ts = (monaco.languages as any).typescript;
        if (ts?.typescriptDefaults) {
          ts.typescriptDefaults.setCompilerOptions({
            target: ts.ScriptTarget?.ES2020 ?? 7,
            moduleResolution: ts.ModuleResolutionKind?.NodeJs ?? 2,
            strict: false,
          });
        }
      } catch {
        // Monaco typescript plugin may not be available
      }
    }

    // Focus the editor
    editor.focus();
  }

  return (
    <div
      style={{
        borderRadius: "10px",
        overflow: "hidden",
        border: dark
          ? "1px solid rgba(226,232,240,0.08)"
          : "1px solid rgba(26,26,46,0.1)",
      }}
    >
      {/* Editor toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.375rem 0.75rem",
          background: dark ? "#0f172a" : "#1e293b",
          borderBottom: dark
            ? "1px solid rgba(226,232,240,0.06)"
            : "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: "5px" }}>
          {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
            <div
              key={c}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: c,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            color: "rgba(226,232,240,0.3)",
          }}
        >
          solution.{language === "typescript" ? "ts" : language}
        </span>
        <div style={{ width: "44px" }} />
      </div>

      <MonacoEditor
        height={height}
        language={language}
        value={value}
        theme={dark ? "vs-dark" : "vs"}
        onChange={(v) => onChange(v ?? "")}
        onMount={handleMount}
        options={{
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          lineNumbers: "on",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          tabSize: 2,
          insertSpaces: true,
          readOnly,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "line",
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  );
}
