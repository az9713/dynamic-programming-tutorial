# DP Mastery — Interactive Dynamic Programming Course Platform

A full-featured, web-based course platform for learning dynamic programming from first principles. Work through 10 carefully ordered problems with animated DP table visualizations, an AI tutor sidebar, per-problem quizzes, timed exams, coding homework with AI grading, and a progress dashboard — all without signing up or touching a database.

https://github.com/az9713/dynamic-programming-tutorial/assets/VIDEO_PLACEHOLDER/dp_demo.mp4

---

## Features

- **10 progressive DP problems** — Fibonacci through Unique Paths, covering Linear DP, Choice DP, 2D DP, String DP, Interval DP, Grid DP, and LIS-style patterns
- **Animated step-by-step DP table visualizer** — play, pause, step forward/back, and watch each cell fill in with the live recurrence formula
- **AI Tutor sidebar** — powered by OpenRouter; choose between Claude Sonnet, GPT-4o, or Gemini Flash; supports streaming responses
- **Per-problem quizzes** — 60 questions total (6 per problem) covering multiple-choice, fill-in-the-blank, and free-response formats
- **Timed exams** — a Midterm and a Final with countdown timers and immediate scoring
- **Coding homework** — write real solutions in Monaco Editor (the VS Code editor, in-browser), then have them AI-graded with line-level feedback
- **Progress tracking** — skill radar chart across 7 DP categories, earned badges, current streak, and per-problem scores
- **Dark / light mode** — respects your system preference, persists across sessions
- **Fully client-side** — no database, no authentication, no backend required; all progress lives in `localStorage`

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js (App Router) | 16 | Framework, routing, API Route Handlers |
| React | 19 | UI components |
| TypeScript | 5 | Type safety throughout |
| Tailwind CSS | v4 | Utility classes and theme variables |
| Framer Motion | 12 | Page and card animations |
| Monaco Editor | 4 | In-browser code editor for homework |
| Recharts | 3 | Skill radar chart on progress page |
| OpenRouter API | — | Single endpoint wrapping Claude, GPT-4o, Gemini |
| localStorage | — | All user progress and settings persistence |

---

## Prerequisites

You need three things before you can run the project.

### 1. Node.js 18 or later

Node.js is a JavaScript runtime that lets you run the development server and build tools on your machine.

