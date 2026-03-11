# DP Mastery — User Guide

Welcome. This guide will walk you through everything you need to know to get the most out of DP Mastery — from opening the app for the first time to mastering every feature. No prior knowledge of dynamic programming is required.

---

## 1. Welcome

### What is DP Mastery?

DP Mastery is an interactive learning platform for **dynamic programming (DP)** — one of the most important and most feared topics in computer science. Dynamic programming is a problem-solving technique that breaks hard problems into smaller subproblems and stores the results to avoid redundant work. It shows up in job interviews, competitive programming, and real-world algorithms everywhere from Google Maps routing to genome sequencing.

This platform makes DP approachable by letting you *see* the algorithms run step by step, ask an AI tutor questions in plain language, test your knowledge with quizzes and exams, and practice writing code with instant feedback.

### What will you learn?

By the time you work through DP Mastery, you will be able to:

- Explain what dynamic programming is and why it works
- Recognize the key DP patterns: linear DP, choice DP, 2D DP, string DP, interval DP, grid DP, and LIS-style
- Read and write recurrence relations
- Implement 10 classic DP algorithms from scratch
- Analyze time and space complexity of DP solutions

### No prior DP knowledge needed

If you know what a loop and an array are, you are ready to start. The platform begins with the gentlest possible introduction — Fibonacci numbers — and gradually builds up to harder problems. Every concept is explained before it is used.

---

## 2. Getting Started

### Opening the app

Open your web browser and navigate to the application URL (for example, `http://localhost:3000` if you are running it locally, or the hosted URL your instructor provided).

You will land on the **home page**, which shows an overview of the course, your current progress, and quick links to the problems.

### Tour of the interface

The interface has four main areas:

**Navbar (top bar)**
The navigation bar runs across the top of every page. It contains links to:
- **Problems** — the list of all 10 problems
- **Theory** — the full textbook-style reference
- **Exams** — timed assessments
- **Progress** — your personal progress dashboard
- **Settings** — API key, model, and theme preferences

On small screens, the navbar may collapse into a menu button.

**Landing page / dashboard**
The home page gives you a quick summary of how many problems you have completed, your current daily streak, and your recent scores. Think of it as your course homepage.

**Problem cards**
On the Problems page, each of the 10 problems appears as a card showing the problem title, a short description, the difficulty level (from Intro to Hard), and the DP category. Click any card to open that problem.

**Problem detail page**
When you open a problem, you see several tabs or sections:
- The **interactive visualizer** — the animated DP table
- The **theory tab** — a full explanation of the algorithm
- Links to the **quiz** and **homework** for that problem
- The **AI Tutor** button (bottom right corner)

### Setting up the AI Tutor

The AI Tutor is one of the most powerful features in the app. It requires a free API key from OpenRouter.

