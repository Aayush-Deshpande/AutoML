// ============================================================
// AutoML Backend — TypeScript Type Definitions
// Mirrors the exact response shape from POST /analyze
// ============================================================

// ----- Dataset Profile (nested inside metadata) -------------

export interface DatasetProfile {
  missing_values: Record<string, number>;
  missing_percentage: Record<string, number>;
  duplicate_rows: number;
  constant_columns: string[];
  unique_values: Record<string, number>;
  high_cardinality_columns: string[];
  id_columns: string[];
}

// ----- Dataset Metadata -----------------------------------------

export interface DatasetMetadata {
  total_rows: number;
  total_columns: number;
  column_names: string[];
  numeric_columns: string[];
  categorical_columns: string[];
  boolean_columns: string[];
  datetime_columns: string[];
  memory_usage_bytes: number;
  profile: DatasetProfile;
}

// ----- Cleaning Report ------------------------------------------

export interface CleaningReport {
  original_rows: number;
  final_rows: number;
  duplicates_removed: number;
  constant_columns: string[];
  id_columns: string[];
  constant_columns_removed: number;
  id_columns_removed: number;
  total_columns_removed: number;
}

// ----- Task Type ------------------------------------------------

export type MLTask =
  | "regression"
  | "binary_classification"
  | "multiclass_classification";

// ----- Metrics --------------------------------------------------

export interface RegressionMetrics {
  mae: number;
  mse: number;
  rmse: number;
  r2: number;
}

export interface ClassificationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc?: number | null;
}

export type ModelMetrics = RegressionMetrics | ClassificationMetrics;

// ----- Leaderboard Entry ----------------------------------------

export interface LeaderboardEntry {
  model_name: string;
  score: number;
  metrics: ModelMetrics;
  training_time: number;
}

// ----- Best Model -----------------------------------------------

export interface BestModel {
  model_name: string;
  score: number;
  metrics: ModelMetrics;
  training_time: number;
}

// ----- Exported Files -------------------------------------------
// These are string paths relative to the backend server CWD
// e.g. "outputs/abc-123/best_model.pkl"

export interface ExportedFiles {
  model_path: string;
  preprocessing_pipeline_path: string;
  metadata_path: string;
  leaderboard_path: string;
}

// ----- Full Results Object (inside "results") -------------------

export interface AnalysisResults {
  metadata: DatasetMetadata;
  target_column: string;
  task: MLTask;
  cleaning_report: CleaningReport;
  leaderboard: LeaderboardEntry[];
  best_model: BestModel;
  failed_models: Record<string, string>;
  exported_files: ExportedFiles;
}

// ----- Top-Level API Response -----------------------------------

export interface AnalyzeResponse {
  status: "success";
  results: AnalysisResults;
}

// ----- Error Response (FastAPI HTTPException) -------------------

export interface APIError {
  detail: string;
}

// ----- UI State -------------------------------------------------

export type UploadStatus =
  | "idle"
  | "uploading"
  | "analyzing"
  | "success"
  | "error";

export interface AnalysisState {
  status: UploadStatus;
  results: AnalysisResults | null;
  error: string | null;
}

// ----- Type Guards ----------------------------------------------

export function isRegressionMetrics(
  metrics: ModelMetrics
): metrics is RegressionMetrics {
  return "r2" in metrics;
}

export function isClassificationMetrics(
  metrics: ModelMetrics
): metrics is ClassificationMetrics {
  return "accuracy" in metrics;
}

// ----- Utility --------------------------------------------------

export function getPrimaryMetricLabel(task: MLTask): string {
  return task === "regression" ? "R²" : "F1 Score";
}

export function formatMetricValue(value: number): string {
  return (value * 100).toFixed(2) + "%";
}

export function formatR2(value: number): string {
  return value.toFixed(4);
}
