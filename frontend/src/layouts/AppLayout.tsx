import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar.tsx";
import { Sidebar } from "@/components/Sidebar";

// ============================================================
// AppLayout — Application Shell
// Fixed sidebar (left) + fixed top navbar + scrollable content
// Matches: Linear, Vercel, Supabase layout pattern
// ============================================================

export function AppLayout() {
  return (
    <div className="flex h-screen bg-[var(--color-bg)] overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
