"use client";

import { useState, useCallback, useRef } from "react";
import type { TutorContextParams } from "@/lib/ai/context-builder";

export interface TutorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface UseAITutorOptions {
  problemContext?: TutorContextParams;
  apiKey?: string;
}

interface UseAITutorReturn {
  messages: TutorMessage[];
  isLoading: boolean;
  error: string | null;
  send: (content: string) => Promise<void>;
  clear: () => void;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function useAITutor({
  problemContext,
  apiKey,
}: UseAITutorOptions = {}): UseAITutorReturn {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);

      const userMsg: TutorMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      const assistantId = generateId();
      const assistantMsg: TutorMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      abortRef.current = new AbortController();

      try {
        // Build the messages array for the API (no system message — route handles that)
        const apiMessages = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (apiKey) {
          headers["x-api-key"] = apiKey;
        }

        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers,
          body: JSON.stringify({
            messages: apiMessages,
            problemContext: problemContext ?? null,
          }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(
            (data as { error?: string }).error ?? `HTTP ${response.status}`
          );
        }

        if (!response.body) {
          throw new Error("No response body received");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data) as {
                choices?: Array<{
                  delta?: { content?: string };
                  finish_reason?: string;
                }>;
              };
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                accumulated += delta;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: accumulated }
                      : m
                  )
                );
              }
            } catch {
              // Malformed SSE chunk — skip
            }
          }
        }

        // Mark streaming complete
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m
          )
        );
      } catch (err) {
        if ((err as Error).name === "AbortError") return;

        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setError(message);

        // Replace the empty assistant bubble with the error
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: `Error: ${message}`, isStreaming: false }
              : m
          )
        );
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, isLoading, problemContext, apiKey]
  );

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, error, send, clear };
}
