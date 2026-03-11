export interface TutorContextParams {
  problemName: string;
  problemStatement: string;
  recurrence: string;
  stateDefinition: string;
  currentStep?: number;
  totalSteps?: number;
  currentFormula?: string;
}

export function buildTutorContext(params: TutorContextParams): string {
  const {
    problemName,
    problemStatement,
    recurrence,
    stateDefinition,
    currentStep,
    totalSteps,
    currentFormula,
  } = params;

  const lines: string[] = [
    `## Problem: ${problemName}`,
    "",
    `**Problem Statement:** ${problemStatement}`,
    "",
    `**State Definition:** ${stateDefinition}`,
    "",
    `**Recurrence Relation:** ${recurrence}`,
  ];

  if (currentStep !== undefined && totalSteps !== undefined) {
    lines.push("");
    lines.push(`**Current Visualizer Step:** ${currentStep + 1} of ${totalSteps}`);
  }

  if (currentFormula) {
    lines.push("");
    lines.push(`**Current Formula (this step):** ${currentFormula}`);
  }

  return lines.join("\n");
}
