# DP Mastery — AI Assistant Context

## Project Overview

Interactive web course platform for learning dynamic programming. Next.js 16 App Router + TypeScript + Tailwind CSS v4. The entire learning experience — visualizations, quizzes, exams, coding homework, AI tutoring, and progress tracking — runs in the browser with no backend database.

---

## Key Architecture Decisions

- **All DP computation runs client-side.** Algorithm implementations in `src/lib/dp-engine/algorithms/` produce arrays of `DPStep` objects. The visualizer hook (`useDPVisualizer`) steps through them locally — no server round-trips.
- **No database — localStorage only.** `UserProgress` and `AISettings` are serialized to localStorage via helpers in `src/lib/storage/`. Keys are `dp-course-progress` and `dp-course-settings`.
- **Monaco Editor loaded via dynamic import (`ssr: false`).** Monaco is ~2 MB and breaks SSR. All homework pages use `next/dynamic` with `{ ssr: false }`.
- **AI calls go through OpenRouter.** A single API endpoint (`https://openrouter.ai/api/v1/chat/completions`) wraps Claude Sonnet, GPT-4o, and Gemini Flash. The wrapper is in `src/lib/ai/client.ts`.
- **Streaming AI responses via ReadableStream in Route Handlers.** The `/api/ai/chat` route streams tokens back to the client. Other routes (`/api/ai/grade`, `/api/ai/feedback`) are non-streaming and return JSON.
- **BYOK + optional hosted key.** Users paste their own OpenRouter key on the Settings page (stored in localStorage). The server-side `OPENROUTER_API_KEY` env var is a fallback hosted key. `src/lib/ai/rate-limiter.ts` enforces per-IP limits on the hosted key.
- **All pages are client components.** The layout (`src/app/layout.tsx`) is `"use client"` because it owns the ThemeContext and Navbar. Child pages follow the same pattern.

---

## Directory Structure

