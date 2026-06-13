"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  History,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { JobAnalysisStatusBadge } from "@/components/job-analysis/JobAnalysisStatusBadge";
import { useJobAnalysisList } from "@/hooks/useJobAnalysis";
import {
  getFitScoreColor,
  getRecommendationStyle,
} from "@/lib/job-analysis-utils";
import type {
  JobAnalysisListItem,
  JobAnalysisProcessingStatus,
  JobAnalysisSortField,
  JobAnalysisSortOrder,
} from "@/types/job-analysis";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const STATUS_FILTER_OPTIONS: {
  value: string;
  label: string;
}[] = [
  { value: "all", label: "All statuses" },
  { value: "completed", label: "Completed" },
  { value: "processing", label: "Processing" },
  { value: "pending", label: "Queued" },
  { value: "failed", label: "Failed" },
];

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

function formatAnalysisDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

interface SortableHeaderProps {
  label: string;
  field: JobAnalysisSortField;
  sortBy: JobAnalysisSortField;
  sortOrder: JobAnalysisSortOrder;
  onSort: (field: JobAnalysisSortField) => void;
}

function SortableHeader({
  label,
  field,
  sortBy,
  sortOrder,
  onSort,
}: SortableHeaderProps) {
  const isActive = sortBy === field;
  const Icon = isActive
    ? sortOrder === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900 transition-colors"
      data-testid={`sort-${field}`}
    >
      {label}
      <Icon className={cn("w-3.5 h-3.5", isActive ? "text-blue-600" : "text-slate-400")} />
    </button>
  );
}

interface JobAnalysisHistoryTableProps {
  onSelect: (item: JobAnalysisListItem) => void;
  selectedId?: string | null;
}

export function JobAnalysisHistoryTable({
  onSelect,
  selectedId,
}: JobAnalysisHistoryTableProps) {
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<JobAnalysisSortField>("created_at");
  const [sortOrder, setSortOrder] = useState<JobAnalysisSortOrder>("desc");

  const debouncedSearch = useDebouncedValue(searchInput.trim(), 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sortBy, sortOrder]);

  const { data, isLoading, isFetching, isError } = useJobAnalysisList({
    page,
    page_size: PAGE_SIZE,
    search: debouncedSearch || undefined,
    processing_status:
      statusFilter === "all"
        ? undefined
        : (statusFilter as JobAnalysisProcessingStatus),
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const handleSort = (field: JobAnalysisSortField) => {
    if (sortBy === field) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(field);
    setSortOrder(field === "job_title" ? "asc" : "desc");
  };

  const items = data?.items ?? [];
  const totalPages = data?.total_pages ?? 0;
  const total = data?.total ?? 0;
  const showPagination = totalPages > 1;

  return (
    <div className="space-y-4" data-testid="job-analysis-history">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by job title or description..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="pl-9"
            data-testid="job-analysis-history-search"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className="w-full sm:w-44"
            data-testid="job-analysis-history-status-filter"
          >
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="h-12 bg-slate-100 rounded animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="p-10 text-center text-slate-500">
            Failed to load analysis history. Please try again.
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No analyses found</p>
            <p className="text-sm text-slate-500 mt-1">
              {debouncedSearch || statusFilter !== "all"
                ? "Try adjusting your search or filters."
                : "Submit a job to start building your analysis history."}
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>
                    <SortableHeader
                      label="Job title"
                      field="job_title"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Preview</TableHead>
                  <TableHead>
                    <SortableHeader
                      label="Fit score"
                      field="fit_score"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Recommendation
                  </TableHead>
                  <TableHead>
                    <SortableHeader
                      label="Status"
                      field="processing_status"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    <SortableHeader
                      label="Analyzed"
                      field="created_at"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const recommendation = getRecommendationStyle(
                    item.recommendation_decision
                  );
                  const fitScore = item.fit_score;

                  return (
                    <TableRow
                      key={item.id}
                      onClick={() => onSelect(item)}
                      className={cn(
                        "cursor-pointer",
                        selectedId === item.id && "bg-blue-50 hover:bg-blue-50"
                      )}
                      data-testid={`job-analysis-history-row-${item.id}`}
                    >
                      <TableCell className="font-medium text-slate-900 max-w-[200px]">
                        <span className="line-clamp-2">
                          {item.job_title || "Untitled job"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-slate-500 max-w-xs">
                        <span className="line-clamp-2 text-sm">
                          {item.job_description_preview}
                        </span>
                      </TableCell>
                      <TableCell>
                        {fitScore != null ? (
                          <span
                            className={cn(
                              "font-semibold tabular-nums",
                              getFitScoreColor(fitScore)
                            )}
                          >
                            {Math.round(fitScore)}%
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {item.recommendation_decision ? (
                          <span
                            className={cn(
                              "inline-flex px-2.5 py-1 rounded-full text-xs font-medium",
                              recommendation.badge
                            )}
                          >
                            {recommendation.label}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <JobAnalysisStatusBadge status={item.processing_status} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-slate-500 text-sm whitespace-nowrap">
                        {formatAnalysisDate(item.created_at)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-slate-200 bg-slate-50/50">
              <p className="text-sm text-slate-500">
                {total === 0
                  ? "No results"
                  : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total}`}
                {isFetching && !isLoading ? (
                  <span className="ml-2 text-blue-600">Updating…</span>
                ) : null}
              </p>

              {showPagination && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page <= 1 || isFetching}
                    data-testid="job-analysis-history-prev"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-slate-600 tabular-nums px-2">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
                    }
                    disabled={page >= totalPages || isFetching}
                    data-testid="job-analysis-history-next"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
