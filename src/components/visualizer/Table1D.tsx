"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Table1DProps {
  table: number[];
  labels?: string[];
  /** Index currently being computed, -1 if none */
  computing?: number;
  /** Indices on the reconstruction/backtrack path */
  backtrackPath?: number[];
  className?: string;
}

export default function Table1D({
  table,
  labels,
  computing = -1,
  backtrackPath = [],
  className = "",
}: Table1DProps) {
  const backtrackSet = new Set(backtrackPath);

  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="inline-flex flex-col gap-1 min-w-0">
        {/* Index / custom labels */}
        <div className="flex gap-1">
          {table.map((_, i) => (
            <div
              key={i}
              className="w-12 h-5 flex items-center justify-center text-xs text-ink-muted dark:text-text-dark-muted font-mono"
            >
              {labels ? labels[i] : i}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="flex gap-1">
          <AnimatePresence mode="popLayout">
            {table.map((value, i) => {
              const isComputing = i === computing;
              const isBacktrack = backtrackSet.has(i);
              const isDone = !isComputing && value !== 0;

              return (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: isComputing ? 1.1 : 1,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                  className={[
                    "dp-cell",
                    isComputing ? "dp-cell-computing" : "",
                    isBacktrack ? "dp-cell-backtrack animate-glow" : "",
                    isDone && !isComputing && !isBacktrack ? "dp-cell-done" : "",
                    !isComputing && !isBacktrack && !isDone
                      ? "bg-parchment dark:bg-surface-dark-alt text-ink dark:text-text-dark"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {value === -Infinity || value === Infinity ? "∞" : value}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
