"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  JobAnalysisResults,
  JobAnalysisResultsFailed,
  JobAnalysisResultsLoading,
} from "@/components/job-analysis/JobAnalysisResults";
import { useJobAnalysisDetail } from "@/hooks/useJobAnalysis";

interface JobAnalysisDetailViewProps {
  analysisId: string;
  fallbackJobTitle?: string;
  onBack?: () => void;
  backLabel?: string;
}

export function JobAnalysisDetailView({
  analysisId,
  fallbackJobTitle = "",
  onBack,
  backLabel = "Back to history",
}: JobAnalysisDetailViewProps) {
  const { data: analysis, isError } = useJobAnalysisDetail(analysisId);

  const isProcessing =
    analysis?.processing_status === "pending" ||
    analysis?.processing_status === "processing";
  const isCompleted = analysis?.processing_status === "completed";
  const isFailed = analysis?.processing_status === "failed";
  const jobTitle = analysis?.job_title || fallbackJobTitle;

  return (
    <div className="space-y-6" data-testid="job-analysis-detail-view">
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-2 -ml-2 text-slate-600 hover:text-slate-900"
          data-testid="job-analysis-detail-back"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Button>
      )}

      {isError && <JobAnalysisResultsFailed onRetry={onBack} />}

      {!isError && !analysis && (
        <JobAnalysisResultsLoading status="processing" jobTitle={jobTitle} />
      )}

      {analysis && isProcessing && (
        <JobAnalysisResultsLoading
          status={analysis.processing_status}
          jobTitle={jobTitle}
        />
      )}

      {analysis && isFailed && (
        <JobAnalysisResultsFailed
          error={analysis.processing_error}
          onRetry={onBack}
        />
      )}

      {analysis && isCompleted && <JobAnalysisResults analysis={analysis} />}
    </div>
  );
}
