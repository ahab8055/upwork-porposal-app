"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ProposalEditorWorkspace } from "@/components/proposals/ProposalEditorWorkspace";
import {
  useProposalDetail,
  useRequestProposalGeneration,
} from "@/hooks/useProposalGeneration";
import type { ProposalProcessingStatus } from "@/types/proposal";

interface ProposalGenerationPanelProps {
  analysisId: string;
  jobTitle?: string | null;
}

const STATUS_PROGRESS: Record<ProposalProcessingStatus, number> = {
  pending: 20,
  processing: 65,
  completed: 100,
  failed: 100,
};

const STATUS_LABELS: Record<ProposalProcessingStatus, string> = {
  pending: "Queued for generation",
  processing: "AI is writing your proposal",
  completed: "Proposal ready",
  failed: "Generation failed",
};

function StatusSteps({ status }: { status: ProposalProcessingStatus }) {
  const steps = [
    { key: "pending", label: "Queued" },
    { key: "processing", label: "Generating" },
    { key: "completed", label: "Complete" },
  ] as const;

  const activeIndex =
    status === "failed"
      ? 1
      : steps.findIndex((step) => step.key === status);

  return (
    <ol className="flex items-center justify-between gap-2 text-xs sm:text-sm">
      {steps.map((step, index) => {
        const isActive = index <= activeIndex && status !== "failed";
        const isCurrent =
          step.key === status ||
          (status === "failed" && step.key === "processing");

        return (
          <li
            key={step.key}
            className={`flex-1 text-center rounded-lg px-2 py-2 border ${
              isCurrent
                ? "border-blue-200 bg-blue-50 text-blue-800 font-medium"
                : isActive
                  ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                  : "border-slate-100 bg-slate-50 text-slate-500"
            }`}
          >
            {step.label}
          </li>
        );
      })}
    </ol>
  );
}

export function ProposalGenerationPanel({
  analysisId,
  jobTitle,
}: ProposalGenerationPanelProps) {
  const [instructions, setInstructions] = useState("");
  const [activeProposalId, setActiveProposalId] = useState<string | null>(null);

  const generateMutation = useRequestProposalGeneration();
  const { data: proposal, isError: isProposalError } =
    useProposalDetail(activeProposalId);
  const completionToastRef = useRef<string | null>(null);

  const status = proposal?.processing_status;
  const isGenerating =
    generateMutation.isPending ||
    (activeProposalId != null &&
      status != null &&
      (status === "pending" || status === "processing"));
  const isCompleted = status === "completed";
  const isFailed = status === "failed" || isProposalError;

  useEffect(() => {
    if (status === "completed" && proposal?.id) {
      if (completionToastRef.current !== proposal.id) {
        completionToastRef.current = proposal.id;
        toast.success("Proposal generated successfully");
      }
    }
    if (status === "failed") {
      toast.error(proposal?.processing_error || "Proposal generation failed");
    }
  }, [status, proposal?.id, proposal?.processing_error]);

  const progressValue = useMemo(() => {
    if (generateMutation.isPending) return 10;
    if (!status) return 15;
    return STATUS_PROGRESS[status];
  }, [generateMutation.isPending, status]);

  const handleGenerate = () => {
    const trimmed = instructions.trim();
    generateMutation.mutate(
      {
        analysis_id: analysisId,
        instructions: trimmed || null,
      },
      {
        onSuccess: (response) => {
          setActiveProposalId(response.proposal_id);
        },
      }
    );
  };

  const handleRetry = () => {
    setActiveProposalId(null);
    handleGenerate();
  };

  return (
    <section
      className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5"
      data-testid="proposal-generation-panel"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="font-heading text-lg font-semibold text-slate-900">
              Generate Proposal
            </h3>
          </div>
          <p className="text-sm text-slate-600">
            Turn this analysis into a tailored proposal using your workspace
            profile and knowledge base.
          </p>
          {jobTitle && (
            <p className="text-sm text-slate-500 mt-1 truncate">{jobTitle}</p>
          )}
        </div>

        {!isGenerating && !isCompleted && !isFailed && (
          <Button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
            data-testid="generate-proposal-btn"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Proposal
              </>
            )}
          </Button>
        )}
      </div>

      {!isGenerating && !isCompleted && !isFailed && (
        <div className="space-y-2">
          <Label htmlFor="proposal-instructions" className="text-slate-700">
            Optional instructions
          </Label>
          <Textarea
            id="proposal-instructions"
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            placeholder="Tone, emphasis, or formatting guidance for the AI..."
            rows={3}
            data-testid="proposal-instructions-input"
          />
        </div>
      )}

      {isGenerating && (
        <div
          className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 space-y-4"
          data-testid="proposal-generation-loading"
        >
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin shrink-0" />
            <div>
              <p className="font-medium text-slate-900">
                {status ? STATUS_LABELS[status] : "Starting generation..."}
              </p>
              <p className="text-sm text-slate-600 mt-0.5">
                This usually takes under a minute. You can stay on this page.
              </p>
            </div>
          </div>

          <Progress value={progressValue} className="h-2" />

          {status && <StatusSteps status={status} />}
        </div>
      )}

      {isFailed && (
        <Alert variant="destructive" data-testid="proposal-generation-failed">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Proposal generation failed</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              {proposal?.processing_error ||
                "Something went wrong while generating your proposal."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="bg-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isCompleted && proposal && (
        <div className="space-y-4" data-testid="proposal-generation-result">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            <p className="font-medium">Your proposal is ready — edit below before sending</p>
          </div>

          <ProposalEditorWorkspace
            proposalId={proposal.proposal_id}
            jobTitle={jobTitle}
          />
        </div>
      )}
    </section>
  );
}
