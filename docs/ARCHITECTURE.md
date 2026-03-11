# DP Mastery — Architecture Documentation

This document describes the complete architecture of the DP Mastery platform. It is written for
developers with C/C++/Java experience who may not have prior web development exposure. Every
concept is explained from first principles before the platform-specific details are given.

---

## Table of Contents

1. Introduction
2. Technology Overview (for Traditional Developers)
3. High-Level Architecture Diagram
4. Component Architecture Diagram
5. Data Flow Diagrams
6. Key Abstractions
7. How a Request Travels Through the System
8. Module Dependency Map
9. Security Model
10. Extending the System

---

## 1. Introduction

### What This Application Is

DP Mastery is an interactive course platform for learning Dynamic Programming algorithms. It
provides:

- Ten curated DP problems (Fibonacci through Matrix Chain Multiplication), each with a full
  problem statement, theory content, recurrence relation, and complexity analysis.
- A step-by-step animated visualizer that lets students watch how a DP table fills in, one cell
  at a time, at adjustable speed.
- A quiz system with multiple-choice and free-response questions per problem.
- A homework coding environment where students write TypeScript solutions that are graded by an AI
  model.
- Timed exams spanning multiple problems.
- An AI tutor (chat interface) that knows the current problem context and answers questions in a
  Socratic style.
- A progress tracking system that records completed problems, scores, badges, and a daily-use
  streak. All progress is stored locally in the browser — no account or server database is needed.

### What "Full-Stack Web App" Means

A traditional desktop application (Qt, wxWidgets, Win32) is a single executable that runs on the
user's machine. It owns the screen, handles events, and may talk to a database directly.

A web application is different in two important ways:

1. The UI runs inside a web browser (Chrome, Firefox, Safari). The browser provides a sandboxed
   JavaScript runtime, a layout/rendering engine, and a set of APIs. The application code does not
   run as a native binary — it runs as JavaScript (or TypeScript compiled to JavaScript) inside
   that sandbox.

2. When server-side logic is needed (e.g., calling an external AI API that requires secret keys),
   an HTTP server handles those requests. The browser sends an HTTP POST request; the server
   executes the logic and sends a response back.

"Full-stack" means the project contains both the browser-side code (the "front end") and the
server-side code (the "back end"). In this project, Next.js handles both halves from a single
codebase.

### How It Differs from Desktop Apps

| Concept            | Desktop App                  | This Web App                                     |
|--------------------|------------------------------|--------------------------------------------------|
| Executable target  | Machine binary               | JavaScript running in a browser                  |
| UI toolkit         | Qt / GTK / Win32             | React (components render HTML/CSS)               |
| State persistence  | Files, registry              | localStorage (key-value store in the browser)    |
| Remote calls       | Sockets, direct DB           | HTTP requests to Next.js API routes              |
| Deployment         | Installer / package          | Static files + Node.js server hosted anywhere    |
| Screen ownership   | Full window                  | Browser tab, constrained by browser security     |

One critical constraint of the browser environment is the **same-origin policy**: browser code
cannot directly call third-party HTTP APIs that require secret keys, because the key would be
visible to any user who opens the browser's network inspector. The solution used here is to proxy
those calls through Next.js API routes running on the server, where the key is stored in an
environment variable invisible to the user.

---

## 2. Technology Overview (for Traditional Developers)

### Next.js / React

React is a UI library analogous to Qt or GTK, but it targets HTML rather than native widgets. You
describe your UI as a tree of **components**, which are TypeScript functions that return HTML-like
markup (called JSX). React calls these functions whenever its internal state changes and updates
only the parts of the browser's DOM (Document Object Model — the live tree of HTML elements) that
actually changed.

```
// Conceptual analogy in pseudocode:
class Button extends QWidget {
  void render() {
    return <button onClick={handler}>{label}</button>;
  }
}
```

In React:
```typescript
function Button({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick}>{label}</button>;
}
```

Next.js is a framework built on top of React. It adds:
- **File-system routing**: a file at `src/app/problems/[slug]/page.tsx` automatically becomes the
  URL `/problems/fibonacci`, `/problems/knapsack`, etc. The `[slug]` bracket syntax is a
  URL parameter (analogous to a route parameter in a REST framework).
- **API Routes**: a file at `src/app/api/ai/chat/route.ts` automatically becomes the HTTP
  endpoint `POST /api/ai/chat`. This is the server-side code.
- **Server-Side Rendering / Static generation**: pages can be rendered to HTML on the server
  before being sent to the browser. This project marks its pages `"use client"` because they need
  browser APIs (localStorage, intervals).

### TypeScript

TypeScript is JavaScript with an optional static type system layered on top, compiled away before
runtime. Think of it as C++ without manual memory management: you get interfaces, generics, union
types, and compile-time checks, but the output is plain JavaScript that browsers and Node.js can
run.

```typescript
// TypeScript interface — like a C++ struct or abstract class
interface DPStep {
  index: number;
  description: string;
  table: number[][] | number[];   // union type: either 1D or 2D
  computing: number[];
  backtrackPath?: number[][];     // optional field (the ? suffix)
}
```

The TypeScript compiler (`tsc`) and the Next.js build process (`next build`) transform `.ts` and
`.tsx` files to JavaScript.

### Tailwind CSS

CSS is the styling language of the web. Normally you write a `.css` file with rules like:

```css
.button { background: blue; padding: 8px 16px; border-radius: 4px; }
```

Tailwind CSS is a utility-first approach: instead of writing your own CSS rules, you attach
pre-defined class names directly to your HTML elements:

```tsx
<button className="bg-blue-500 px-4 py-2 rounded">Click me</button>
```

Each class name (`bg-blue-500`, `px-4`, `py-2`, `rounded`) maps to exactly one CSS property.
Tailwind generates only the CSS for classes you actually use, keeping the final stylesheet small.

### Framer Motion

Framer Motion is an animation library for React. It lets you declare how elements should animate
when they appear, disappear, or change state, using a declarative syntax:

```tsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  Content
</motion.div>
```

This is analogous to a tweening system (like those in game engines): you specify start and end
states, and the library interpolates values over time using `requestAnimationFrame` under the hood.

### localStorage

`localStorage` is a key-value store built into every browser. It persists across page loads and
browser restarts (until the user clears it). The API is synchronous:

```javascript
localStorage.setItem("key", JSON.stringify(value));
const value = JSON.parse(localStorage.getItem("key") ?? "null");
```

This project uses localStorage as its entire database. No server-side database is needed because
the data (progress, settings) belongs to one user on one machine.

Capacity is approximately 5 MB per origin, which is far more than this application needs.

### API Routes (Next.js)

API routes are ordinary TypeScript functions exported from files under `src/app/api/`. Next.js
compiles them into a Node.js HTTP server. They run on the server (or in a serverless/edge runtime
when deployed), not in the browser. They can safely access environment variables (`.env` files)
where secret API keys are stored.

