import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { cn, formatBytes } from "@/utils";

// ============================================================
// UploadZone — drag-and-drop + browse CSV upload
// Validates: .csv only, not empty
// Sends to parent via onFileSelect
// ============================================================

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  selectedFile: File | null;
  onClear: () => void;
}

const ACCEPTED_TYPES = [".csv", "text/csv", "application/csv"];

function validateFile(file: File): string | null {
  if (!file.name.toLowerCase().endsWith(".csv")) {
    return "Only CSV files are supported.";
  }
  if (file.size === 0) {
    return "The file is empty.";
  }
  if (file.size > 500 * 1024 * 1024) {
    return "File is too large. Maximum size is 500MB.";
  }
  return null;
}

export function UploadZone({
  onFileSelect,
  disabled = false,
  selectedFile,
  onClear,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        return;
      }
      setValidationError(null);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // Reset input so same file can be re-selected
      e.target.value = "";
    },
    [handleFile]
  );

  const handleClear = () => {
    setValidationError(null);
    onClear();
  };

  // --- File selected state ---
  if (selectedFile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface)]"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded bg-[var(--color-accent-muted)] shrink-0">
          <FileText size={14} className="text-[var(--color-accent)]" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-[var(--color-text-1)] truncate">
            {selectedFile.name}
          </p>
          <p className="text-[11px] text-[var(--color-text-3)] mt-0.5">
            {formatBytes(selectedFile.size)}
          </p>
        </div>

        {!disabled && (
          <button
            onClick={handleClear}
            className="flex items-center justify-center w-6 h-6 rounded text-[var(--color-text-3)] hover:text-[var(--color-text-1)] hover:bg-[var(--color-surface-2)] transition-colors"
            aria-label="Remove file"
          >
            <X size={13} />
          </button>
        )}
      </motion.div>
    );
  }

  // --- Drop zone state ---
  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload CSV file"
        aria-disabled={disabled}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            inputRef.current?.click();
          }
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 px-6 py-10 rounded-lg border border-dashed transition-all duration-150 cursor-pointer",
          isDragging
            ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)]"
            : "border-[var(--color-border-strong)] bg-[var(--color-surface)] hover:border-[var(--color-text-4)] hover:bg-[var(--color-surface-2)]",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <AnimatePresence mode="wait">
          {isDragging ? (
            <motion.div
              key="dragging"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <Upload size={20} className="text-[var(--color-accent)]" />
              <p className="text-[13px] font-medium text-[var(--color-accent)]">
                Drop to upload
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-2)]">
                <Upload size={16} className="text-[var(--color-text-2)]" />
              </div>
              <div className="text-center">
                <p className="text-[13px] text-[var(--color-text-1)]">
                  <span className="font-medium">Browse files</span>
                  <span className="text-[var(--color-text-3)]"> or drag and drop</span>
                </p>
                <p className="text-[11px] text-[var(--color-text-3)] mt-0.5">
                  CSV files only
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleInputChange}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          disabled={disabled}
        />
      </div>

      {/* Validation error */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 mt-2 px-3 py-2 rounded bg-[var(--color-error-muted)] border border-[var(--color-error)]/20"
          >
            <AlertCircle size={12} className="text-[var(--color-error)] shrink-0" />
            <p className="text-[12px] text-[var(--color-error)]">{validationError}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
