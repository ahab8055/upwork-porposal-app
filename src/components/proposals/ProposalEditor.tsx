"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Cloud,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProposalRichTextEditor } from "@/components/proposals/ProposalRichTextEditor";
import {
  contentToEditorHtml,
  downloadProposalText,
  editorHtmlToPlainText,
} from "@/lib/proposal-editor-utils";
import { useProposalAutoSave } from "@/hooks/useProposalEditor";
import type { ProposalSaveStatus } from "@/hooks/useProposalEditor";

interface ProposalEditorProps {
  versionId: string;
  proposalId: string;
  initialContent: string;
  title?: string;
  jobTitle?: string | null;
  showViewAllLink?: boolean;
  onSaveStateChange?: (state: {
    saveNow: (changeSummary?: string) => Promise<unknown>;
    saveStatus: ProposalSaveStatus;
    hasUnsavedChanges: boolean;
  }) => void;
}

function SaveStatusBadge({ status }: { status: ProposalSaveStatus }) {
  if (status === "idle") return null;

  const config: Record<
    Exclude<ProposalSaveStatus, "idle">,
    { icon: React.ReactNode; label: string; className: string }
  > = {
    dirty: {
      icon: <Cloud className="w-4 h-4 text-amber-600" />,
      label: "Unsaved changes",
      className: "text-amber-700 bg-amber-50 border-amber-100",
    },
    saving: {
      icon: <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />,
      label: "Saving...",
      className: "text-blue-700 bg-blue-50 border-blue-100",
    },
    saved: {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      label: "All changes saved",
      className: "text-emerald-700 bg-emerald-50 border-emerald-100",
    },
    error: {
      icon: <Cloud className="w-4 h-4 text-red-600" />,
      label: "Save failed",
      className: "text-red-700 bg-red-50 border-red-100",
    },
  };

  const current = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${current.className}`}
      data-testid="proposal-save-status"
    >
      {current.icon}
      {current.label}
    </span>
  );
}

export function ProposalEditor({
  versionId,
  proposalId,
  initialContent,
  title = "Edit Proposal",
  jobTitle,
  showViewAllLink = true,
  onSaveStateChange,
}: ProposalEditorProps) {
  const [htmlContent, setHtmlContent] = useState(() =>
    contentToEditorHtml(initialContent)
  );

  const {
    saveStatus,
    markDirty,
    saveNow,
    resetSavedBaseline,
    isSaving,
    hasUnsavedChanges,
  } = useProposalAutoSave({
    versionId,
    htmlContent,
    enabled: true,
  });

  useEffect(() => {
    onSaveStateChange?.({ saveNow, saveStatus, hasUnsavedChanges });
  }, [onSaveStateChange, saveNow, saveStatus, hasUnsavedChanges]);

  useEffect(() => {
    const html = contentToEditorHtml(initialContent);
    setHtmlContent(html);
    resetSavedBaseline(editorHtmlToPlainText(html));
  }, [initialContent, resetSavedBaseline, versionId]);

  const plainText = useMemo(
    () => editorHtmlToPlainText(htmlContent),
    [htmlContent]
  );

  const handleCopy = async () => {
    if (!plainText) return;
    try {
      await navigator.clipboard.writeText(plainText);
      toast.success("Proposal copied to clipboard");
    } catch {
      toast.error("Failed to copy proposal");
    }
  };

  const handleDownload = () => {
    if (!plainText) {
      toast.error("Nothing to download");
      return;
    }
    const safeTitle = (jobTitle || "proposal")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    downloadProposalText(plainText, `${safeTitle || "proposal"}-${proposalId}.txt`);
    toast.success("Proposal downloaded");
  };

  return (
    <section
      className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-4"
      data-testid="proposal-editor"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold text-slate-900">
            {title}
          </h3>
          {jobTitle && (
            <p className="text-sm text-slate-500 mt-1 truncate">{jobTitle}</p>
          )}
          <p className="text-sm text-slate-600 mt-1">
            Refine the AI draft before sending. Edits auto-save every few seconds.
          </p>
        </div>
        <SaveStatusBadge status={saveStatus} />
      </div>

      <ProposalRichTextEditor
        key={versionId}
        defaultHtml={contentToEditorHtml(initialContent)}
        onChange={setHtmlContent}
        onDirty={markDirty}
      />

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => saveNow()}
          disabled={isSaving || !plainText}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          data-testid="save-proposal-btn"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save now
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={!plainText}
          data-testid="copy-proposal-btn"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
        <Button
          variant="outline"
          onClick={handleDownload}
          disabled={!plainText}
          data-testid="download-proposal-btn"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        {showViewAllLink && (
          <Button variant="outline" asChild data-testid="open-full-editor-btn">
            <Link href={`/proposals/${proposalId}/edit`}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open full editor
            </Link>
          </Button>
        )}
        {showViewAllLink && (
          <Button variant="ghost" asChild>
            <Link href="/proposals">View all proposals</Link>
          </Button>
        )}
      </div>
    </section>
  );
}
