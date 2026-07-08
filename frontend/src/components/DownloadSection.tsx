import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  BrainCircuit,
  Workflow,
  FileJson,
  BarChart3,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { downloadFile } from "@/services/api";
import { getFilename } from "@/utils";
import type { ExportedFiles } from "@/types";

// ============================================================
// DownloadSection — download buttons for backend artifacts
// exported_files: { model_path, preprocessing_pipeline_path,
//                   metadata_path, leaderboard_path }
// All paths are relative to backend CWD, e.g. "outputs/uuid/best_model.pkl"
// ============================================================

interface DownloadSectionProps {
  exportedFiles: ExportedFiles;
}

interface DownloadItem {
  key: keyof ExportedFiles;
  label: string;
  description: string;
  icon: React.ElementType;
  filename: string;
}

const DOWNLOAD_ITEMS: DownloadItem[] = [
  {
    key: "model_path",
    label: "Best Model",
    description: "Trained model (.pkl)",
    icon: BrainCircuit,
    filename: "best_model.pkl",
  },
  {
    key: "preprocessing_pipeline_path",
    label: "Preprocessor",
    description: "Feature pipeline (.pkl)",
    icon: Workflow,
    filename: "preprocessing_pipeline.pkl",
  },
  {
    key: "metadata_path",
    label: "Metadata",
    description: "Dataset statistics (.json)",
    icon: FileJson,
    filename: "metadata.json",
  },
  {
    key: "leaderboard_path",
    label: "Leaderboard",
    description: "All model results (.json)",
    icon: BarChart3,
    filename: "leaderboard.json",
  },
];

type DownloadState = "idle" | "loading" | "done" | "error";

export function DownloadSection({ exportedFiles }: DownloadSectionProps) {
  const [states, setStates] = useState<Record<string, DownloadState>>({});

  const handleDownload = async (item: DownloadItem) => {
    const filePath = exportedFiles[item.key];
    if (!filePath) return;

    setStates((prev) => ({ ...prev, [item.key]: "loading" }));

    try {
      await downloadFile(filePath, getFilename(filePath) ?? item.filename);
      setStates((prev) => ({ ...prev, [item.key]: "done" }));
      // Reset after 2s
      setTimeout(() => {
        setStates((prev) => ({ ...prev, [item.key]: "idle" }));
      }, 2000);
    } catch {
      setStates((prev) => ({ ...prev, [item.key]: "error" }));
    }
  };

  return (
    <section aria-labelledby="downloads-heading">
      <h2
        id="downloads-heading"
        className="text-[11px] font-semibold text-[var(--color-text-3)] uppercase tracking-wider mb-3"
      >
        Downloads
      </h2>

      <div className="grid grid-cols-2 gap-2">
        {DOWNLOAD_ITEMS.map((item, index) => {
          const filePath = exportedFiles[item.key];
          const state = states[item.key] ?? "idle";
          const isAvailable = Boolean(filePath);

          return (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              onClick={() => handleDownload(item)}
              disabled={!isAvailable || state === "loading"}
              aria-label={`Download ${item.label}`}
              className="flex items-center gap-3 px-3.5 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-left hover:bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] transition-all duration-100 disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-7 h-7 rounded bg-[var(--color-surface-2)] shrink-0 group-hover:bg-[var(--color-surface-3)] transition-colors">
                <item.icon
                  size={13}
                  className="text-[var(--color-text-2)]"
                  aria-hidden="true"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-[var(--color-text-1)]">
                  {item.label}
                </p>
                <p className="text-[11px] text-[var(--color-text-3)] truncate">
                  {item.description}
                </p>
              </div>

              {/* State indicator */}
              <div className="shrink-0">
                {state === "loading" ? (
                  <Loader2
                    size={13}
                    className="text-[var(--color-accent)] animate-spin"
                    aria-hidden="true"
                  />
                ) : state === "done" ? (
                  <CheckCircle2
                    size={13}
                    className="text-[var(--color-success)]"
                    aria-hidden="true"
                  />
                ) : (
                  <Download
                    size={13}
                    className="text-[var(--color-text-4)] group-hover:text-[var(--color-text-2)] transition-colors"
                    aria-hidden="true"
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
