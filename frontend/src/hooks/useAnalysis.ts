import { useState, useCallback } from "react";
import { analyzeDataset } from "@/services/api";
import type { AnalysisState, AnalysisResults } from "@/types";

// ============================================================
// useAnalysis — manages the full upload → analyze → results flow
// Single source of truth for analysis state
// ============================================================

interface UseAnalysisReturn {
  state: AnalysisState;
  uploadProgress: number;
  run: (file: File, targetColumn?: string | null) => Promise<void>;
  reset: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
  const [state, setState] = useState<AnalysisState>({
    status: "idle",
    results: null,
    error: null,
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  const run = useCallback(
    async (file: File, targetColumn?: string | null) => {
      setState({ status: "uploading", results: null, error: null });
      setUploadProgress(0);

      try {
        const response = await analyzeDataset({
          file,
          targetColumn,
          onUploadProgress: (percentage) => {
            setUploadProgress(percentage);
            // Once upload is 100%, switch to "analyzing"
            if (percentage >= 100) {
              setState((prev) => ({ ...prev, status: "analyzing" }));
            }
          },
        });

        const results: AnalysisResults = response.results;

        setState({
          status: "success",
          results,
          error: null,
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";

        setState({
          status: "error",
          results: null,
          error: message,
        });
      } finally {
        setUploadProgress(0);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ status: "idle", results: null, error: null });
    setUploadProgress(0);
  }, []);

  return { state, uploadProgress, run, reset };
}
