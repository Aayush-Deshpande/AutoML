import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, Trophy, Medal } from "lucide-react";
import {
  formatScore,
  formatTime,
  formatMetric,
  getPrimaryMetricLabel,
  METRIC_LABELS,
  getMetricEntries,
} from "@/utils";
import type { LeaderboardEntry, MLTask } from "@/types";

// ============================================================
// LeaderboardTable — sortable, searchable model comparison
// Backend: leaderboard[] = { model_name, score, metrics, training_time }
// Already sorted by primary metric descending from backend
// We add UI-level sorting + search on top
// ============================================================

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
  task: MLTask;
}

type SortKey = "rank" | "model_name" | "score" | "training_time";
type SortDir = "asc" | "desc";

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1)
    return <Trophy size={13} className="text-[var(--color-gold)]" aria-hidden="true" />;
  if (rank === 2)
    return <Medal size={13} className="text-[var(--color-silver)]" aria-hidden="true" />;
  if (rank === 3)
    return <Medal size={13} className="text-[var(--color-bronze)]" aria-hidden="true" />;
  return (
    <span className="text-[12px] font-mono text-[var(--color-text-4)]">{rank}</span>
  );
}

function SortIcon({
  column,
  sortKey,
  sortDir,
}: {
  column: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
}) {
  if (sortKey !== column)
    return <ChevronsUpDown size={11} className="text-[var(--color-text-4)]" />;
  return sortDir === "asc" ? (
    <ChevronUp size={11} className="text-[var(--color-accent)]" />
  ) : (
    <ChevronDown size={11} className="text-[var(--color-accent)]" />
  );
}

export function LeaderboardTable({ leaderboard, task }: LeaderboardTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [search, setSearch] = useState("");

  // Original rank (position in backend-sorted leaderboard)
  const originalRank = useMemo(() => {
    const map = new Map<string, number>();
    leaderboard.forEach((m, i) => map.set(m.model_name, i + 1));
    return map;
  }, [leaderboard]);

  // Metric keys for the table columns — derived from first entry, excluding primary metric key
  const metricKeys = useMemo(() => {
    if (!leaderboard[0]) return [];
    const primaryKey = task === "regression" ? "r2" : "f1";
    return getMetricEntries(leaderboard[0].metrics)
      .map(([k]) => k)
      .filter((k) => k !== primaryKey);
  }, [leaderboard, task]);

  const sorted = useMemo(() => {
    let data = [...leaderboard].filter((m) =>
      m.model_name.toLowerCase().includes(search.toLowerCase())
    );

    data.sort((a, b) => {
      let valA: number | string;
      let valB: number | string;

      if (sortKey === "rank") {
        valA = originalRank.get(a.model_name) ?? 0;
        valB = originalRank.get(b.model_name) ?? 0;
      } else if (sortKey === "score") {
        valA = a.score;
        valB = b.score;
      } else if (sortKey === "training_time") {
        valA = a.training_time;
        valB = b.training_time;
      } else {
        valA = a.model_name;
        valB = b.model_name;
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortDir === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortDir === "asc"
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });

    return data;
  }, [leaderboard, sortKey, sortDir, search, originalRank]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const headerClass =
    "px-3 py-2 text-left text-[11px] font-semibold text-[var(--color-text-3)] uppercase tracking-wider whitespace-nowrap select-none cursor-pointer hover:text-[var(--color-text-1)] transition-colors";

  return (
    <section aria-labelledby="leaderboard-heading">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2
          id="leaderboard-heading"
          className="text-[11px] font-semibold text-[var(--color-text-3)] uppercase tracking-wider"
        >
          Leaderboard — {getPrimaryMetricLabel(task)}
        </h2>
        <span className="text-[11px] text-[var(--color-text-4)]">
          {leaderboard.length} models
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search
          size={12}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-4)]"
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter models…"
          aria-label="Filter models"
          className="w-full h-8 pl-8 pr-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[12px] text-[var(--color-text-1)] placeholder:text-[var(--color-text-4)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" aria-label="Model leaderboard">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <th
                  scope="col"
                  className={headerClass}
                  onClick={() => toggleSort("rank")}
                  aria-sort={sortKey === "rank" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  <span className="flex items-center gap-1">
                    #
                    <SortIcon column="rank" sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
                <th
                  scope="col"
                  className={headerClass}
                  onClick={() => toggleSort("model_name")}
                  aria-sort={sortKey === "model_name" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  <span className="flex items-center gap-1">
                    Model
                    <SortIcon column="model_name" sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
                <th
                  scope="col"
                  className={headerClass}
                  onClick={() => toggleSort("score")}
                  aria-sort={sortKey === "score" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  <span className="flex items-center gap-1">
                    {getPrimaryMetricLabel(task)}
                    <SortIcon column="score" sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>

                {/* All metric columns */}
                {metricKeys.map((key) => (
                  <th scope="col" key={key} className={headerClass}>
                    {METRIC_LABELS[key] ?? key}
                  </th>
                ))}

                <th
                  scope="col"
                  className={headerClass}
                  onClick={() => toggleSort("training_time")}
                  aria-sort={sortKey === "training_time" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  <span className="flex items-center gap-1">
                    Time
                    <SortIcon column="training_time" sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={4 + metricKeys.length}
                    className="px-3 py-8 text-center text-[12px] text-[var(--color-text-4)]"
                  >
                    No models match your search.
                  </td>
                </tr>
              ) : (
                sorted.map((model, index) => {
                  const rank = originalRank.get(model.model_name) ?? index + 1;
                  const isWinner = rank === 1;

                  return (
                    <motion.tr
                      key={model.model_name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className={`border-b border-[var(--color-border)] last:border-0 transition-colors ${
                        isWinner
                          ? "bg-[var(--color-accent-muted)]"
                          : "bg-[var(--color-bg-elevated)] hover:bg-[var(--color-surface)]"
                      }`}
                    >
                      {/* Rank */}
                      <td className="w-10 px-3 py-2.5">
                        <div className="flex items-center justify-center w-6">
                          <RankIcon rank={rank} />
                        </div>
                      </td>

                      {/* Model name */}
                      <td className="px-3 py-2.5">
                        <span
                          className={`text-[13px] font-medium ${
                            isWinner
                              ? "text-[var(--color-text-1)]"
                              : "text-[var(--color-text-2)]"
                          }`}
                        >
                          {model.model_name}
                        </span>
                      </td>

                      {/* Primary score */}
                      <td className="px-3 py-2.5">
                        <span
                          className={`text-[13px] font-semibold font-mono ${
                            isWinner
                              ? "text-[var(--color-accent)]"
                              : "text-[var(--color-text-1)]"
                          }`}
                        >
                          {formatScore(model.score, task)}
                        </span>
                      </td>

                      {/* All metrics */}
                      {metricKeys.map((key) => {
                        const metricsDict = model.metrics as unknown as Record<string, number | null | undefined>;
                        const value = metricsDict[key];
                        return (
                          <td key={key} className="px-3 py-2.5">
                            <span className="text-[12px] font-mono text-[var(--color-text-2)]">
                              {formatMetric(key, value)}
                            </span>
                          </td>
                        );
                      })}

                      {/* Training time */}
                      <td className="px-3 py-2.5">
                        <span className="text-[12px] font-mono text-[var(--color-text-3)]">
                          {formatTime(model.training_time)}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
