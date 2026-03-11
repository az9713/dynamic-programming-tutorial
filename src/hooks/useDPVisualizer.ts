"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { DPStep } from "@/lib/dp-engine/types";

export interface UseDPVisualizerReturn {
  steps: DPStep[];
  setSteps: (steps: DPStep[]) => void;
  currentStep: number;
  step: DPStep | null;
  isPlaying: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  stepForward: () => void;
  stepBack: () => void;
  reset: () => void;
  goToStep: (index: number) => void;
  setSpeed: (speed: number) => void;
  totalSteps: number;
}

export function useDPVisualizer(initialSteps: DPStep[]): UseDPVisualizerReturn {
  const [steps, setStepsState] = useState<DPStep[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepsRef = useRef(initialSteps);

  const totalSteps = steps.length;
  const step = steps[currentStep] ?? null;

  const intervalDelay = Math.round(1000 / speed);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const play = useCallback(() => {
    if (totalSteps === 0) return;
    setCurrentStep((prev) => {
      if (prev >= totalSteps - 1) return 0;
      return prev;
    });
    setIsPlaying(true);
  }, [totalSteps]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (prev) {
        clearTimer();
        return false;
      }
      return true;
    });
  }, [clearTimer]);

  const stepForward = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [clearTimer, totalSteps]);

  const stepBack = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, [clearTimer]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
    setCurrentStep(0);
  }, [clearTimer]);

  const goToStep = useCallback(
    (index: number) => {
      setIsPlaying(false);
      clearTimer();
      setCurrentStep(Math.max(0, Math.min(index, totalSteps - 1)));
    },
    [clearTimer, totalSteps]
  );

  const setSteps = useCallback(
    (newSteps: DPStep[]) => {
      setIsPlaying(false);
      clearTimer();
      setCurrentStep(0);
      setStepsState(newSteps);
    },
    [clearTimer]
  );

  // Auto-advance interval while playing
  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }

    clearTimer();
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalDelay);

    return clearTimer;
  }, [isPlaying, intervalDelay, totalSteps, clearTimer]);

  // Reset when initialSteps changes (compare by reference using a ref)
  useEffect(() => {
    if (stepsRef.current !== initialSteps) {
      stepsRef.current = initialSteps;
      setIsPlaying(false);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentStep(0);
      setStepsState(initialSteps);
    }
  }, [initialSteps]);

  return {
    steps,
    setSteps,
    currentStep,
    step,
    isPlaying,
    speed,
    play,
    pause,
    togglePlay,
    stepForward,
    stepBack,
    reset,
    goToStep,
    setSpeed,
    totalSteps,
  };
}
