"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseTimerReturn {
  timeLeft: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  formatTime: () => string;
}

export function useTimer(totalSeconds: number): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearTick() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTick();
          setIsRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return clearTick;
  }, [isRunning]);

  const start = useCallback(() => {
    if (timeLeft > 0) setIsRunning(true);
  }, [timeLeft]);

  const pause = useCallback(() => {
    clearTick();
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    clearTick();
    setIsRunning(false);
    setTimeLeft(totalSeconds);
  }, [totalSeconds]);

  const formatTime = useCallback(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, [timeLeft]);

  return { timeLeft, isRunning, start, pause, reset, formatTime };
}
