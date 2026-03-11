# Zero to Hero: A Systematic Study Plan for Mastering This Application

---

## Introduction

### Who this plan is for

This plan is written for someone who can already write code — in C, Java, Python, or any other language — but does not yet know modern web development. You understand variables, loops, functions, and data structures. You may have never opened a React app, written TypeScript, or touched a browser's DevTools.

By the end of this plan, you will understand every layer of how DP Mastery is built: the algorithms, the data structures, the React components, the AI integration, the storage layer, the animations, and the deployment model. You will be able to open any file in this repository and understand what it does, why it was written that way, and how you would change it.

This is not a plan for learning DP algorithms (see `USER-GUIDE.md` for that, or see the original algorithm-focused study plan). This is a plan for understanding the *software itself* as a piece of engineering — how you go from "here is a DP algorithm in Python" to "here is a production-quality interactive web app teaching that algorithm."

### How to use this plan

Each week has two components:

- **Theory** — concepts to understand before you write any code. Read external resources, watch videos, and think through the ideas.
- **Hands-on** — specific exercises using the DP Mastery repository. These ground the theory in real code you can read, run, and modify.

You do not need to follow a strict one-week-per-section schedule. Some phases will take you longer; others you may fly through. The order matters more than the pace — each phase builds on the previous ones.

A note on tools: you will need **VS Code** (or any code editor), **Node.js** (version 18 or higher), and **npm** installed. Run `npm install` inside the `dp-course` directory once, then `npm run dev` to start the development server at `http://localhost:3000`.

---

## Phase 1: Foundations (Weeks 1-2)

This phase builds the bedrock. Everything in later phases assumes you understand how the web works and what TypeScript is.

---

### Week 1: Web Fundamentals

#### Theory

**How browsers work**

A browser's job is to turn text files into pixels on screen. The three text formats it understands are:

- **HTML** (HyperText Markup Language) — the structure. Think of it as the skeleton. `<div>`, `<button>`, `<p>` are HTML elements.
- **CSS** (Cascading Style Sheets) — the appearance. Colors, fonts, layout, spacing.
- **JavaScript** — the behavior. Reacting to clicks, fetching data, updating the page without a full reload.

When you type a URL, the browser makes an HTTP request to a server. The server responds with an HTML file. The browser parses that HTML, finds `<link>` tags pointing to CSS files and `<script>` tags pointing to JavaScript files, fetches those too, and renders the whole thing.

**The client-server model and HTTP**

- **Client** = the browser (your computer)
- **Server** = a computer somewhere that responds to requests
- **HTTP** = the protocol (language) they use to communicate
- **REST API** = a convention for organizing HTTP endpoints so they map cleanly to resources (`GET /problems` = fetch all problems, `POST /api/ai/chat` = send a message to the AI)

**What is Node.js?**

JavaScript was originally designed to run only in browsers. Node.js is a runtime that lets JavaScript run *outside* a browser — on a server, in a terminal, in build tools. Think of it as the JVM for JavaScript: Node.js is to JavaScript what the JVM is to Java. When you run `npm run dev`, Node.js is executing the Next.js development server on your machine.

**npm (Node Package Manager)**

npm is to Node.js what Maven is to Java or pip is to Python. You declare dependencies in `package.json` and run `npm install` to download them into the `node_modules/` directory.

#### Hands-on exercises

**Exercise 1: Explore the file structure**

Open the `dp-course` directory in VS Code. Spend 15 minutes reading the directory tree without opening individual files. Notice the top-level directories: `src/`, `docs/`, `public/`. Inside `src/`, notice `app/`, `components/`, `data/`, `hooks/`, `lib/`. For each directory, ask yourself: "What would I expect to find here, based on the name?" Then compare your guess to the actual contents.

**Exercise 2: Read package.json**

Open `/package.json`. This file is the manifest for the entire project. Read:
- `"scripts"` — the commands you can run (`npm run dev`, `npm run build`)
- `"dependencies"` — libraries the app needs to *run* (React, Next.js, Framer Motion, Recharts)
- `"devDependencies"` — libraries only needed during development (TypeScript, the type definitions)

For each major dependency, look it up briefly: what does it do? Why might it be here?

**Exercise 3: Read tsconfig.json**

Open `/tsconfig.json`. This tells the TypeScript compiler how to behave. The most important settings are:
- `"strict": true` — enables strict type checking, similar to `-Wall` in C
- `"paths": { "@/*": ["./src/*"] }` — this is why you see `import from "@/lib/..."` instead of long relative paths like `../../../lib/...`

**Exercise 4: Open DevTools and inspect the page**

With the dev server running (`npm run dev`), open `http://localhost:3000` in Chrome. Press F12 (or right-click anywhere and choose "Inspect") to open DevTools.

- Click the **Elements** tab. This shows the live HTML. Expand nodes to see the structure of the page. Hover over elements in the HTML tree — they highlight on the page.
- Click the **Console** tab. This is a live JavaScript REPL. You can run JavaScript here against the live page.
- Click the **Network** tab. Refresh the page. Watch all the files that get downloaded.

**Exercise 5: Inspect localStorage**

In DevTools, click the **Application** tab (it may be hidden behind a `>>` overflow arrow in the tab bar). In the left sidebar, expand **Local Storage** and click `http://localhost:3000`. You will see key-value pairs stored by the app.

Now switch to the **Console** tab and type:
```javascript
localStorage.getItem('dp-course-progress')
```

If you have used the app, you will see a JSON string. Try:
```javascript
JSON.parse(localStorage.getItem('dp-course-progress'))
```

This is the raw `UserProgress` object the app uses to track your learning. Explore its structure — you will recognize it when you read `src/lib/dp-engine/types.ts` in Week 2.

---

### Week 2: TypeScript and Modern JavaScript

#### Theory

**TypeScript = JavaScript + types**

TypeScript is a superset of JavaScript. Every valid JavaScript file is valid TypeScript. TypeScript adds a type system on top — like the difference between C and C++, or untyped Python and type-annotated Python. Types are erased at compile time; the browser only ever runs plain JavaScript. The TypeScript compiler (`tsc`) catches type errors before your code reaches the browser.

**Modern JavaScript syntax you need to know**

If you know C or Java, these constructs may look unfamiliar:

```typescript
// const and let (no var)
const name = "Alice";        // immutable binding (like Java's final)
let count = 0;               // mutable binding

// Arrow functions (lambda expressions)
const add = (a: number, b: number) => a + b;
// Equivalent to: function add(a, b) { return a + b; }

// Template literals (backtick strings with interpolation)
const message = `Hello, ${name}! Count is ${count}.`;

// Destructuring — extract values from objects or arrays
const { title, difficulty } = problem;         // object destructuring
const [first, second, ...rest] = array;        // array destructuring

// Spread operator — copy/merge arrays and objects
const newArray = [...oldArray, newItem];
const newObject = { ...oldObject, key: newValue };

// Optional chaining — safe property access without null checks
const score = user?.progress?.quizScores?.fibonacci;

// Nullish coalescing — default value when null or undefined
const display = score ?? 0;
```

