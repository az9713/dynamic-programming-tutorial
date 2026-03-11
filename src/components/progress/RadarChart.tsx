"use client";

import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { DPCategory } from "@/lib/dp-engine/types";

type SkillScores = Record<DPCategory, number>;

interface Props {
  skillScores: SkillScores;
  dark: boolean;
}

const CATEGORY_LABELS: Record<DPCategory, string> = {
  "Linear DP": "Linear",
  "Choice DP": "Choice",
  "2D DP": "2D",
  "String DP": "String",
  "Interval DP": "Interval",
  "Grid DP": "Grid",
  "LIS-style": "LIS",
};

export function RadarChart({ skillScores, dark }: Props) {
  const data = (Object.keys(CATEGORY_LABELS) as DPCategory[]).map((cat) => ({
    subject: CATEGORY_LABELS[cat],
    score: skillScores[cat] ?? 0,
    fullMark: 100,
  }));

  const stroke = "#e8590c";
  const fill = "rgba(232,89,12,0.15)";
  const gridColor = dark ? "rgba(226,232,240,0.08)" : "rgba(26,26,46,0.08)";
  const tickColor = dark ? "rgba(226,232,240,0.4)" : "rgba(26,26,46,0.45)";

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RechartsRadar data={data}>
        <PolarGrid stroke={gridColor} />
        <PolarAngleAxis
          dataKey="subject"
          tick={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fill: tickColor,
          }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={false}
          axisLine={false}
        />
        <Radar
          name="Skill"
          dataKey="score"
          stroke={stroke}
          fill={fill}
          strokeWidth={2}
          dot={{ fill: stroke, r: 3 }}
        />
        <Tooltip
          contentStyle={{
            background: dark ? "#1e293b" : "#ffffff",
            border: dark
              ? "1px solid rgba(226,232,240,0.08)"
              : "1px solid rgba(26,26,46,0.08)",
            borderRadius: "8px",
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: dark ? "#e2e8f0" : "#1a1a2e",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
          formatter={(val) => [`${val}%`, "Score"]}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
