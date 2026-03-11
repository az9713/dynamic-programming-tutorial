import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai/client";
import { checkRateLimit } from "@/lib/ai/rate-limiter";
import { TUTOR_PROMPT } from "@/lib/ai/prompts";
import { buildTutorContext, TutorContextParams } from "@/lib/ai/context-builder";
import { DEFAULT_MODEL } from "@/lib/ai/models";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, problemContext } = body as {
      messages: Array<{ role: string; content: string }>;
      problemContext?: TutorContextParams;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }

    // Determine API key: BYOK header takes priority, then env var
    const byokKey = req.headers.get("x-api-key");
    const hostedKey = process.env.OPENROUTER_API_KEY;
    const apiKey = byokKey ?? hostedKey;

    if (!apiKey) {
      return NextResponse.json(
        { error: "No API key provided. Set x-api-key header or configure OPENROUTER_API_KEY." },
        { status: 401 }
      );
    }

    // Rate-limit requests that use the hosted key
    if (!byokKey && hostedKey) {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        req.headers.get("x-real-ip") ??
        "unknown";
      const { allowed, remaining } = checkRateLimit(ip);
      if (!allowed) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later or provide your own API key." },
          {
            status: 429,
            headers: { "X-RateLimit-Remaining": String(remaining) },
          }
        );
      }
    }

    const model = req.headers.get("x-model") ?? DEFAULT_MODEL;

    // Build system prompt
    let systemContent = TUTOR_PROMPT;
    if (problemContext) {
      const contextString = buildTutorContext(problemContext);
      systemContent = contextString + "\n\n" + TUTOR_PROMPT;
      if (problemContext.problemName) {
        systemContent = systemContent.replace("{problem_name}", problemContext.problemName);
      }
    }
    systemContent = systemContent.replace("{problem_name}", "this problem");

    const fullMessages = [
      { role: "system", content: systemContent },
      ...messages,
    ];

    const upstream = await callAI({ messages: fullMessages, model, apiKey, stream: true });

    // Stream the OpenRouter response body directly to the client
    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
