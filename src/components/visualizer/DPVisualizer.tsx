"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DPProblem, DPAlgorithm, DPStep } from "@/lib/dp-engine/types";
import { useDPVisualizer } from "@/hooks/useDPVisualizer";
import Table1D from "./Table1D";
import Table2D from "./Table2D";
import StepControls from "./StepControls";
import RecurrenceDisplay from "./RecurrenceDisplay";
import InputEditor from "./InputEditor";

interface DPVisualizerProps {
  problem: DPProblem;
  algorithm: DPAlgorithm;
  /** Override 2D detection — pass true to force Table2D */
  is2D?: boolean;
}

function is2DTable(table: DPStep["table"]): table is number[][] {
  return Array.isArray(table) && Array.isArray(table[0]);
}

type Approach = "bottom-up" | "top-down";

export default function DPVisualizer({ problem, algorithm, is2D }: DPVisualizerProps) {
  const [approach, setApproach] = useState<Approach>("bottom-up");
  const [showBacktrack, setShowBacktrack] = useState(true);
  const [showInput, setShowInput] = useState(false);

  // Memoize initial steps so they don't recompute on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialSteps = useMemo(() => algorithm.run(problem.defaultInput), [problem.slug]);
  const vis = useDPVisualizer(initialSteps);
  const { step, currentStep, totalSteps, isPlaying, speed } = vis;

  const handleRunWithInput = useCallback(
    (input: Record<string, unknown>) => {
      const newSteps = algorithm.run(input);
      vis.setSteps(newSteps);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [algorithm]
  );

  // Determine 1D vs 2D
  const use2D = is2D !== undefined ? is2D : step ? is2DTable(step.table) : false;

  // Derive flat props for table components from the current step
  const table1D = (!use2D && step) ? (step.table as number[]) : [];
  const table2D = (use2D && step) ? (step.table as number[][]) : [[]];

  const computingIndex = (!use2D && step) ? (step.computing[0] ?? -1) : -1;
  const computing2D: [number, number] | null =
    use2D && step && step.computing.length >= 2
      ? [step.computing[0], step.computing[1]]
      : null;

  const backtrack1D: number[] =
    !use2D && showBacktrack && step?.backtrackPath
      ? step.backtrackPath.map((c) => c[0])
      : [];
  const backtrack2D: [number, number][] =
    use2D && showBacktrack && step?.backtrackPath
      ? (step.backtrackPath as [number, number][])
      : [];

  return (
    <div className="flex flex-col gap-5">
      {/* Top toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Approach tabs */}
        <div className="flex rounded-lg border border-ink/10 dark:border-white/10 overflow-hidden text-sm">
          {(["bottom-up", "top-down"] as Approach[]).map((a) => (
            <button
              key={a}
              onClick={() => setApproach(a)}
              className={[
                "px-3 py-1.5 transition-colors",
                approach === a
                  ? "bg-accent text-white"
                  : "bg-parchment dark:bg-surface-dark-alt text-ink-muted dark:text-text-dark-muted",
              ].join(" ")}
            >
              {a === "bottom-up" ? "Bottom-Up Visualization" : "Top-Down Explanation"}
            </button>
          ))}
        </div>

        {/* Backtrack overlay toggle */}
        <label className="flex items-center gap-2 text-sm text-ink dark:text-text-dark cursor-pointer select-none">
          <div
            onClick={() => setShowBacktrack((v) => !v)}
            className={[
              "relative w-9 h-5 rounded-full transition-colors",
              showBacktrack ? "bg-accent" : "bg-ink/20 dark:bg-white/20",
            ].join(" ")}
          >
            <motion.div
              animate={{ x: showBacktrack ? 16 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
            />
          </div>
          Backtrack path
        </label>

        {/* Input editor toggle */}
        <button
          onClick={() => setShowInput((v) => !v)}
          className="ml-auto text-sm text-accent hover:underline"
        >
          {showInput ? "Hide input" : "Edit input"}
        </button>
      </div>

      {/* Input editor (collapsible) */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <InputEditor
              defaultInput={problem.defaultInput}
              onRun={handleRunWithInput}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approach explanation */}
      <div className="text-sm text-ink-muted dark:text-text-dark-muted bg-parchment dark:bg-surface-dark-alt rounded-lg px-4 py-2 border border-ink/5 dark:border-white/5">
        {approach === "bottom-up"
          ? "Bottom-up (tabulation): Fill the table iteratively from base cases up to the answer."
          : "Top-down (memoization): Recursively solve subproblems and cache results to avoid recomputation. Each subproblem is solved once and its result memoized for later lookups."}
      </div>

      {/* RecurrenceDisplay */}
      <RecurrenceDisplay
        recurrence={problem.recurrence}
        currentFormula={step?.formula}
        description={step?.description}
      />

      {/* DP Table */}
      <div className="rounded-xl border border-ink/10 dark:border-white/10 bg-parchment dark:bg-surface-dark-card p-4 overflow-auto">
        {step ? (
          use2D ? (
            <Table2D
              table={table2D}
              computing={computing2D}
              backtrackPath={backtrack2D}
            />
          ) : (
            <Table1D
              table={table1D}
              computing={computingIndex}
              backtrackPath={backtrack1D}
            />
          )
        ) : (
          <div className="text-sm text-ink-muted dark:text-text-dark-muted">No steps to display.</div>
        )}
      </div>

      {/* Playback controls */}
      <StepControls
        currentStep={currentStep}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        speed={speed}
        onPlay={vis.play}
        onPause={vis.pause}
        onStepForward={vis.stepForward}
        onStepBack={vis.stepBack}
        onReset={vis.reset}
        onSpeedChange={vis.setSpeed}
        onGoToStep={vis.goToStep}
      />

      {/* Step description */}
      {step && (
        <p className="text-xs text-ink-muted dark:text-text-dark-muted text-center">
          {step.description}
          {step.isBacktrack && (
            <span className="ml-2 text-gold font-medium">Backtracking</span>
          )}
        </p>
      )}
    </div>
  );
}
