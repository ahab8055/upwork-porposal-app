"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { JobAnalysisRecord } from "@/types/job-analysis";
import {
  getConfidenceLevel,
  getFitScoreColor,
  getRecommendationReasoning,
  getRecommendationStyle,
} from "@/lib/job-analysis-utils";

interface JobAnalysisResultsProps {
  analysis: JobAnalysisRecord;
}

function TagList({
  items,
  emptyLabel,
  variant,
}: {
  items: string[];
  emptyLabel: string;
  variant: "success" | "warning" | "danger" | "neutral";
}) {
  if (!items.length) {
    return <p className="text-sm text-slate-500">{emptyLabel}</p>;
  }

  const styles = {
    success: "bg-emerald-50 text-emerald-800 border-emerald-100",
    warning: "bg-amber-50 text-amber-800 border-amber-100",
    danger: "bg-red-50 text-red-800 border-red-100",
    neutral: "bg-slate-50 text-slate-700 border-slate-100",
  };

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className={`px-3 py-1.5 rounded-full text-sm border ${styles[variant]}`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function SectionCard({
  title,
  icon,
  children,
  testId,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  testId?: string;
}) {
  return (
    <section
      className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6"
      data-testid={testId}
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-heading text-lg font-semibold text-slate-900">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

export function JobAnalysisResults({ analysis }: JobAnalysisResultsProps) {
  const fitScore = analysis.fit_score ?? analysis.match_score;
  const recommendation = getRecommendationStyle(
    analysis.recommendations?.decision
  );
  const confidence = getConfidenceLevel(analysis);
  const reasoning = getRecommendationReasoning(analysis);

  return (
    <div className="space-y-6" data-testid="job-analysis-results">
      <div className="grid gap-4 lg:grid-cols-3">
        <div
          className="bg-white rounded-xl border border-slate-200 p-6 text-center lg:col-span-1"
          data-testid="job-analysis-fit-score"
        >
          <p className="text-sm font-medium text-slate-600 mb-2">Fit Score</p>
          <p
            className={`text-5xl font-bold ${getFitScoreColor(fitScore)}`}
          >
            {fitScore != null ? Math.round(fitScore) : "—"}
          </p>
          <p className="text-sm text-slate-500 mt-1">out of 100</p>
          {analysis.job_title && (
            <p className="text-sm text-slate-700 mt-4 font-medium truncate">
              {analysis.job_title}
            </p>
          )}
        </div>

        <div
          className={`rounded-xl border p-6 lg:col-span-2 ${recommendation.bg}`}
          data-testid="job-analysis-recommendation"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">
                Recommendation
              </p>
              <p className={`text-2xl sm:text-3xl font-bold ${recommendation.text}`}>
                {recommendation.label}
              </p>
            </div>
            <div
              className="text-left sm:text-right"
              data-testid="job-analysis-confidence"
            >
              <p className="text-sm font-medium text-slate-600 mb-1">
                Confidence
              </p>
              <p className={`text-xl font-bold ${recommendation.text}`}>
                {confidence.label}
              </p>
              {confidence.percent != null && (
                <p className="text-sm text-slate-600">{Math.round(confidence.percent)}%</p>
              )}
            </div>
          </div>
          {(reasoning || confidence.description) && (
            <p className="mt-4 text-sm text-slate-700 leading-relaxed">
              {reasoning || confidence.description}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard
          title="Strengths"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          testId="job-analysis-strengths"
        >
          <TagList
            items={analysis.strengths}
            emptyLabel="No strengths identified yet"
            variant="success"
          />
        </SectionCard>

        <SectionCard
          title="Weaknesses"
          icon={<XCircle className="w-5 h-5 text-amber-600" />}
          testId="job-analysis-weaknesses"
        >
          <TagList
            items={analysis.weaknesses}
            emptyLabel="No weaknesses identified"
            variant="warning"
          />
        </SectionCard>

        <SectionCard
          title="Missing Skills"
          icon={<Target className="w-5 h-5 text-blue-600" />}
          testId="job-analysis-missing-skills"
        >
          <TagList
            items={analysis.missing_skills}
            emptyLabel="No missing skills flagged"
            variant="neutral"
          />
        </SectionCard>

        <SectionCard
          title="Risks"
          icon={<ShieldAlert className="w-5 h-5 text-red-600" />}
          testId="job-analysis-risks"
        >
          <TagList
            items={analysis.risks}
            emptyLabel="No significant risks identified"
            variant="danger"
          />
        </SectionCard>
      </div>
    </div>
  );
}

export function JobAnalysisResultsLoading({
  status,
  jobTitle,
}: {
  status: string;
  jobTitle?: string;
}) {
  return (
    <div
      className="bg-white rounded-xl border border-slate-200 p-8 text-center"
      data-testid="job-analysis-loading"
    >
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
      <h3 className="font-heading text-lg font-semibold text-slate-900">
        Analyzing opportunity
      </h3>
      <p className="text-slate-600 mt-2 capitalize">
        Status: {status.replace("_", " ")}
      </p>
      {jobTitle && (
        <p className="text-sm text-slate-500 mt-2 truncate">{jobTitle}</p>
      )}
      <p className="text-sm text-slate-500 mt-4">
        Comparing this job against your company profile and knowledge base...
      </p>
    </div>
  );
}

export function JobAnalysisResultsFailed({
  error,
  onRetry,
}: {
  error?: string | null;
  onRetry?: () => void;
}) {
  return (
    <Alert variant="destructive" data-testid="job-analysis-failed">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle>Analysis failed</AlertTitle>
      <AlertDescription>
        {error || "Something went wrong while analyzing this job."}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="block mt-3 text-sm font-medium underline"
          >
            Try again
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}

export function JobAnalysisResultsPending() {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <Sparkles className="w-4 h-4 text-blue-600" />
      Waiting for analysis to start...
    </div>
  );
}