**Promises and async/await**

JavaScript is single-threaded. To do slow work (network requests, reading files) without freezing the entire page, it uses asynchronous programming. A `Promise` is an object representing a value that will exist in the future.

```typescript
// Old style (callback chains — hard to read)
fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Modern style (async/await — reads like synchronous code)
async function fetchData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

Think of `await` as "pause here and wait for the Promise to resolve, but do not block the thread — let other work happen in the meantime."

**ES modules (import/export)**

```typescript
// Named export — you can have many per file
export function helper() { ... }
export const CONSTANT = 42;

// Default export — exactly one per file
export default function MainThing() { ... }

// Importing
import { helper, CONSTANT } from './utils';
import MainThing from './MainThing';
import * as utils from './utils';   // everything as a namespace
```

#### Hands-on exercises

**Exercise 1: Map every interface in types.ts to a C++ struct**

Open `/src/lib/dp-engine/types.ts`. Read every interface. For each one, write out the equivalent C++ struct on paper. For example:

```typescript
// TypeScript
interface DPStep {
  index: number;
  description: string;
  table: number[][] | number[];
  computing: number[];
  formula?: string;     // the ? means optional (may be undefined)
}
```

Equivalent in C++:
```cpp
struct DPStep {
    int index;
    std::string description;
    std::variant<std::vector<std::vector<int>>, std::vector<int>> table;
    std::vector<int> computing;
    std::optional<std::string> formula;
};
```

Do this for `DPStep`, `DPProblem`, `DPAlgorithm`, `QuizQuestion`, `Exam`, `UserProgress`, and `AISettings`. This exercise builds the mental translation layer you will use throughout the rest of the plan.

**Exercise 2: Trace the Fibonacci algorithm**

Open `/src/lib/dp-engine/algorithms/fibonacci.ts`. Read the entire file. Trace through it manually (or on paper) for `n = 5`. Write down each `DPStep` object that would be produced. Then compare to what the visualizer actually shows for `n = 5`. Do they match?

**Exercise 3: Modify fibonacci.ts to add console logging**

In the algorithm's `run()` function, add a `console.log` inside the main loop that prints the current `i` and the current state of the `dp` array. Run the app with `npm run dev`, open the Fibonacci problem page, and open the browser Console tab. You should see logs appear when the visualizer runs.

This exercise proves you understand the data flow: the algorithm file runs in the browser (not on the server), and its output is visible in DevTools.

Remove the `console.log` after confirming it works — logging inside a tight loop creates noise.

---

## Phase 2: React and Next.js (Weeks 3-4)

React is the library that turns data into UI. Next.js is the framework that adds routing, server-side features, and API routes on top of React.

---

### Week 3: React Fundamentals

#### Theory

**Components**

A React component is a function that takes **props** (inputs) and returns **JSX** (a description of what to render). JSX looks like HTML written inside JavaScript:

```typescript
function ProblemCard({ title, difficulty }: { title: string; difficulty: string }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <span>{difficulty}</span>
    </div>
  );
}
```

Think of a component as a template function. Every time React calls it, it returns a fresh description of what the UI should look like right now, based on the current props and state.

**State (useState)**

State is data that, when changed, causes the component to re-render:

```typescript
const [count, setCount] = useState(0);
// count = current value
// setCount = function to update it
```

When you call `setCount(count + 1)`, React schedules a re-render. The next render sees the new value. This is how the visualizer's "current step" pointer advances as you click step-forward — the click handler calls `setCurrentStep(s => s + 1)`, React re-renders, and the table re-draws with the new step highlighted.

**The rendering cycle**

1. Component renders (function runs, returns JSX)
2. React updates the DOM to match
3. User does something (clicks a button)
4. Event handler calls a state setter
5. React schedules a re-render
6. Return to step 1 with updated state

**useEffect — side effects**

Some operations do not belong in rendering: fetching data, setting up timers, subscribing to events. These go in `useEffect`:

```typescript
useEffect(() => {
  const timer = setInterval(() => tick(), 1000);
  return () => clearInterval(timer);  // cleanup when component unmounts
}, []);  // empty array = run once on mount, never again
```

The second argument is the **dependency array**. Empty array = run once on mount. `[someValue]` = re-run whenever `someValue` changes. No array at all = run after every render.

**useCallback — memoized callbacks**

```typescript
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

`useCallback` returns the same function reference unless its dependencies change. This matters for performance — if a parent passes a callback to a child, and the callback is recreated on every render, the child re-renders unnecessarily.

**useRef — mutable references that do not trigger renders**

```typescript
const timerRef = useRef<number | null>(null);
timerRef.current = setInterval(() => advance(), speed);
```

`useRef` stores a mutable value that does NOT trigger re-renders when changed. Used for timers, DOM node references, and any value that should survive re-renders but should not cause them.

#### Hands-on exercises

**Exercise 1: Read a simple component**

Open `/src/components/ui/Button.tsx`. This is one of the simplest components in the codebase. Read every line. Identify: What are the props? What does the component return? Is there any state? This is your baseline for understanding React components.

**Exercise 2: Read StepControls.tsx**

Open `/src/components/visualizer/StepControls.tsx`. This component renders the play/pause/step controls for the visualizer. Identify: which props does it receive? Which props are callback functions (event handlers for clicks)? Trace: when a user clicks Play, what function gets called, and where does that function come from?

**Exercise 3: Read and trace useDPVisualizer.ts**

Open `/src/hooks/useDPVisualizer.ts`. This hook manages the entire playback lifecycle:
- The list of all algorithm steps (from `run()`)
- The current step index
- Whether it is playing or paused
- The playback speed
- The interval timer for automatic advancement

Read it carefully. Draw a state machine diagram on paper: what states exist (idle, playing, paused, done), and what events cause transitions between them? This diagram will be one of the most useful things you create during the entire plan.

**Exercise 4: Add a "Jump to End" button**

Modify `/src/components/visualizer/StepControls.tsx` to add a new button labeled "End" (or a skip-to-end icon). When clicked, it should call whatever prop jumps the visualizer to the last step (likely something like `onSeek(totalSteps - 1)`). The button should be disabled when the visualizer is already at the last step.

Test it: open any problem's visualizer, click "End," and confirm the table shows the final filled state.

---

### Week 4: Next.js and Routing

#### Theory

**File-based routing**

In Next.js, the directory structure under `src/app/` *is* the URL structure:

```
src/app/page.tsx                          →  /
src/app/problems/page.tsx                 →  /problems
src/app/problems/[slug]/page.tsx          →  /problems/fibonacci, /problems/knapsack, etc.
src/app/problems/[slug]/quiz/page.tsx     →  /problems/fibonacci/quiz, etc.
src/app/settings/page.tsx                 →  /settings
src/app/exams/page.tsx                    →  /exams
```

You do not write any routing configuration. The file tree IS the router. New pages are created by adding new `page.tsx` files.

**Dynamic routes**

The `[slug]` directory is a **dynamic segment**. The brackets tell Next.js "this part of the URL is a variable." The page component inside that directory reads the variable with `useParams()` from `next/navigation`.

