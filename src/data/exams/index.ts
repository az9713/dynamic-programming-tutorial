import type { Exam } from "@/lib/dp-engine/types";
import { midtermExam } from "./midterm";
import { finalExam } from "./final";

export const exams: Exam[] = [midtermExam, finalExam];

export const examsById: Record<string, Exam> = {
  midterm: midtermExam,
  final: finalExam,
};

export { midtermExam, finalExam };
