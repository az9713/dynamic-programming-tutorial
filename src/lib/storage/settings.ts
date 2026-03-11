import { DEFAULT_MODEL } from "@/lib/ai/models";

const STORAGE_KEY = "dp-course-settings";

export interface AppSettings {
  apiKey: string;
  model: string;
  theme: "light" | "dark";
}

function defaultSettings(): AppSettings {
  return {
    apiKey: "",
    model: DEFAULT_MODEL,
    theme: "light",
  };
}

export function getSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings();

    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    const defaults = defaultSettings();

    return {
      apiKey: parsed.apiKey ?? defaults.apiKey,
      model: parsed.model ?? defaults.model,
      theme: parsed.theme ?? defaults.theme,
    };
  } catch {
    return defaultSettings();
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // fail silently
  }
}
