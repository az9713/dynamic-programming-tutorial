"use client";

import { motion } from "framer-motion";

interface Table2DProps {
  table: number[][];
  rowLabels?: string[];
  colLabels?: string[];
  /** Currently computing cell as [row, col], null if none */
  computing?: [number, number] | null;
  /** Cells on the backtrack/reconstruction path */
  backtrackPath?: [number, number][];
  className?: string;
}

export default function Table2D({
  table,
  rowLabels,
  colLabels,
  computing = null,
  backtrackPath = [],
  className = "",
}: Table2DProps) {
  // Build a fast lookup set using "row,col" string keys
  const backtrackSet = new Set(backtrackPath.map(([r, c]) => `${r},${c}`));

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="border-collapse">
        <thead>
          <tr>
            {/* Corner spacer */}
            <th className="w-8 h-8" />
            {table[0]?.map((_, colIdx) => (
              <th
                key={colIdx}
                className="w-12 h-8 text-xs font-mono text-ink-muted dark:text-text-dark-muted text-center"
              >
                {colLabels ? colLabels[colIdx] : colIdx}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {/* Row label */}
              <td className="w-8 text-xs font-mono text-ink-muted dark:text-text-dark-muted text-center pr-1">
                {rowLabels ? rowLabels[rowIdx] : rowIdx}
              </td>

              {row.map((value, colIdx) => {
                const isComputing =
                  computing !== null &&
                  computing[0] === rowIdx &&
                  computing[1] === colIdx;
                const isBacktrack = backtrackSet.has(`${rowIdx},${colIdx}`);
                const isDone = !isComputing && value !== 0;

                return (
                  <td key={colIdx} className="p-0.5">
                    <motion.div
                      layout
                      animate={{
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
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