```typescript
// src/app/api/ai/chat/route.ts
export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;  // secret, invisible to browser
  // ... call OpenRouter, stream back response
}
```

When the browser sends `fetch("/api/ai/chat", { method: "POST", body: ... })`, Next.js routes
it to this function.

### Server-Sent Events (SSE) / Streaming

The AI chat uses streaming responses. Instead of waiting for the entire AI response before showing
anything, the server sends chunks of text as they arrive from OpenRouter, and the browser renders
them progressively — the same way ChatGPT streams tokens.

The protocol is **Server-Sent Events** (SSE): the server keeps the HTTP response body open and
writes lines of the form `data: {...}\n\n`. The browser reads the stream chunk by chunk using the
Streams API (`ReadableStreamDefaultReader`).

---

## 3. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------+
|                            BROWSER                                    |
|                                                                       |
|  +----------------------------------------------------------------+  |
|  |                   Next.js App (React)                          |  |
|  |                                                                |  |
|  |  +-----------+    +---------------+    +-------------------+  |  |
|  |  |  Pages    |    |  Components   |    |  Hooks            |  |  |
|  |  |  (routes) |    |  (UI parts)   |    |  (state managers) |  |  |
|  |  |           |    |               |    |                   |  |  |
|  |  | /         |    | DPVisualizer  |    | useDPVisualizer   |  |  |
|  |  | /problems |    | TutorSidebar  |    | useAITutor        |  |  |
|  |  | /problems |    | QuizRunner    |    | useProgress       |  |  |
|  |  |   /[slug] |    | CodeEditor    |    |                   |  |  |
|  |  | /quiz     |    | Table1D       |    |                   |  |  |
|  |  | /homework |    | Table2D       |    |                   |  |  |
|  |  | /exams    |    | StepControls  |    |                   |  |  |
|  |  | /progress |    | RadarChart    |    |                   |  |  |
|  |  | /settings |    | BadgeGrid     |    |                   |  |  |
|  |  +-----------+    +---------------+    +-------------------+  |  |
|  |        |                 |                       |             |  |
|  |        v                 v                       v             |  |
|  |  +----------------------------------------------------------+  |  |
|  |  |                    Data Layer                            |  |  |
|  |  |                                                          |  |  |
|  |  | +------------------+  +-------------------+             |  |  |
|  |  | | Problem Data     |  |  DP Engine        |             |  |  |
|  |  | | (static objects) |  |  (algorithms run  |             |  |  |
|  |  | | data/problems/   |  |   in the browser) |             |  |  |
|  |  | | data/quizzes/    |  |  lib/dp-engine/   |             |  |  |
|  |  | | data/exams/      |  |                   |             |  |  |
|  |  | +------------------+  +-------------------+             |  |  |
|  |  |                                                          |  |  |
|  |  | +------------------------------------------+            |  |  |
|  |  | | Storage (localStorage CRUD)              |            |  |  |
|  |  | | lib/storage/progress.ts  — UserProgress  |            |  |  |
|  |  | | lib/storage/settings.ts  — AppSettings   |            |  |  |
|  |  | +------------------------------------------+            |  |  |
|  |  +----------------------------------------------------------+  |  |
|  +----------------------------------------------------------------+  |
|                              |                                        |
|                   HTTP calls | (AI requests only — chat/grade/quiz)  |
+------------------------------|---------------------------------------+
                               v
+-----------------------------------------------------------------------+
|                      Next.js API Routes (server-side)                 |
|                                                                       |
|  +------------------+  +------------------+  +--------------------+  |
|  |  POST            |  |  POST            |  |  POST              |  |
|  |  /api/ai/chat    |  |  /api/ai/grade   |  |  /api/ai/          |  |
|  |  (streaming SSE) |  |  (JSON response) |  |  quiz-generate     |  |
|  +--------+---------+  +--------+---------+  +--------+-----------+  |
|           |                     |                      |              |
|           +---------------------+----------------------+              |
|                                 |                                     |
|                    lib/ai/client.ts (callAI)                          |
|                    lib/ai/prompts.ts (system prompts)                 |
|                    lib/ai/context-builder.ts (problem context)        |
|                    lib/ai/rate-limiter.ts (token bucket)              |
+-------------------------------|-----------------------------------------+
                                v
+-----------------------------------------------------------------------+
|                        OpenRouter API                                 |
|              https://openrouter.ai/api/v1/chat/completions            |
|                                                                       |
|    Routes to:  Claude Sonnet  |  GPT-4o  |  Gemini Flash             |
|    (model selected per request via x-model header)                    |
+-----------------------------------------------------------------------+
```

**Key observation**: The DP algorithms (Fibonacci, Knapsack, etc.) run entirely in the browser.
No server call is made to compute or visualize DP tables. Server calls happen only when the AI
features (chat, grading, quiz generation) are used.

---

## 4. Component Architecture Diagram

The following shows the component tree for the Problem Detail page, which is the most complex page
in the application. Indentation represents containment (parent-child in the React tree).

```
RootLayout  (src/app/layout.tsx)
├── ThemeProvider  (React context: theme + toggle function)
│   ├── Navbar
│   │   ├── Logo link
│   │   ├── Nav links (Dashboard, Problems, Theory, Exams, Progress, Settings)
│   │   └── Theme toggle button
│   └── <main>
│       └── ProblemPage  (src/app/problems/[slug]/page.tsx)
│           │
│           ├── Breadcrumb  ("All Problems" back link)
│           │
│           ├── Header section
│           │   ├── Problem number + difficulty badge + category badge
│           │   ├── Problem title (h1)
│           │   └── Short description paragraph
│           │
│           ├── Section: "Problem Statement"
│           │   ├── Problem statement text block
│           │   └── Info cards: State definition | Recurrence | Base Cases
│           │
│           ├── Section: "Interactive Visualizer"
│           │   └── DPVisualizer  (src/components/visualizer/DPVisualizer.tsx)
│           │       ├── Toolbar
│           │       │   ├── Approach tabs (Bottom-Up / Top-Down explanation)
│           │       │   ├── Backtrack path toggle
│           │       │   └── "Edit input" button
│           │       ├── InputEditor  (collapsible)
│           │       │   └── Text fields for each algorithm input parameter
│           │       ├── Approach description label
│           │       ├── RecurrenceDisplay
│           │       │   ├── Static recurrence formula (e.g. "dp[i] = dp[i-1] + dp[i-2]")
│           │       │   └── Current step formula (substituted values, e.g. "dp[5] = 3 + 2 = 5")
│           │       ├── Table container
│           │       │   ├── Table1D  (for 1D problems: Fibonacci, Coin Change, etc.)
│           │       │   │   └── Animated cells (orange = computing, gold glow = backtrack path)
│           │       │   └── Table2D  (for 2D problems: Knapsack, LCS, etc.)
│           │       │       └── Animated cells with row/col headers
│           │       ├── StepControls
│           │       │   ├── Reset | Step Back | Play/Pause | Step Forward buttons
│           │       │   ├── Progress bar / scrubber
│           │       │   └── Speed control (0.5x – 4x)
│           │       └── Step description text
│           │
│           ├── Section: "Theory"
│           │   └── TheoryContent  (inline markdown renderer)
│           │
│           ├── Section: "Complexity"
│           │   └── Cards: Time | Space | Notes
│           │
│           ├── Action buttons
│           │   ├── Link → /problems/[slug]/quiz
│           │   ├── Link → /problems/[slug]/homework
│           │   └── "Mark Complete" button
│           │
│           └── TutorSidebar  (src/components/tutor/TutorSidebar.tsx)
│               (fixed position, slides in from right edge)
│               ├── Header
│               │   ├── AI avatar + "DP Tutor" label
│               │   ├── Office Hours toggle
│               │   ├── Clear conversation button
│               │   └── Close button
│               ├── Message list  (scrollable)
│               │   └── ChatMessage[]  (user and assistant bubbles)
│               ├── Error banner  (shown on API errors)
│               └── ChatInput  (textarea + send button)
```

**Other pages** follow the same pattern (RootLayout wrapping page-specific content):

```
/problems/[slug]/quiz
  └── QuizRunner
      ├── MultipleChoice  (per MC question)
      ├── CodingQuestion  (per code question)
      └── Score summary after submission

