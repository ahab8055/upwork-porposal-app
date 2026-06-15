"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProposalEditor } from "@/components/proposals/ProposalEditor";
import { ProposalProcessingStatusBadge } from "@/components/proposals/ProposalProcessingStatusBadge";
import type { ProposalSaveStatus } from "@/hooks/useProposalEditor";
import { useProposalVersion } from "@/hooks/useProposalEditor";
import {
  useProposalDetail,
  useRegenerateProposal,
} from "@/hooks/useProposalGeneration";
import { useProposalVersions } from "@/hooks/useProposalHistory";
import type { ProposalProcessingStatus } from "@/types/proposal";

interface EditorSaveHandle {
  saveNow: (changeSummary?: string) => Promise<unknown>;
  saveStatus: ProposalSaveStatus;
  hasUnsavedChanges: boolean;
}

interface ProposalEditorWorkspaceProps {
  proposalId: string;
  jobTitle?: string | null;
  showViewAllLink?: boolean;
  title?: string;
}

const STATUS_PROGRESS: Record<ProposalProcessingStatus, number> = {
  pending: 20,
  processing: 65,
  completed: 100,
  failed: 100,
};

function versionLabel(
  versionNumber: number,
  status: ProposalProcessingStatus,
  isAiGenerated?: boolean
): string {
  const source = isAiGenerated === false ? "edited" : "AI";
  return `v${versionNumber} · ${status} · ${source}`;
}

export function ProposalEditorWorkspace({
  proposalId,
  jobTitle,
  showViewAllLink = true,
  title = "Edit Proposal",
}: ProposalEditorWorkspaceProps) {
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [regenInstructions, setRegenInstructions] = useState("");
  const editorSaveRef = useRef<EditorSaveHandle | null>(null);

  const { data: latestProposal } = useProposalDetail(proposalId);
  const { data: versionHistory, refetch: refetchVersions } =
    useProposalVersions(proposalId);
  const { data: activeVersion, isLoading: isLoadingVersion } =
    useProposalVersion(activeVersionId);

  const regenerateMutation = useRegenerateProposal();

  useEffect(() => {
    if (!latestProposal) return;
    setActiveVersionId((current) => current ?? latestProposal.id);
  }, [latestProposal]);

  const handleEditorSaveState = useCallback((state: EditorSaveHandle) => {
    editorSaveRef.current = state;
  }, []);

  const switchVersion = useCallback(
    async (versionId: string) => {
      if (versionId === activeVersionId) return;

      const editor = editorSaveRef.current;
      if (editor?.hasUnsavedChanges) {
        await editor.saveNow("Saved before switching versions");
      }

      setActiveVersionId(versionId);
    },
    [activeVersionId]
  );

  const handleRegenerate = async () => {
    const editor = editorSaveRef.current;

    if (editor?.hasUnsavedChanges) {
      await editor.saveNow("Saved before regenerating");
    }

    const trimmed = regenInstructions.trim();
    regenerateMutation.mutate(
      {
        proposalId,
        data: { instructions: trimmed || null },
      },
      {
        onSuccess: (response) => {
          setActiveVersionId(response.version_id);
          void refetchVersions();
        },
      }
    );
  };

  useEffect(() => {
    if (activeVersion?.processing_status === "completed") {
      void refetchVersions();
    }
  }, [activeVersion?.id, activeVersion?.processing_status, refetchVersions]);

  const versions = versionHistory?.items ?? [];
  const latestIsGenerating =
    latestProposal?.processing_status === "pending" ||
    latestProposal?.processing_status === "processing";
  const isRegenerating =
    regenerateMutation.isPending ||
    (activeVersionId === latestProposal?.id && latestIsGenerating) ||
    activeVersion?.processing_status === "pending" ||
    activeVersion?.processing_status === "processing";
  const isActiveFailed = activeVersion?.processing_status === "failed";
  const isActiveCompleted = activeVersion?.processing_status === "completed";
  const canRegenerate = !regenerateMutation.isPending && !latestIsGenerating;

  const progressValue = regenerateMutation.isPending
    ? 10
    : STATUS_PROGRESS[activeVersion?.processing_status ?? "pending"];

  return (
    <div className="space-y-4" data-testid="proposal-editor-workspace">
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2 flex-1">
            <Label htmlFor="proposal-version-select">Proposal version</Label>
            <Select
              value={activeVersionId ?? undefined}
              onValueChange={(value) => void switchVersion(value)}
              disabled={!versions.length}
            >
              <SelectTrigger
                id="proposal-version-select"
                className="w-full lg:max-w-md"
                data-testid="proposal-version-select"
              >
                <SelectValue placeholder="Select a version" />
              </SelectTrigger>
              <SelectContent>
                {versions.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    {versionLabel(
                      version.version_number,
                      version.processing_status,
                      version.is_ai_generated
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {versions.length > 1 && (
              <p className="text-xs text-slate-500">
                {versions.length} versions available. Unsaved edits are saved
                automatically before switching.
              </p>
            )}
          </div>

            <Button
            onClick={() => void handleRegenerate()}
            disabled={!canRegenerate}
            className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
            data-testid="regenerate-proposal-btn"
          >
            {regenerateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="regenerate-instructions">
            Regeneration instructions (optional)
          </Label>
          <Textarea
            id="regenerate-instructions"
            value={regenInstructions}
            onChange={(event) => setRegenInstructions(event.target.value)}
            placeholder="Try a more concise tone, emphasize React experience, etc."
            rows={2}
            disabled={!canRegenerate}
            data-testid="regenerate-instructions-input"
          />
        </div>
      </div>

      {latestIsGenerating &&
        activeVersionId !== latestProposal?.id &&
        latestProposal && (
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm text-blue-900">
            A new version is generating (v{latestProposal.version_number}). You
            can keep reviewing earlier versions while you wait.
          </div>
        )}

      {isRegenerating && activeVersionId === latestProposal?.id && (
        <div
          className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 space-y-3"
          data-testid="proposal-regeneration-loading"
        >
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin shrink-0" />
            <div>
              <p className="font-medium text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Generating alternative version
              </p>
              <p className="text-sm text-slate-600">
                Your previous versions are preserved. This page updates when the
                new draft is ready.
              </p>
            </div>
          </div>
          <Progress value={progressValue} className="h-2" />
          {activeVersion && (
            <ProposalProcessingStatusBadge status={activeVersion.processing_status} />
          )}
        </div>
      )}

      {isActiveFailed && activeVersion && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {activeVersion.processing_error || "This version failed to generate."}
        </div>
      )}

      {isLoadingVersion && !activeVersion && (
        <div className="flex items-center justify-center py-16 text-slate-600">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          Loading version...
        </div>
      )}

      {isActiveCompleted && activeVersion && !isRegenerating && (
        <ProposalEditor
          key={activeVersion.id}
          versionId={activeVersion.id}
          proposalId={proposalId}
          initialContent={activeVersion.content}
          title={title}
          jobTitle={jobTitle}
          showViewAllLink={showViewAllLink}
          onSaveStateChange={handleEditorSaveState}
        />
      )}
    </div>
  );
}
