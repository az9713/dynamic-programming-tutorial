"use client";

import { motion } from "framer-motion";

interface StepControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  /** Scrub to an arbitrary step index */
  onGoToStep?: (index: number) => void;
}

const SPEED_OPTIONS = [0.5, 1, 1.5, 2, 4];

const iconButton =
  "flex items-center justify-center w-9 h-9 rounded-lg bg-parchment-dark dark:bg-surface-dark-alt border border-ink/10 dark:border-white/10 text-ink dark:text-text-dark disabled:opacity-40 disabled:cursor-not-allowed";

export default function StepControls({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onReset,
  onSpeedChange,
  onGoToStep,
}: StepControlsProps) {
  const progress = totalSteps > 1 ? currentStep / (totalSteps - 1) : 0;

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!onGoToStep || totalSteps < 2) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onGoToStep(Math.round(ratio * (totalSteps - 1)));
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Progress bar */}
      <div
        className={`relative h-2 rounded-full bg-parchment-dark dark:bg-surface-dark-alt overflow-hidden ${onGoToStep ? "cursor-pointer" : ""}`}
        onClick={handleProgressClick}
      >
        <motion.div
          className="absolute inset-y-0 left-0 bg-accent rounded-full"
          animate={{ width: `${progress * 100}%` }}
          transition={{ type: "tween", duration: 0.15 }}
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-2">
        {/* Reset */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          disabled={currentStep === 0 && !isPlaying}
          className={iconButton}
          title="Reset"
          aria-label="Reset"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.45" />
          </svg>
        </motion.button>

        {/* Step back */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStepBack}
          disabled={currentStep === 0}
          className={iconButton}
          title="Step back"
          aria-label="Step back"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" />
          </svg>
        </motion.button>

        {/* Play / Pause */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isPlaying ? onPause : onPlay}
          disabled={totalSteps === 0}
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-accent text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
          title={isPlaying ? "Pause" : "Play"}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </motion.button>

        {/* Step forward */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStepForward}
          disabled={currentStep >= totalSteps - 1}
          className={iconButton}
          title="Step forward"
          aria-label="Step forward"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </motion.button>

        {/* Step counter */}
        <span className="ml-2 text-sm font-mono text-ink-muted dark:text-text-dark-muted whitespace-nowrap">
          {totalSteps > 0 ? `Step ${currentStep + 1} of ${totalSteps}` : "Step 0 of 0"}
        </span>

        {/* Speed selector */}
        <div className="ml-auto flex items-center gap-1">
          <span className="text-xs text-ink-muted dark:text-text-dark-muted">Speed:</span>
          <div className="flex gap-1">
            {SPEED_OPTIONS.map((s) => (
              <motion.button
                key={s}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSpeedChange(s)}
                className={[
                  "px-2 py-1 text-xs rounded-md border font-mono transition-colors",
                  speed === s
                    ? "bg-accent text-white border-accent"
                    : "bg-parchment-dark dark:bg-surface-dark-alt border-ink/10 dark:border-white/10 text-ink dark:text-text-dark",
                ].join(" ")}
              >
                {s}x
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