/problems/[slug]/homework
  └── CodeEditor
      ├── Monaco-style text editor
      ├── Test case runner
      └── FeedbackPanel  (after AI grading)

/progress
  ├── StreakTracker
  ├── RadarChart  (skill scores by DP category)
  └── BadgeGrid

/settings
  └── Form: API key, model selector, theme toggle
```

---

## 5. Data Flow Diagrams

### 5a. Visualizer Data Flow

This flow is entirely in the browser. No HTTP requests are made.

```
User clicks "Play" button in StepControls
         |
         v
vis.play()  (useDPVisualizer hook, src/hooks/useDPVisualizer.ts)
         |
    setIsPlaying(true)
         |
         v
useEffect detects isPlaying === true
         |
    clearInterval(old timer)
    intervalRef.current = setInterval(callback, 1000 / speed)
         |
         v  [every tick]
    setCurrentStep(prev => prev + 1)
         |
    If prev >= totalSteps - 1:
        setIsPlaying(false)  <-- auto-stop at end
         |
         v
steps[currentStep]  →  DPStep object
         |
         +---> step.table          → Table1D or Table2D renders cells
         |     (number[] or        → cells update via Framer Motion animation
         |      number[][])          (orange highlight on computing cell)
         |
         +---> step.computing      → highlighted "active" cell index
         |
         +---> step.formula        → RecurrenceDisplay shows substituted formula
         |     e.g. "dp[5] = dp[4] + dp[3] = 3 + 2 = 5"
         |
         +---> step.description    → Step description text below table
         |     e.g. "dp[5] = dp[4] + dp[3] = 3 + 2 = 5"
         |
         +---> step.backtrackPath  → golden glow applied to these cells
               (only on last step,   (when showBacktrack toggle is on)
                isBacktrack: true)

User edits input ("Edit input" → InputEditor → "Run"):
         |
         v
handleRunWithInput(newInput)
         |
    algorithm.run(newInput)  ← pure function, recomputes all steps
         |
    vis.setSteps(newSteps)
         |
    reset to step 0, stop playback
```

### 5b. AI Tutor Data Flow

```
User types message in ChatInput and presses Enter or Send
         |
         v
TutorSidebar calls send(content)  (from useAITutor hook)
         |
         v
useAITutor.send()  (src/hooks/useAITutor.ts)
         |
    1. Append user message to messages[] state
    2. Create empty assistant message bubble (isStreaming: true)
    3. Append empty assistant message to messages[] state
    4. Build apiMessages: all prior messages + new user message
         |
         v
fetch POST /api/ai/chat
  Headers:
    Content-Type: application/json
    x-api-key: <BYOK key if user provided one in Settings>
  Body (JSON):
    {
      messages: [ {role, content}, ... ],
      problemContext: {
        problemName: "Fibonacci Numbers",
        problemStatement: "...",
        recurrence: "dp[i] = dp[i-1] + dp[i-2]",
        stateDefinition: "dp[i] = the i-th Fibonacci number",
        currentStep: 5,
        totalSteps: 13,
        currentFormula: "dp[5] = dp[4] + dp[3] = 3 + 2 = 5"
      }
    }
         |
         v
API Route  (src/app/api/ai/chat/route.ts)  [runs on server]
         |
    1. Parse body: messages[], problemContext
    2. Resolve API key:
         byokKey = req.headers.get("x-api-key")  -- user's own key
         hostedKey = process.env.OPENROUTER_API_KEY  -- platform key
         apiKey = byokKey ?? hostedKey
         If neither: return 401
    3. Rate limiting (only when using hosted key):
         ip = x-forwarded-for header
         checkRateLimit(ip) → token bucket (20 requests/minute/IP)
         If exhausted: return 429
    4. Resolve model:
         model = req.headers.get("x-model") ?? DEFAULT_MODEL
         DEFAULT_MODEL = "anthropic/claude-sonnet-4"
    5. Build system prompt:
         contextString = buildTutorContext(problemContext)
           → Markdown block with problem name, statement,
             state definition, recurrence, current step info
         systemContent = contextString + "\n\n" + TUTOR_PROMPT
           → TUTOR_PROMPT instructs the AI to be a patient TA,
             give hints before answers, use Socratic questions
    6. fullMessages = [{ role: "system", content: systemContent }, ...messages]
    7. callAI({ messages: fullMessages, model, apiKey, stream: true })
         → POST https://openrouter.ai/api/v1/chat/completions
           with stream: true
         |
         v
OpenRouter API  (external service)
  → Routes to Claude Sonnet (or whichever model was selected)
  → Streams response as SSE:
      data: {"choices":[{"delta":{"content":"The "}}]}\n\n
      data: {"choices":[{"delta":{"content":"Fibonacci "}}]}\n\n
      data: {"choices":[{"delta":{"content":"recurrence..."}}]}\n\n
      data: [DONE]\n\n
         |
         v
API Route passes upstream.body directly back to browser
  Response headers:
    Content-Type: text/event-stream
    Cache-Control: no-cache
         |
         v  [back in browser]
useAITutor reads ReadableStream:
         |
    reader = response.body.getReader()
    decoder = new TextDecoder()
    accumulated = ""
         |
    loop:
      { done, value } = await reader.read()
      chunk = decoder.decode(value)
      for each line in chunk.split("\n"):
        if line starts with "data: ":
          data = line.slice(6)
          if data === "[DONE]": break
          parsed = JSON.parse(data)
          delta = parsed.choices[0].delta.content
          accumulated += delta
          setMessages(prev => prev.map(m =>
            m.id === assistantId ? { ...m, content: accumulated } : m
          ))
         |
         v
React re-renders TutorSidebar on each state update
  → ChatMessage for assistant shows progressively growing text
         |
         v
