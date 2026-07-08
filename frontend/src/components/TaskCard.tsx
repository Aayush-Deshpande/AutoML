import { motion } from "framer-motion";
import { Target, Zap } from "lucide-react";
import { getTaskLabel, getTaskColor } from "@/utils";
import type { MLTask } from "@/types";

// ============================================================
// TaskCard — shows detected target column + ML task type
// Backend: target_column (str), task (MLTask)
// ============================================================

interface TaskCardProps {
  targetColumn: string;
  task: MLTask;
}

export function TaskCard({ targetColumn, task }: TaskCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      aria-labelledby="task-heading"
      className="flex items-center gap-6 px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
    >
      {/* Target column */}
      <div className="flex items-center gap-2 min-w-0">
        <Target size={13} className="text-[var(--color-text-4)] shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-[11px] text-[var(--color-text-3)]">Target column</p>
          <p className="text-[13px] font-semibold font-mono text-[var(--color-text-1)] truncate mt-0.5">
            {targetColumn}
          </p>
        </div>
      </div>

      <div className="w-px h-7 bg-[var(--color-border)] shrink-0" aria-hidden="true" />

      {/* Task type */}
      <div className="flex items-center gap-2">
        <Zap size={13} className="text-[var(--color-text-4)] shrink-0" aria-hidden="true" />
        <div>
          <p className="text-[11px] text-[var(--color-text-3)]">Task type</p>
          <div className="mt-0.5">
            <span
              id="task-heading"
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${getTaskColor(task)}`}
            >
              {getTaskLabel(task)}
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
