import { useLocation } from "react-router-dom";

// ============================================================
// Navbar — top bar showing current section + breadcrumb
// Thin, informational, like Vercel/Linear top bar
// ============================================================

const ROUTE_LABELS: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Overview",
    description: "AutoML Platform",
  },
  "/analyze": {
    title: "Analyze",
    description: "Upload a dataset and run automated machine learning",
  },
};

export function Navbar() {
  const { pathname } = useLocation();
  const route = ROUTE_LABELS[pathname] ?? {
    title: "AutoML",
    description: "",
  };

  return (
    <header className="flex items-center h-[52px] px-5 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] shrink-0">
      <div className="flex flex-col justify-center">
        <h1 className="text-[13px] font-semibold text-[var(--color-text-1)] leading-none">
          {route.title}
        </h1>
        {route.description && (
          <p className="text-[11px] text-[var(--color-text-3)] mt-0.5 leading-none">
            {route.description}
          </p>
        )}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" aria-hidden="true" />
          <span className="text-[11px] text-[var(--color-text-3)]">
            Backend ready
          </span>
        </div>
      </div>
    </header>
  );
}
