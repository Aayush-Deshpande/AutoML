import { motion } from "framer-motion";
import { Trophy, Clock } from "lucide-react";
import {
  formatScore,
  formatTime,
  formatMetric,
  getPrimaryMetricLabel,
  METRIC_LABELS,
  getMetricEntries,
} from "@/utils";
import type { BestModel, MLTask } from "@/types";

// ============================================================
// BestModelCard — featured hero card for the winning model
// Backend: best_model.{ model_name, score, metrics, training_time }
// Primary metric: r2 (regression), f1 (classification)
// ============================================================

interface BestModelCardProps {
  bestModel: BestModel;
  task: MLTask;
}

export function BestModelCard({ bestModel, task }: BestModelCardProps) {
  const metricEntries = getMetricEntries(bestModel.metrics);

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      aria-labelledby="best-model-heading"
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] overflow-hidden"
    >
      {/* Header strip */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <Trophy size={13} className="text-[var(--color-gold)]" aria-hidden="true" />
        <span className="text-[11px] font-semibold text-[var(--color-text-3)] uppercase tracking-wider">
          Best Model
        </span>
      </div>

      <div className="px-5 py-5">
        {/* Model name + primary score */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3
              id="best-model-heading"
              className="text-[22px] font-bold text-[var(--color-text-1)] tracking-tight"
            >
              {bestModel.model_name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Clock size={11} className="text-[var(--color-text-4)]" aria-hidden="true" />
              <span className="text-[11px] text-[var(--color-text-3)] font-mono">
                {formatTime(bestModel.training_time)} training time
              </span>
            </div>
          </div>

          {/* Primary score — the number that matters most */}
          <div className="text-right shrink-0">
            <p className="text-[11px] text-[var(--color-text-3)] uppercase tracking-wider">
              {getPrimaryMetricLabel(task)}
            </p>
            <p className="text-[32px] font-bold font-mono text-[var(--color-accent)] leading-none mt-1">
              {formatScore(bestModel.score, task)}
            </p>
          </div>
        </div>

        {/* All metrics */}
        <div className="grid grid-cols-2 gap-px bg-[var(--color-border)] rounded-lg overflow-hidden border border-[var(--color-border)] mt-5">
          {metricEntries.map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--color-bg-elevated)]"
            >
              <span className="text-[11px] text-[var(--color-text-3)]">
                {METRIC_LABELS[key] ?? key}
              </span>
              <span className="text-[12px] font-semibold font-mono text-[var(--color-text-1)]">
                {formatMetric(key, value as number | null)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