- Download from [nodejs.org](https://nodejs.org/) — choose the "LTS" version
- After installing, verify by opening a terminal and running:
  ```bash
  node --version   # should print v18.x.x or higher
  ```

### 2. npm

npm (Node Package Manager) is the tool used to install the project's dependencies. It ships with Node.js automatically — no separate install needed.

Verify it is available:
```bash
npm --version
```

### 3. A code editor

[Visual Studio Code](https://code.visualstudio.com/) is recommended. It has first-class TypeScript support and works well with Next.js projects.

### 4. An OpenRouter API key

OpenRouter is a service that gives you access to Claude, GPT-4o, Gemini, and other models through a single API. The AI Tutor and homework grading features require a key.

**How to get a key:**

1. Go to [openrouter.ai](https://openrouter.ai/) and click **Sign In**
2. Create a free account (email or OAuth)
3. Navigate to **Keys** in your account dashboard
4. Click **Create Key**, give it a name (e.g. "DP Mastery"), and copy the key — it starts with `sk-or-`
5. You can either paste it into the platform's Settings page at runtime, or add it to `.env.local` (see Quick Start below)

> The AI features are optional. The visualizer, quizzes, and exams all work without a key.

---

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd dp-course

# 2. Install dependencies
npm install

# 3. Add your OpenRouter API key (optional, but needed for AI features)
echo "OPENROUTER_API_KEY=your-key-here" > .env.local

# 4. Start the development server
npm run dev

# 5. Open the app
# Visit http://localhost:3000 in your browser
```

The first `npm install` may take a minute — it downloads Monaco Editor and other dependencies. Subsequent starts are fast.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | No (but needed for AI features) | Your OpenRouter API key (`sk-or-...`). If omitted, users can still enter their own key on the Settings page at runtime. |
| `NEXT_PUBLIC_APP_URL` | No | The URL the app is deployed at. Defaults to `http://localhost:3000`. Used in the `HTTP-Referer` header sent to OpenRouter. |

Create a `.env.local` file in the project root (it is git-ignored by default):

```
OPENROUTER_API_KEY=sk-or-your-key-here
NEXT_PUBLIC_APP_URL=https://your-deployment.vercel.app
```

---

## Project Structure

```
dp-course/
├── src/
│   ├── app/                          # Next.js App Router pages and API routes
│   │   ├── api/
│   │   │   └── ai/
│   │   │       ├── chat/             # Streaming AI tutor chat endpoint
│   │   │       ├── feedback/         # AI explanation/feedback endpoint
│   │   │       ├── grade/            # Homework grading endpoint
│   │   │       └── quiz-generate/    # Dynamic quiz question generation endpoint
│   │   ├── exams/
│   │   │   ├── [examId]/             # Dynamic exam-taking page
│   │   │   └── page.tsx              # Exam selection page
│   │   ├── problems/
│   │   │   ├── [slug]/
│   │   │   │   ├── homework/         # Coding homework page (Monaco + AI grader)
│   │   │   │   ├── quiz/             # Per-problem quiz page
│   │   │   │   └── page.tsx          # Problem page (visualizer + tutor + theory)
│   │   │   └── page.tsx              # Problem list page
│   │   ├── progress/                 # Progress dashboard (radar, badges, streaks)
│   │   ├── settings/                 # API key and model configuration
│   │   ├── theory/                   # Theory index page
│   │   ├── globals.css               # Theme variables, animations, base styles
│   │   ├── layout.tsx                # Root layout: ThemeProvider + Navbar
│   │   └── page.tsx                  # Landing / dashboard page
│   │
│   ├── components/                   # Reusable React components
│   │   ├── editor/                   # Monaco code editor + AI feedback panel
│   │   ├── progress/                 # Radar chart, badge grid, streak tracker
│   │   ├── quiz/                     # Quiz runner, multiple-choice, coding question
│   │   ├── tutor/                    # AI tutor sidebar, chat input, message bubbles
│   │   ├── ui/                       # Generic UI: Button, Card, Modal, DifficultyBadge
│   │   └── visualizer/               # DP table visualizer, step controls, recurrence display
│   │
│   ├── data/                         # Static course content
│   │   ├── exams/                    # Midterm and Final exam definitions + questions
│   │   ├── problems/                 # DPProblem objects (metadata, theory, starter code, tests)
│   │   └── quizzes/                  # 6 quiz questions per problem (60 total)
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAITutor.ts             # Chat state, streaming, message history
│   │   ├── useDPVisualizer.ts        # Step-by-step visualizer state machine
│   │   ├── useProgress.ts            # Read/write progress from localStorage
│   │   └── useTimer.ts               # Countdown timer for exams
│   │
│   └── lib/                          # Core logic (no React dependencies)
│       ├── ai/
│       │   ├── client.ts             # OpenRouter fetch wrapper (streaming + non-streaming)
│       │   ├── context-builder.ts    # Builds system prompt context per problem
│       │   ├── models.ts             # Available model list and default model
│       │   ├── prompts.ts            # AI persona and system prompt definitions
│       │   └── rate-limiter.ts       # In-memory rate limiter for the hosted key
│       ├── dp-engine/
│       │   ├── algorithms/           # 10 algorithm implementations (produce DPStep[])
│       │   ├── runner.ts             # Runs algorithms and validates output
│       │   └── types.ts              # All TypeScript interfaces for the platform
│       └── storage/
│           ├── progress.ts           # localStorage helpers for UserProgress
│           └── settings.ts           # localStorage helpers for AISettings
│
├── docs/
│   └── screenshots/                  # Screenshot assets for the README
├── .env.local                        # Your local secrets (git-ignored)
├── next.config.ts                    # Next.js configuration
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server at `http://localhost:3000` with hot reload |
| `npm run build` | Compile a production build into `.next/` |
| `npm run start` | Serve the production build (run `npm run build` first) |
| `npm run lint` | Run ESLint across the project |

---

## How to Add a New DP Problem

Follow these five steps to add a new problem and have it automatically appear throughout the platform.

### Step 1 — Create the problem data file

Create `src/data/problems/my-problem.ts` and export a `DPProblem` object:

```typescript
import type { DPProblem } from "@/lib/dp-engine/types";

export const myProblem: DPProblem = {
  slug: "my-problem",
  number: 11,
  title: "My New Problem",
  description: "Short description.",
  difficulty: "Medium",
  category: "Linear DP",
  problemStatement: "Full problem statement...",
  recurrence: "dp[i] = ...",
  stateDefinition: "dp[i] represents...",
  baseCases: "dp[0] = ...",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  defaultInput: { n: 10 },
  theoryContent: "## Theory\n\nMarkdown content...",
  starterCode: "function myProblem(n: number): number {\n  // your code here\n}",
  testCases: [
    { input: [5], expected: 42, description: "n = 5 should return 42" },
  ],
};
```

### Step 2 — Create the algorithm implementation

Create `src/lib/dp-engine/algorithms/my-problem.ts` and export a `DPAlgorithm`:

```typescript
import type { DPAlgorithm, DPStep } from "@/lib/dp-engine/types";

export const myProblemAlgorithm: DPAlgorithm = {
  run(input) {
    const n = input.n as number;
    const steps: DPStep[] = [];
    const dp: number[] = new Array(n + 1).fill(0);

    // Push a DPStep for every cell you fill in
    for (let i = 1; i <= n; i++) {
      dp[i] = dp[i - 1] + 1; // example recurrence
      steps.push({
        index: steps.length,
        description: `Computing dp[${i}]`,
        table: [...dp],
        computing: [i],
        formula: `dp[${i}] = dp[${i - 1}] + 1 = ${dp[i]}`,
      });
    }

    return steps;
  },

  solve(input) {
    const n = input.n as number;
    // Return just the answer, no steps needed
    return n; // replace with real logic
  },
};
```

### Step 3 — Register in the index files

Add your problem to `src/data/problems/index.ts`:

```typescript
import { myProblem } from "./my-problem";

export const problems: DPProblem[] = [
  // ... existing problems ...
  myProblem,
];
```

Add your algorithm to `src/lib/dp-engine/algorithms/index.ts`:

```typescript
import { myProblemAlgorithm } from "./my-problem";

export const algorithms: Record<string, DPAlgorithm> = {
  // ... existing algorithms ...
  "my-problem": myProblemAlgorithm,
};
```

### Step 4 — Add quiz questions

Create `src/data/quizzes/my-problem.ts` with at least 6 `QuizQuestion` objects, then add it to `src/data/quizzes/index.ts`.

### Step 5 — Verify

Run `npm run dev` and navigate to `/problems/my-problem`. The visualizer, tutor, quiz, and homework pages are all generated automatically from the slug.

---

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com/), which has native Next.js support.

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com/) and import the repository
3. In the **Environment Variables** section of the Vercel project settings, add `OPENROUTER_API_KEY` and optionally `NEXT_PUBLIC_APP_URL` (set this to your Vercel deployment URL)
4. Click **Deploy**

Vercel will build and deploy on every push to the main branch automatically.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Contributing

Contributions are welcome. A few guidelines:

- Open an issue first for significant changes so the approach can be discussed
- Follow the existing code style (inline styles with CSS custom properties, no new third-party UI libraries)
- All new problems must include algorithm implementation, data file, and quiz questions
- TypeScript strict mode is enabled — no `any` types without a comment explaining why
- There is no test suite yet; if you add one, please include tests for any new algorithm implementations