1. Go to [openrouter.ai](https://openrouter.ai) and create a free account.
2. In your OpenRouter dashboard, generate an API key. It will look like `sk-or-v1-...`.
3. In DP Mastery, click **Settings** in the navbar.
4. Paste your API key into the **OpenRouter API Key** field.
5. Choose a model from the dropdown. The default is **Claude Sonnet** (recommended for clear explanations). You can also choose GPT-4o or Gemini Flash.
6. Click **Save Settings**.

Your API key is stored only in your browser's local storage — it is never sent to any DP Mastery server.

If you do not have an API key, some AI features may still work via a shared hosted key, but responses may be rate-limited.

### Light and dark mode

To switch between light and dark mode:
1. Click **Settings** in the navbar.
2. Under **Appearance**, click either the **Light** or **Dark** button.
3. Click **Save Settings**.

The change takes effect immediately across the entire app.

---

## 3. Ten Quick-Win Use Cases

Each of the following mini-tutorials takes about 5 minutes. Work through them in order for the best experience — they build on each other.

---

### Use Case 1: Watch Fibonacci Come Alive

Fibonacci is the "Hello World" of dynamic programming. This use case shows you exactly what DP looks like in motion.

1. Click **Problems** in the navbar. The problems list page opens.
2. Click the **Fibonacci Numbers** card (Problem 1 — labeled "Intro").
3. You are now on the Fibonacci problem page. Look for the **Interactive Visualizer** section — it shows a row of numbered cells representing the DP table.
4. Click the **Play button** (the orange triangle pointing right). If you see a row of cells with values, the animation has already run; click **Reset** first, then Play.
5. Watch the cells fill in from left to right. The algorithm computes F(0), F(1), F(2), and so on up to F(10).
6. Notice the colors: the cell currently being computed turns **yellow**, and once its value is locked in, it turns **green**.
7. Look below the table — you will see the **formula** for the current step, showing the exact arithmetic: for example, `dp[3] = dp[2] + dp[1] = 1 + 1 = 2`.
8. To watch at a faster pace, find the speed control (it shows "1x" by default) and click **2x**. Click again for even faster playback.
9. That's it — you just watched a complete DP algorithm run from start to finish. Every other problem in the app follows this same pattern: fill the table one cell at a time, left to right (or row by row for 2D problems).

**What you learned:** DP builds a table by computing small answers first, then using those to compute bigger answers. This avoids recomputing the same thing twice.

---

### Use Case 2: Step Through Coin Change Manually

Sometimes the best way to understand an algorithm is to control it yourself, one step at a time.

1. Click **Problems** in the navbar, then click **Coin Change (Minimum Coins)** (Problem 3).
2. You see the visualizer. The default input is coins `[1, 5, 6]` and target amount `11`.
3. Do NOT click Play. Instead, find the **step forward button** — it is a single right-pointing arrow, usually labeled ">" or shown next to the Play button.
4. Click ">" once. One cell fills in. Read the description below the table: it will say something like `dp[1] = min(dp[0]+1) = 1`. This means: to make amount 1, the best we can do is 1 coin (a coin worth 1).
5. Click ">" again. `dp[2]` fills in. Two coins of value 1 are needed to make amount 2.
6. Keep clicking. Notice when you reach `dp[5]`: the algorithm tries coin 1 (would need 5 coins) and coin 5 (needs just 1 coin). It picks the minimum: **1 coin**. The formula shows this calculation.
7. Continue to `dp[11]`. The final answer is **2 coins** (a coin worth 5 plus a coin worth 6). This is better than what a naive greedy approach would find.

**What you learned:** DP doesn't just look at one previous cell — it can look at many (here, one per coin denomination) and choose the best. Stepping manually lets you see every decision the algorithm makes.

---

### Use Case 3: Ask the AI Tutor Your First Question

The AI Tutor is like having a patient teaching assistant available at any time. It gives hints first rather than full answers, which helps you actually learn.

1. Open any problem page — Fibonacci is a good starting point.
2. Look for the **"Ask AI Tutor"** button in the bottom-right corner of the page. Click it. A sidebar slides in from the right.
3. You will see a text input field at the bottom of the sidebar. Click it and type:
   ```
   What does dp[i] mean in this problem?
   ```
4. Press Enter or click the send button. The AI responds with a clear explanation of the state definition.
5. Now try a follow-up:
   ```
   Can you give me a hint about the recurrence relation?
   ```
6. The tutor gives a hint — it points you toward the idea without giving the formula away. If you ask again ("I'm still stuck, can you be more direct?"), it will give a fuller explanation.
7. Try:
   ```
   Why is naive recursion so slow for this problem?
   ```
8. The tutor explains exponential blow-up in plain language.

**Tips for getting the best answers:**
- Ask one focused question at a time.
- Mention the step you are on: "I'm on step 4 of the visualizer and I don't understand why the value jumped."
- The tutor is aware of which problem you are on and what step the visualizer is showing.

**What you learned:** The AI Tutor can answer any question about the current problem, from basic definitions to deep conceptual questions. Use it freely — there is no such thing as a silly question.

---

### Use Case 4: Modify Inputs and See What Changes

The visualizer is not fixed to one example. You can change the inputs and watch the algorithm adapt.

1. Go to **Problems > Fibonacci Numbers**.
2. Look for an **"Edit input"** button or an input field at the top of the visualizer (it may show `n = 10`).
3. Click it and change the value from `10` to `15`.
4. Click **Run** (or press Enter, depending on the interface).
5. The DP table now has 16 cells (indices 0 through 15) instead of 11.
6. Click Play. The animation runs the same algorithm on a bigger input. Watch F(11) through F(15) appear.
7. Try setting `n = 5` and running again — now you get a much smaller table and can read every value easily.
8. On the Coin Change problem, you can change the coin denominations and target amount. Try coins `[2]` and amount `3` — you will see that it is impossible (the table never reaches a finite value for amount 3).

**What you learned:** The same algorithm works for any valid input. Changing inputs is one of the best ways to build intuition — try edge cases, try large inputs, try inputs where the answer surprises you.

---

### Use Case 5: Take Your First Quiz

Quizzes test whether you have understood the key ideas. Each problem has its own quiz with 6 questions.

1. Go to **Problems > Fibonacci Numbers**.
2. Find and click the **"Take Quiz"** button. This takes you to the quiz page for Fibonacci.
3. You will see the first question. Fibonacci's quiz mixes question types:
   - **Multiple choice** — pick one answer from four options
   - **Fill in the blank** — type a specific value (like `13` or `55`)
   - **Free response** — write a sentence or two explaining a concept
4. Answer each question to the best of your ability. You do not need a perfect score — the explanations are part of the learning.
5. After answering all 6 questions, click **Submit**.
6. Your score appears along with an explanation for each question. Even if you got it right, reading the explanation deepens understanding.
7. Your score is automatically saved. Click **Progress** in the navbar to see it recorded.

**Tips:**
- If a fill-in-the-blank answer feels wrong, double-check your arithmetic against the visualizer.
- Free-response questions are graded leniently — focus on the key concept, not exact wording.
- You can retake quizzes. Only your highest score is kept.

**What you learned:** Testing yourself is one of the most effective ways to learn. Even getting an answer wrong — and then reading the explanation — locks in understanding much better than just reading.

---

### Use Case 6: Write and Submit Your First Homework

Homework assignments ask you to implement the algorithm yourself in a code editor. This is where the real skill-building happens.

1. Go to **Problems > Climbing Stairs** (Problem 2 — it is very similar to Fibonacci).
2. Click the **"Homework"** link or tab. This opens a page with a code editor.
3. The editor shows a starter function with comments explaining what you need to implement:
   ```typescript
   export function climbingStairs(n: number): number {
     // TODO: Create a dp array of size n+1
     // TODO: Set base cases dp[1] = 1 and dp[2] = 2
     // TODO: Fill the table using the recurrence
     // TODO: Return dp[n]
     throw new Error("Not implemented");
   }
   ```
4. Replace the `throw new Error("Not implemented")` line with your actual implementation. Use the recurrence you learned from the visualizer and theory: `dp[i] = dp[i-1] + dp[i-2]`.
5. When you are happy with your code, click **"Submit for Grading"**.
6. The AI grader runs your code against test cases and evaluates it on four dimensions: correctness, approach, code quality, and efficiency. Each is scored out of 25, for a total of 100.
7. Read the feedback carefully. It will tell you if your base cases are wrong, if you used an inefficient approach, or if your code could be cleaner.
8. You can revise and resubmit as many times as you like.

**Tips:**
- Study the visualizer and theory before writing code.
- Start simple — get correctness first, then worry about optimization.
- If you are stuck, ask the AI Tutor: "Can you give me a hint about the base cases for Climbing Stairs?"

**What you learned:** Writing the algorithm yourself — even when it is hard — is the step that moves you from "I understand this conceptually" to "I can actually do this."

---

### Use Case 7: Track Your Progress

The Progress page gives you a bird's-eye view of how far you have come.

1. Complete at least two quizzes (Fibonacci and Climbing Stairs are the easiest starting points).
2. Click **Progress** in the navbar.
3. The page shows several things:

   **Skill Radar Chart:** A spider/radar chart with seven axes — one per DP category (Linear DP, Choice DP, 2D DP, String DP, Interval DP, Grid DP, LIS-style). As you complete problems and quizzes, the corresponding axis grows toward 100. This gives you an honest picture of which pattern families you have mastered and which need more work.

   **Badges:** Badges are earned by hitting milestones. You might already have earned "First Steps" for completing your first problem. Other badges reward streaks, perfect quiz scores, and completing all problems in a category.

   **Streak Tracker:** Shows how many consecutive days you have practiced. A streak resets if you miss a day — so make it a habit to do even just one problem per day.

4. Hover over each section to explore the details. Your exact quiz scores, homework scores, and exam results are all recorded here.

**What you learned:** Progress tracking keeps you honest and motivated. The radar chart in particular is valuable — it shows you precisely which DP patterns to study next.

---

### Use Case 8: Challenge Yourself with the Midterm Exam

The Midterm Exam tests everything from Problems 1 through 5 under timed conditions.

1. Click **Exams** in the navbar. You will see two exams: Midterm and Final.
2. Click **Start** on the **Midterm Exam**. Read the description: 15 questions, 30-minute time limit, covering Fibonacci, Climbing Stairs, Coin Change, Knapsack, and LCS.
3. A countdown timer appears at the top of the page. It counts down from 30:00.
4. Answer the 15 questions carefully. Question types include multiple choice, fill-in-the-blank, and free response — the same types you practiced in individual quizzes. The questions are drawn directly from those quizzes (3 per problem).
5. Work at a steady pace. You have 2 minutes per question on average.
6. Important: **the exam auto-submits when the timer reaches zero**, even if you have not answered every question. Unanswered questions are marked wrong.
7. You can also click **Submit** early if you finish before the time runs out.
8. After submission, your score appears with a breakdown by problem area and detailed explanations for every question.

**Tips:**
- Do not take the exam until you have completed the quizzes for all 5 covered problems.
- If you run out of time, do not panic — review the feedback, restudy the weak areas, and you can retake it later.
- Your exam scores are recorded in your Progress page.

**What you learned:** Timed exams simulate the pressure of real job interviews and competitive programming contests. They also reveal which concepts you know well enough to recall quickly versus which you are still shaky on.

---

### Use Case 9: Compare Two Approaches

The Knapsack problem introduces a 2D DP table. It also gives you the chance to see how the same problem can be approached in different ways.

1. Go to **Problems > 0/1 Knapsack** (Problem 4).
2. The visualizer now shows a 2D table (a grid) instead of a single row. The rows represent items, and the columns represent knapsack capacity from 0 to W (7 in the default example).
3. Click Play and watch the table fill **row by row**, left to right within each row. Each cell `dp[i][w]` represents the maximum value achievable using the first `i` items with capacity `w`.
4. Look for the **"Show backtrack path"** toggle (it may be a checkbox or button below the table). Turn it on after the animation completes. The optimal set of items is highlighted in **gold** — this is the reconstruction path that tells you which items were selected.
5. Toggle the backtrack path on and off a few times to see how the path connects through the table.
6. Now look for a **"Top-Down"** tab or button near the theory section. This switches to a written explanation of the recursive (memoized) approach to the same problem — as opposed to the bottom-up table-filling approach the visualizer shows. Both produce the same answer but think about the problem differently.
7. Compare the two: bottom-up fills the entire table proactively; top-down only computes the cells it actually needs.

**What you learned:** Most DP problems can be solved either bottom-up (iterative table filling) or top-down (recursive with memoization). Understanding both approaches makes you flexible in real situations.

---

### Use Case 10: Read the Complete Theory

The Theory section is a full textbook-style reference you can return to whenever you need a clear explanation.

1. Click **Theory** in the navbar.
2. You will see a page with navigation for all 10 problems. Click any problem to jump to its section.
3. Each theory section covers:
   - **The problem** — a clear, formal statement
   - **Why this is a DP problem** — intuition for why brute force fails and DP helps
   - **State definition** — what exactly `dp[i]` (or `dp[i][j]`) represents
   - **Recurrence relation** — the formula connecting states
   - **Base cases** — where the table starts
   - **Fill order** — which direction to compute
   - **Worked trace** — a complete hand-trace through a small example
   - **Complexity analysis** — time and space costs with explanations
4. Work through the Fibonacci theory first. It is the shortest and most carefully written — every concept introduced there carries forward into every later problem.
5. Bookmark the Theory page. When you are stuck on a quiz or homework assignment, reading the theory for that problem is often the fastest path to understanding.

**What you learned:** Having a clean reference is invaluable. The Theory page is written to be read multiple times — once for initial understanding, and again when you are trying to solve a harder problem and need to see a familiar pattern laid out carefully.

---

## 4. Features Reference

This section is a concise reference for every feature in the app.

### Problem List Page (`/problems`)

Shows all 10 problems as cards. Each card displays the problem title, short description, difficulty badge (color-coded: Intro/Easy/Medium/Hard), and DP category. Click a card to open that problem.

The 10 problems in order:

| # | Title | Difficulty | Category |
|---|---|---|---|
| 1 | Fibonacci Numbers | Intro | Linear DP |
| 2 | Climbing Stairs | Easy | Linear DP |
| 3 | Coin Change | Easy-Medium | Linear DP / Choice DP |
| 4 | 0/1 Knapsack | Medium | Choice DP |
| 5 | Longest Common Subsequence | Medium | String DP |
| 6 | Edit Distance | Medium | String DP |
| 7 | Matrix Chain Multiplication | Medium-Hard | Interval DP |
| 8 | Longest Increasing Subsequence | Medium | LIS-style |
| 9 | Rod Cutting | Easy-Medium | Choice DP |
| 10 | Unique Paths in Grid | Easy | Grid DP |

### Problem Detail Page (`/problems/[slug]`)

The main page for each problem. Contains:

- **Problem statement** — the formal description of what must be computed
- **Recurrence relation** — the core formula
- **Interactive Visualizer** — animated DP table (see below)
- **Theory tab** — full explanation (same content as the Theory page)
- **Quiz link** — takes you to that problem's 6-question quiz
- **Homework link** — takes you to the code editor for that problem
- **AI Tutor button** — opens the tutor sidebar (bottom right)

### Interactive Visualizer

The centerpiece of each problem page.

**Controls:**
- Play / Pause — starts or stops automatic step-through animation
- Step Back (<) — move one step backward
- Step Forward (>) — move one step forward
- Reset — return to step 0
- Speed selector — 0.5x, 1x, 2x, 4x playback speeds

**Display:**
- **1D table** (problems 1-3, 8-9) — a single row of cells indexed 0, 1, 2, ...
- **2D table** (problems 4-7, 10) — a grid of cells indexed by row and column
- **Computing cell** — highlighted in yellow while being calculated
- **Completed cell** — highlighted in green once finalized
- **Backtrack path** — highlighted in gold, showing the reconstruction path (toggle on/off)
- **Formula display** — shows the recurrence with actual numbers substituted for the current step
- **Step description** — plain-English explanation of what the current step is doing

**Input editor:**
Click "Edit input" to change the problem's input values. Click "Run" to recompute with the new input.

### Quiz System (`/problems/[slug]/quiz`)

Each problem has exactly 6 quiz questions. Question types:

- **Multiple choice** — select one of four options
- **Fill in the blank** — type a specific value or short answer
- **Free response** — write a sentence or two; graded for keywords and concepts

After submitting, you see your score and a detailed explanation for every question. Your highest score across all attempts is saved to your progress.

### Exam System (`/exams`)

Two timed exams are available:

- **Midterm Exam** — 15 questions, 30 minutes, covers Problems 1-5 (Fibonacci through LCS)
- **Final Exam** — covers all 10 problems (check the exam page for details)

Each exam has a countdown timer visible at the top. The exam auto-submits when time expires. After completion, you see your overall score and per-question feedback. Exam results are saved to your Progress page with the date taken.

### Homework (`/problems/[slug]/homework`)

A full-screen code editor pre-loaded with a starter function and comments. You write the implementation, then click "Submit for Grading."

**Grading criteria (25 points each, 100 total):**
- Correctness — does the function return the right answer for all test cases?
- Approach — does it use proper dynamic programming?
- Code quality — is the code clean, readable, and well-structured?
- Efficiency — is the time and space complexity optimal (or close to it)?

Feedback includes a numerical score, written comments, and specific suggestions for improvement. You can resubmit as many times as you want.

### AI Tutor

Accessible via the "Ask AI Tutor" button (bottom right of any problem page). Opens a sidebar chat interface.

**What to ask:**
- "What does `dp[i]` represent in this problem?"
- "Why do we initialize the table to Infinity?"
- "Give me a hint about the recurrence."
- "I'm stuck on step 7 of the visualizer — what's happening?"
- "What's the difference between top-down and bottom-up DP?"
- "Can you explain the time complexity?"

**How it works:**
The tutor knows which problem you are on and what step the visualizer is currently showing. It uses that context to give relevant answers. It is configured to give hints before full answers — if you want more detail, just ask again.

Available models (configured in Settings):
- **Claude Sonnet** — best overall quality, recommended default
- **GPT-4o** — very capable, great for code explanations
- **Gemini Flash** — fastest response time

### Progress Tracking (`/progress`)

Your personal dashboard showing:

- **Skill Radar Chart** — a seven-axis spider chart, one axis per DP category. Each axis shows your score from 0-100 based on problems completed and quiz scores in that category.
- **Badge Grid** — earned badges (colored) and locked badges (greyed out). Hover over a locked badge to see what you need to unlock it.
- **Streak Tracker** — your current daily streak and your best-ever streak. A streak increments once per calendar day when you use the app.
- **Quiz Scores** — all recorded quiz scores by problem
- **Exam History** — scores, totals, and dates for all exams taken
- **Homework Scores** — grades and feedback for all submitted homework

All data is stored in your browser's local storage under the key `dp-course-progress`.

### Settings (`/settings`)

- **OpenRouter API Key** — paste your key here to enable AI features. Stored locally only.
- **AI Model** — choose between Claude Sonnet, GPT-4o, and Gemini Flash.
- **Appearance** — toggle between Light and Dark mode.
- **Save Settings** — must click to persist changes.
- **Reset All Progress** — in the Danger Zone at the bottom. Clears all quiz scores, exam scores, homework scores, badges, and streak. Requires two clicks to confirm.

---

## 5. Tips for Learning DP

**Start with the first three problems.** Problems 1-3 (Fibonacci, Climbing Stairs, Coin Change) are all linear DP — they use a 1D table and have clean, readable recurrences. Building confidence here makes the jump to 2D problems (Knapsack and LCS) much easier.

**Use the visualizer before reading the theory.** Watch the animation two or three times with different inputs. Build a visual mental model of how the table fills. Then read the theory — you will find it clicks much faster when you already have the picture in your head.

**Ask the AI Tutor when you are stuck — but try first.** The tutor gives hints before full answers, which respects your learning. Try to figure it out for 5-10 minutes before asking for help. When you do ask, be specific: "I don't understand why dp[6] = 1 in Coin Change" is much better than "I'm confused."

**Take the quiz immediately after watching the visualizer.** The best time to test yourself is right after studying. You will catch gaps in understanding while the material is fresh.

**Do the homework before moving to the next problem.** It is tempting to skim through all the visualizations and save the coding for later. Resist this. Implementing each algorithm yourself — even imperfectly — is what builds lasting skill.

**Check the Progress page weekly.** The radar chart is particularly useful. If your "Choice DP" axis is low, you know to spend more time on Coin Change, Knapsack, and Rod Cutting.

**Build a streak.** Even 15 minutes a day compounds dramatically. The streak tracker is there to help you build a habit, not to stress you out.

**Problems are ordered by difficulty — trust the order.** The curriculum is designed so that each problem builds on the previous ones. Do not skip ahead to LCS or Matrix Chain before completing the first four problems.

---

## 6. Troubleshooting

**"The AI Tutor is not responding"**
The most common cause is a missing or incorrect API key. Go to Settings and double-check your OpenRouter API key. Make sure it starts with `sk-or-`. Also make sure you clicked Save Settings after entering it. If the key is correct and the problem persists, check your OpenRouter account for remaining credits.

**"The visualizer is not playing / is stuck"**
Click the **Reset** button (usually a circular arrow), then click Play again. If the problem continues, try refreshing the page. If you changed the input to an invalid value (like a negative number), reset the input to the default first.

**"My progress has disappeared"**
Progress is stored in your browser's local storage. It is lost if you:
- Use private/incognito browsing mode (local storage does not persist between incognito sessions)
- Clear your browser's site data or cookies
- Use a different browser or device

To avoid data loss, avoid using incognito mode for this app. Unfortunately there is no cloud sync — your data lives in the specific browser you use.

**"A page looks broken or styles are missing"**
Try refreshing the page (Ctrl+R or Cmd+R). If that does not help, try toggling between light and dark mode in Settings — this sometimes forces a style recompute. If the problem persists, try a different browser (Chrome and Firefox are best supported).

**"Homework grading returned an error"**
Make sure your code does not have a syntax error (the editor will usually underline these in red). Also make sure your function signature matches the starter code exactly — changing the function name or parameter names may confuse the grader.

**"The exam timer is running but I accidentally refreshed the page"**
Refreshing during an exam resets the timer. Your previous answers are not saved. To avoid this, do not navigate away or refresh during an exam.

---

*You are ready. Start with Problem 1, watch Fibonacci come alive, and take it one step at a time.*
