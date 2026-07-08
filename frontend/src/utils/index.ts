import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { MLTask, ModelMetrics } from "@/types";

// ============================================================
// cn — className merge utility (shadcn/ui standard)
// ============================================================

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============================================================
// Memory formatting
// Backend returns memory_usage_bytes as integer
// ============================================================

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ============================================================
// Training time formatting
// Backend returns training_time as float seconds
// ============================================================

export function formatTime(seconds: number): string {
  if (seconds < 0.001) return "<1ms";
  if (seconds < 1) return `${(seconds * 1000).toFixed(0)}ms`;
  if (seconds < 60) return `${seconds.toFixed(2)}s`;
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(0);
  return `${m}m ${s}s`;
}

// ============================================================
// Score formatting
// Primary metric: r2 for regression, f1 for classification
// ============================================================

export function formatScore(score: number, task: MLTask): string {
  if (task === "regression") {
    // R² can be negative; show 4 decimal places
    return score.toFixed(4);
  }
  // Classification: show as percentage
  return `${(score * 100).toFixed(2)}%`;
}

// ============================================================
// Task display names
// ============================================================

export function getTaskLabel(task: MLTask): string {
  const labels: Record<MLTask, string> = {
    regression: "Regression",
    binary_classification: "Binary Classification",
    multiclass_classification: "Multiclass Classification",
  };
  return labels[task];
}

// ============================================================
// Primary metric name per task
// ============================================================

export function getPrimaryMetricLabel(task: MLTask): string {
  return task === "regression" ? "R²" : "F1 Score";
}

// ============================================================
// Format individual metric values for display
// ============================================================

export function formatMetric(key: string, value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  // R2 can be negative; don't format as percentage
  if (key === "r2") return value.toFixed(4);
  // MAE, MSE, RMSE are raw values
  if (key === "mae" || key === "mse" || key === "rmse") {
    if (Math.abs(value) < 0.01) return value.toExponential(3);
    return value.toFixed(4);
  }
  // All classification metrics are 0–1 → show as %
  return `${(value * 100).toFixed(2)}%`;
}

// ============================================================
// Get all metric entries from a metrics object as sorted pairs
// ============================================================

export function getMetricEntries(metrics: ModelMetrics): [string, number | null][] {
  return Object.entries(metrics) as [string, number | null][];
}

// ============================================================
// Metric display label map
// ============================================================

export const METRIC_LABELS: Record<string, string> = {
  r2: "R²",
  mae: "MAE",
  mse: "MSE",
  rmse: "RMSE",
  accuracy: "Accuracy",
  precision: "Precision",
  recall: "Recall",
  f1: "F1 Score",
  roc_auc: "ROC AUC",
};

// ============================================================
// File name extraction from path string
// "outputs/abc/best_model.pkl" → "best_model.pkl"
// ============================================================

export function getFilename(filePath: string): string {
  return filePath.split("/").pop() ?? filePath;
}

// ============================================================
// Task badge color
// ============================================================

export function getTaskColor(task: MLTask): string {
  const colors: Record<MLTask, string> = {
    regression: "text-blue-400 bg-blue-400/10",
    binary_classification: "text-green-400 bg-green-400/10",
    multiclass_classification: "text-purple-400 bg-purple-400/10",
  };
  return colors[task];
}
