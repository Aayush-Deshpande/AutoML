import { motion } from "framer-motion";
import type { UploadStatus } from "@/types";

// ============================================================
// AnalysisLoader — shown during upload + analysis
// Inspired by: Linear's loading states — informative, not theatrical
// ============================================================

interface AnalysisLoaderProps {
  status: UploadStatus;
  uploadProgress: number;
}

// Pipeline steps that AutoML performs (mirrors backend pipeline.py)
const PIPELINE_STEPS = [
  { id: "load",       label: "Loading dataset",            phase: "uploading" },
  { id: "profile",    label: "Profiling columns",          phase: "analyzing" },
  { id: "detect",     label: "Detecting target & task",    phase: "analyzing" },
  { id: "clean",      label: "Cleaning data",              phase: "analyzing" },
  { id: "preprocess", label: "Preprocessing features",     phase: "analyzing" },
  { id: "train",      label: "Training models",            phase: "analyzing" },
  { id: "evaluate",   label: "Evaluating & ranking",       phase: "analyzing" },
  { id: "export",     label: "Exporting artifacts",        phase: "analyzing" },
] as const;

export function AnalysisLoader({ status, uploadProgress }: AnalysisLoaderProps) {
  const isUploading = status === "uploading";
  const isAnalyzing = status === "analyzing";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-6 py-8"
    >
      {/* Status heading */}
      <div>
        <p className="text-[13px] font-semibold text-[var(--color-text-1)]">
          {isUploading ? "Uploading dataset…" : "Running AutoML pipeline…"}
        </p>
        <p className="text-[12px] text-[var(--color-text-3)] mt-0.5">
          {isUploading
            ? "Sending your file to the server"
            : "Training and evaluating all models. This may take a few minutes."}
        </p>
      </div>

      {/* Upload progress bar */}
      {isUploading && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-[var(--color-text-3)]">Upload progress</span>
            <span className="text-[11px] font-mono text-[var(--color-text-2)]">
              {uploadProgress}%
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-[var(--color-surface-3)] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[var(--color-accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>
        </div>
      )}

      {/* Pipeline steps */}
      <div className="flex flex-col gap-1">
        {PIPELINE_STEPS.map((step) => {
          // Upload step is done once we switch to analyzing
          const isDone = step.phase === "uploading" && isAnalyzing;
          // Analyzing steps pulse while analyzing is active
          const isInProgress =
            (step.phase === "uploading" && isUploading) ||
            (step.phase === "analyzing" && isAnalyzing);

          return (
            <div key={step.id} className="flex items-center gap-2.5 py-0.5">
              {/* Step indicator */}
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                {isDone ? (
                  <div className="w-3 h-3 rounded-full bg-[var(--color-success)] opacity-70" />
                ) : isInProgress ? (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[var(--color-accent)]"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-[var(--color-border-strong)]" />
                )}
              </div>

              <span
                className={
                  isDone
                    ? "text-[12px] text-[var(--color-text-3)] line-through"
                    : isInProgress
                    ? "text-[12px] text-[var(--color-text-1)]"
                    : "text-[12px] text-[var(--color-text-3)]"
                }
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Skeleton preview — shows while analyzing */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-2 pt-2"
        >
          <p className="text-[11px] text-[var(--color-text-4)] uppercase tracking-wider">
            Results preview
          </p>
          <div className="skeleton h-20 rounded-lg" />
          <div className="grid grid-cols-3 gap-2">
            <div className="skeleton h-12 rounded" />
            <div className="skeleton h-12 rounded" />
            <div className="skeleton h-12 rounded" />
          </div>
          <div className="skeleton h-32 rounded-lg" />
        </motion.div>
      )}
    </motion.div>
  );
}
