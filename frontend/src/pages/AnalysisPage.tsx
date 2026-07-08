import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronRight } from "lucide-react";

import { useAnalysis } from "@/hooks/useAnalysis";
import { UploadZone } from "@/components/UploadZone";
import { AnalysisLoader } from "@/components/AnalysisLoader";
import { ErrorAlert } from "@/components/ErrorAlert";
import { DatasetSummary } from "@/components/DatasetSummary";
import { CleaningReport } from "@/components/CleaningReport";
import { TaskCard } from "@/components/TaskCard";
import { BestModelCard } from "@/components/BestModelCard";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { DownloadSection } from "@/components/DownloadSection";
import { FailedModelsCard } from "@/components/FailedModelsCard";

// ============================================================
// AnalysisPage — main product page
// Flow: Upload → Loading → Results Dashboard
// ============================================================

export function AnalysisPage() {
  const { state, uploadProgress, run, reset } = useAnalysis();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetColumn, setTargetColumn] = useState<string>("");

  const isActive =
    state.status === "uploading" || state.status === "analyzing";
  const hasResults = state.status === "success" && state.results !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || isActive) return;
    await run(selectedFile, targetColumn || null);
  };

  const handleReset = () => {
    reset();
    setSelectedFile(null);
    setTargetColumn("");
  };

  return (
    <div className="min-h-full p-6 max-w-[1280px] mx-auto">
      <AnimatePresence mode="wait">
        {/* ─── UPLOAD FORM ─── */}
        {!hasResults && (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="max-w-[560px]"
          >
            <div className="mb-6">
              <h2 className="text-[15px] font-semibold text-[var(--color-text-1)]">
                Upload Dataset
              </h2>
              <p className="text-[12px] text-[var(--color-text-3)] mt-1">
                Upload a CSV file and AutoML will automatically detect the task,
                train models, and rank them by performance.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-4">
                {/* File upload */}
                <UploadZone
                  onFileSelect={setSelectedFile}
                  disabled={isActive}
                  selectedFile={selectedFile}
                  onClear={() => setSelectedFile(null)}
                />

                {/* Target column — optional */}
                <div>
                  <label
                    htmlFor="target-column"
                    className="block text-[12px] font-medium text-[var(--color-text-2)] mb-1.5"
                  >
                    Target column
                    <span className="ml-1.5 text-[var(--color-text-4)] font-normal">
                      (optional — auto-detected if blank)
                    </span>
                  </label>
                  <input
                    id="target-column"
                    type="text"
                    value={targetColumn}
                    onChange={(e) => setTargetColumn(e.target.value)}
                    placeholder="e.g. Survived, price, label"
                    disabled={isActive}
                    className="w-full h-9 px-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[13px] text-[var(--color-text-1)] placeholder:text-[var(--color-text-4)] focus:outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-50"
                    aria-describedby="target-column-hint"
                  />
                  <p id="target-column-hint" className="text-[11px] text-[var(--color-text-4)] mt-1">
                    If left blank, the backend will score and auto-detect the best target column.
                  </p>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {state.status === "error" && state.error && (
                    <ErrorAlert
                      error={state.error}
                      onDismiss={reset}
                    />
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!selectedFile || isActive}
                  className="flex items-center justify-center gap-2 h-9 px-4 rounded bg-[var(--color-accent)] text-white text-[13px] font-semibold hover:bg-[var(--color-accent-dim)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-busy={isActive}
                >
                  {isActive ? (
                    <>
                      <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" aria-hidden="true" />
                      {state.status === "uploading" ? "Uploading…" : "Analyzing…"}
                    </>
                  ) : (
                    <>
                      Run AutoML
                      <ChevronRight size={13} aria-hidden="true" />
                    </>
                  )}
                </button>

                {/* Loading state */}
                <AnimatePresence>
                  {isActive && (
                    <AnalysisLoader
                      status={state.status}
                      uploadProgress={uploadProgress}
                    />
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>
        )}

        {/* ─── RESULTS DASHBOARD ─── */}
        {hasResults && state.results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[15px] font-semibold text-[var(--color-text-1)]">
                  Analysis Complete
                </h2>
                <p className="text-[12px] text-[var(--color-text-3)] mt-0.5">
                  {selectedFile?.name} · {state.results.leaderboard.length} models trained
                </p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 h-8 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[12px] text-[var(--color-text-2)] hover:text-[var(--color-text-1)] hover:border-[var(--color-border-strong)] transition-colors"
                aria-label="Start a new analysis"
              >
                <RotateCcw size={12} aria-hidden="true" />
                New analysis
              </button>
            </div>

            {/* ─── Main dashboard grid ─── */}
            <div className="flex flex-col gap-6">
              {/* Row 1: Task info */}
              <TaskCard
                targetColumn={state.results.target_column}
                task={state.results.task}
              />

              {/* Row 2: Dataset summary + Cleaning report — side by side */}
              <div className="grid grid-cols-[1fr_320px] gap-6">
                <DatasetSummary metadata={state.results.metadata} />
                <CleaningReport report={state.results.cleaning_report} />
              </div>

              {/* Row 3: Best model + Downloads — side by side */}
              <div className="grid grid-cols-[1fr_280px] gap-6">
                <BestModelCard
                  bestModel={state.results.best_model}
                  task={state.results.task}
                />
                <DownloadSection exportedFiles={state.results.exported_files} />
              </div>

              {/* Row 4: Leaderboard — full width */}
              <LeaderboardTable
                leaderboard={state.results.leaderboard}
                task={state.results.task}
              />

              {/* Row 5: Failed models — collapsed by default */}
              {Object.keys(state.results.failed_models).length > 0 && (
                <FailedModelsCard failedModels={state.results.failed_models} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
