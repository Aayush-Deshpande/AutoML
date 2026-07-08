import { NavLink } from "react-router-dom";
import { LayoutDashboard, FlaskConical, GitBranch } from "lucide-react";
import { cn } from "@/utils";

// ============================================================
// Sidebar — fixed left navigation
// Minimal, like Linear/Vercel — logo + nav items + footer
// ============================================================

const NAV_ITEMS = [
  {
    to: "/",
    icon: LayoutDashboard,
    label: "Overview",
    end: true,
  },
  {
    to: "/analyze",
    icon: FlaskConical,
    label: "Analyze",
    end: false,
  },
] as const;

export function Sidebar() {
  return (
    <aside className="flex flex-col w-[220px] shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 h-[52px] px-4 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-center w-6 h-6 rounded bg-[var(--color-accent)] shrink-0">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 10L6 2L10 10M3.5 7.5H8.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-[13px] font-semibold text-[var(--color-text-1)] tracking-tight">
          AutoML
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 p-2 flex-1" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-2.5 py-1.5 rounded text-[13px] transition-colors duration-100",
                isActive
                  ? "bg-[var(--color-surface-2)] text-[var(--color-text-1)] font-medium"
                  : "text-[var(--color-text-2)] hover:text-[var(--color-text-1)] hover:bg-[var(--color-surface)]"
              )
            }
          >
            <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-[var(--color-border)]">
        <a
          href="https://github.com/Aayush-Deshpande/AutoML"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded text-[13px] text-[var(--color-text-3)] hover:text-[var(--color-text-2)] hover:bg-[var(--color-surface)] transition-colors duration-100"
        >
          <GitBranch size={14} strokeWidth={1.75} aria-hidden="true" />
          GitHub
        </a>
      </div>
    </aside>
  );
}
