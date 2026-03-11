import { DPStep } from './types';

export class DPRunner {
  private steps: DPStep[];
  private currentStep: number;

  constructor(steps: DPStep[]) {
    this.steps = steps;
    this.currentStep = 0;
  }

  getCurrentStep(): DPStep {
    return this.steps[this.currentStep];
  }

  next(): DPStep | null {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      return this.steps[this.currentStep];
    }
    return null;
  }

  prev(): DPStep | null {
    if (this.currentStep > 0) {
      this.currentStep--;
      return this.steps[this.currentStep];
    }
    return null;
  }

  reset(): void {
    this.currentStep = 0;
  }

  getProgress(): { current: number; total: number } {
    return {
      current: this.currentStep,
      total: this.steps.length,
    };
  }

  /** Jump to a specific step index (clamped to valid range) */
  goTo(index: number): DPStep {
    this.currentStep = Math.max(0, Math.min(index, this.steps.length - 1));
    return this.steps[this.currentStep];
  }

  /** Whether there is a next step */
  hasNext(): boolean {
    return this.currentStep < this.steps.length - 1;
  }

  /** Whether there is a previous step */
  hasPrev(): boolean {
    return this.currentStep > 0;
  }
}
