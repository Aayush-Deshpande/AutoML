import axios, { AxiosError } from "axios";
import type { AnalyzeResponse, APIError } from "@/types";

// ============================================================
// Axios instance — all API calls go through here
// Proxy in vite.config.ts routes /analyze → localhost:8000
// ============================================================

const api = axios.create({
  baseURL: "/",
  timeout: 600_000, // 10 minutes — AutoML can take a long time
});

// ============================================================
// analyzeDataset
// POST /analyze
// multipart/form-data: { file: File, target_column?: string }
// ============================================================

export interface AnalyzeParams {
  file: File;
  targetColumn?: string | null;
  onUploadProgress?: (percentage: number) => void;
}

export async function analyzeDataset(
  params: AnalyzeParams
): Promise<AnalyzeResponse> {
  const { file, targetColumn, onUploadProgress } = params;

  const formData = new FormData();
  formData.append("file", file);

  // Only append target_column if user provided one
  // Backend accepts it as optional Form field
  if (targetColumn && targetColumn.trim() !== "") {
    formData.append("target_column", targetColumn.trim());
  }

  try {
    const response = await api.post<AnalyzeResponse>("/analyze", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentage);
        }
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // FastAPI error shape: { detail: string }
      const apiError = error.response?.data as APIError | undefined;
      const message =
        apiError?.detail ??
        error.message ??
        "An unexpected error occurred.";
      throw new Error(message);
    }
    throw error;
  }
}

// ============================================================
// downloadFile
// Triggers a browser download for backend-generated artifacts
// exported_files paths are relative to backend CWD
// e.g. "outputs/abc123/best_model.pkl"
// We serve them via /outputs/ proxy
// ============================================================

export function getDownloadUrl(filePath: string): string {
  // filePath arrives as "outputs/abc123/best_model.pkl"
  // Vite proxy will forward /outputs/... to FastAPI static files
  return `/${filePath}`;
}

export async function downloadFile(
  filePath: string,
  filename: string
): Promise<void> {
  const url = getDownloadUrl(filePath);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Download failed: ${response.statusText}`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(objectUrl);
}