**App Router, layouts, and "use client"**

`layout.tsx` files wrap every page at that level and below. `src/app/layout.tsx` wraps the entire application — it is where the `<html>` and `<body>` tags live, and where the Navbar is rendered once, persisting across all page navigations.

By default, Next.js renders components on the server. The `"use client"` directive at the top of a file tells Next.js "this component runs in the browser." In DP Mastery, almost everything is a client component because it uses browser-only APIs: `localStorage`, event listeners, animation, and the interactive visualizer.

**API Routes (Route Handlers)**

Files named `route.ts` inside `src/app/api/` are server-side HTTP handlers:

```typescript
// src/app/api/ai/chat/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  // call OpenRouter with the user's API key
  // stream back the response
  return new Response(stream, { headers: { "Content-Type": "text/event-stream" } });
}
```

These run on the server, not in the browser. They are where it is safe to use secret credentials or call external services that should not be exposed to the client.

#### Hands-on exercises

**Exercise 1: Read the root layout**

Open `/src/app/layout.tsx`. Identify: where is the Navbar rendered? How does the ThemeContext get provided to all child components? What HTML structure wraps every page in the app? Notice that this file is `"use client"` — think about why the root layout needs to run in the browser.

**Exercise 2: Read the problem detail page**

Open `/src/app/problems/[slug]/page.tsx`. This is the most complex page in the app. Read it end to end. Identify:
- How does it read `slug` from the URL?
- How does it look up the `DPProblem` object using the slug?
- How does it load the corresponding algorithm?
- How are the Theory, Quiz, and Homework sections navigated between?

**Exercise 3: Read the AI chat API route**

Open `/src/app/api/ai/chat/route.ts`. Read it carefully. Identify:
- What does it expect in the request body?
- How does it obtain the user's API key?
- How does it call OpenRouter?
- How does it stream the response back to the browser?
- What response headers does it set to enable streaming?

**Exercise 4: Create a new /about page**

Create the file `/src/app/about/page.tsx`. Make it a `"use client"` component that displays:
- The course title ("DP Mastery")
- The total number of problems (10)
- Today's date (use `new Date().toLocaleDateString()`)
- A clickable link back to the Problems page (use `import Link from "next/link"`)

Once created, navigate to `http://localhost:3000/about` to verify it appears. This exercises the complete page creation workflow: new file, client component, JSX, and Next.js's `Link` component.

---

## Phase 3: The DP Engine (Weeks 5-6)

This phase dives into the core logic layer — the algorithms and the data structures that power the visualizer.

---

### Week 5: Understanding the Algorithm Layer

#### Theory

**What is a "step" in algorithm visualization?**

The central insight behind this visualizer is that an algorithm can be decomposed into a sequence of **state snapshots**. Each snapshot (a `DPStep`) captures:
- The full state of the DP table at that moment
- Which cell is being computed right now
- A human-readable description of what is happening
- The recurrence formula with actual numbers substituted in

The algorithm's `run()` function pre-computes all steps and returns them as an array. The visualizer then simply indexes into this array. This design makes stepping forward, stepping backward, and seeking to any arbitrary position all trivially simple — they are just changes to an integer index.

**Why deep copies matter**

Consider this subtle bug:

```typescript
// WRONG — steps all end up with the same table!
steps.push({ table: dp, computing: [i] });
dp[i] = newValue;
// The step we just pushed contains a reference to dp,
// not a snapshot. After the loop, every step shows the final state.

// CORRECT — each step gets its own copy
steps.push({ table: [...dp], computing: [i] });
dp[i] = newValue;
```

Every `DPStep` must contain a **snapshot** — a full copy of the table as it was at that exact moment. In 1D tables: `[...dp]`. In 2D tables: `dp.map(row => [...row])`. Missing this produces a broken visualizer where all steps appear to show the final filled state.

**The DPAlgorithm interface as the Strategy Pattern**

In object-oriented design, the **Strategy Pattern** is when you define an interface (the contract) and have multiple concrete implementations swappable at runtime. Here:

```typescript
interface DPAlgorithm {
  run: (input: Record<string, unknown>) => DPStep[];
  solve: (input: Record<string, unknown>) => unknown;
}
```

Every algorithm file exports an object matching this shape. The visualizer has no knowledge of which specific algorithm it is running — it calls `algorithm.run(input)` and receives steps. This is exactly why adding a new problem requires only creating one new algorithm file and registering it; no other code needs to change.

**The runner.ts cursor pattern**

After `run()` produces the full steps array, the hook maintains a simple integer **cursor** (`currentStepIndex`). Moving forward increments it; moving backward decrements it; seeking sets it directly. The visualizer reads `steps[currentStepIndex]`. This pattern makes time-travel playback (stepping backward) completely free — you just decrement an integer.

#### Hands-on exercises

**Exercise 1: Read all 10 algorithm files**

Open `/src/lib/dp-engine/algorithms/` and read every file. For each algorithm, write down:
- The state definition: what does each cell represent?
- The recurrence: how is each cell computed from previous cells?
- The fill order: 1D left-to-right? 2D row-by-row? Diagonal?
- Is the table 1D or 2D?

Notice patterns across the files. The 1D algorithms (fibonacci, climbing-stairs, coin-change, lis, rod-cutting) all follow the same basic skeleton. The 2D algorithms (knapsack, lcs, edit-distance, matrix-chain, unique-paths) all add an outer row loop. The diagonal fill in matrix-chain stands apart.

**Exercise 2: Trace an algorithm manually**

Pick any algorithm file. Trace the `run()` function by hand for the default input, writing out each `DPStep` that would be produced — including the `table` snapshot, `computing` index, and `formula` string. Then open the visualizer for that problem and step through it manually. Verify that every step matches your hand-trace.

**Exercise 3: Read runner.ts**

Open `/src/lib/dp-engine/runner.ts`. It is a thin wrapper that validates the input and dispatches to the correct algorithm by slug. Notice how it looks up the algorithm from the registry. This is the only additional file you would need to understand (not change) if you added a new problem.

**Exercise 4: Implement an 11th algorithm**

The best proof that you understand the pattern is to extend it. Implement **Partition Equal Subset Sum**: given an array of positive integers, determine whether it can be split into two subsets with equal sum.

- State: `dp[i][s]` = can we achieve sum `s` using only the first `i` items? (boolean)
- Recurrence: `dp[i][s] = dp[i-1][s] || dp[i-1][s - nums[i-1]]` (if `nums[i-1] <= s`)
- Base case: `dp[i][0] = true` for all `i`

Create:
1. `/src/data/problems/partition-subset.ts` — the `DPProblem` metadata object
2. `/src/lib/dp-engine/algorithms/partition-subset.ts` — the `DPAlgorithm` implementation
3. `/src/data/quizzes/partition-subset.ts` — 6 `QuizQuestion` objects

Register all three in their respective `index.ts` files. Navigate to `/problems/partition-subset` to see your new problem in the app.

---

### Week 6: The Visualization Pipeline

#### Theory

