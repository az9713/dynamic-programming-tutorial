# DP Course Platform — API Reference

## Introduction

This document describes the internal API routes used by the DP Course Platform frontend. All routes are Next.js Route Handlers running server-side in the `src/app/api/ai/` directory. They act as a thin proxy between the browser client and the [OpenRouter](https://openrouter.ai) external LLM API, adding authentication resolution, rate limiting, model selection, and prompt construction.

**Base path**: `/api/ai`

**Available endpoints**:

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/ai/chat` | Streaming AI tutor chat (SSE) |
| POST | `/api/ai/quiz-generate` | Generate AI quiz questions |
| POST | `/api/ai/grade` | Grade a homework code submission |
| POST | `/api/ai/feedback` | Code review feedback without grading |

---

## Authentication

All four endpoints use the same key resolution logic. The server resolves the API key in priority order:

1. **BYOK (Bring Your Own Key)**: The client sends its OpenRouter API key in the `x-api-key` request header. This takes highest priority.
2. **Hosted Key**: If no `x-api-key` header is present, the server falls back to the `OPENROUTER_API_KEY` environment variable configured on the server.
3. **No key**: If neither is available, the server returns `401 Unauthorized`.

```
Request Header Priority:
  x-api-key: sk-or-v1-xxx   <-- checked first (BYOK)
  (absent)                   <-- falls back to process.env.OPENROUTER_API_KEY
```

The user's BYOK key is stored in `localStorage` under `dp-course-settings` and read by the frontend hooks, which attach it to every request via the `x-api-key` header.

### Error Response (401)

```json
{
  "error": "No API key provided. Set x-api-key header or configure OPENROUTER_API_KEY."
}
```

---

## Rate Limiting

Rate limiting is enforced **only** when a request uses the hosted server key (i.e., no `x-api-key` header was sent by the client). BYOK requests are never rate-limited.

**Algorithm**: Token bucket per client IP address

**Limits**:
- 20 requests per minute per IP
- Bucket refills fully every 60 seconds
- Partial refills are calculated proportionally for elapsed time

**IP detection order**:
1. `x-forwarded-for` header (first IP in the comma-separated list)
2. `x-real-ip` header
3. Falls back to `"unknown"` if neither is present

**Response header**: `X-RateLimit-Remaining` is included in all responses (both allowed and rejected) to show the number of tokens left in the current bucket window.

**Note**: The rate limiter state is in-memory and resets on server restart. It is not shared across multiple server instances.

### Error Response (429)

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Remaining: 0

{
  "error": "Rate limit exceeded. Please try again later or provide your own API key."
}
```

---

## Model Selection

Any endpoint can be told which AI model to use by setting the `x-model` request header to a valid OpenRouter model ID.

**Header**: `x-model`

If the header is absent, the server uses the `DEFAULT_MODEL`.

### Available Models

| Model ID | Name | Provider | Character |
|----------|------|----------|-----------|
| `anthropic/claude-sonnet-4` | Claude Sonnet | Anthropic | Fast, balanced — **default** |
| `openai/gpt-4o` | GPT-4o | OpenAI | Versatile, capable |
| `google/gemini-2.0-flash-exp` | Gemini Flash | Google | Quick responses |

**Default model**: `anthropic/claude-sonnet-4`

To change the default or add/remove models, edit `src/lib/ai/models.ts`.

---

## Endpoints

---

### POST /api/ai/chat

**Purpose**: Streaming AI tutor chat for the problem visualizer page.

The endpoint builds a system prompt from the tutor persona and optional problem context, then streams the OpenRouter response body directly to the client as Server-Sent Events (SSE). The frontend `useAITutor` hook reads the stream incrementally to display tokens as they arrive.

**Temperature**: 0.7 (default, set in `callAI`)

#### Request

```
POST /api/ai/chat
Content-Type: application/json
x-api-key: sk-or-v1-xxx        (optional, BYOK)
x-model: anthropic/claude-sonnet-4  (optional)
```

**Body**:

```json
{
  "messages": [
    { "role": "user", "content": "What does dp[i] mean in this problem?" }
  ],
  "problemContext": {
    "problemName": "Fibonacci Numbers",
    "problemStatement": "Compute the n-th Fibonacci number efficiently.",
    "recurrence": "dp[i] = dp[i-1] + dp[i-2]",
    "stateDefinition": "dp[i] = the i-th Fibonacci number",
    "currentStep": 5,
    "totalSteps": 12,
    "currentFormula": "dp[5] = dp[4] + dp[3] = 3 + 2 = 5"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `messages` | `ChatMessage[]` | Yes | Conversation history. Must be a non-empty array. |
| `problemContext` | `TutorContextParams` | No | Current problem state for context-aware tutoring. When provided, it is prepended to the system prompt before the tutor persona instructions. |

**messages constraints**: Must be a non-empty array. A missing or empty array returns `400`.

#### Response

A successful response is an SSE stream with `Content-Type: text/event-stream`. Each line prefixed with `data:` contains a JSON chunk in the OpenRouter streaming format.

```
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: {"choices":[{"delta":{"content":"The"}}]}
data: {"choices":[{"delta":{"content":" dp"}}]}
data: {"choices":[{"delta":{"content":"[i]"}}]}
data: {"choices":[{"delta":{"content":" represents"}}]}
...
data: [DONE]
```

**Frontend parsing**: The `useAITutor` hook opens a `ReadableStream` reader on the response body, decodes chunks as UTF-8 text, splits on newlines, filters lines starting with `data:`, strips the prefix, and extracts `choices[0].delta.content` from each parsed JSON object. Content is accumulated and set into component state on each chunk.

#### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| 400 | `messages` is missing or empty | `{"error": "messages array is required"}` |
| 401 | No API key available | `{"error": "No API key provided. Set x-api-key header or configure OPENROUTER_API_KEY."}` |
| 429 | Hosted key rate limit exceeded | `{"error": "Rate limit exceeded. Please try again later or provide your own API key."}` |
| 500 | Unhandled exception or OpenRouter API error | `{"error": "<message>"}` |

**Note**: If OpenRouter returns an error after the stream has already begun (i.e., after the 200 response headers were sent), the error may appear mid-stream rather than as a distinct HTTP error status.

---

### POST /api/ai/quiz-generate

**Purpose**: Dynamically generate quiz questions for a given DP problem at a specified difficulty level.

The response is a JSON array of question objects. The AI is instructed to target a specific difficulty and return structured data. The raw model output is stripped of any accidental markdown fences before being parsed.

**Temperature**: 0.8 (higher for variety in generated questions)

#### Request

```
POST /api/ai/quiz-generate
Content-Type: application/json
x-api-key: sk-or-v1-xxx        (optional, BYOK)
x-model: anthropic/claude-sonnet-4  (optional)
```

**Body**:

```json
{
  "problemSlug": "fibonacci",
  "difficulty": "Intro",
  "count": 5
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `problemSlug` | `string` | Yes | URL slug of the DP problem (e.g., `"fibonacci"`, `"knapsack"`). |
| `difficulty` | `Difficulty` | No | Target difficulty for the questions. Defaults to `"Medium"` if omitted. See `Difficulty` type below. |
| `count` | `number` | No | Number of questions to generate. Defaults to `5`. |

#### Response

```json
[
  {
    "id": "fib-q1",
    "problemSlug": "fibonacci",
    "type": "multiple-choice",
    "question": "What is the time complexity of the naive recursive Fibonacci implementation?",
    "options": ["O(n)", "O(n^2)", "O(2^n)", "O(n log n)"],
    "correctAnswer": 2,
    "explanation": "Each call branches into two recursive calls, resulting in a binary tree of depth n and O(2^n) total calls.",
    "difficulty": "Intro"
  }
]
```

The response is a direct JSON array (not wrapped in an object). See the `QuizQuestion` interface in the Data Types section for the full field specification.

#### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| 400 | `problemSlug` is missing | `{"error": "problemSlug is required"}` |
| 401 | No API key available | `{"error": "No API key available"}` |
| 500 | Parse failure or OpenRouter error | `{"error": "<message>"}` |

---

### POST /api/ai/grade

**Purpose**: Grade a homework code submission against a problem. Returns a structured score with category breakdowns and written feedback.

The grader uses a low temperature setting for consistent, reproducible scoring. Test results (passed/failed) are summarized and appended to the prompt so the model can factor them in.

**Temperature**: 0.3 (low for consistency)

#### Request

```
POST /api/ai/grade
Content-Type: application/json
x-api-key: sk-or-v1-xxx        (optional, BYOK)
x-model: anthropic/claude-sonnet-4  (optional)
```

**Body**:

```json
{
  "code": "function fibonacci(n: number): number {\n  const dp = Array(n + 1).fill(0);\n  dp[1] = 1;\n  for (let i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];\n  return dp[n];\n}",
  "problemSlug": "fibonacci",
  "testResults": [
    { "passed": true,  "description": "fibonacci(10) === 55" },
    { "passed": true,  "description": "fibonacci(0) === 0" },
    { "passed": false, "description": "fibonacci(-1) should handle negative input" }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | `string` | Yes | The submitted source code as a string. |
| `problemSlug` | `string` | Yes | URL slug identifying the problem being graded. |
| `testResults` | `TestResult[]` | No | Array of test case outcomes. Each entry has `passed: boolean` and `description: string`. When provided, a formatted summary is appended to the grading prompt. |

#### Response

```json
{
  "score": 85,
  "correctness": 25,
  "approach": 20,
  "quality": 20,
  "efficiency": 20,
  "feedback": "Good implementation using bottom-up tabulation. The iterative approach is efficient and avoids recursion overhead.",
  "suggestions": [
    "Consider adding input validation for negative numbers",
    "The space could be optimized to O(1) by using two variables instead of the full array"
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `score` | `number` | Overall score (0–100). |
| `correctness` | `number` | Correctness sub-score. |
| `approach` | `number` | DP approach quality sub-score. |
| `quality` | `number` | Code quality sub-score. |
| `efficiency` | `number` | Time/space efficiency sub-score. |
| `feedback` | `string` | Prose explanation of the grade. |
| `suggestions` | `string[]` | Actionable improvement suggestions. |

#### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| 400 | `code` or `problemSlug` is missing | `{"error": "code and problemSlug are required"}` |
| 401 | No API key available | `{"error": "No API key available"}` |
| 500 | JSON parse failure or OpenRouter error | `{"error": "<message>"}` |

---

### POST /api/ai/feedback

**Purpose**: Code review for a DP solution without producing a numeric grade. Returns structured qualitative feedback across several dimensions.

This is lighter-weight than `/api/ai/grade` — it has no test result input and focuses on code review style rather than scoring. Useful for "review my code" workflows before a formal submission.

**Temperature**: 0.4

#### Request

```
POST /api/ai/feedback
Content-Type: application/json
x-api-key: sk-or-v1-xxx        (optional, BYOK)
x-model: anthropic/claude-sonnet-4  (optional)
```

**Body**:

```json
{
  "code": "function fibonacci(n: number): number {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}",
  "problemSlug": "fibonacci"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | `string` | Yes | The source code to review. |
| `problemSlug` | `string` | Yes | URL slug identifying the problem context. |

#### Response

```json
{
  "summary": "The solution uses naive recursion and solves the problem correctly for small inputs, but is not a dynamic programming approach.",
  "correctness": "Correct for all non-negative inputs within stack depth limits.",
  "dpApproach": "This is a recursive solution without memoization or tabulation. It does not qualify as dynamic programming.",
  "codeStyle": "Clean and readable. Good use of base cases.",
  "efficiency": "O(2^n) time and O(n) space due to call stack depth. Not suitable for large n.",
  "edgeCases": "Does not handle negative inputs. Will overflow the call stack for large n.",
  "suggestions": [
    "Rewrite using bottom-up tabulation to achieve O(n) time and O(1) space",
    "Add a check for n < 0 to handle invalid inputs gracefully"
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `summary` | `string` | Brief overall assessment of the solution. |
| `correctness` | `string` | Assessment of whether the solution produces correct output. |
| `dpApproach` | `string` | Evaluation of whether and how DP principles are applied. |
| `codeStyle` | `string` | Comments on readability, naming, and structure. |
| `efficiency` | `string` | Time and space complexity analysis. |
| `edgeCases` | `string` | Assessment of edge case handling. |
| `suggestions` | `string[]` | Prioritized list of recommended improvements. |

#### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| 400 | `code` or `problemSlug` is missing | `{"error": "code and problemSlug are required"}` |
| 401 | No API key available | `{"error": "No API key available"}` |
| 500 | JSON parse failure or OpenRouter error | `{"error": "<message>"}` |

---

## Data Types Reference

The following TypeScript interfaces are used across the API layer. The canonical definitions live in `src/lib/dp-engine/types.ts` and `src/lib/ai/client.ts`.

### ChatMessage

```typescript
// src/lib/ai/client.ts
interface ChatMessage {
  role: string;   // "user" | "assistant" | "system"
  content: string;
}
```

Used in the `messages` array of the `/api/ai/chat` request body.

### TutorContextParams

```typescript
// src/lib/ai/context-builder.ts
interface TutorContextParams {
  problemName: string;
  problemStatement: string;
  recurrence: string;
  stateDefinition: string;
  currentStep?: number;
  totalSteps?: number;
  currentFormula?: string;
}
```

The optional `problemContext` field in the `/api/ai/chat` request body. When present, the problem metadata is embedded into the system prompt so the tutor can give problem-specific answers referencing the current visualizer state.

### Difficulty

```typescript
// src/lib/dp-engine/types.ts
type Difficulty = "Intro" | "Easy" | "Easy-Medium" | "Medium" | "Medium-Hard" | "Hard";
```

Used as the `difficulty` field in `/api/ai/quiz-generate` requests and in the `QuizQuestion` response objects.

### QuizQuestion

```typescript
// src/lib/dp-engine/types.ts
interface QuizQuestion {
  id: string;
  problemSlug: string;
  type: "multiple-choice" | "fill-blank" | "free-response" | "code";
  question: string;
  options?: string[];        // present for "multiple-choice" type
  correctAnswer: string | number;  // index for multiple-choice, string for others
  explanation: string;
  difficulty: Difficulty;
}
```

This is the shape of each element in the array returned by `/api/ai/quiz-generate`.

### GradeResult

```typescript
// src/app/api/ai/grade/route.ts
interface GradeResult {
  score: number;
  correctness: number;
  approach: number;
  quality: number;
  efficiency: number;
  feedback: string;
  suggestions: string[];
}
```

The full response body shape returned by `/api/ai/grade`.

### AIModel

```typescript
// src/lib/ai/models.ts
interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
}
```

Describes an entry in the `AVAILABLE_MODELS` list. The `id` field is the value passed via the `x-model` request header.

---

## Testing the API

The following curl examples assume the dev server is running at `http://localhost:3000`. Replace `YOUR_KEY` with a valid OpenRouter API key.

### Chat (streaming)

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_KEY" \
  -d '{
    "messages": [
      { "role": "user", "content": "Explain what dp[i] represents in the Fibonacci problem." }
    ],
    "problemContext": {
      "problemName": "Fibonacci Numbers",
      "problemStatement": "Compute the n-th Fibonacci number.",
      "recurrence": "dp[i] = dp[i-1] + dp[i-2]",
      "stateDefinition": "dp[i] = the i-th Fibonacci number"
    }
  }'
```

Because the response is SSE, curl will print each `data:` line as it arrives. Use `--no-buffer` for real-time output:

```bash
curl --no-buffer -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_KEY" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

### Quiz Generation

```bash
curl -X POST http://localhost:3000/api/ai/quiz-generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_KEY" \
  -d '{
    "problemSlug": "fibonacci",
    "difficulty": "Easy",
    "count": 3
  }'
```

### Grading

```bash
curl -X POST http://localhost:3000/api/ai/grade \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_KEY" \
  -d '{
    "code": "function fibonacci(n) { const dp = [0,1]; for(let i=2;i<=n;i++) dp[i]=dp[i-1]+dp[i-2]; return dp[n]; }",
    "problemSlug": "fibonacci",
    "testResults": [
      { "passed": true, "description": "fibonacci(10) === 55" },
      { "passed": true, "description": "fibonacci(0) === 0" }
    ]
  }'
```

### Feedback

```bash
curl -X POST http://localhost:3000/api/ai/feedback \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_KEY" \
  -d '{
    "code": "function fibonacci(n) { if(n<=1) return n; return fibonacci(n-1)+fibonacci(n-2); }",
    "problemSlug": "fibonacci"
  }'
```

### Testing with the hosted key (no BYOK)

Omit the `x-api-key` header to exercise the hosted key path and rate limiter. The response will include an `X-RateLimit-Remaining` header:

```bash
curl -v -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}' \
  2>&1 | grep -E "(< X-RateLimit|data:)"
```

---

## Error Handling

### Error Response Format

All error responses use the same JSON envelope:

```json
{
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Meaning | When it occurs |
|------|---------|----------------|
| 400 | Bad Request | Required fields are missing or invalid (e.g., empty `messages` array, missing `code` or `problemSlug`). |
| 401 | Unauthorized | No API key is available from either the `x-api-key` header or the `OPENROUTER_API_KEY` environment variable. |
| 429 | Too Many Requests | The per-IP rate limit on the hosted key has been exhausted. The `X-RateLimit-Remaining: 0` header is included. |
| 500 | Internal Server Error | An unhandled exception occurred, including OpenRouter API errors (non-2xx responses from OpenRouter), JSON parse failures on model output, or unexpected response formats. |

### Mid-stream Errors

The `/api/ai/chat` endpoint sends back the OpenRouter response stream directly. If OpenRouter returns a successful `200` response that then errors part-way through the stream, the HTTP status code visible to the client will already be `200`. The frontend `useAITutor` hook should handle stream read errors gracefully and display an appropriate message to the user if the stream terminates unexpectedly before a `[DONE]` sentinel.

### OpenRouter Errors

When the OpenRouter API returns a non-2xx response, `callAI()` in `src/lib/ai/client.ts` throws an `Error` with the message `"OpenRouter API error <status>: <body>"`. This is caught by each route handler and returned as a `500` response with the error text in the `error` field.

Common upstream causes:
- Invalid or expired API key (OpenRouter returns 401)
- Model not available or invalid model ID (OpenRouter returns 400)
- OpenRouter service outage (OpenRouter returns 5xx)
- Exceeded OpenRouter account credits or rate limits
