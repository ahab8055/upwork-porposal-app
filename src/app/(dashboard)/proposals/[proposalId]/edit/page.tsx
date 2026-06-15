"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProposalEditorWorkspace } from "@/components/proposals/ProposalEditorWorkspace";
import { useProposalDetail } from "@/hooks/useProposalGeneration";

interface ProposalEditPageProps {
  params: Promise<{ proposalId: string }>;
}

export default function ProposalEditPage({ params }: ProposalEditPageProps) {
  const { proposalId } = use(params);
  const { data: proposal, isLoading, isError } = useProposalDetail(proposalId);

  return (
    <div className="p-4 sm:p-8" data-testid="proposal-edit-page">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="-ml-2 text-slate-600">
            <Link href="/proposals">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to proposals
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900">
              Proposal Editor
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Edit, regenerate, and compare proposal versions before submitting.
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-24 text-slate-600">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            Loading proposal...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
            Unable to load this proposal. It may have been removed or you may not
            have access.
          </div>
        )}

        {proposal && (
          <ProposalEditorWorkspace
            proposalId={proposal.proposal_id}
            showViewAllLink={false}
            title="Edit Proposal"
          />
        )}
      </div>
    </div>
  );
}
