import { NextRequest, NextResponse } from "next/server";
import { callAINonStreaming } from "@/lib/ai/client";
import { GRADER_PROMPT } from "@/lib/ai/prompts";
import { DEFAULT_MODEL } from "@/lib/ai/models";

interface GradeResult {
  score: number;
  correctness: number;
  approach: number;
  quality: number;
  efficiency: number;
  feedback: string;
  suggestions: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, problemSlug, testResults } = body as {
      code: string;
      problemSlug: string;
      testResults?: Array<{ passed: boolean; description: string }>;
    };

    if (!code || !problemSlug) {
      return NextResponse.json({ error: "code and problemSlug are required" }, { status: 400 });
    }

    const apiKey = req.headers.get("x-api-key") ?? process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "No API key available" }, { status: 401 });
    }

    const model = req.headers.get("x-model") ?? DEFAULT_MODEL;

    const testSummary =
      testResults && testResults.length > 0
        ? `\n\nTest Results:\n${testResults.map((t) => `- [${t.passed ? "PASS" : "FAIL"}] ${t.description}`).join("\n")}`
        : "";

    const userMessage =
      `Grade this solution for the problem "${problemSlug}".\n\n` +
      `Code:\n\`\`\`\n${code}\n\`\`\`` +
      testSummary +
      `\n\nReturn valid JSON only with no markdown fences.`;

    const raw = await callAINonStreaming({
      messages: [
        { role: "system", content: GRADER_PROMPT },
        { role: "user", content: userMessage },
      ],
      model,
      apiKey,
      temperature: 0.3,
    });

    const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    const result: GradeResult = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