**How the hook manages playback state**

`useDPVisualizer` implements a state machine. The key states are:

- **Idle** — no steps loaded yet (initial state before an algorithm runs)
- **Ready** — steps loaded, cursor at 0, not playing
- **Playing** — automatically advancing via `setInterval`
- **Paused** — mid-sequence, interval stopped
- **Done** — cursor at the last step

Key transitions:
- Ready → Playing: user clicks Play
- Playing → Paused: user clicks Pause, or cursor reaches the end
- Paused → Playing: user clicks Play again
- Any state → Ready: user clicks Reset
- Any state → specific step: user uses step forward, step back, or seek

This state machine is implemented with multiple `useState` variables rather than a single `state` enum, but the logical structure is identical to a classic state machine.

**How Framer Motion animates**

Framer Motion is a React animation library. Instead of writing CSS keyframes or managing animation timing by hand, you declare the desired visual state and Framer Motion transitions to it automatically:

```typescript
<motion.div
  animate={{
    opacity: 1,
    scale: 1.05,
    backgroundColor: "#fbbf24"
  }}
  transition={{ duration: 0.2 }}
>
  {value}
</motion.div>
```

When the `animate` prop changes — for example, when a cell transitions from "idle" to "computing" — Framer Motion interpolates between the old and new values over the specified duration. This is how cell color transitions appear smooth rather than instant.

**How Table1D and Table2D map step data to cell appearance**

The table components receive the current `DPStep` and the full steps array. For each cell, they determine its visual state by asking:

1. Is this cell's index listed in `step.computing`? → Yellow (currently being computed)
2. Is this cell's index listed in `step.backtrackPath`? → Gold (part of the solution path)
3. Was this cell computed in a step before the current one? → Green (done)
4. Otherwise? → Dimmed/grey (not yet computed)

This classification is performed entirely in the render function using the step data. The cell itself stores no visual state — all appearance is derived from the current step.

#### Hands-on exercises

**Exercise 1: Read DPVisualizer.tsx end to end**

Open `/src/components/visualizer/DPVisualizer.tsx`. This is the top-level visualizer component. Trace every prop flowing into it. Where does the `DPStep` array come from? How does `StepControls` connect back to the hook? How is the 1D vs 2D decision made to choose between `Table1D` and `Table2D`?

**Exercise 2: Add console.log breadcrumbs to useDPVisualizer**

Open `/src/hooks/useDPVisualizer.ts`. Add `console.log` calls inside the play, pause, step-forward, and reset functions, and also inside the interval callback that advances the step. Open the Fibonacci visualizer and use every control. Watch the state transitions appear in the Console tab. This makes the state machine visible and tangible. Remove the logs when done.

**Exercise 3: Read Table1D.tsx**

Open `/src/components/visualizer/Table1D.tsx`. For each cell in the rendered table, trace how the visual state is determined. How does it decide whether to apply a yellow, green, gold, or grey appearance? What data does it look at to make that decision?

**Exercise 4: Add a step-description tooltip on cell hover**

Modify `Table1D.tsx` so that hovering over any completed cell shows a small tooltip with the description from the `DPStep` that first computed that cell. To implement this, you need to find — for each cell index — the first step in the steps array where that index appears in `computing`, and then read that step's `description`.

This is a meaningful feature improvement, not a toy exercise. It makes the visualizer more educational by connecting each computed value back to the explanation of how it was derived.

---

## Phase 4: AI Integration (Weeks 7-8)

This phase covers the AI features: the chat API, the grading endpoint, and the streaming UI.

---

### Week 7: Understanding LLM APIs

#### Theory

**What is an LLM and how does a chat API work?**

A Large Language Model (LLM) is a neural network trained to predict the next token in a text sequence. In practice, you interact with them via an HTTP API that takes an array of **messages** and returns the model's response:

```typescript
const messages = [
  {
    role: "system",
    content: "You are a patient DP tutor. Give hints before full answers."
  },
  {
    role: "user",
    content: "What does dp[i] mean in Fibonacci?"
  },
];
// POST these to the API → model generates a response
```

The `system` message defines the AI's persona and constraints. The `user` and `assistant` messages form the conversation history. Every request sends the full history — the model has no built-in memory between requests.

**Streaming with Server-Sent Events (SSE)**

Generating a long response can take several seconds. If you wait for the complete response before showing anything, the UI feels frozen. Instead, most LLM APIs support **streaming**: they send tokens incrementally as they are generated. The client displays them as they arrive.

The protocol used is **Server-Sent Events (SSE)**. The server sends a continuous stream of lines, each starting with `data: ` followed by a JSON payload. A special `data: [DONE]` line signals the end of the stream:

```
data: {"choices":[{"delta":{"content":"The"}}]}
data: {"choices":[{"delta":{"content":" recurrence"}}]}
data: {"choices":[{"delta":{"content":" is"}}]}
data: [DONE]
```

The client reads this stream chunk by chunk and appends each piece of text to the UI as it arrives.

**OpenRouter**

OpenRouter is a proxy service that accepts one API format and routes to many AI providers (Anthropic, OpenAI, Google, and others). DP Mastery uses OpenRouter so that users can choose between Claude, GPT-4o, and Gemini without the app needing separate integrations for each provider.

The endpoint is always `https://openrouter.ai/api/v1/chat/completions`. Only the `model` field in the request body changes between providers.

**API keys and authentication**

API keys are secret credentials proving you have a valid account. They are always sent in the `Authorization: Bearer sk-or-...` HTTP header. Never embed an API key in client-side JavaScript — anyone who opens DevTools can read it.