```
src/
├── app/
│   ├── api/ai/
│   │   ├── chat/route.ts           # Streaming tutor chat (SSE)
│   │   ├── feedback/route.ts       # Step explanation endpoint
│   │   ├── grade/route.ts          # Homework grading endpoint
│   │   └── quiz-generate/route.ts  # Dynamic quiz question generation
│   ├── exams/
│   │   ├── [examId]/page.tsx       # Timed exam runner
│   │   └── page.tsx                # Exam selection
│   ├── problems/
│   │   ├── [slug]/
│   │   │   ├── homework/page.tsx   # Monaco editor + AI grader
│   │   │   ├── quiz/page.tsx       # Per-problem quiz
│   │   │   └── page.tsx            # Visualizer + tutor + theory tabs
│   │   └── page.tsx                # Problem list
│   ├── progress/page.tsx           # Radar chart, badges, streaks
│   ├── settings/page.tsx           # API key and model picker
│   ├── theory/page.tsx             # Theory index
│   ├── globals.css                 # @theme block, cell animations, base styles
│   ├── layout.tsx                  # ThemeProvider + Navbar (root layout)
│   └── page.tsx                    # Landing page / dashboard
│
├── components/
│   ├── editor/
│   │   ├── CodeEditor.tsx          # Monaco wrapper (dynamically imported)
│   │   └── FeedbackPanel.tsx       # Displays AI grading feedback
│   ├── progress/
│   │   ├── BadgeGrid.tsx           # Earned/locked badge display
│   │   ├── RadarChart.tsx          # Recharts radar for 7 DP skill axes
│   │   └── StreakTracker.tsx       # Current and best streak display
│   ├── quiz/
│   │   ├── CodingQuestion.tsx      # Code-answer quiz question type
│   │   ├── MultipleChoice.tsx      # Multiple-choice question type
│   │   └── QuizRunner.tsx          # Orchestrates question flow + scoring
│   ├── tutor/
│   │   ├── ChatInput.tsx           # Message input with send button
│   │   ├── ChatMessage.tsx         # Individual message bubble
│   │   └── TutorSidebar.tsx        # Full tutor panel with message list
│   ├── ui/
│   │   ├── Button.tsx              # Shared button component
│   │   ├── Card.tsx                # Shared card container
│   │   ├── DifficultyBadge.tsx     # Color-coded difficulty pill
│   │   └── Modal.tsx               # Generic modal overlay
│   └── visualizer/
│       ├── DPVisualizer.tsx        # Top-level visualizer layout
│       ├── InputEditor.tsx         # Editable problem inputs
│       ├── RecurrenceDisplay.tsx   # Live recurrence formula with substituted values
│       ├── StepControls.tsx        # Play/pause/step/speed controls
│       ├── Table1D.tsx             # 1D dp[] table renderer
│       └── Table2D.tsx             # 2D dp[][] table renderer
│
├── data/
│   ├── exams/
│   │   ├── final.ts                # Final exam questions
│   │   ├── midterm.ts              # Midterm exam questions
│   │   └── index.ts                # Exam registry
│   ├── problems/
│   │   ├── fibonacci.ts            # Problem 1: Fibonacci Numbers
│   │   ├── climbing-stairs.ts      # Problem 2: Climbing Stairs
│   │   ├── coin-change.ts          # Problem 3: Coin Change
│   │   ├── knapsack.ts             # Problem 4: 0/1 Knapsack
│   │   ├── lcs.ts                  # Problem 5: Longest Common Subsequence
│   │   ├── edit-distance.ts        # Problem 6: Edit Distance
│   │   ├── matrix-chain.ts         # Problem 7: Matrix Chain Multiplication
│   │   ├── lis.ts                  # Problem 8: Longest Increasing Subsequence
│   │   ├── rod-cutting.ts          # Problem 9: Rod Cutting
│   │   ├── unique-paths.ts         # Problem 10: Unique Paths in Grid
│   │   └── index.ts                # problems[] array + problemsBySlug map
│   └── quizzes/
│       ├── [slug].ts               # 6 QuizQuestion objects per problem
│       └── index.ts                # quizzesBySlug map
│
├── hooks/
│   ├── useAITutor.ts               # Chat state, streaming fetch, message history
│   ├── useDPVisualizer.ts          # Step playback state machine (play/pause/seek)
│   ├── useProgress.ts              # Read/write UserProgress from localStorage
│   └── useTimer.ts                 # Countdown timer for timed exams
│
└── lib/
    ├── ai/
    │   ├── client.ts               # callAI() and callAINonStreaming() — OpenRouter wrappers
    │   ├── context-builder.ts      # Assembles system prompt context from problem data
    │   ├── models.ts               # AVAILABLE_MODELS list and DEFAULT_MODEL constant
    │   ├── prompts.ts              # AI persona definitions and system prompt templates
    │   └── rate-limiter.ts         # In-memory per-IP rate limiter for hosted key
    ├── dp-engine/
    │   ├── algorithms/
    │   │   ├── [slug].ts           # One file per problem; exports DPAlgorithm
    │   │   └── index.ts            # algorithms{} registry keyed by slug
    │   ├── runner.ts               # Validates input and dispatches to algorithm
    │   └── types.ts                # ALL TypeScript interfaces (source of truth)
    └── storage/
        ├── progress.ts             # loadProgress() / saveProgress() / resetProgress()
        └── settings.ts             # loadSettings() / saveSettings()
```

---

## Important Files

| File | Purpose |
|---|---|
| `src/lib/dp-engine/types.ts` | Single source of truth for all TypeScript interfaces: `DPStep`, `DPProblem`, `DPAlgorithm`, `QuizQuestion`, `Exam`, `UserProgress`, `AISettings` |
| `src/lib/dp-engine/algorithms/` | One file per problem. Each exports a `DPAlgorithm` with `run()` (returns `DPStep[]`) and `solve()` (returns the answer only) |
| `src/data/problems/` | `DPProblem` objects containing metadata, theory markdown, starter code, and test cases |
| `src/lib/ai/client.ts` | `callAI()` returns a raw `Response` (use for streaming). `callAINonStreaming()` returns the string content directly |
| `src/lib/ai/models.ts` | Edit `AVAILABLE_MODELS` or `DEFAULT_MODEL` here to change which AI models are offered |
| `src/lib/ai/prompts.ts` | All AI persona definitions and system prompt templates |
| `src/hooks/useDPVisualizer.ts` | State machine for the visualizer: holds current step index, play/pause state, speed, and exposes controls |
| `src/app/globals.css` | `@theme` block with all CSS custom property tokens; also defines `.dp-cell-computing`, `.dp-cell-backtrack`, and other animation classes |
| `src/lib/storage/progress.ts` | Reads/writes `dp-course-progress` in localStorage |

