const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export interface ChatMessage {
  role: string;
  content: string;
}

export interface CallAIParams {
  messages: ChatMessage[];
  model: string;
  apiKey: string;
  stream?: boolean;
  temperature?: number;
}

export async function callAI(params: CallAIParams): Promise<Response> {
  const { messages, model, apiKey, stream = false, temperature = 0.7 } = params;

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": APP_URL,
      "X-Title": "DP Mastery",
    },
    body: JSON.stringify({
      model,
      messages,
      stream,
      temperature,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${errorText}`);
  }

  return response;
}

export async function callAINonStreaming(params: CallAIParams): Promise<string> {
  const response = await callAI({ ...params, stream: false });
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("Unexpected response format from OpenRouter API");
  }
  return content;
}
