import { motion } from "framer-motion";
import { Trash2, MinusSquare, Tag, Layers } from "lucide-react";
import type { CleaningReport as CleaningReportType } from "@/types";

// ============================================================
// CleaningReport — displays DataCleaner results
// Mirrors: cleaning_report.duplicates_removed,
//          constant_columns_removed, id_columns_removed,
//          total_columns_removed
// ============================================================

interface CleaningReportProps {
  report: CleaningReportType;
}

export function CleaningReport({ report }: CleaningReportProps) {
  const items = [
    {
      label: "Duplicates removed",
      value: report.duplicates_removed,
      icon: Trash2,
      description:
        report.duplicates_removed > 0
          ? `${report.original_rows.toLocaleString()} → ${report.final_rows.toLocaleString()} rows`
          : "No duplicate rows found",
    },
    {
      label: "Constant columns",
      value: report.constant_columns_removed,
      icon: MinusSquare,
      description:
        report.constant_columns.length > 0
          ? report.constant_columns.join(", ")
          : "None removed",
    },
    {
      label: "ID columns",
      value: report.id_columns_removed,
      icon: Tag,
      description:
        report.id_columns.length > 0
          ? report.id_columns.join(", ")
          : "None removed",
    },
    {
      label: "Total columns removed",
      value: report.total_columns_removed,
      icon: Layers,
      description: "Constant + ID columns",
      accent: report.total_columns_removed > 0,
    },
  ];

  return (
    <section aria-labelledby="cleaning-report-heading">
      <h2
        id="cleaning-report-heading"
        className="text-[11px] font-semibold text-[var(--color-text-3)] uppercase tracking-wider mb-3"
      >
        Cleaning Report
      </h2>

      <div className="flex flex-col divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-lg overflow-hidden">
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 px-4 py-3 bg-[var(--color-bg-elevated)]"
          >
            <item.icon
              size={13}
              className="text-[var(--color-text-4)] shrink-0"
              aria-hidden="true"
            />

            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-[var(--color-text-2)]">
                {item.label}
              </p>
              {item.description && (
                <p className="text-[11px] text-[var(--color-text-4)] truncate mt-0.5">
                  {item.description}
                </p>
              )}
            </div>

            <span
              className={`text-[14px] font-semibold font-mono shrink-0 ${
                item.accent && item.value > 0
                  ? "text-[var(--color-warning)]"
                  : item.value > 0
                  ? "text-[var(--color-text-1)]"
                  : "text-[var(--color-text-4)]"
              }`}
            >
              {item.value}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