---

## Conventions

### Components

- All pages and the root layout use `"use client"` — this project does not use React Server Components for rendering UI.
- Components detect dark mode via a `MutationObserver` on `document.documentElement.classList` (watching for the `dark` class). Pattern used in every page:
  ```typescript
  function useTheme() {
    const [dark, setDark] = useState(false);
    useEffect(() => {
      const check = () => setDark(document.documentElement.classList.contains("dark"));
      check();
      const obs = new MutationObserver(check);
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => obs.disconnect();
    }, []);
    return dark;
  }
  ```
- The root layout also exports a `useTheme` hook from `ThemeContext` that additionally provides a `toggle()` function — use that in the Navbar and Settings, use the MutationObserver pattern in all other components.

### Styling

- Styling uses **inline `style` props** with CSS custom properties from `globals.css` (e.g., `var(--font-display)`, `var(--font-body)`, `var(--font-mono)`) combined with Tailwind utility classes where convenient.
- Do not introduce a new CSS-in-JS library or styled-components.
- Dark mode is handled by conditional values in inline styles based on the `dark` boolean from `useTheme()`, not Tailwind dark: variants.
- Theme color tokens: primary accent is `#e8590c` (orange), secondary is `#d97706` (amber), dark bg is `#0f172a`, card bg dark is `#1e293b`, light bg is `#faf8f5`.

### Data flow

- Progress stored under localStorage key `dp-course-progress` as a `UserProgress` JSON object.
- AI settings stored under localStorage key `dp-course-settings` as an `AISettings` JSON object.
- The user's API key (from Settings page) is read from localStorage at request time inside the Route Handlers via the `x-api-key` request header sent by the client hooks.

### Algorithm implementations

- Each algorithm file exports one `DPAlgorithm` object with two methods: `run(input)` and `solve(input)`.
- `run()` must produce one `DPStep` per cell fill operation. The `computing` array uses `[index]` for 1D tables and `[row, col]` for 2D tables.
- The `table` field in each step must be a **snapshot** (new array/copy) of the DP table state at that moment, not a reference.
- `formula` strings should show the recurrence with actual substituted values, e.g. `"dp[3] = dp[2] + dp[1] = 3"`.

---

## Common Tasks

### Add a new problem

1. Create `src/data/problems/my-slug.ts` — export a `DPProblem` object
2. Create `src/lib/dp-engine/algorithms/my-slug.ts` — export a `DPAlgorithm` object
3. Register both in their respective `index.ts` files
4. Create `src/data/quizzes/my-slug.ts` with 6 `QuizQuestion` objects and register in `src/data/quizzes/index.ts`
5. The problem page at `/problems/my-slug` and all sub-routes are generated automatically

### Change AI model defaults

Edit `src/lib/ai/models.ts`. Update `AVAILABLE_MODELS` to add/remove models and change `DEFAULT_MODEL` to alter the pre-selected model. Model IDs must be valid OpenRouter model identifiers.

### Modify theme colors

Edit the `@theme` block in `src/app/globals.css`. Color changes here propagate via CSS custom properties.

### Add a new badge

Badge definitions and unlock logic live in `src/app/progress/page.tsx`. Add a new entry to the badges array with an id, label, description, and unlock condition checked against `UserProgress`.

### Add a new exam

Create a file in `src/data/exams/` following the `Exam` interface in `types.ts`, then register it in `src/data/exams/index.ts`. The exam runner at `/exams/[examId]` picks it up automatically.

### Modify AI prompts or personas

Edit `src/lib/ai/prompts.ts`. System prompts are assembled per-request in `src/lib/ai/context-builder.ts` which injects the current problem's metadata.

### Adjust rate limiting

Edit `src/lib/ai/rate-limiter.ts`. The limiter applies only when the client does not send its own API key and the server falls back to `OPENROUTER_API_KEY`.

---

## Testing

No test framework is currently configured.

To add Jest + React Testing Library:

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest ts-jest
```

Priority test targets:
- `src/lib/dp-engine/algorithms/` — pure functions, easy to unit test; verify that `solve()` returns correct answers and `run()` produces the right number of steps
- `src/lib/storage/` — test round-trip serialization of `UserProgress`
- `src/hooks/useDPVisualizer.ts` — test state transitions (play, pause, step, seek)
