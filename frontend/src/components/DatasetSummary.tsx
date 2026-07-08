import { motion } from "framer-motion";
import {
  Rows,
  Columns,
  HardDrive,
  Hash,
  Type,
  ToggleLeft,
  Calendar,
} from "lucide-react";
import { formatBytes } from "@/utils";
import type { DatasetMetadata } from "@/types";

// ============================================================
// DatasetSummary — displays metadata from DatasetLoader
// Mirrors: metadata.total_rows, total_columns, memory_usage_bytes,
//          numeric_columns, categorical_columns, boolean_columns,
//          datetime_columns
// ============================================================

interface DatasetSummaryProps {
  metadata: DatasetMetadata;
}

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ElementType;
  muted?: boolean;
}

export function DatasetSummary({ metadata }: DatasetSummaryProps) {
  const stats: StatItem[] = [
    {
      label: "Rows",
      value: metadata.total_rows.toLocaleString(),
      icon: Rows,
    },
    {
      label: "Columns",
      value: metadata.total_columns,
      icon: Columns,
    },
    {
      label: "Memory",
      value: formatBytes(metadata.memory_usage_bytes),
      icon: HardDrive,
    },
    {
      label: "Numeric",
      value: metadata.numeric_columns.length,
      icon: Hash,
      muted: metadata.numeric_columns.length === 0,
    },
    {
      label: "Categorical",
      value: metadata.categorical_columns.length,
      icon: Type,
      muted: metadata.categorical_columns.length === 0,
    },
    {
      label: "Boolean",
      value: metadata.boolean_columns.length,
      icon: ToggleLeft,
      muted: metadata.boolean_columns.length === 0,
    },
    {
      label: "Datetime",
      value: metadata.datetime_columns.length,
      icon: Calendar,
      muted: metadata.datetime_columns.length === 0,
    },
  ];

  return (
    <section aria-labelledby="dataset-summary-heading">
      <h2
        id="dataset-summary-heading"
        className="text-[11px] font-semibold text-[var(--color-text-3)] uppercase tracking-wider mb-3"
      >
        Dataset
      </h2>

      <div className="grid grid-cols-4 gap-px bg-[var(--color-border)] rounded-lg overflow-hidden border border-[var(--color-border)]">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.04 }}
            className="flex flex-col gap-2 px-4 py-3 bg-[var(--color-bg-elevated)]"
          >
            <div className="flex items-center gap-1.5">
              <stat.icon
                size={11}
                className="text-[var(--color-text-4)]"
                aria-hidden="true"
              />
              <span className="text-[11px] text-[var(--color-text-3)]">
                {stat.label}
              </span>
            </div>
            <span
              className={`text-[18px] font-semibold font-mono tracking-tight ${
                stat.muted
                  ? "text-[var(--color-text-4)]"
                  : "text-[var(--color-text-1)]"
              }`}
            >
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
