import { useState } from "react";
import { ChevronDown, ChevronRight, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// FailedModelsCard — collapsed by default, expandable
// Backend: failed_models: Record<string, string> (model → error)
// Only shown if failed_models has entries
// ============================================================

interface FailedModelsCardProps {
  failedModels: Record<string, string>;
}

export function FailedModelsCard({ failedModels }: FailedModelsCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const entries = Object.entries(failedModels);

  if (entries.length === 0) return null;

  return (
    <section aria-labelledby="failed-models-heading">
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-controls="failed-models-list"
        className="flex items-center gap-2 w-full text-left"
      >
        {isOpen ? (
          <ChevronDown size={12} className="text-[var(--color-text-4)]" />
        ) : (
          <ChevronRight size={12} className="text-[var(--color-text-4)]" />
        )}
        <span
          id="failed-models-heading"
          className="text-[11px] font-semibold text-[var(--color-text-4)] uppercase tracking-wider"
        >
          {entries.length} model{entries.length !== 1 ? "s" : ""} failed to train
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="failed-models-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-lg overflow-hidden mt-2">
              {entries.map(([modelName, errorMsg]) => (
                <div key={modelName} className="flex items-start gap-3 px-4 py-3 bg-[var(--color-bg-elevated)]">
                  <XCircle
                    size={12}
                    className="text-[var(--color-error)] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-[var(--color-text-2)]">
                      {modelName}
                    </p>
                    <p className="text-[11px] text-[var(--color-text-4)] mt-0.5 truncate">
                      {errorMsg.split("\n")[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
