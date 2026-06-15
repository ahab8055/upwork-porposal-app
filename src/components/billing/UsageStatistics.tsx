"use client";

import { FileText, Sparkles, BarChart3 } from "lucide-react";
import {
  formatBillingDate,
  formatUsageLabel,
  getUsagePercent,
} from "@/lib/subscription-utils";
import { UsageMetricSummary, WorkspaceUsageResponse } from "@/types/billing";
import { cn } from "@/lib/utils";

interface UsageMetricCardProps {
  title: string;
  metric: UsageMetricSummary;
  icon: React.ReactNode;
  variant: "blue" | "violet" | "emerald";
}

const variantStyles = {
  blue: {
    bar: "bg-blue-600",
    icon: "bg-blue-100 text-blue-600",
  },
  violet: {
    bar: "bg-violet-600",
    icon: "bg-violet-100 text-violet-600",
  },
  emerald: {
    bar: "bg-emerald-600",
    icon: "bg-emerald-100 text-emerald-600",
  },
};

function UsageMetricCard({ title, metric, icon, variant }: UsageMetricCardProps) {
  const percent = getUsagePercent(metric.used, metric.limit, metric.unlimited);
  const styles = variantStyles[variant];

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-5"
      data-testid={`usage-metric-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatUsageLabel(metric.used, metric.limit, metric.unlimited)}
          </p>
          {!metric.unlimited && metric.remaining !== null && (
            <p className="mt-1 text-sm text-slate-500">
              {metric.remaining} remaining
            </p>
          )}
          {metric.unlimited && (
            <p className="mt-1 text-sm text-slate-500">Unlimited</p>
          )}
        </div>
        <div className={cn("rounded-lg p-2.5", styles.icon)}>{icon}</div>
      </div>

      {!metric.unlimited && metric.limit !== null && (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn("h-full rounded-full transition-all", styles.bar)}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">{percent}% of monthly limit</p>
        </div>
      )}
    </div>
  );
}

interface UsageStatisticsProps {
  usage?: WorkspaceUsageResponse | null;
  isLoading?: boolean;
}

export function UsageStatistics({ usage, isLoading }: UsageStatisticsProps) {
  if (isLoading) {
    return (
      <div
        className="grid gap-4 md:grid-cols-3"
        data-testid="usage-statistics-loading"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-xl border border-slate-200 bg-slate-50"
          />
        ))}
      </div>
    );
  }

  if (!usage) {
    return (
      <div
        className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500"
        data-testid="usage-statistics-empty"
      >
        Usage statistics are not available right now.
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="usage-statistics">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold text-slate-900">
            Usage this period
          </h3>
          <p className="text-sm text-slate-500">
            {formatBillingDate(usage.period_start)} –{" "}
            {formatBillingDate(usage.period_end)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <UsageMetricCard
          title="Proposal generations"
          metric={usage.proposal_generations}
          icon={<FileText className="h-5 w-5" />}
          variant="blue"
        />
        <UsageMetricCard
          title="Job analyses"
          metric={usage.job_analyses}
          icon={<BarChart3 className="h-5 w-5" />}
          variant="violet"
        />
        <UsageMetricCard
          title="AI requests"
          metric={usage.ai_requests}
          icon={<Sparkles className="h-5 w-5" />}
          variant="emerald"
        />
      </div>
    </div>
  );
}
