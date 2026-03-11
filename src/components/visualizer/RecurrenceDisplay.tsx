"use client";

import { motion, AnimatePresence } from "framer-motion";

interface RecurrenceDisplayProps {
  /** The base recurrence relation string, e.g. "dp[i] = max(dp[i-1]+nums[i], nums[i])" */
  recurrence: string;
  /** The current step's formula with substituted values */
  currentFormula?: string;
  /** Step description */
  description?: string;
}

export default function RecurrenceDisplay({
  recurrence,
  currentFormula,
  description,
}: RecurrenceDisplayProps) {
  return (
    <div className="rounded-xl border border-ink/10 dark:border-white/10 bg-parchment dark:bg-surface-dark-card p-4 space-y-3">
      {/* Base recurrence */}
      <div>
        <p className="text-xs font-medium text-ink-muted dark:text-text-dark-muted uppercase tracking-wide mb-1">
          Recurrence
        </p>
        <p className="font-mono text-sm text-ink dark:text-text-dark">
          {recurrence}
        </p>
      </div>

      {/* Current step formula */}
      <AnimatePresence mode="wait">
        {currentFormula && (
          <motion.div
            key={currentFormula}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs font-medium text-accent uppercase tracking-wide mb-1">
              This step
            </p>
            <p className="font-mono text-sm font-semibold text-ink dark:text-text-dark bg-cell-computing dark:bg-gold/10 rounded-lg px-3 py-2">
              {currentFormula}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step description */}
      <AnimatePresence mode="wait">
        {description && (
          <motion.p
            key={description}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-sm text-ink-muted dark:text-text-dark-muted border-t border-ink/5 dark:border-white/5 pt-2"
          >
            {description}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
