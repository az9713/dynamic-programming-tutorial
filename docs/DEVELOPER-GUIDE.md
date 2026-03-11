# Developer Guide — DP Mastery Platform

**Audience:** Developers with C++ or Java experience who are new to web development and TypeScript.

This guide explains how this codebase works, maps familiar concepts to their web equivalents, and walks you through the most common tasks you will perform.

---

## Table of Contents

1. [Prerequisites and Setup](#1-prerequisites-and-setup)
2. [Mental Model: Web Dev for Systems Programmers](#2-mental-model-web-dev-for-systems-programmers)
3. [Project Architecture](#3-project-architecture)
4. [Key Technologies Explained](#4-key-technologies-explained)
5. [The DP Engine](#5-the-dp-engine)
6. [AI Integration](#6-ai-integration)
7. [Common Patterns in This Codebase](#7-common-patterns-in-this-codebase)
8. [Step-by-Step: Adding a New DP Problem](#8-step-by-step-adding-a-new-dp-problem)
9. [Step-by-Step: Adding a New Quiz](#9-step-by-step-adding-a-new-quiz)
10. [Debugging Tips](#10-debugging-tips)
11. [Glossary](#11-glossary)

---

## 1. Prerequisites and Setup

### What You Need Installed

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ (LTS) | JavaScript runtime (replaces JVM/GCC) |
| npm | 10+ | Package manager (replaces Maven/Gradle/CMake) |
| VS Code | Latest | Recommended editor |
| Git | Any | Version control |

Check your versions:
```bash
node --version   # should print v20.x or higher
npm --version    # should print 10.x or higher
```

### Recommended VS Code Extensions

- **ESLint** — real-time lint errors, like compiler warnings surfaced in the editor
- **Prettier** — auto-format on save
- **Tailwind CSS IntelliSense** — autocomplete for utility classes
- **TypeScript Error Lens** — inline type errors next to the offending line
- **ES7+ React/Redux/React-Native snippets** — component boilerplate shortcuts

### Running the Project

```bash
# Install dependencies (downloads node_modules — like cmake + make + linking)
npm install

# Start the development server with hot reload
npm run dev
```

The app runs at `http://localhost:3000`. Changes to any source file reload the browser automatically without losing component state.

### Other Scripts

```bash
npm run build    # production build — runs the TypeScript compiler fully
npm run lint     # run ESLint across the codebase
npm run start    # serve the production build locally
```

### Environment Variables

Create a `.env.local` file at the project root (never commit this file):

```bash
# Optional: a hosted OpenRouter API key for users who have not set their own
OPENROUTER_API_KEY=sk-or-...

# Public: base URL used in AI request headers
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 2. Mental Model: Web Dev for Systems Programmers

If you know C++ or Java, you already understand the hard parts. The table below maps concepts you know to their web equivalents.

### Concept Mapping

| C++ / Java | TypeScript / Web equivalent | Notes |
|---|---|---|
| `#include <vector>` | `import { useState } from 'react'` | ES modules, not headers; resolved at build time |
| `Makefile` / `pom.xml` | `package.json` | Declares dependencies and build scripts |
| `int main()` | `src/app/page.tsx` | Entry point rendered when you visit `/` |
| `class Widget { render(); }` | `function Widget(props) { return <div/> }` | React components are usually functions |
| `template<typename T>` | TypeScript generics `<T>` | Same idea, different syntax |
| `struct` / POD type | TypeScript `interface` | Type declaration only — no vtable, no runtime cost |
| `std::map<string, T>` | `Record<string, T>` | Plain JS object used as a hash map |
| `std::optional<T>` | `T \| null` or `T \| undefined` | Union types encode optionality |
| `std::vector<T>` | `T[]` or `Array<T>` | Dynamic array |
| `enum class Color` | `type Color = "red" \| "blue"` | String literal unions are idiomatic in TS |
| `.h` / `.cpp` split | Single `.ts` or `.tsx` file | No separate declaration files needed |
| `make test` | `npm test` | Run the test suite |
| Linker errors | TypeScript import errors | Resolved at compile time by `tsc` |

### React Components vs Classes

In C++ you might model UI as a class with a render method. In React, a component is a plain function that receives inputs and returns a description of the UI:

```tsx
// C++ mental model
class DifficultyBadge {
public:
    string difficulty;
    void render();
};

// React reality — a function that returns JSX
interface BadgeProps {
    difficulty: string;
}

function DifficultyBadge({ difficulty }: BadgeProps) {
    return <span className="rounded px-2 py-1">{difficulty}</span>;
}
```

React calls this function every time it needs to update the UI. Think of it as a pure render function, not a long-lived object instance.

### State vs Local Variables

A local variable inside a component is re-created on every render and discarded. To persist a value across renders, use `useState`:

```tsx
// WRONG — resets to 0 every render because the function call ends
function Counter() {
    let count = 0;
    return <button onClick={() => count++}>{count}</button>;
}

// CORRECT — React manages this value between function calls
function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

`useState` is the closest equivalent to a class member variable — it lives as long as the component is mounted.

### `useEffect` — Side Effects After Render

In Java you put initialization in a constructor and cleanup in a destructor (or `close()`). In React:

```tsx
useEffect(() => {
    // Runs after render — setup, subscriptions, timers
    const timer = setInterval(tick, 1000);

    return () => {
        // Cleanup function — runs when component unmounts
        clearInterval(timer);
    };
}, []); // Empty array = run once on mount only (like a constructor)
```

### `async`/`await` Instead of Threads

JavaScript is single-threaded. There are no threads, mutexes, or concurrent memory access bugs. Async operations use Promises:

```typescript
// C++: launch thread, join thread
// TypeScript: register callback via await
async function fetchData(): Promise<string> {
    const response = await fetch("https://api.example.com/data");
    const json = await response.json();
    return json.message;
}
```

`await` suspends the current async function until the Promise resolves, then resumes. The event loop processes everything else while it waits.

---

## 3. Project Architecture

### File-Based Routing

There is no router configuration file. The URL structure is determined entirely by the directory structure inside `src/app/`:

```
src/app/
├── page.tsx                    →  /
├── problems/
│   ├── page.tsx                →  /problems
│   └── [slug]/
│       ├── page.tsx            →  /problems/fibonacci
│       ├── quiz/page.tsx       →  /problems/fibonacci/quiz
│       └── homework/page.tsx   →  /problems/fibonacci/homework
├── exams/
│   ├── page.tsx                →  /exams
│   └── [examId]/page.tsx       →  /exams/midterm
└── api/
    └── ai/
        └── chat/route.ts       →  POST /api/ai/chat
```

`[slug]` is a dynamic segment — the actual value is available as `params.slug` inside the page component. When you create a new problem with slug `house-robber`, its pages at `/problems/house-robber`, `/problems/house-robber/quiz`, and `/problems/house-robber/homework` exist automatically without touching the routing code.

### Client vs Server Components

This project uses `"use client"` on every page and the root layout. That directive opts the component tree into client-side rendering. You will see it at the top of nearly every file:

```typescript
"use client";   // must be the very first line

import { useState } from 'react';
```

The only true server-side code is in `src/app/api/` — Route Handlers (equivalent to Express endpoints) that handle AI API calls without exposing API keys to the browser.

### Data Flow

```
User changes input
       |
       v
React component (useState, event handlers)
       |
       v
dp-engine algorithm (pure TypeScript function)
       |
       v
DPStep[] array (immutable snapshots of table state)
       |
       v
useDPVisualizer hook (step-index state machine)
       |
       v
Table1D / Table2D component (renders one step)
       |
       v
Browser DOM
```

Progress and settings bypass the server entirely — they live in `localStorage`. AI chat goes through a Route Handler to keep the API key on the server side.

---

## 4. Key Technologies Explained

### TypeScript

TypeScript is JavaScript with a type system. Type annotations exist only at compile time — at runtime it is plain JavaScript.

```typescript
// Basic annotations
const n: number = 10;
const slug: string = "fibonacci";
const steps: DPStep[] = [];

// Interface — like a C struct, structural not nominal
interface DPStep {
    index: number;
    description: string;
    table: number[] | number[][];   // union: either 1D or 2D array
    computing: number[];
    formula?: string;               // ? means optional (may be undefined)
}

// Generic function — same idea as C++ templates
function first<T>(arr: T[]): T | null {
    return arr.length > 0 ? arr[0] : null;
}
```

`npm run build` runs a full type check. The dev server is more lenient — always do a build before shipping.

### React

React builds UIs out of components. A component accepts `props` and returns JSX.

**JSX** looks like HTML inside JavaScript and compiles to `React.createElement()` calls:

```tsx
// JSX you write
const el = <div className="card">{problem.title}</div>;

// What the compiler produces (you never write this)
const el = React.createElement("div", { className: "card" }, problem.title);
```

Key JSX rules:
- Use `className` not `class` (`class` is a reserved word in JS)
- Expressions go in `{}`: `{problem.title}`, `{isPlaying ? "Pause" : "Play"}`
- Files with JSX must have the `.tsx` extension

**Core hooks:**

```tsx
const [value, setValue] = useState(initialValue);   // reactive state
const stable = useCallback(() => { ... }, [deps]);   // memoized function
const computed = useMemo(() => expensive(), [deps]); // memoized value
const ref = useRef(null);                           // mutable, no re-render
useEffect(() => { setup(); return cleanup; }, [deps]); // side effects
```

### Tailwind CSS

Tailwind provides single-purpose CSS classes you compose directly in JSX:

```tsx
// One class = one CSS property
<div className="flex items-center gap-4 p-6 rounded-xl bg-white shadow-lg">
    <span className="text-sm font-bold text-orange-500">Easy</span>
</div>
```

This project also uses inline `style` props with CSS custom properties from `globals.css` for theme-sensitive values like colors and fonts:

```tsx
<h1 style={{ fontFamily: "var(--font-display)", color: dark ? "#fff" : "#0f172a" }}>
    Title
</h1>
```

Dark mode is handled via conditional inline styles based on the `dark` boolean from `useTheme()`, not via Tailwind's `dark:` variants.

### Framer Motion

Framer Motion handles animations declaratively:

```tsx
import { motion } from 'framer-motion';

<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
>
    Content fades in on mount, out on unmount
</motion.div>
```

Use `motion.div`, `motion.button`, etc. wherever you need animation.

### Next.js

Next.js wraps React with:
- **File-based routing** — directories are routes
- **Route Handlers** — `route.ts` files are server-side API endpoints
- **`next/dynamic`** — lazy loading with SSR control
- **Automatic code splitting** — each route only loads its own JS

The dev server uses React Fast Refresh for instant hot reload without losing component state.

---

## 5. The DP Engine

The DP engine is pure TypeScript with no React dependency. It lives in `src/lib/dp-engine/`.

### The DPStep Interface

Every algorithm produces a `DPStep[]` array. Each element is a complete snapshot of the table at one moment:

```typescript
export interface DPStep {
    index: number;              // Position in the sequence
    description: string;        // Human-readable explanation shown in the UI
    table: number[][] | number[]; // FULL COPY of the DP table at this moment
    computing: number[];        // Active cell: [i] for 1D, [row, col] for 2D
    backtrackPath?: number[][];  // Highlighted cells during reconstruction
    formula?: string;           // Recurrence with substituted values
    isBacktrack?: boolean;      // True for reconstruction steps
}
```

**Critical rule:** `table` must be a snapshot (a copy), not a reference to the live array. If you push the same array reference into every step, they all end up showing the final state.

```typescript
// WRONG — all steps share the same reference
steps.push({ table: dp, ... });

// CORRECT for 1D — spread creates a shallow copy
steps.push({ table: [...dp], ... });

// CORRECT for 2D
steps.push({ table: dp.map(row => [...row]), ... });
```

### Reading the Fibonacci Algorithm

`src/lib/dp-engine/algorithms/fibonacci.ts` is the simplest full example:

```typescript
import { DPAlgorithm, DPStep } from '../types';

const algorithm: DPAlgorithm = {
    run(input: Record<string, unknown>): DPStep[] {
        const n = typeof input.n === 'number' ? Math.max(0, Math.floor(input.n)) : 10;
        const steps: DPStep[] = [];
        const dp: number[] = new Array(n + 1).fill(0);

        dp[0] = 0;
        if (n >= 1) dp[1] = 1;

        // Step for base case initialization
        steps.push({
            index: 0,
            description: `Initialize dp table. dp[0] = 0, dp[1] = 1`,
            table: [...dp],         // snapshot at this moment
            computing: [0],
            formula: `dp[0] = 0 (base case)`,
        });

        for (let i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
            steps.push({
                index: steps.length,
                description: `dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`,
                table: [...dp],     // new snapshot after filling this cell
                computing: [i],     // highlight cell i
                formula: `dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`,
            });
        }

        return steps;
    },

    solve(input: Record<string, unknown>): unknown {
        // Fast path: just the answer, no step recording overhead
        const n = typeof input.n === 'number' ? Math.max(0, Math.floor(input.n)) : 10;
        if (n <= 0) return 0;
        if (n === 1) return 1;
        let a = 0, b = 1;
        for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
        return b;
    },
};

export default algorithm;
```

`solve()` is used for test case grading. `run()` is the step-recording version used by the visualizer.

### How the Visualizer Consumes Steps

`useDPVisualizer` in `src/hooks/useDPVisualizer.ts` is a state machine. It holds `currentStep` as an index into the `DPStep[]` array and exposes controls:

```typescript
const {
    step,          // DPStep | null — the current step object
    currentStep,   // number — current index
    totalSteps,    // number — steps.length
    isPlaying,     // boolean
    play, pause, togglePlay,
    stepForward, stepBack,
    reset, goToStep,
    setSpeed,
} = useDPVisualizer(steps);
```

When `isPlaying` is true, a `setInterval` advances `currentStep` at the configured speed. `Table1D` or `Table2D` reads `step.table` and `step.computing` to color the active cell. When `step.isBacktrack` is true, `step.backtrackPath` is used to highlight the reconstruction path.

### Algorithm Registry

Each algorithm file exports a default `DPAlgorithm`. The registry maps slugs to implementations:

```typescript
// src/lib/dp-engine/algorithms/index.ts
const algorithms: Record<string, DPAlgorithm> = {
    'fibonacci': fibonacci,
    'climbing-stairs': climbingStairs,
    // ...
};
```

The runner (`src/lib/dp-engine/runner.ts`) looks up the algorithm by slug and dispatches to `run()` or `solve()`.

---

## 6. AI Integration

### Architecture

All AI calls go through OpenRouter (`https://openrouter.ai/api/v1/chat/completions`), which provides a unified interface to Claude, GPT-4o, Gemini Flash, and others with a single API key format.

The tutor chat flow:

```
User types message
       |
       v
useAITutor hook  →  POST /api/ai/chat
                     Header: x-api-key: <user key from localStorage>
                          |
                          v
                    Route Handler (server)
                    Reads key: x-api-key header, or OPENROUTER_API_KEY env var
                    Builds system prompt via context-builder.ts
                    Calls callAI() with stream: true
                          |
                          v
                    OpenRouter API streams SSE tokens
                          |
                          v
                    Route Handler pipes ReadableStream to client
                          |
                          v
useAITutor reads stream chunk-by-chunk, appends to message state
```

### The API Client

`src/lib/ai/client.ts` contains two functions:

```typescript
// Returns the raw Response — use when streaming
export async function callAI(params: CallAIParams): Promise<Response>

// Awaits the full response and returns the string content
export async function callAINonStreaming(params: CallAIParams): Promise<string>
```

The Route Handler for streaming returns the response body directly to the browser:

```typescript
// In src/app/api/ai/chat/route.ts (simplified)
const aiResponse = await callAI({ messages, model, apiKey, stream: true });
return new Response(aiResponse.body, {
    headers: { "Content-Type": "text/event-stream" },
});
```

### BYOK vs Hosted Key

The key selection logic in every Route Handler:

```typescript
const clientKey = request.headers.get("x-api-key");
const apiKey = clientKey || process.env.OPENROUTER_API_KEY || "";
```

Users who enter their own key on the Settings page bypass the rate limiter entirely. The hosted key is rate-limited per IP by `src/lib/ai/rate-limiter.ts`.

### Changing AI Models

Edit `src/lib/ai/models.ts`. Update `AVAILABLE_MODELS` to add or remove models and change `DEFAULT_MODEL`. Model IDs must be valid OpenRouter identifiers (e.g., `"anthropic/claude-sonnet-4-5"`, `"openai/gpt-4o"`).

### Modifying Prompts

All system prompt templates and persona definitions live in `src/lib/ai/prompts.ts`. Per-request context (current problem slug, recurrence, state definition) is injected by `src/lib/ai/context-builder.ts`.

---

## 7. Common Patterns in This Codebase

### `"use client"`

Every component file that uses hooks, event handlers, `localStorage`, or any browser API must have `"use client"` as its very first line — before any imports:

```typescript
"use client";           // first line — Next.js directive, not a JS statement

import { useState } from 'react';
```

Omitting it from a file that uses `useState` causes a build error.

### Dark Mode Detection via MutationObserver

Components that need to adjust colors based on the current theme use this self-contained hook:

```typescript
function useTheme() {
    const [dark, setDark] = useState(false);
    useEffect(() => {
        const check = () =>
            setDark(document.documentElement.classList.contains("dark"));
        check(); // set initial value synchronously
        const obs = new MutationObserver(check);
        obs.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],  // only watch class changes
        });
        return () => obs.disconnect(); // cleanup on unmount
    }, []);
    return dark;
}
```

The Navbar and Settings page use `useTheme()` from `ThemeContext` (which also provides `toggle()`). Every other component uses this local MutationObserver pattern.

### localStorage Persistence

The pattern in `src/lib/storage/progress.ts`:

```typescript
export function getProgress(): UserProgress {
    if (typeof window === "undefined") return defaultProgress(); // SSR guard

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultProgress();
        const parsed = JSON.parse(raw) as Partial<UserProgress>;
        // Merge so new fields added to the schema always have default values
        return { ...defaultProgress(), ...parsed };
    } catch {
        return defaultProgress(); // corrupted data — reset gracefully
    }
}
```

Always guard with `typeof window === "undefined"` before accessing `localStorage`. Next.js runs component code on the server during the build, where `window` does not exist.

### `useCallback` and `useMemo`

These prevent functions and computed values from being re-created on every render:

```typescript
// Without useCallback — new function object on every render
const handleClick = () => setCount(c => c + 1);

// With useCallback — same reference unless dependencies change
const handleClick = useCallback(() => {
    setCount(c => c + 1);
}, []); // empty deps = created once
```

Use `useCallback` for handlers passed as props to child components (prevents unnecessary child re-renders). Use `useMemo` for expensive computations. Do not apply them everywhere — they have overhead and are only beneficial when you need referential stability or to skip expensive work.

### `useRef` for Mutable Values Without Re-renders

`useRef` holds a value that persists across renders but does not trigger a re-render when changed. In `useDPVisualizer.ts`, the interval handle lives in a ref:

```typescript
const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

// Setting this does not cause a render
intervalRef.current = setInterval(tick, delay);

// Clearing it
if (intervalRef.current !== null) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
}
```

Think of `useRef` as a class member variable that bypasses React's render cycle — useful for timers, DOM node references, and previous-value tracking.

### Dynamic Import for Heavy Dependencies

Monaco Editor is ~2 MB and uses browser APIs that break server-side rendering. It loads via `next/dynamic`:

```typescript
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(
    () => import('@/components/editor/CodeEditor'),
    { ssr: false }  // never attempt to render on the server
);
```

This keeps the initial page bundle small and avoids SSR errors.

---

## 8. Step-by-Step: Adding a New DP Problem

This walkthrough adds **House Robber** with slug `house-robber`.

### Step 1 — Create the Problem Data File

Create `src/data/problems/house-robber.ts`:

```typescript
import type { DPProblem } from "@/lib/dp-engine/types";

export const houseRobber: DPProblem = {
    slug: "house-robber",
    number: 11,
    title: "House Robber",
    description: "Find the maximum money you can rob from non-adjacent houses.",
    difficulty: "Easy",
    category: "Linear DP",

    problemStatement:
        "Given an array of non-negative integers representing the money in each house, " +
        "find the maximum you can rob without robbing two adjacent houses.",

    recurrence: "dp[i] = max(dp[i-1], dp[i-2] + nums[i])",
    stateDefinition: "dp[i] = maximum money robable from the first i+1 houses",
    baseCases: "dp[0] = nums[0]\ndp[1] = max(nums[0], nums[1])",

    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",

    defaultInput: { nums: [2, 7, 9, 3, 1] },

    theoryContent: `## House Robber\n\n...your markdown explanation here...`,

    starterCode: `export function houseRobber(nums: number[]): number {
  // TODO: implement using bottom-up DP
  throw new Error("Not implemented");
}`,

    testCases: [
        { input: [[2, 7, 9, 3, 1]], expected: 12, description: "Rob houses 0, 2, 4" },
        { input: [[2, 1, 1, 2]], expected: 4, description: "Rob houses 0 and 3" },
    ],
};
```

### Step 2 — Create the Algorithm File

Create `src/lib/dp-engine/algorithms/house-robber.ts`:

```typescript
import { DPAlgorithm, DPStep } from '../types';

const algorithm: DPAlgorithm = {
    run(input: Record<string, unknown>): DPStep[] {
        const nums = Array.isArray(input.nums)
            ? (input.nums as number[])
            : [2, 7, 9, 3, 1];
        const n = nums.length;
        const steps: DPStep[] = [];

        if (n === 0) return steps;

        const dp: number[] = new Array(n).fill(0);
        dp[0] = nums[0];

        steps.push({
            index: 0,
            description: `Base case: dp[0] = nums[0] = ${nums[0]}`,
            table: [...dp],   // snapshot — always spread
            computing: [0],
            formula: `dp[0] = ${nums[0]}`,
        });

        if (n > 1) {
            dp[1] = Math.max(nums[0], nums[1]);
            steps.push({
                index: 1,
                description: `Base case: dp[1] = max(${nums[0]}, ${nums[1]}) = ${dp[1]}`,
                table: [...dp],
                computing: [1],
                formula: `dp[1] = max(${nums[0]}, ${nums[1]}) = ${dp[1]}`,
            });
        }

        for (let i = 2; i < n; i++) {
            dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
            steps.push({
                index: steps.length,
                description: `dp[${i}] = max(dp[${i-1}], dp[${i-2}] + nums[${i}])` +
                    ` = max(${dp[i-1]}, ${dp[i-2] + nums[i]}) = ${dp[i]}`,
                table: [...dp],
                computing: [i],
                formula: `dp[${i}] = max(${dp[i-1]}, ${dp[i-2] + nums[i]}) = ${dp[i]}`,
            });
        }

        return steps;
    },

    solve(input: Record<string, unknown>): unknown {
        const nums = Array.isArray(input.nums)
            ? (input.nums as number[])
            : [2, 7, 9, 3, 1];
        const n = nums.length;
        if (n === 0) return 0;
        if (n === 1) return nums[0];
        let prev2 = nums[0];
        let prev1 = Math.max(nums[0], nums[1]);
        for (let i = 2; i < n; i++) {
            const curr = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    },
};

export default algorithm;
```

### Step 3 — Register the Algorithm

In `src/lib/dp-engine/algorithms/index.ts`, add two lines:

```typescript
import houseRobber from './house-robber';      // add import

const algorithms: Record<string, DPAlgorithm> = {
    'fibonacci': fibonacci,
    // ...existing entries...
    'house-robber': houseRobber,               // add entry
};
```

### Step 4 — Register the Problem Data

In `src/data/problems/index.ts`:

```typescript
import { houseRobber } from "./house-robber";  // add import

export const problems: DPProblem[] = [
    fibonacci,
    // ...existing entries...
    houseRobber,                               // add to array
];
// problemsBySlug is derived automatically from the array
```

### Step 5 — Create and Register a Quiz

See section 9 below.

### Step 6 — Verify

Navigate to `http://localhost:3000/problems/house-robber`. The visualizer, theory tab, quiz, and homework pages all work automatically — routing is derived from the slug.

---

## 9. Step-by-Step: Adding a New Quiz

Each problem requires exactly 6 `QuizQuestion` objects.

### Question Types

| `type` | Description | Needs `options`? | `correctAnswer` format |
|---|---|---|---|
| `"multiple-choice"` | Pick from 4 options | Yes — array of 4 strings | `number` (0-indexed position) |
| `"fill-blank"` | Type a missing value | No | `string` (exact match) |
| `"free-response"` | Open-ended answer | No | `string` (keyword match by AI grader) |
| `"code"` | Write a code snippet | No | `string` (sample answer) |

### Create the Quiz File

Create `src/data/quizzes/house-robber.ts`:

```typescript
import type { QuizQuestion } from "@/lib/dp-engine/types";

export const houseRobberQuiz: QuizQuestion[] = [
    {
        id: "hr-1",
        problemSlug: "house-robber",
        type: "multiple-choice",
        question: "Why does a simple greedy approach (always take the largest house) fail?",
        options: [
            "It produces the wrong answer because it may skip a better pair",
            "It always takes adjacent houses",
            "It runs in O(n^2) time",
            "Greedy always works for this problem",
        ],
        correctAnswer: 0,   // 0-indexed: index 0 is the correct option
        explanation:
            "Greedy can be fooled by a large middle house that forces you to skip two " +
            "smaller but jointly better houses. DP considers all options.",
        difficulty: "Easy",
    },
    {
        id: "hr-2",
        problemSlug: "house-robber",
        type: "fill-blank",
        question:
            "For nums = [2, 7, 9, 3, 1], dp[2] = max(dp[1], dp[0] + nums[2]) = max(7, 2+9) = ___",
        correctAnswer: "11",
        explanation: "dp[2] = max(7, 11) = 11. Rob houses 0 and 2.",
        difficulty: "Easy",
    },
    {
        id: "hr-3",
        problemSlug: "house-robber",
        type: "multiple-choice",
        question: "What is the time complexity of the bottom-up DP solution?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
        correctAnswer: 2,
        explanation: "We fill one cell per house in a single left-to-right pass.",
        difficulty: "Easy",
    },
    {
        id: "hr-4",
        problemSlug: "house-robber",
        type: "fill-blank",
        question: "The space-optimized version needs only ___ variables instead of a full dp array.",
        correctAnswer: "2",
        explanation:
            "dp[i] only depends on dp[i-1] and dp[i-2], so two variables (prev1, prev2) suffice.",
        difficulty: "Easy",
    },
    {
        id: "hr-5",
        problemSlug: "house-robber",
        type: "free-response",
        question:
            "Explain in one sentence what dp[i] represents in the House Robber recurrence.",
        correctAnswer: "maximum money from first i houses",
        explanation:
            "dp[i] = the maximum amount of money robable from houses 0 through i, " +
            "respecting the no-adjacent constraint.",
        difficulty: "Easy",
    },
    {
        id: "hr-6",
        problemSlug: "house-robber",
        type: "multiple-choice",
        question: "For nums = [1, 2, 3, 1], what is the maximum rob amount?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,   // index 1 = "4"
        explanation: "Rob house 0 (1) and house 2 (3) = 4. Or house 1 (2) and house 3 (1) = 3. Best is 4.",
        difficulty: "Easy",
    },
];
```

### Register the Quiz

In `src/data/quizzes/index.ts`:

```typescript
import { houseRobberQuiz } from "./house-robber";    // add import

export const quizzesBySlug: Record<string, QuizQuestion[]> = {
    fibonacci: fibonacciQuiz,
    // ...existing entries...
    "house-robber": houseRobberQuiz,                  // add entry
};

export { houseRobberQuiz };                           // add named export
```

The quiz is now available at `/problems/house-robber/quiz`.

---

## 10. Debugging Tips

### React DevTools

Install the React DevTools browser extension. It adds two panels:

- **Components** — inspect the live component tree, current props and state, active hooks and their values
- **Profiler** — record renders and identify which components re-render unnecessarily

When `useDPVisualizer` misbehaves, open Components, find the hook, and inspect `currentStep`, `isPlaying`, and `totalSteps` directly without adding `console.log`.

### Hydration Errors

**Symptom:** `Error: Hydration failed` or `Text content does not match server-rendered HTML`.

**Cause:** The component produced different HTML on the server vs. the browser. Common triggers:
- Accessing `localStorage` or `window` outside a `useEffect`
- Using `Date.now()` or `Math.random()` during the render phase
- Rendering content based on `typeof window !== "undefined"` synchronously

**Fix:** Move browser-only logic inside `useEffect`. The `getProgress()` function in this codebase already does this:
```typescript
if (typeof window === "undefined") return defaultProgress();
```

### Infinite Re-render Loop

**Symptom:** Page freezes, CPU spikes, browser warns "Page Unresponsive."

**Cause:** A `useEffect` updates state, which triggers a re-render, which runs the effect again.

**Common culprit:** Object or array created inside the component used as a dependency:

```typescript
// BUG: steps is a new array on every render, so this effect loops forever
const steps = algorithm.run(input);
useEffect(() => {
    visualizer.setSteps(steps);
}, [steps]);

// FIX: useMemo gives steps a stable reference
const steps = useMemo(() => algorithm.run(input), [input.n]);
```

### Stale Closures

**Symptom:** An event handler always reads the same value no matter how many times state updates.

**Cause:** The function closed over a state variable at the moment it was created. When state updates, old closures still hold the old value.

**Fix:** Use the functional updater form of `setState`:

```typescript
// BUG: count in the closure may be stale
const increment = () => setCount(count + 1);

// FIX: always receives the latest value from React
const increment = () => setCount(prev => prev + 1);
```

### Common Errors and Fixes

| Error message | Likely cause | Fix |
|---|---|---|
| `Cannot read properties of null (reading 'classList')` | DOM access before mount | Move inside `useEffect` |
| `Warning: Each child in a list should have a unique "key"` | Missing `key` on list items | Add `key={item.id}` to each element returned from `.map()` |
| `Module not found: Can't resolve '@/...'` | Wrong import alias | `@/` maps to `src/` — check your path |
| `SyntaxError: Unexpected token '<'` | JSX in a `.ts` file | Rename the file to `.tsx` |
| `localStorage is not defined` | Accessed during SSR | Add `typeof window === "undefined"` guard |
| `Warning: Cannot update a component while rendering a different component` | Calling `setState` during another component's render | Move the state update into a `useEffect` or event handler |

### Inspecting Algorithm Output

To verify your algorithm produces correct steps without loading the UI, add a temporary log at the bottom of the algorithm file during development:

```typescript
// TEMPORARY — remove before committing
if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
    const testResult = algorithm.run({ n: 5 });
    console.log("Step count:", testResult.length);
    console.log("Final table:", testResult[testResult.length - 1]?.table);
}
```

---

## 11. Glossary

| Term | Definition | C++/Java equivalent |
|---|---|---|
| **Component** | A function returning JSX; the basic UI building block | Class with a `render()` method |
| **Props** | Read-only inputs passed from parent to child | Constructor arguments / method parameters |
| **State** | Mutable data owned by a component; updating it triggers a re-render | Class member variables |
| **Hook** | A function starting with `use` that accesses React features | No direct equivalent; closest is a mixin or aspect |
| **JSX** | HTML-like syntax in TS files that compiles to `React.createElement` calls | Template engine / XML literals |
| **`useEffect`** | Runs code after render; return value is the cleanup function | Constructor + destructor |
| **`useState`** | Declares a reactive state variable | Instance field |
| **`useCallback`** | Memoizes a function reference | Caching a function pointer |
| **`useMemo`** | Memoizes a computed value | Cached/lazy computation |
| **`useRef`** | Mutable container that does not trigger re-renders | Non-reactive pointer / instance field |
| **Route Handler** | `route.ts` in `src/app/api/` — runs on the server only | REST endpoint in Spring / Express |
| **SSR** | Server-Side Rendering — HTML generated on server before sending | Rendering a template server-side |
| **Hydration** | React attaching event handlers to server-rendered HTML | Binding listeners after DOM load |
| **Dynamic import** | `next/dynamic(() => import(...))` — lazy loading | `dlopen` / dynamic class loading |
| **`"use client"`** | Directive opting a file into client-side rendering | — (no equivalent) |
| **Slug** | URL-safe lowercase hyphenated identifier: `"house-robber"` | String key / enum value |
| **`Record<K, V>`** | Object with known key type and value type | `std::map<K, V>` / `HashMap<K, V>` |
| **`T \| null`** | Union type — value is either T or null | `std::optional<T>` |
| **`T[]`** | Array of type T | `std::vector<T>` / `T[]` in Java |
| **`interface`** | Structural type declaration | `struct` / Java interface (without methods) |
| **`type`** | Type alias; often used for union types | `typedef` |
| **`as`** | Type assertion — tells compiler to treat value as given type | `static_cast<T>` (no runtime check) |
| **`unknown`** | Top type — must narrow before using | `void*` (but type-safe) |
| **`?.`** | Optional chaining — short-circuits to `undefined` if left side is nullish | Null-check before pointer dereference |
| **`??`** | Nullish coalescing — returns right side if left is `null`/`undefined` | `x != null ? x : default` |
| **`ReadableStream`** | Web Streams API — streaming bytes from server to client | `std::istream` / `InputStream` |
| **localStorage** | Browser key-value store persisted across sessions | Flat file / embedded KV store |
| **`DPStep`** | One animation frame in the visualizer — a complete table snapshot | Struct representing a state snapshot |
| **`DPAlgorithm`** | Object with `run()` and `solve()` — the strategy interface | Strategy pattern |
| **`DPProblem`** | Metadata, theory text, and test cases for one problem | Data class / value object |
| **`UserProgress`** | All user progress serialized to localStorage | Save file / session data |
| **`AISettings`** | API key and model selection stored in localStorage | Configuration object |

---

*For architecture decisions and conventions, see `CLAUDE.md`. For the full type surface of the DP engine, see `src/lib/dp-engine/types.ts`.*