When reader.read() returns done = true:
  setMessages: mark assistant message isStreaming = false
  setIsLoading(false)
```

### 5c. Quiz/Homework Grading Flow

```
[QUIZ PATH — local scoring for multiple-choice questions]

User selects answers and clicks Submit in QuizRunner
         |
         v
QuizRunner component
  for each question:
    userAnswer === question.correctAnswer ? +1 : +0
  score = (correct / total) * 100
         |
         v
useProgress.saveQuizScore(problemSlug, score)
  → updates localStorage
         |
         v
Score summary displayed inline

[HOMEWORK PATH — AI grading for code submissions]

User writes TypeScript solution in CodeEditor and clicks Submit
         |
         v
CodeEditor component
  1. Runs test cases locally (evaluates code with Function constructor)
     testResults = [ { passed: true/false, description: "..." }, ... ]
  2. Sends to API for AI grading:
         |
         v
fetch POST /api/ai/grade
  Headers: x-api-key (if BYOK), x-model
  Body:
    {
      code: "<student's TypeScript code>",
      problemSlug: "fibonacci",
      testResults: [ { passed: true, description: "F(10) = 55" }, ... ]
    }
         |
         v
API Route  (src/app/api/ai/grade/route.ts)  [server-side]
         |
    1. Validate: code and problemSlug required
    2. Resolve API key (same pattern as chat route)
    3. Build user message:
         "Grade this solution for the problem 'fibonacci'.\n\n
          Code:\n```\n<student code>\n```\n\n
          Test Results:\n- [PASS] F(10) = 55\n...\n\n
          Return valid JSON only with no markdown fences."
    4. callAINonStreaming({
         messages: [
           { role: "system", content: GRADER_PROMPT },
           { role: "user", content: userMessage }
         ],
         model, apiKey,
         temperature: 0.3  // low temp for deterministic grading
       })
         |
         v
OpenRouter → AI model → returns JSON string:
  {
    "score": 88,
    "correctness": 25,
    "approach": 22,
    "quality": 21,
    "efficiency": 20,
    "feedback": "Good bottom-up implementation...",
    "suggestions": ["Consider space optimization...", "..."]
  }
         |
         v
API route parses JSON, returns it as NextResponse.json(result)
         |
         v
Browser receives GradeResult object
         |
         v
FeedbackPanel component renders:
  Score badge (88/100)
  Breakdown bars (correctness, approach, quality, efficiency)
  Feedback text
  Suggestions list
         |
         v
useProgress.saveHomeworkScore(slug, score, feedback)
  → persists to localStorage
```

### 5d. Progress Persistence Flow

```
Any scoring/completion event occurs in the browser:
  - User clicks "Mark Complete" on a problem
  - Quiz submitted → score calculated
  - Homework graded → score returned from API
  - Exam submitted → score calculated locally
  - User opens a problem page → streak updated
         |
         v
useProgress hook  (src/hooks/useProgress.ts)
  |
  internal update() function:
    setProgress(prev => {
      const next = updater(prev)    // pure transform
      saveProgress(next)            // write to localStorage
      return next                   // update React state
    })
         |
         v
lib/storage/progress.ts → saveProgress()
  localStorage.setItem("dp-course-progress", JSON.stringify(progress))
         |
         v
React re-renders any component that uses useProgress()
  → Problem list shows checkmarks on completedProblems
  → Progress page re-renders:
      StreakTracker: reads streak.current + streak.lastDate
      RadarChart: reads skillScores (0–100 per DPCategory)
      BadgeGrid: reads badges[] array
      Score tables: reads quizScores, examScores, homeworkScores

On next page load (fresh browser tab or F5):
         |
         v
useProgress initializes with:
  useState<UserProgress>(() => getProgress())
         |
         v
lib/storage/progress.ts → getProgress()
  raw = localStorage.getItem("dp-course-progress")
  parsed = JSON.parse(raw)
  return merge(parsed, defaultProgress())
  // merge ensures new fields added to the schema always get defaults
  // even if the stored JSON predates a code update
```

---

## 6. Key Abstractions

### DPProblem (src/lib/dp-engine/types.ts)

A `DPProblem` is a plain data object (like a C struct) that contains everything needed to display,
teach, and grade one dynamic programming problem.

```typescript
interface DPProblem {
  slug: string;            // URL key: "fibonacci", "knapsack", etc.
  number: number;          // display order (1–10)
  title: string;
  description: string;
  difficulty: Difficulty;  // "Intro" | "Easy" | ... | "Hard"
  category: DPCategory;    // "Linear DP" | "2D DP" | "String DP" | ...
  problemStatement: string;
  recurrence: string;      // e.g. "dp[i] = dp[i-1] + dp[i-2]"
  stateDefinition: string; // e.g. "dp[i] = the i-th Fibonacci number"
  baseCases: string;
  timeComplexity: string;
  spaceComplexity: string;
  complexityNotes?: string;
  defaultInput: Record<string, unknown>;  // e.g. { n: 10 }
  theoryContent: string;   // markdown string
  starterCode: string;     // TypeScript function stub for homework
  testCases: TestCase[];   // input/expected pairs for grading
}
```

There are ten of these objects, one per file in `src/data/problems/`. They are imported statically
into the browser bundle — no database query is needed to load a problem.

### DPStep (src/lib/dp-engine/types.ts)

A `DPStep` is a snapshot of the DP computation at a single moment in time. It is the core unit
that the visualizer displays.

```typescript
interface DPStep {
  index: number;           // position in the sequence (0-based)
  description: string;     // human-readable: "dp[5] = dp[4] + dp[3] = 3 + 2 = 5"
  table: number[][] | number[];  // full DP table state at this step
  computing: number[];     // which cell is being computed right now
                           //   1D: [columnIndex]
                           //   2D: [rowIndex, colIndex]
  backtrackPath?: number[][];  // cells on the optimal reconstruction path
  formula?: string;        // recurrence with substituted numbers
  isBacktrack?: boolean;   // true only on the final "show result" step
}
```

Every algorithm precomputes the full array of `DPStep` objects when `algorithm.run(input)` is
called. The visualizer then plays through this array like a tape. This design means all computation
is done up front, and playback is just array indexing — smooth and immediate even at step 0 or
when scrubbing.

Each `DPStep` stores a **complete copy** of the entire table (`[...dp]`) rather than a diff. This
allows random access to any step index (the scrubber uses `goToStep(index)`). The cost is memory
proportional to `numSteps * tableSize`, which is negligible for the problem sizes used here.

### DPAlgorithm (src/lib/dp-engine/types.ts)

`DPAlgorithm` is an interface (analogous to a pure virtual base class in C++) with two methods:

```typescript
interface DPAlgorithm {
  run:   (input: Record<string, unknown>) => DPStep[];
  solve: (input: Record<string, unknown>) => unknown;
}
```

- `run()` produces the full step-by-step trace for the visualizer.
- `solve()` just returns the answer efficiently (used for quick answer checking).

All ten algorithms implement this interface. They are registered in a lookup table:

```typescript
// src/lib/dp-engine/algorithms/index.ts
const algorithms: Record<string, DPAlgorithm> = {
  'fibonacci': fibonacci,
  'knapsack': knapsack,
  // ...
};
```

The `ProblemPage` looks up the algorithm by slug: `algorithms[slug]`.

### Algorithm Implementation Example (src/lib/dp-engine/algorithms/fibonacci.ts)

The Fibonacci implementation demonstrates the pattern used by all algorithms:

```typescript
const algorithm: DPAlgorithm = {
  run(input): DPStep[] {
    const n = input.n as number;
    const steps: DPStep[] = [];
    const dp: number[] = new Array(n + 1).fill(0);

    // Step 0: initial state (base case dp[0])
    dp[0] = 0;
    steps.push({ index: 0, description: "Initialize dp[0] = 0", table: [...dp], computing: [0], formula: "dp[0] = 0 (base case)" });

    // Step 1: base case dp[1]
    dp[1] = 1;
    steps.push({ index: 1, description: "Base case: dp[1] = 1", table: [...dp], computing: [1], formula: "dp[1] = 1 (base case)" });

    // Steps 2..n: recurrence
    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      steps.push({
        index: steps.length,
        description: `dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`,
        table: [...dp],      // NOTE: spread to take a snapshot, not a reference
        computing: [i],
        formula: `dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`,
      });
    }

    // Final step: backtrack visualization
    steps.push({ ..., backtrackPath: [[0],[1],...,[n]], isBacktrack: true });

    return steps;
  },

  solve(input): unknown {
    // Space-optimized O(1) solution — used for fast answer checks
    const n = input.n as number;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) { [a, b] = [b, a + b]; }
    return b;
  }
};
```

The key idiom `table: [...dp]` creates a shallow copy (spread operator) of the array at that
moment. Without it, every step would hold a reference to the same array and would all show the
final state.

### DPRunner (src/lib/dp-engine/runner.ts)

`DPRunner` is a helper class that wraps an array of `DPStep` objects and provides cursor
navigation. Think of it as an iterator with a position pointer:

```typescript
class DPRunner {
  private steps: DPStep[];
  private currentStep: number;

