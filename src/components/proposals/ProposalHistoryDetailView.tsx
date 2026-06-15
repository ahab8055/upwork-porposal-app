"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProposalProcessingStatusBadge } from "@/components/proposals/ProposalProcessingStatusBadge";
import {
  useProposalDetailPolling,
  useProposalVersions,
} from "@/hooks/useProposalHistory";
import { useQuery } from "@tanstack/react-query";
import { proposalService } from "@/services/proposalService";
import {
  downloadProposalText,
  editorHtmlToPlainText,
} from "@/lib/proposal-editor-utils";

interface ProposalHistoryDetailViewProps {
  proposalId: string;
  onBack?: () => void;
  backLabel?: string;
}

function formatDetailDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ProposalHistoryDetailView({
  proposalId,
  onBack,
  backLabel = "Back to list",
}: ProposalHistoryDetailViewProps) {
  const [selectedVersionNumber, setSelectedVersionNumber] = useState<number | null>(
    null
  );

  const { data: proposal, isLoading, isError } =
    useProposalDetailPolling(proposalId);
  const { data: versionHistory } = useProposalVersions(
    proposal?.total_versions && proposal.total_versions > 1 ? proposalId : null
  );

  const activeVersionNumber =
    selectedVersionNumber ?? proposal?.version_number ?? 1;

  const { data: selectedVersion } = useQuery({
    queryKey: ["proposal-version-detail", proposalId, activeVersionNumber],
    queryFn: () =>
      proposalService.getProposalVersionByNumber(proposalId, activeVersionNumber),
    enabled:
      Boolean(proposalId) &&
      proposal != null &&
      activeVersionNumber !== proposal.version_number,
  });

  const contentProposal = selectedVersion ?? proposal;

  const isProcessing =
    proposal?.processing_status === "pending" ||
    proposal?.processing_status === "processing";
  const isFailed = proposal?.processing_status === "failed";
  const isCompleted = proposal?.processing_status === "completed";

  const handleCopy = async () => {
    const content = contentProposal?.content;
    if (!content) return;
    try {
      await navigator.clipboard.writeText(editorHtmlToPlainText(content));
      toast.success("Proposal copied to clipboard");
    } catch {
      toast.error("Failed to copy proposal");
    }
  };

  const handleDownload = () => {
    const content = contentProposal?.content;
    if (!content) return;
    const plain = editorHtmlToPlainText(content);
    downloadProposalText(plain, `proposal-${proposalId}.txt`);
    toast.success("Proposal downloaded");
  };

  if (isLoading && !proposal) {
    return (
      <div
        className="bg-white rounded-xl border border-slate-200 p-10 text-center"
        data-testid="proposal-detail-loading"
      >
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-slate-600">Loading proposal...</p>
      </div>
    );
  }

  if (isError || !proposal) {
    return (
      <Alert variant="destructive" data-testid="proposal-detail-error">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Unable to load proposal</AlertTitle>
        <AlertDescription>
          This proposal may have been removed or you may not have access.
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="block mt-3 text-sm font-medium underline"
            >
              {backLabel}
            </button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6" data-testid="proposal-history-detail">
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-2 -ml-2 text-slate-600 hover:text-slate-900"
          data-testid="proposal-detail-back"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Button>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <ProposalProcessingStatusBadge status={proposal.processing_status} />
              <span className="text-xs font-mono text-slate-400">
                {proposal.proposal_id}
              </span>
            </div>
            <h2 className="font-heading text-xl font-semibold text-slate-900 line-clamp-3">
              {contentProposal?.content?.slice(0, 120) || "Proposal"}
            </h2>
            <p className="text-sm text-slate-500">
              Created {formatDetailDate(proposal.created_at)}
              {proposal.updated_at !== proposal.created_at && (
                <> · Updated {formatDetailDate(proposal.updated_at)}</>
              )}
            </p>
          </div>

          {isCompleted && (
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                data-testid="proposal-detail-copy"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                data-testid="proposal-detail-download"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                asChild
                data-testid="proposal-detail-edit"
              >
                <Link href={`/proposals/${proposalId}/edit`}>
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-3 text-sm">
          <div className="rounded-lg bg-slate-50 border border-slate-100 px-4 py-3">
            <p className="text-slate-500 text-xs mb-1">Analysis</p>
            <p className="font-mono text-slate-800 truncate">{proposal.analysis_id}</p>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-100 px-4 py-3">
            <p className="text-slate-500 text-xs mb-1">Version</p>
            <p className="text-slate-800 tabular-nums">
              v{proposal.version_number}
              {proposal.total_versions && proposal.total_versions > 1 && (
                <span className="text-slate-500"> of {proposal.total_versions}</span>
              )}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-100 px-4 py-3">
            <p className="text-slate-500 text-xs mb-1">Source</p>
            <p className="text-slate-800">
              {proposal.user_edits?.edit_type === "manual_revision"
                ? "Manually edited"
                : proposal.user_edits?.edit_type === "ai_regeneration"
                  ? "AI regenerated"
                  : "AI generated"}
            </p>
          </div>
        </div>

        {versionHistory && versionHistory.total_versions > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm text-slate-600">Version history</span>
            <Select
              value={String(activeVersionNumber)}
              onValueChange={(value) => setSelectedVersionNumber(Number(value))}
            >
              <SelectTrigger className="w-full sm:w-56" data-testid="proposal-version-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {versionHistory.items.map((version) => (
                  <SelectItem
                    key={version.id}
                    value={String(version.version_number)}
                  >
                    v{version.version_number} — {version.processing_status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activeVersionNumber !== proposal.version_number && (
              <p className="text-xs text-slate-500">
                Viewing version {activeVersionNumber}. Latest is v
                {proposal.version_number}.
              </p>
            )}
          </div>
        )}

        {proposal.generation_instructions && (
          <div>
            <p className="text-sm font-medium text-slate-700 mb-1">
              Generation instructions
            </p>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-100">
              {proposal.generation_instructions}
            </p>
          </div>
        )}

        {isProcessing && (
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin shrink-0" />
            <div>
              <p className="font-medium text-slate-900">Generation in progress</p>
              <p className="text-sm text-slate-600">
                This page updates automatically when your proposal is ready.
              </p>
            </div>
          </div>
        )}

        {isFailed && (
          <Alert variant="destructive">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Generation failed</AlertTitle>
            <AlertDescription>
              {proposal.processing_error || "Something went wrong during generation."}
            </AlertDescription>
          </Alert>
        )}

        {contentProposal?.processing_status === "completed" && contentProposal.content && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-900">Proposal content</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/analytics">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View analysis
                </Link>
              </Button>
            </div>
            <div
              className="bg-slate-50 rounded-lg border border-slate-100 p-4 text-sm text-slate-700 whitespace-pre-wrap max-h-[480px] overflow-y-auto"
              data-testid="proposal-detail-content"
            >
              {editorHtmlToPlainText(contentProposal.content)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
