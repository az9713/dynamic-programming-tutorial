export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
}

export const AVAILABLE_MODELS: AIModel[] = [
  { id: "anthropic/claude-sonnet-4", name: "Claude Sonnet", provider: "Anthropic", description: "Fast, balanced" },
  { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI", description: "Versatile, capable" },
  { id: "google/gemini-2.0-flash-exp", name: "Gemini Flash", provider: "Google", description: "Quick responses" },
];

export const DEFAULT_MODEL = "anthropic/claude-sonnet-4";
