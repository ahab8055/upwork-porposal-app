"use client";

import { useState } from "react";
import { BarChart3, History, Sparkles } from "lucide-react";
import { JobAnalysisSubmitForm } from "@/components/job-analysis/JobAnalysisSubmitForm";
import { JobAnalysisDetailView } from "@/components/job-analysis/JobAnalysisDetailView";
import { JobAnalysisHistoryTable } from "@/components/job-analysis/JobAnalysisHistoryTable";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  getJobAnalysisValidationErrors,
  useSubmitJobAnalysis,
} from "@/hooks/useJobAnalysis";
import type { SubmitJobAnalysisInput } from "@/lib/validations/job-analysis";
import type { JobAnalysisListItem } from "@/types/job-analysis";
import { AxiosError } from "axios";

export default function AnalyticsPage() {
  const submitMutation = useSubmitJobAnalysis();
  const [serverErrors, setServerErrors] = useState<
    Partial<Record<keyof SubmitJobAnalysisInput, string>>
  >({});
  const [activeTab, setActiveTab] = useState("analyze");
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [submittedJobTitle, setSubmittedJobTitle] = useState("");
  const [historyDetailId, setHistoryDetailId] = useState<string | null>(null);
  const [historyDetailTitle, setHistoryDetailTitle] = useState("");

  const handleSubmit = (data: SubmitJobAnalysisInput) => {
    setServerErrors({});
    setActiveAnalysisId(null);
    setSubmittedJobTitle(data.job_title);

    submitMutation.mutate(data, {
      onSuccess: (response) => {
        setActiveAnalysisId(response.analysis_id);
      },
      onError: (error) => {
        const validationErrors = getJobAnalysisValidationErrors(
          error as AxiosError<{ detail?: string | { loc?: (string | number)[]; msg?: string }[] }>
        );
        if (Object.keys(validationErrors).length > 0) {
          setServerErrors(validationErrors);
        }
      },
    });
  };

  const handleAnalyzeAnother = () => {
    setActiveAnalysisId(null);
    setSubmittedJobTitle("");
    setServerErrors({});
  };

  const handleHistorySelect = (item: JobAnalysisListItem) => {
    setHistoryDetailId(item.id);
    setHistoryDetailTitle(item.job_title || "");
  };

  const handleHistoryBack = () => {
    setHistoryDetailId(null);
    setHistoryDetailTitle("");
  };

  const showAnalyzeForm = !activeAnalysisId;

  return (
    <div className="p-4 sm:p-8" data-testid="analytics-page">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-slate-900">
              Analytics
            </h1>
          </div>
          <p className="text-slate-600 mt-1">
            Submit a job description to evaluate fit against your company profile,
            skills, and knowledge base. Revisit past analyses anytime.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-100">
            <TabsTrigger value="analyze" data-testid="analytics-tab-analyze">
              <Sparkles className="w-4 h-4 mr-2" />
              New Analysis
            </TabsTrigger>
            <TabsTrigger value="history" data-testid="analytics-tab-history">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            {showAnalyzeForm && (
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                <JobAnalysisSubmitForm
                  onSubmit={handleSubmit}
                  isSubmitting={submitMutation.isPending}
                  serverErrors={serverErrors}
                />
              </div>
            )}

            {activeAnalysisId && (
              <div className="space-y-6">
                <JobAnalysisDetailView
                  analysisId={activeAnalysisId}
                  fallbackJobTitle={submittedJobTitle}
                />
                <Button
                  variant="outline"
                  onClick={handleAnalyzeAnother}
                  data-testid="analyze-another-btn"
                >
                  Analyze another job
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {historyDetailId ? (
              <JobAnalysisDetailView
                analysisId={historyDetailId}
                fallbackJobTitle={historyDetailTitle}
                onBack={handleHistoryBack}
              />
            ) : (
              <JobAnalysisHistoryTable
                onSelect={handleHistorySelect}
                selectedId={historyDetailId}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
