import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

// ============================================================
// ErrorAlert — graceful error display
// Never exposes raw Python tracebacks (backend returns detail str)
// ============================================================

interface ErrorAlertProps {
  error: string;
  onDismiss?: () => void;
}

export function ErrorAlert({ error, onDismiss }: ErrorAlertProps) {
  // Sanitize error — strip any stack trace lines
  const sanitized = error
    .split("\n")[0] // Only first line
    .replace(/File ".*?", line \d+/g, "") // Strip Python paths
    .trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-3 px-4 py-3 rounded-lg border border-[var(--color-error)]/25 bg-[var(--color-error-muted)]"
    >
      <AlertTriangle
        size={14}
        className="text-[var(--color-error)] shrink-0 mt-0.5"
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[var(--color-error)]">
          Analysis failed
        </p>
        <p className="text-[12px] text-[var(--color-text-2)] mt-0.5 break-words">
          {sanitized || "An unexpected error occurred. Please try again."}
        </p>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="flex items-center justify-center w-5 h-5 rounded text-[var(--color-text-3)] hover:text-[var(--color-text-1)] hover:bg-[var(--color-error)]/20 transition-colors shrink-0"
        >
          <X size={12} />
        </button>
      )}
    </motion.div>
  );
}
