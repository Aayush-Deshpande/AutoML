import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// ============================================================
// NotFoundPage — 404 page
// ============================================================

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 text-center">
      <p className="text-[11px] font-mono text-[var(--color-text-4)] uppercase tracking-widest mb-3">
        404
      </p>
      <h1 className="text-[20px] font-bold text-[var(--color-text-1)] tracking-tight">
        Page not found
      </h1>
      <p className="text-[13px] text-[var(--color-text-3)] mt-2 max-w-[320px]">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 mt-6 px-4 h-8 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[12px] text-[var(--color-text-2)] hover:text-[var(--color-text-1)] hover:border-[var(--color-border-strong)] transition-colors"
      >
        <ArrowLeft size={12} aria-hidden="true" />
        Back to overview
      </Link>
    </div>
  );
}
