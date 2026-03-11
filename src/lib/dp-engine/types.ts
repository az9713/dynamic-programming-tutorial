export type Difficulty = "Intro" | "Easy" | "Easy-Medium" | "Medium" | "Medium-Hard" | "Hard";

export type DPCategory =
  | "Linear DP"
  | "Choice DP"
  | "2D DP"
  | "String DP"
  | "Interval DP"
  | "Grid DP"
  | "LIS-style";

export interface DPStep {
  /** Index in the step sequence */
  index: number;
  /** Human-readable description of what's happening */
  description: string;
  /** Current state of the DP table (1D or 2D) */
  table: number[][] | number[];
  /** Cell(s) currently being computed: [row, col] for 2D, [index] for 1D */
  computing: number[];
  /** Cells that are part of the backtrack/reconstruction path */
  backtrackPath?: number[][];
  /** The recurrence formula with substituted values for this step */
  formula?: string;
  /** Whether this step is a backtracking step */
  isBacktrack?: boolean;
}

export interface DPProblem {
  /** URL-friendly slug */
  slug: string;
  /** Problem number (1-10) */
  number: number;
  /** Display title */
  title: string;
  /** Short description */
  description: string;
  /** Difficulty level */
  difficulty: Difficulty;
  /** DP category/pattern */
  category: DPCategory;
  /** Problem statement (full) */
  problemStatement: string;
  /** The recurrence relation */
  recurrence: string;
  /** State definition: what dp[i] or dp[i][j] represents */
  stateDefinition: string;
  /** Base cases explanation */
  baseCases: string;
  /** Time complexity */
  timeComplexity: string;
  /** Space complexity */
  spaceComplexity: string;
  /** Complexity notes */
  complexityNotes?: string;
  /** Default input values for the visualizer */
  defaultInput: Record<string, unknown>;
  /** Theory content (markdown) */
  theoryContent: string;
  /** Starter code for homework */
  starterCode: string;
  /** Test cases for homework grading */
  testCases: TestCase[];
}

export interface TestCase {
  input: unknown[];
  expected: unknown;
  description: string;
}

export interface DPAlgorithm {
  /** Run the algorithm and produce steps */
  run: (input: Record<string, unknown>) => DPStep[];
  /** Get just the final result */
  solve: (input: Record<string, unknown>) => unknown;
}

export interface QuizQuestion {
  id: string;
  problemSlug: string;
  type: "multiple-choice" | "fill-blank" | "free-response" | "code";
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  difficulty: Difficulty;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  problemSlugs: string[];
  timeLimitMinutes: number;
  questions: QuizQuestion[];
}

export interface UserProgress {
  completedProblems: string[];
  quizScores: Record<string, number>;
  examScores: Record<string, { score: number; total: number; date: string }>;
  homeworkScores: Record<string, { score: number; feedback: string; date: string }>;
  badges: string[];
  streak: { current: number; lastDate: string };
  skillScores: Record<DPCategory, number>;
}

export interface AISettings {
  apiKey: string;
  model: string;
  provider: "openrouter";
}