  next(): DPStep | null { ... }   // advance and return
  prev(): DPStep | null { ... }   // retreat and return
  goTo(index: number): DPStep { ... }  // random access
  getProgress(): { current, total } { ... }
}
```

In practice, `useDPVisualizer` manages its own index with React state rather than instantiating a
`DPRunner` — but `DPRunner` exists as a standalone utility for contexts that need the same
traversal logic outside React.

### useDPVisualizer (src/hooks/useDPVisualizer.ts)

This is the state machine that drives the visualizer. In C++ terms, think of it as a controller
object with both data and a timer callback. React "hooks" are functions that use React's built-in
state and lifecycle primitives.

Internal state:
```
steps:        DPStep[]    — the full step array for the current algorithm + input
currentStep:  number      — index into steps[]
isPlaying:    boolean     — whether the timer is running
speed:        number      — steps per second (e.g. 1.0, 2.0)
intervalRef:  timer ref   — handle to the setInterval timer
```

Exposed interface (what components use):
```
play()          — start auto-advance
pause()         — stop auto-advance
togglePlay()    — flip between play and pause
stepForward()   — advance one step, pause
stepBack()      — retreat one step, pause
reset()         — return to step 0, pause
goToStep(n)     — jump to step n, pause
setSpeed(n)     — change playback speed
setSteps(arr)   — replace the step array (on new input), reset to step 0
step            — the current DPStep object (derived: steps[currentStep])
totalSteps      — steps.length
```

The timer logic:
```typescript
useEffect(() => {
  if (!isPlaying) { clearInterval(timer); return; }

  timer = setInterval(() => {
    setCurrentStep(prev => {
      if (prev >= totalSteps - 1) { setIsPlaying(false); return prev; }
      return prev + 1;
    });
  }, Math.round(1000 / speed));  // e.g. speed=2 → 500ms interval

  return () => clearInterval(timer);  // cleanup on re-render or unmount
}, [isPlaying, speed, totalSteps]);
```

React's `useEffect` is analogous to registering/unregistering a callback. The cleanup return
value runs when the effect is torn down (component unmounts, or before the effect re-runs). This
ensures timers are never leaked.

### useAITutor (src/hooks/useAITutor.ts)

Manages the chat conversation and the streaming response protocol.

Internal state:
```
messages:   TutorMessage[]   — the full conversation history
isLoading:  boolean          — true while a request is in-flight
error:      string | null    — last error message, if any
abortRef:   AbortController  — allows cancelling an in-flight request
```

The `send(content)` function:
1. Appends a user message bubble immediately (optimistic UI update).
2. Appends an empty assistant bubble with `isStreaming: true` (shows a loading indicator).
3. POSTs to `/api/ai/chat` with the full message history and problem context.
4. Reads the SSE stream chunk by chunk.
5. For each SSE `data:` line, parses the JSON, extracts `delta.content`, and appends it to the
   assistant bubble's content field in React state.
6. On completion, marks the assistant message `isStreaming: false`.

The `AbortController` pattern allows in-flight requests to be cancelled if the user closes the
sidebar mid-stream. `abortRef.current.abort()` signals the `fetch()` to cancel.

### UserProgress (src/lib/dp-engine/types.ts)

This is the main data structure persisted to localStorage. Think of it as the user's save file.

```typescript
interface UserProgress {
  completedProblems: string[];   // slugs of completed problems
  quizScores: Record<string, number>;          // slug → score (0–100)
  examScores: Record<string, {                 // examId → score record
    score: number;
    total: number;
    date: string;   // "YYYY-MM-DD"
  }>;
  homeworkScores: Record<string, {             // slug → grade record
    score: number;
    feedback: string;
    date: string;
  }>;
  badges: string[];              // earned badge IDs
  streak: {
    current: number;             // consecutive days of activity
    lastDate: string;            // "YYYY-MM-DD" of last activity
  };
  skillScores: Record<DPCategory, number>;     // category → 0–100
}
```

Stored at localStorage key `"dp-course-progress"` as JSON. Settings (API key, model, theme)
are stored separately at `"dp-course-settings"`.

The `getProgress()` function uses a defensive merge pattern:
```typescript
return {
  completedProblems: parsed.completedProblems ?? defaults.completedProblems,
  // ...each field...
  skillScores: { ...defaults.skillScores, ...(parsed.skillScores ?? {}) },
};
```
This means if a future update adds a new field to `UserProgress`, old saved data will still load
correctly — the new field will get its default value rather than being `undefined`.

### API Route Pattern

Every API route follows the same structure. Using the chat route as the canonical example:

```typescript
// src/app/api/ai/chat/route.ts

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // 1. Parse and validate the request body
    const body = await req.json();
    const { messages, problemContext } = body;
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "..." }, { status: 400 });
    }

    // 2. Resolve the API key (BYOK takes precedence over hosted key)
    const byokKey = req.headers.get("x-api-key");
    const hostedKey = process.env.OPENROUTER_API_KEY;
    const apiKey = byokKey ?? hostedKey;
    if (!apiKey) return NextResponse.json({ error: "..." }, { status: 401 });

    // 3. Rate limit (only when using hosted key)
    if (!byokKey && hostedKey) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
      const { allowed } = checkRateLimit(ip);
      if (!allowed) return NextResponse.json({ error: "..." }, { status: 429 });
    }

    // 4. Build the AI request and call OpenRouter
    const upstream = await callAI({ messages: fullMessages, model, apiKey, stream: true });

    // 5. Return response (streaming or JSON)
    return new NextResponse(upstream.body, {
      headers: { "Content-Type": "text/event-stream" }
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

The grade route (`/api/ai/grade`) uses `callAINonStreaming()` instead, which awaits the complete
response and returns it as a regular JSON object. The quiz-generate route follows the same pattern
as the grade route.

---

## 7. How a Request Travels Through the System

**Scenario**: The user opens `/problems/fibonacci`, clicks Play, watches the animation through
step 5, then asks the AI tutor "why does dp[5] equal 5?"

### Phase 1: Page Load

1. User navigates to `/problems/fibonacci` (types the URL or clicks a link).

2. The browser sends an HTTP GET to the Next.js server. Next.js matches the route to
   `src/app/problems/[slug]/page.tsx` with `slug = "fibonacci"`.

3. Because the page is marked `"use client"`, Next.js sends the JavaScript bundle to the browser.
   The browser runs it.

4. React mounts `ProblemPage`. On mount, two `useEffect` calls fire:
   - `getSettings()` reads `localStorage["dp-course-settings"]` → stores the user's API key in
     local component state.
   - `updateStreak()` is called (from `useProgress`). It reads `localStorage["dp-course-progress"]`,
     checks if today's date was already recorded in `streak.lastDate`, and increments the streak
     counter if not. Writes back to localStorage.

5. `problemsBySlug["fibonacci"]` is looked up from the statically-imported problems map. This is
   an in-memory object lookup — no I/O.

6. `algorithms["fibonacci"]` is looked up from the statically-imported algorithms map.

7. `DPVisualizer` mounts. Its `useMemo` block runs `algorithm.run(problem.defaultInput)`:
   ```
   algorithm.run({ n: 10 })
   ```
   This executes the Fibonacci algorithm loop synchronously and produces an array of 13 `DPStep`
   objects (steps 0 through 12, including the final backtrack step). This computation takes
   microseconds.

8. `useDPVisualizer(initialSteps)` initializes with `currentStep = 0`, `isPlaying = false`.
   The visualizer renders `steps[0]`: the initial state with `dp = [0,0,0,...,0]` and
   `computing = [0]` (cell 0 highlighted).

9. The full page is visible. The user sees the problem statement, the DP table (row of grey cells
   with cell 0 highlighted orange), and the "Play" button.

### Phase 2: User Clicks Play

10. User clicks the Play button in `StepControls`.

11. `StepControls` calls `onPlay()` → `vis.play()` in `useDPVisualizer`.

12. `play()` calls `setIsPlaying(true)`.

13. React re-renders. The `useEffect` that watches `isPlaying` detects it changed to `true`.

14. The effect clears any existing interval and starts a new one:
    ```
    setInterval(callback, 1000 / speed)  // speed=1 → 1000ms
    ```

15. After 1000ms, the timer fires. `callback` runs: `setCurrentStep(prev => prev + 1)`.
    `currentStep` becomes 1.

16. React re-renders. `step = steps[1]` is now the current step (base case dp[1] = 1).
    - `Table1D` receives `table = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]`, `computing = 1`.
    - Cell 1 animates to its orange highlight state via Framer Motion.
    - `RecurrenceDisplay` shows `formula = "dp[1] = 1 (base case)"`.
    - The step description text updates.

17. This repeats on each timer tick until `currentStep = 12` (the final backtrack step). On that
    tick, the callback detects `prev >= totalSteps - 1` and calls `setIsPlaying(false)`. The
    interval is cleared. The golden backtrack glow is applied to all cells.

18. The user pauses manually at step 5 (either by clicking Pause, or the Step Back/Forward buttons
    — each of these calls `setIsPlaying(false)` before adjusting the index). Now `currentStep = 5`,
    `step = steps[5]`.

### Phase 3: User Opens the AI Tutor

19. User clicks "Ask AI Tutor" (the floating orange button at bottom-right of the page).

20. `setTutorOpen(true)` in `ProblemPage` state. React re-renders.

21. `TutorSidebar` receives `open = true`. The `AnimatePresence` block renders the sidebar panel.
    Framer Motion animates it sliding in from the right (`initial={{ x: "100%" }}` →
    `animate={{ x: 0 }}`).

22. `TutorSidebar` calls `useAITutor({ problemContext, apiKey })`. `useAITutor` initializes with
    an empty `messages[]` array. The empty state screen is shown with suggestion chips.

### Phase 4: User Sends the Message

23. User types "why does dp[5] equal 5?" in `ChatInput` and presses Enter.

24. `ChatInput` calls `onSend("why does dp[5] equal 5?")`.

25. `TutorSidebar` calls `send("why does dp[5] equal 5?")` from `useAITutor`.

26. Inside `send()`:
    - A user `TutorMessage` is created with a random ID (e.g. `"a7f3b2c1"`).
    - `setMessages(prev => [...prev, userMsg])` — React state updated, sidebar re-renders, user
      bubble appears.
    - An empty assistant `TutorMessage` is created (id `"x9k2m4n7"`, `isStreaming: true`).
    - `setMessages(prev => [...prev, assistantMsg])` — assistant bubble appears (empty, with
      streaming indicator).
    - `setIsLoading(true)`.
    - An `AbortController` is created and stored in `abortRef.current`.

27. `fetch("POST /api/ai/chat")` is called with:
    ```json
    {
      "messages": [
        { "role": "user", "content": "why does dp[5] equal 5?" }
      ],
      "problemContext": {
        "problemName": "Fibonacci Numbers",
        "problemStatement": "Compute the n-th Fibonacci number...",
        "recurrence": "dp[i] = dp[i-1] + dp[i-2]",
        "stateDefinition": "dp[i] = the i-th Fibonacci number",
        "currentStep": 5,
        "totalSteps": 13,
        "currentFormula": "dp[5] = dp[4] + dp[3] = 3 + 2 = 5"
      }
    }
    ```
    The `x-api-key` header is set if the user provided one in Settings.

### Phase 5: Server-Side Processing

28. Next.js routes the POST to `src/app/api/ai/chat/route.ts`. This runs on the server (Node.js
    process), not in the browser.

29. The route parses the body, resolves the API key (BYOK header if present, else
    `process.env.OPENROUTER_API_KEY`).

30. Because the user may be using the hosted key, `checkRateLimit(ip)` is called. The token
    bucket for this IP address has tokens available, so `allowed = true`.

31. The model is resolved: `req.headers.get("x-model") ?? "anthropic/claude-sonnet-4"`.

32. The system prompt is built:
    - `buildTutorContext(problemContext)` produces a markdown block:
      ```
      ## Problem: Fibonacci Numbers

      **Problem Statement:** Compute the n-th Fibonacci number...

      **State Definition:** dp[i] = the i-th Fibonacci number

      **Recurrence Relation:** dp[i] = dp[i-1] + dp[i-2]

      **Current Visualizer Step:** 6 of 13

      **Current Formula (this step):** dp[5] = dp[4] + dp[3] = 3 + 2 = 5
      ```
    - This is prepended to `TUTOR_PROMPT` (the persona instructions).
    - `{problem_name}` placeholder is replaced with `"Fibonacci Numbers"`.

33. `callAI()` sends a POST to `https://openrouter.ai/api/v1/chat/completions` with:
    - `model: "anthropic/claude-sonnet-4"`
    - `stream: true`
    - `messages: [{ role: "system", content: <full system prompt> }, { role: "user", content: "why does dp[5] equal 5?" }]`

34. OpenRouter validates the API key, routes to Claude, and begins streaming the response.

35. The API route receives OpenRouter's response object. It returns `new NextResponse(upstream.body, ...)`
    — piping the raw response stream directly back to the browser without buffering.

### Phase 6: Streaming Back to the Browser

36. Back in the browser, `fetch()` returns a `Response` with a streaming body. The `useAITutor`
    hook gets a `ReadableStreamDefaultReader`.

37. The read loop processes incoming SSE chunks. As Claude generates tokens, lines like these
    arrive:
    ```
    data: {"choices":[{"delta":{"content":"Great"}}]}
    data: {"choices":[{"delta":{"content":" question"}}]}
    data: {"choices":[{"delta":{"content":"! At step"}}]}
    data: {"choices":[{"delta":{"content":" 5, we're"}}]}
    ...
    data: [DONE]
    ```

38. For each chunk, `accumulated` grows: `"Great"`, `"Great question"`, `"Great question! At step"`,
    etc. After each delta, `setMessages()` is called to update the assistant message in React state.

39. React re-renders `TutorSidebar` on each state update. The assistant bubble grows token by
    token, exactly like a ChatGPT interface.

40. When `[DONE]` is received, the read loop exits. The assistant message is marked
    `isStreaming: false`. `setIsLoading(false)` is called. The streaming cursor indicator
    disappears.

The entire round trip from clicking Send to seeing the first characters typically takes 500–1500ms
depending on network latency to OpenRouter and the AI model's time to first token.

---

## 8. Module Dependency Map

The arrows below mean "imports from" or "depends on". Read left-to-right, top-to-bottom.

```
Pages  (src/app/*)
  |
  +---> Components  (src/components/*)
  |         |
  |         +---> Hooks  (src/hooks/*)
  |         |         |
  |         |         +---> Storage  (src/lib/storage/*)
  |         |         |         |
  |         |         |         +---> Types  (src/lib/dp-engine/types.ts)
  |         |         |
  |         |         +---> AI context-builder  (src/lib/ai/context-builder.ts)
  |         |         |         |
  |         |         |         +---> (no further deps — pure function)
  |         |         |
  |         |         +---> Types  (src/lib/dp-engine/types.ts)
  |         |
  |         +---> DP Engine  (src/lib/dp-engine/*)
  |                   |
  |                   +---> Types  (src/lib/dp-engine/types.ts)
  |
  +---> Data  (src/data/*)
            |
            +---> Types  (src/lib/dp-engine/types.ts)

API Routes  (src/app/api/*)
  |
  +---> AI lib  (src/lib/ai/*)
            |
            +---> client.ts
            |     (callAI, callAINonStreaming → HTTP to OpenRouter)
            |
            +---> prompts.ts
            |     (TUTOR_PROMPT, GRADER_PROMPT, QUIZ_GENERATOR_PROMPT)
            |     (no imports — pure string constants)
            |
            +---> context-builder.ts
            |     (buildTutorContext → assembles markdown context string)
            |     (no imports — pure function)
            |
            +---> rate-limiter.ts
            |     (checkRateLimit → in-memory token bucket)
            |     (no imports — pure logic with module-level Map)
            |
            +---> models.ts
                  (AVAILABLE_MODELS, DEFAULT_MODEL)
                  (no imports — pure constants)
```

**Noteworthy design properties**:

- `src/lib/dp-engine/types.ts` is a pure type definition file with no imports. Everything depends
  on it; it depends on nothing. This is intentional — types are the foundation of the system.

- `src/lib/ai/` modules are all server-side only. They should never be imported by browser-side
  code. The split is enforced by the fact that API keys only exist server-side.

- `src/data/problems/` and `src/data/quizzes/` contain static data objects. They are bundled into
  the browser's JavaScript at build time. There is no runtime database read for problem data.

- `src/lib/storage/` is pure localStorage CRUD with no React dependency. Hooks in `src/hooks/`
  wrap it with React state management.

---

## 9. Security Model

### No Authentication

This is a self-hosted learning tool. There is no login system. Any user who runs the application
has full access to all features. All user data (progress, scores) is stored locally in their own
browser's localStorage. No user data is ever sent to the server.

### API Key Management

The application can use AI features in two modes:

**Mode A — Bring Your Own Key (BYOK)**

The user enters their own OpenRouter API key in the Settings page. It is saved to
`localStorage["dp-course-settings"]`. When the browser makes an AI request, the key is sent as
the `x-api-key` HTTP header to the Next.js API route.

Security note: the key travels over HTTPS (encrypted in transit) from the browser to the Next.js
server. It is never logged or stored server-side — the route reads it from the request header and
uses it immediately. The key is only as secure as the user's machine and browser storage.

**Mode B — Hosted Key**

The platform operator places `OPENROUTER_API_KEY=sk-or-...` in the `.env` file on the server.
The browser never sees this key. It is only accessible inside the server-side API route functions
via `process.env.OPENROUTER_API_KEY`.

When the hosted key is used, rate limiting is applied: 20 requests per minute per IP address,
using a token bucket algorithm. BYOK users are not rate-limited (they're paying for their own
usage).

### Rate Limiter Implementation (src/lib/ai/rate-limiter.ts)

The token bucket algorithm works as follows:
- Each IP address gets a bucket with capacity of 20 tokens.
- Each AI request consumes 1 token.
- Every 60 seconds, the bucket is refilled to 20 tokens.
- If a request arrives when the bucket is empty, it is rejected with HTTP 429.

The buckets are stored in an in-memory `Map<string, Bucket>`. This means:
1. Rate limit state is lost on server restart.
2. In a multi-instance deployment, each server instance has its own state (no coordination).

For a production deployment with multiple server instances, this would need to be replaced with a
Redis-backed counter. For a single-instance or serverless deployment, the current implementation
is sufficient.

### localStorage Privacy

`localStorage` is partitioned by origin (scheme + domain + port). Data stored by
`http://localhost:3000` is completely separate from data stored by any other website. A page on
`https://evil.com` cannot read the progress data stored by this application.

The progress and settings data never leave the browser. The only data that leaves is:
1. The user's chat messages, which are sent to the Next.js server and forwarded to OpenRouter/the
   AI provider.
2. The user's homework code, which is sent to the Next.js server and forwarded to the AI grader.

Users should be aware that OpenRouter and the underlying AI providers (Anthropic, OpenAI, Google)
may retain conversation data per their respective privacy policies.

---

## 10. Extending the System

### Adding a New Problem

A new problem requires three additions: problem data, algorithm implementation, and quiz questions.

**Step 1: Create the problem data file**

Create `src/data/problems/my-problem.ts`:

```typescript
import type { DPProblem } from "@/lib/dp-engine/types";

export const myProblem: DPProblem = {
  slug: "my-problem",           // must be URL-safe, kebab-case
  number: 11,                   // assign the next number
  title: "My New Problem",
  description: "Short description for the problem list card.",
  difficulty: "Medium",
  category: "Choice DP",        // must be an existing DPCategory value

  problemStatement: "Full problem statement here...",
  recurrence: "dp[i] = max(dp[i-1], val[i] + dp[i-k])",
  stateDefinition: "dp[i] = maximum value using the first i items",
  baseCases: "dp[0] = 0",

  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",

  defaultInput: { n: 8 },       // default parameter values for the visualizer

  theoryContent: `## My New Problem\n\n...markdown content...`,

  starterCode: `export function myProblem(n: number): number {\n  // TODO\n  throw new Error("Not implemented");\n}`,

  testCases: [
    { input: [5], expected: 42, description: "n=5 should return 42" },
  ],
};
```

**Step 2: Register the problem**

In `src/data/problems/index.ts`, add:
```typescript
import { myProblem } from "./my-problem";
// ...
export const problems: DPProblem[] = [
  fibonacci, climbingStairs, /* ... existing 10 ... */, myProblem,
];
```

**Step 3: Create the algorithm**

Create `src/lib/dp-engine/algorithms/my-problem.ts`:

```typescript
import { DPAlgorithm, DPStep } from '../types';

const algorithm: DPAlgorithm = {
  run(input): DPStep[] {
    const n = input.n as number;
    const steps: DPStep[] = [];
    const dp = new Array(n + 1).fill(0);

    steps.push({ index: 0, description: "Initialize", table: [...dp], computing: [0] });

    for (let i = 1; i <= n; i++) {
      dp[i] = /* recurrence */;
      steps.push({
        index: steps.length,
        description: `dp[${i}] = ...`,
        table: [...dp],           // always spread — snapshot not reference
        computing: [i],
        formula: `dp[${i}] = ...`,
      });
    }
    return steps;
  },

  solve(input): unknown {
    // fast O(1) or O(n) solution without step tracking
    return /* answer */;
  }
};

export default algorithm;
```

**Step 4: Register the algorithm**

In `src/lib/dp-engine/algorithms/index.ts`, add:
```typescript
import myProblemAlgo from './my-problem';
// ...
const algorithms: Record<string, DPAlgorithm> = {
  // existing entries...
  'my-problem': myProblemAlgo,
};
```

**Step 5: Create quizzes (optional)**

Create `src/data/quizzes/my-problem.ts` with an array of `QuizQuestion` objects. Register it in
`src/data/quizzes/index.ts`.

**Step 6: Update progress category mapping (if needed)**

In `src/hooks/useProgress.ts`, add the slug to `SLUG_TO_CATEGORY`:
```typescript
const SLUG_TO_CATEGORY: Record<string, DPCategory> = {
  // existing...
  "my-problem": "Choice DP",
};
```

That is all. The routing, visualizer, theory page, quiz page, and homework page are all
automatically driven by the problem data and algorithm objects. No new page components are needed.

### Adding a New Visualization Type

The visualizer currently supports 1D tables (`Table1D`) and 2D tables (`Table2D`). Detection is
automatic based on whether `step.table` is `number[]` or `number[][]`.

To add a new visualization type (e.g. a tree visualization for memoization):

1. Create `src/components/visualizer/TreeViz.tsx` implementing the desired visualization.
2. Extend the `DPStep` type in `types.ts` with any additional fields needed (e.g. `treeNodes`).
3. In `DPVisualizer.tsx`, add a condition alongside the existing `use2D` check to detect when to
   use the new component and render it instead of `Table1D`/`Table2D`.
4. Update algorithm implementations to populate the new fields in their step objects.

### Adding a New AI Persona

The tutor persona is defined entirely in `src/lib/ai/prompts.ts`. To add a new persona (e.g.
a strict professor vs. the current encouraging TA):

1. Add a new prompt constant to `src/lib/ai/prompts.ts`:
   ```typescript
   export const STRICT_PROFESSOR_PROMPT = "You are a rigorous professor...";
   ```

2. Add a persona selector to the Settings page (`src/app/settings/page.tsx`), stored in
   `AppSettings` in `src/lib/storage/settings.ts`.

3. In the chat API route (`src/app/api/ai/chat/route.ts`), read the persona preference
   (pass it as a request header or body field) and select the corresponding prompt constant.

4. Pass the persona setting down from `ProblemPage` → `TutorSidebar` → `useAITutor` → the fetch
   call headers.

### Adding a Database

Currently all data is in-memory (problem data in JS module scope) or in localStorage (user
progress). To add a database — for example, to support multi-device sync or server-side progress
storage:

**What would change**:

1. **User identity**: You would need an authentication system. Currently there are no user accounts.
   Options: NextAuth.js (supports many OAuth providers), Clerk, or a custom JWT system.

2. **Progress storage**: Replace `src/lib/storage/progress.ts` with API calls. Instead of
   `localStorage.setItem(...)`, you would call `fetch("POST /api/progress/save", { body: ... })`.
   The API route would write to a database (PostgreSQL via Prisma, Supabase, MongoDB, etc.).

3. **Progress retrieval**: Replace the localStorage read in `getProgress()` with a server fetch
   on page load. Because this is async, you would need to handle a loading state in `useProgress`.

4. **Problem data**: Problem content could remain as static TypeScript objects (they don't change
   per-user and are fast to bundle), or move to a CMS/database if you want to edit them without
   code changes.

5. **What stays the same**: The DP algorithms, visualizer, AI tutor, and component structure would
   not change. The only change is the storage layer in `src/lib/storage/` and the addition of API
   routes for reading/writing user data.

The cleanest migration path is to:
- Add a `src/lib/db/` module with database client code (e.g. Prisma client).
- Replace `src/lib/storage/progress.ts` functions with thin wrappers that call new API routes.
- Keep `useProgress` hook's interface identical — its callers (all the page components) require
  no changes.

---

*End of Architecture Documentation*
