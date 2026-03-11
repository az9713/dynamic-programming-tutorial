import { NextRequest, NextResponse } from "next/server";
import { callAINonStreaming } from "@/lib/ai/client";
import { QUIZ_GENERATOR_PROMPT } from "@/lib/ai/prompts";
import { DEFAULT_MODEL } from "@/lib/ai/models";
import { Difficulty } from "@/lib/dp-engine/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { problemSlug, difficulty, count = 5 } = body as {
      problemSlug: string;
      difficulty: Difficulty;
      count?: number;
    };

    if (!problemSlug) {
      return NextResponse.json({ error: "problemSlug is required" }, { status: 400 });
    }

    const apiKey = req.headers.get("x-api-key") ?? process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "No API key available" }, { status: 401 });
    }

    const model = req.headers.get("x-model") ?? DEFAULT_MODEL;

    const userMessage =
      `Generate ${count} quiz questions for the dynamic programming problem "${problemSlug}". ` +
      `Target difficulty: ${difficulty ?? "Medium"}. ` +
      `Return a valid JSON array only, with no additional text or markdown fences.`;

    const raw = await callAINonStreaming({
      messages: [
        { role: "system", content: QUIZ_GENERATOR_PROMPT },
        { role: "user", content: userMessage },
      ],
      model,
      apiKey,
      temperature: 0.8,
    });

    // Strip potential markdown code fences before parsing
    const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    const questions = JSON.parse(cleaned);

    return NextResponse.json(questions);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