In DP Mastery, the key is handled safely:
1. The user pastes their key into the Settings page
2. The key is stored in `localStorage` (browser-only, never sent to DP Mastery's server as persistent storage)
3. When making an AI request, the client sends the key in the `x-api-key` header to the app's own API route (`/api/ai/chat`)
4. The Next.js route handler — which runs on the server — reads the header and passes the key to OpenRouter

This keeps the key safe: the server-to-OpenRouter communication is trusted, and the key never appears in client-visible JavaScript code.

#### Hands-on exercises

**Exercise 1: Read client.ts**

Open `/src/lib/ai/client.ts`. The core function (`callAI`) takes a messages array and configuration options and returns a streaming `Response`. Read how it constructs the request body (which fields go to OpenRouter) and what headers it sets (including `Authorization` and `HTTP-Referer`).

**Exercise 2: Read prompts.ts**

Open `/src/lib/ai/prompts.ts`. There are four prompt templates: `TUTOR_PROMPT`, `QUIZ_GENERATOR_PROMPT`, `GRADER_PROMPT`, and `CODE_REVIEWER_PROMPT`. Notice how each one defines a different persona and behavioral contract. Note the `{problem_name}` placeholder in `TUTOR_PROMPT` — this string is replaced at request time with the actual problem name.

**Exercise 3: Read context-builder.ts**

Open `/src/lib/ai/context-builder.ts`. The `buildTutorContext()` function assembles a context block that is injected into the system prompt alongside the tutor persona. It includes the problem statement, recurrence, state definition, and — if the user is actively looking at a step — the current step number and formula. This is how the tutor can answer step-specific questions.

**Exercise 4: Watch the SSE stream in DevTools**

With the dev server running, open any problem page, open the AI Tutor sidebar, and ask a question. In DevTools, go to the **Network** tab and find the request to `/api/ai/chat`. Click on it. Under the **Response** tab, scroll slowly and watch the raw SSE data. Look for `data: {"choices":[{"delta":{"content":"..."}}]}` lines and correlate them with the text appearing in the sidebar.

**Exercise 5: Add an "Exam Prep Coach" persona**

Open `/src/lib/ai/prompts.ts`. Add a new export:

```typescript
export const EXAM_PREP_PROMPT =
  "You are an exam preparation coach helping a student review dynamic programming before a timed exam. " +
  "Focus on rapid recall: key recurrences, base cases, complexity, and common mistakes. " +
  "Use short, crisp responses. Quiz the student with flashcard-style questions. " +
  "Be direct — exam time is limited. " +
  "You are currently reviewing {problem_name}.";
```

If the tutor UI has a mode selector, wire it in. If not, write a short design document describing how you would add a mode toggle to the `TutorSidebar` to switch between personas.

---

### Week 8: The Chat System

#### Theory

**React state for real-time streaming UI**

When tokens arrive from the SSE stream, the UI needs to append each one to the current assistant message incrementally. The standard approach:

1. When the user sends a message, append a placeholder assistant message with empty content to the messages array
2. As each token arrives from the stream, update that last message's content by appending the token
3. Each update triggers a React re-render, and the user sees text appearing character by character

The tricky part: reading a stream is asynchronous, but React state updates inside async code still work correctly — each `setState` call schedules a re-render with the latest value.

**ReadableStream API**

The `Response` object returned by `fetch()` exposes a `body` property of type `ReadableStream<Uint8Array>`. You read it like this:

```typescript
const reader = response.body!.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  // text is a chunk of raw SSE data — parse it below
}
```

**SSE parsing**

A typical raw chunk looks like this:

```
data: {"choices":[{"delta":{"content":"Hello"}}]}\n\ndata: {"choices":[{"delta":{"content":" world"}}]}\n\n
```

Parsing steps:
1. Split the chunk on `"\n\n"` to separate individual events
2. For each event, remove the `"data: "` prefix
3. Skip `"[DONE]"` markers
4. `JSON.parse` the remaining string
5. Extract `choices[0].delta.content`
6. Append the extracted text to the current assistant message

#### Hands-on exercises

**Exercise 1: Read useAITutor.ts line by line**

Open `/src/hooks/useAITutor.ts`. This hook manages the entire chat lifecycle: message history, loading state, the streaming fetch request, and the SSE parsing loop. Read every line carefully. Draw a flowchart showing what happens from "user clicks Send" to "the final token appears in the UI."

**Exercise 2: Read TutorSidebar.tsx**

Open `/src/components/tutor/TutorSidebar.tsx`. How does it render the list of messages? What shows visually while a response is being streamed? How does the scroll-to-bottom behavior work after each new message?

**Exercise 3: Read ChatMessage.tsx**

Open `/src/components/tutor/ChatMessage.tsx`. This renders a single message bubble. How does it display markdown? The AI tutor frequently responds with code blocks and bold text — these need to be rendered as formatted HTML rather than plain text.

**Exercise 4: Add a "Copy" button to assistant messages**

Modify `ChatMessage.tsx` to add a small "Copy" button that appears when hovering over an assistant message (not a user message). Clicking it should copy the message content to the clipboard using the browser's `navigator.clipboard.writeText()` API. After copying, show a brief "Copied!" label for 2 seconds before reverting back to "Copy."

---

## Phase 5: State Management and Persistence (Week 9)

Understanding how the app stores and retrieves data is essential for understanding its architecture.

---

### Week 9: State Management and localStorage

#### Theory

**localStorage API**

`localStorage` is a browser API for storing string key-value pairs persistently — the data survives page refreshes, browser restarts, and computer reboots, until it is explicitly cleared.

```typescript
localStorage.setItem('key', 'value');           // store a string
const value = localStorage.getItem('key');      // retrieve (null if missing)
localStorage.removeItem('key');                  // delete one key
localStorage.clear();                           // delete all keys for this origin
```

Values must be strings. To store objects, serialize with `JSON.stringify()` and deserialize with `JSON.parse()`.

**The "all client-side, no database" architecture**

DP Mastery stores all user data in `localStorage`. There is no user account system, no database, no server storing your progress. This design choice means:
- Zero setup required — open the URL and start learning
- Zero privacy concerns — your data never leaves your machine
- One trade-off — data is tied to a specific browser on a specific device

**BYOK (Bring Your Own Key)**

Your OpenRouter API key is stored in localStorage under `dp-course-settings`. The app never sends it to a DP Mastery server for storage. When you make an AI request, the client reads the key from localStorage and passes it to the Next.js API route via an HTTP header. The route uses it to call OpenRouter and then discards it — it is never logged.

**React hooks as the state management layer**

DP Mastery does not use a global state library like Redux or Zustand. Instead, state is managed by custom hooks (`useProgress`, `useAITutor`, `useDPVisualizer`). Each hook owns a slice of state. Components that need that state call the hook directly.

The key insight: `localStorage` is the source of truth for progress and settings. React state is a fast in-memory mirror of that source of truth. When you save a quiz score, both are updated simultaneously — the `saveProgress()` call writes to localStorage, and `setProgress()` updates the React state that triggers re-renders.

#### Hands-on exercises

**Exercise 1: Read progress.ts and settings.ts**

Open `/src/lib/storage/progress.ts` and `/src/lib/storage/settings.ts`. These are thin wrappers around localStorage. Notice:
- The `try-catch` blocks: localStorage can fail in private/incognito mode when the storage quota is exceeded, and the app silently degrades rather than crashing.
- The `defaultProgress()` function and the merge pattern in `getProgress()`: if the stored data is missing a field (because the schema gained a new field after the user first used the app), the new field gets its default value on read.

**Exercise 2: Re-read useProgress.ts with your React knowledge**

Open `/src/hooks/useProgress.ts`. You saw this file in the setup phase. Now read it again with your Week 3 React knowledge. Trace how `saveQuizScore` works step by step: it calls `update()`, which calls `setProgress()`, which both updates React state AND calls `saveProgress()` simultaneously. Why is it important to do both? What would break if you only updated React state without writing to localStorage? What would break if you only wrote to localStorage without updating React state?

**Exercise 3: Inspect live progress data in DevTools**

In DevTools → Application → Local Storage, find the `dp-course-progress` key. Open a few problem pages, take a quiz, and watch the value update in real time as you use the app. Expand the JSON and find your quiz score. This makes the persistence layer visible and concrete.

**Exercise 4: Add a "streak freeze" feature**

The streak breaks if you miss a day. A streak freeze lets you skip one day without losing your streak. Design and implement it:

1. Add a `streakFreezes: number` field to `UserProgress` in `/src/lib/dp-engine/types.ts`.
2. Update `defaultProgress()` in `/src/lib/storage/progress.ts` to initialize `streakFreezes: 1` (one free freeze to start with).
3. Modify `updateStreak()` in `/src/hooks/useProgress.ts`: if the last activity date was two days ago (not one day ago) and `streakFreezes > 0`, decrement `streakFreezes` and extend the streak instead of resetting to 1.
4. Display the number of available freezes in the Progress page's streak section.

---

## Phase 6: Styling and Animations (Week 10)

The visual layer: how CSS custom properties, Tailwind, and Framer Motion work together.

---

### Week 10: Styling and Animations

#### Theory

**Tailwind CSS — utility classes**

Tailwind is a CSS framework where you apply small, single-purpose utility classes directly in your JSX. Instead of:

```css
/* styles.css */
.card {
  border-radius: 8px;
  padding: 16px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

```jsx
<div className="card">...</div>
```

You write:

```jsx
<div className="rounded-lg p-4 bg-white shadow-sm">...</div>
```

Each class (`rounded-lg`, `p-4`, `bg-white`, `shadow-sm`) applies exactly one CSS rule. This eliminates the need to invent class names and keeps styles co-located with the markup.

**CSS custom properties (variables)**

CSS custom properties are variables defined in CSS and reused throughout:

```css
:root {
  --color-primary: #e8590c;       /* orange */
  --font-display: 'Playfair Display', serif;
}

.button {
  background: var(--color-primary);
  font-family: var(--font-display);
}
```

In DP Mastery, the `@theme` block in `globals.css` defines all color and font tokens. Changing a value there propagates automatically to every component that uses `var(--that-property)`.

**Dark mode implementation**

Dark mode is implemented by toggling a `dark` class on the `<html>` element. Components detect this using a `MutationObserver` — a browser API that watches for changes to an element's attributes. The `useTheme()` pattern in every page file sets up this observer and returns a boolean `dark` value. Components use it to choose between light and dark color values:

```typescript
const bg = dark ? "#0f172a" : "#faf8f5";
const textColor = dark ? "#e2e8f0" : "#1a1a2e";
```

**Framer Motion — declarative animations**

Framer Motion wraps standard HTML elements with animation capabilities:

```typescript
<motion.div
  initial={{ opacity: 0, y: 16 }}    // starting state (before mount)
  animate={{ opacity: 1, y: 0 }}     // target state
  transition={{ duration: 0.4 }}      // how long to interpolate
>
  Content slides in from below and fades in
</motion.div>
```

When the `animate` prop's values change at runtime, Framer Motion automatically tweens from the old values to the new ones. This is how the DP table cells smoothly transition colors during playback.

#### Hands-on exercises

**Exercise 1: Read globals.css**

Open `/src/app/globals.css`. Focus on the `@theme` block at the top. Map each CSS variable to where you have seen it used in the app. The primary accent color (`#e8590c` — orange) appears in the Play button, active badges, the "computing" cell highlight, the Settings save button, and many other places. Change it to a different color and watch the entire app update simultaneously via hot-reload.

**Exercise 2: Trace styles in a component**

Pick any page component. For each visual element, identify whether its styling comes from:
- A Tailwind utility class in `className`
- An inline `style` prop with hardcoded values
- An inline `style` prop with `var(--css-variable)`
- A conditional value based on the `dark` boolean

The Settings page is a good choice for this exercise — it is visually rich and uses all four styling mechanisms.

**Exercise 3: Change a theme color and watch it propagate**

In `/src/app/globals.css`, change the primary orange accent (`#e8590c`) to a deep teal (`#0d9488`). Save the file. The hot-reload updates the browser immediately. Count how many places change. Then revert the change.

**Exercise 4: Add a "high contrast" mode**

Design and implement a third theme option alongside Light and Dark:

1. Add `"high-contrast"` as an option to the theme selector in `/src/app/settings/page.tsx` and to the settings type in the settings storage file.
2. When high contrast is selected, apply both a `dark` class and a `high-contrast` class to `document.documentElement`.
3. In `/src/app/globals.css`, add overrides inside a `.high-contrast` selector block: pure white text, pure black background, bolder fonts, thicker borders.
4. Update the `useTheme()` pattern in components to be aware of the `high-contrast` class.

---

## Phase 7: Full Integration (Weeks 11-12)

With all the pieces understood individually, trace them end to end through real user flows.

---

### Week 11: Tracing Complete User Flows

The goal of this week is to understand each major user action as a complete chain of events crossing every layer of the application — from the user's click, through React, through the business logic, to the DOM update.

**Flow 1: Loading a problem page**

1. User navigates to `/problems/fibonacci`.
2. Next.js file-based router matches `src/app/problems/[slug]/page.tsx`.
3. The page component runs. `useParams()` returns `{ slug: "fibonacci" }`.
4. `problemsBySlug["fibonacci"]` looks up the `DPProblem` object from the data registry.
5. `algorithms["fibonacci"]` looks up the `DPAlgorithm` implementation.
6. `algorithm.run(problem.defaultInput)` executes synchronously and returns `DPStep[]`.
7. The `useDPVisualizer` hook receives these steps and initializes `currentStepIndex = 0`.
8. The visualizer renders `steps[0]` — the initial empty state of the DP table.
9. `Table1D` renders one cell per index. Each cell reads its value and visual state from `steps[0]`.

Exercise: Add `console.log("Algorithm: " + slug, "Steps:", steps.length)` at step 6 and verify it in the Console tab.

**Flow 2: Playing the animation**

1. User clicks the Play button in `StepControls`.
2. The `onPlay` callback fires (passed from `useDPVisualizer` as a prop).
3. `setIsPlaying(true)` executes inside the hook.
4. A `useEffect` watching `isPlaying` fires because the value changed.
5. `setInterval(() => advance(), speedMs)` starts a repeating timer.
6. Each tick calls `setCurrentStepIndex(i => i + 1)`.
7. Each increment triggers a React re-render of the visualizer.
8. `Table1D` reads `steps[newIndex]` and re-classifies each cell.
9. Framer Motion smoothly transitions the newly-computing cell from grey to yellow.
10. When `currentStepIndex === steps.length - 1`, the interval is cleared and playing stops.

Exercise: Add `console.log("Tick:", currentStepIndex)` inside the interval callback and watch it fire in the Console.

**Flow 3: Asking the AI tutor a question**

1. User types a message in `ChatInput` and presses Enter.
2. `useAITutor.sendMessage(text)` is called.
3. The user message is appended to the message history state.
4. A placeholder assistant message with empty content is appended (to show "thinking" state).
5. A `fetch` POST is made to `/api/ai/chat` with the message history, current context, and the `x-api-key` header.
6. The Next.js route handler receives the POST request.
7. It reads the API key from the header, builds the tutor context with `buildTutorContext()`, assembles the full `messages` array with `TUTOR_PROMPT`, and calls `callAI()`.
8. `callAI()` makes a streaming request to OpenRouter and returns a `ReadableStream`.
9. The route handler pipes this stream back to the browser as an SSE response.
10. Back in the browser, `useAITutor` reads the stream chunk by chunk in a `while` loop.
11. Each chunk is parsed as SSE; the delta content is extracted; the placeholder message's content is appended.
12. Each append triggers a React re-render; `TutorSidebar` shows text progressively.

Exercise: In the Network tab, find the `/api/ai/chat` request. Watch the EventStream sub-tab while the AI responds. Correlate each `data:` line with a word appearing in the sidebar.

**Flow 4: Taking a quiz and saving a score**

1. User navigates to `/problems/fibonacci/quiz`.
2. `QuizRunner` loads questions from `quizzesBySlug["fibonacci"]`.
3. User answers all 6 questions and clicks Submit.
4. `QuizRunner` calculates a score (correct answers / total × 100).
5. `useProgress().saveQuizScore("fibonacci", score)` is called.
6. `saveQuizScore` calls `update()`, which calls the functional form of `setProgress()`.
7. Inside `setProgress`, both `saveProgress()` (writes to localStorage) and the React state update happen atomically.
8. The new score is immediately available via `progress.quizScores.fibonacci` to any component that uses `useProgress()`.

Exercise: After submitting a quiz, immediately check DevTools → Application → Local Storage and verify the score is there.

---

### Week 12: Building Your Own Feature

You have spent eleven weeks reading and understanding this codebase. Now build something new in it.

Choose one of the following features and implement it completely — new data structures, new components, new hooks or API routes, new storage, and new routing where needed. Each option touches every layer of the application.

---

**Option A: Compare Algorithms Mode**

Show two problems side by side in a split-screen view. URL: `/compare?left=fibonacci&right=climbing-stairs`.

What you need:
- A new page at `src/app/compare/page.tsx`
- Read both `left` and `right` query parameters with `useSearchParams()` from `next/navigation`
- Run two algorithms and create two independent `useDPVisualizer` hook instances
- Render two `DPVisualizer` components side by side
- Add a "Sync Play" toggle that advances both visualizers together when playing

---

**Option B: Progressive Hint System**

Instead of full AI explanations, reveal the solution in four stages. First hint: a conceptual nudge. Second hint: the relevant DP pattern. Third hint: the recurrence relation with a blank. Fourth hint: the complete answer with explanation.

What you need:
- A `hintLevel: number` state variable in the problem page (0 = no hints shown)
- A new API route or modification to the existing chat route that accepts a `hintLevel` parameter in the request body and adjusts the system prompt accordingly
- A "Get Hint" button on the problem page and a "Next Hint" button once hints are showing
- Store which hint level each problem has reached in `UserProgress` so hints persist across sessions

---

**Option C: Export and Import Progress**

Let users download their progress as a JSON file and load it on another device.

What you need:
- An "Export Progress" button in Settings that calls `JSON.stringify(progress)` with formatting and triggers a file download using a hidden `<a>` element with a `download` attribute
- An "Import Progress" file input that reads the selected JSON file using the `FileReader` API
- Schema validation: check that the imported object has the expected fields before accepting it
- A success message ("Progress imported successfully") or error message ("Invalid file format")
- A confirmation dialog before overwriting existing progress

---

**Option D: Community Solutions Gallery**

A read-only page showing multiple correct implementations of each homework problem, illustrating different approaches.

What you need:
- A new data file type (e.g., `src/data/solutions/fibonacci.ts`) containing 3-5 different correct implementations with metadata: approach name, time complexity, space complexity, a short explanation
- A new page at `/problems/[slug]/solutions` using a dynamic route
- A tabbed interface where each tab shows one solution in a read-only Monaco editor (use `next/dynamic` with `ssr: false`, same as homework pages)
- A link to this page from the problem detail page

---

No matter which option you choose, use the patterns you have learned throughout this plan. When you are stuck, your most reliable tool is reading the existing codebase for patterns that are close to what you need.

---

## Phase 8: Going Beyond (Ongoing)

Completing Phase 7 means you understand this application at the level of someone who could have built it. Here is how to keep going.

**Add automated tests**

No test framework is configured in this repository yet. Adding one is a valuable exercise:

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest ts-jest
```

Start with `/src/lib/dp-engine/algorithms/` — these are pure functions, easy to test, and high-value. Verify that each algorithm's `solve()` returns the correct answer for all test cases defined in the corresponding `DPProblem` data file. Then verify that `run()` produces exactly one step per cell fill operation.

Move on to `/src/lib/storage/` — test that `saveProgress(x)` followed by `getProgress()` returns the same value as `x`. Test that `getProgress()` returns sensible defaults when localStorage is empty.

**Learn deployment**

- **Vercel**: The simplest path for Next.js apps. Install the Vercel CLI (`npm install -g vercel`), run `vercel` in the project directory, and follow the prompts. Zero configuration needed.
- **Docker**: Write a `Dockerfile` that runs `npm run build` and then `next start`. Gives you a portable container image deployable anywhere Docker runs.
- **Self-hosted Node.js**: Run `npm run build` to generate the `.next/` output directory, then `npm start` to serve it. Works on any server with Node.js 18+.

**Study other frameworks**

After becoming fluent in React + Next.js, you will find other frameworks approachable quickly because the underlying ideas are the same:

- **Vue.js**: Similar component model, slightly different syntax. The reactivity system is more automatic — variables declared with `ref()` or `reactive()` are tracked without explicit state setters.
- **Svelte**: Compiles away the framework entirely at build time. Very little boilerplate. Closest to writing plain HTML and JavaScript.
- **Astro**: Excellent for content-heavy sites. Renders HTML at build time and ships zero JavaScript by default, adding it back only for interactive islands.

**Build your own project from scratch**

The deepest learning comes from building something with no starter code. Some ideas that use the same architectural patterns as DP Mastery:

- A sorting algorithm visualizer (same pattern: algorithm produces steps, hook manages playback)
- A graph algorithm explorer (BFS, DFS, Dijkstra — animated step-through on a node/edge canvas)
- A personal finance dashboard that fetches data from a public API and visualizes it with charts

Apply the same layering: a pure algorithm layer producing state snapshots, a hook managing playback, AI explanations, localStorage persistence.

**Contribute back**

If you find bugs in this repository, have ideas for new problems, want to improve documentation, or want to add the test suite that is currently missing, contributions are welcome. The architecture is intentionally designed to be extended cleanly.

---

## Appendix A: Glossary of Terms

**API (Application Programming Interface):** A defined set of functions or HTTP endpoints that one piece of software exposes so other software can use it. The OpenRouter API accepts HTTP POST requests and returns AI-generated text.

**API Route / Route Handler:** In Next.js, a file named `route.ts` inside `src/app/api/` that handles HTTP requests on the server. In DP Mastery, used for the AI chat, grading, and feedback endpoints.

**Async/Await:** JavaScript syntax for writing asynchronous code that reads like synchronous code. `await` pauses execution inside an `async` function until a Promise resolves, without blocking the browser's main thread.

**Bundle:** The compiled and minified JavaScript output produced by `npm run build`. The browser downloads and runs these bundles rather than the original TypeScript source files.

**BYOK (Bring Your Own Key):** An architecture where users supply their own API keys rather than sharing a platform-provided key. Gives users control over costs and rate limits.

**Component:** In React, a function that accepts props and returns JSX. The fundamental building block of a React UI. Components compose (nest inside each other) to build complex interfaces.

**CSS Custom Property:** A CSS variable declared with `--name: value` syntax and referenced with `var(--name)`. Used in DP Mastery to define design tokens (colors, fonts) that propagate everywhere a `var()` reference uses them.

**Dark Mode:** A UI theme with dark backgrounds and light text. Implemented here by toggling a `dark` class on the `<html>` element and detecting that class in components via `MutationObserver`.

**DPAlgorithm:** The TypeScript interface all algorithm files implement. Has two methods: `run()` (returns all visualization steps) and `solve()` (returns just the final answer).

**DPStep:** A single snapshot of the DP table at one moment during execution. Contains the table values, which cell is being computed, a plain-English description, and the formula with substituted values.

**Dynamic Route:** A Next.js route where part of the URL is a variable. The `[slug]` directory segment creates a dynamic route. The variable value is read with `useParams()`.

**ES Module:** The modern JavaScript standard for code organization. Uses `import`/`export` syntax. Replaced the older CommonJS `require()` / `module.exports` system.

**Framer Motion:** A React animation library for declarative animations. You describe starting and ending visual states; Framer Motion interpolates between them.

**Hook:** A React function beginning with `use` that lets function components access React features (state, effects, context, etc.). Examples from this codebase: `useState`, `useEffect`, `useProgress`, `useDPVisualizer`.

**HTTP (HyperText Transfer Protocol):** The protocol for communication between browsers and servers. Requests have a method (GET, POST, etc.), a URL, headers, and an optional body. Responses have a status code, headers, and a body.

**JSX (JavaScript XML):** A syntax extension for JavaScript resembling HTML. JSX is compiled to `React.createElement()` calls. The `.tsx` file extension indicates TypeScript with JSX.

**localStorage:** A browser API for storing string key-value pairs that persist across page refreshes and browser restarts (but not across different browsers or devices, and not in incognito mode).

**LLM (Large Language Model):** A neural network trained to predict the next token in a text sequence. Used in DP Mastery via the OpenRouter API for the tutor, grader, and feedback features.

**MutationObserver:** A browser API that fires a callback whenever specified DOM attributes change. Used in DP Mastery to detect when the `dark` class is toggled on `<html>`.

**Next.js:** A React framework that adds file-based routing, server-side rendering capabilities, API route handlers, and build tooling on top of React.

**npm (Node Package Manager):** The package manager for Node.js. `npm install` downloads packages listed in `package.json`. `npm run dev` starts the development server.

**OpenRouter:** An API proxy routing requests to many AI providers (Anthropic, OpenAI, Google, etc.) through a single API interface. Used in DP Mastery so users can choose their preferred AI model.

**Prop:** Short for "property." The input values passed to a React component, analogous to function arguments.

**Promise:** A JavaScript object representing a future value. Can be in pending, fulfilled, or rejected state. Used with `async/await` for readable asynchronous code.

**React:** A JavaScript library for building user interfaces using composable components. Developed by Meta (Facebook).

**ReadableStream:** A browser API for consuming data progressively as it arrives. Used in DP Mastery to process the AI's streaming SSE response token by token.

**Recharts:** A React charting library. Used in DP Mastery for the skills radar chart on the Progress page.

**REST API:** A convention for organizing HTTP endpoints around resources, using standard HTTP methods (GET, POST, PUT, DELETE) to represent operations.

**Slug:** A URL-friendly string identifier, typically lowercase with hyphens (e.g., `coin-change`, `edit-distance`). Each problem has a slug used to build its URL and look it up in registries.

**SSE (Server-Sent Events):** A protocol for streaming data from a server to a browser over a single HTTP connection. The server sends lines prefixed with `data: `. Used in DP Mastery to stream AI tokens incrementally.

**State:** In React, data held by a component using `useState`. Changing state via the setter function schedules a re-render of the component.

**Strategy Pattern:** A design pattern where an interface defines a contract and multiple concrete implementations can be used interchangeably. The `DPAlgorithm` interface in this codebase is an example.

**Tailwind CSS:** A utility-first CSS framework. Small single-purpose classes (`p-4`, `rounded-lg`, `bg-white`) are applied directly in JSX instead of writing named CSS rules.

**TypeScript:** A superset of JavaScript that adds optional static type checking. TypeScript source is compiled to plain JavaScript before running in the browser.

**useCallback:** A React hook that memoizes a function, returning the same reference across renders unless the specified dependencies change.

**useEffect:** A React hook for running side effects (data fetching, timers, DOM subscriptions) after a component renders.

**useRef:** A React hook that stores a mutable value that does NOT cause re-renders when changed. Used for timers, DOM node references, and other mutable values that should survive re-renders silently.

**useState:** The primary React hook for storing reactive state. Returns the current value and a setter function.

---

## Appendix B: Recommended External Resources

**TypeScript**

- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
  The official documentation. Work through "Everyday Types," "Functions," "Object Types," and "Generics" in that order.

- TypeScript Playground: https://www.typescriptlang.org/play
  An in-browser TypeScript environment. Useful for quick experiments without setting up a project. Paste code from this repository and inspect the inferred types.

**React**

- React Documentation: https://react.dev
  The official React docs were rewritten in 2023 and are excellent. The interactive "Learn React" tutorial is worth completing in full before Phase 2.

- React DevTools browser extension: Install this to inspect component trees, props, state values, and renders directly in the browser.

**Next.js**

- Next.js Documentation: https://nextjs.org/docs
  Start with "Getting Started" and "App Router." The "Routing" and "Data Fetching" sections are most directly relevant to understanding this codebase.

**Tailwind CSS**

- Tailwind CSS Documentation: https://tailwindcss.com/docs
  The search is excellent. When you encounter an unfamiliar class in this codebase, look it up to see exactly what CSS it generates.

**Framer Motion**

- Framer Motion Documentation: https://www.framer.com/motion/
  Start with the "Animation" and "Gestures" guides. The "Layout Animations" section is relevant to the smooth cell transitions in the DP table.

**OpenRouter**

- OpenRouter Documentation: https://openrouter.ai/docs
  Read "Quick Start" and the API Reference. The "Streaming" section explains the SSE format used in this app's chat route.

**General Web Development**

- MDN Web Docs: https://developer.mozilla.org
  The authoritative reference for all browser APIs. Whenever you encounter an unfamiliar browser API in this codebase (`localStorage`, `ReadableStream`, `MutationObserver`, SSE, `navigator.clipboard`), look it up on MDN first.

- The Odin Project: https://www.theodinproject.com
  A free, comprehensive curriculum covering HTML, CSS, JavaScript, React, and Node.js from scratch. If you find Phase 1 of this study plan moves too fast, The Odin Project's Foundations track will cover the same ground more gradually with guided exercises.
