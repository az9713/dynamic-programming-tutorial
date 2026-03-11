import { NextRequest, NextResponse } from "next/server";
import { callAINonStreaming } from "@/lib/ai/client";
import { CODE_REVIEWER_PROMPT } from "@/lib/ai/prompts";
import { DEFAULT_MODEL } from "@/lib/ai/models";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, problemSlug } = body as {
      code: string;
      problemSlug: string;
    };

    if (!code || !problemSlug) {
      return NextResponse.json({ error: "code and problemSlug are required" }, { status: 400 });
    }

    const apiKey = req.headers.get("x-api-key") ?? process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "No API key available" }, { status: 401 });
    }

    const model = req.headers.get("x-model") ?? DEFAULT_MODEL;

    const userMessage =
      `Please review this dynamic programming solution for "${problemSlug}".\n\n` +
      `Code:\n\`\`\`\n${code}\n\`\`\`\n\n` +
      `Provide structured feedback as JSON with fields: summary (string), ` +
      `correctness (string), dpApproach (string), codeStyle (string), ` +
      `efficiency (string), edgeCases (string), suggestions (string[]). ` +
      `Return valid JSON only with no markdown fences.`;

    const raw = await callAINonStreaming({
      messages: [
        { role: "system", content: CODE_REVIEWER_PROMPT },
        { role: "user", content: userMessage },
      ],
      model,
      apiKey,
      temperature: 0.4,
    });

    const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    const review = JSON.parse(cleaned);

    return NextResponse.json(review);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
