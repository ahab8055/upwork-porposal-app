"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProposalHistoryDetailView } from "@/components/proposals/ProposalHistoryDetailView";
import { ProposalHistoryTable } from "@/components/proposals/ProposalHistoryTable";
import { StatsCard } from "@/components/proposals/StatsCard";
import { useProposalHistoryStats } from "@/hooks/useProposalHistory";
import type { ProposalVersionSummary } from "@/types/proposal";

export default function ProposalsPage() {
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const { data: stats, isLoading: statsLoading } = useProposalHistoryStats();

  const handleSelect = (item: ProposalVersionSummary) => {
    setSelectedProposalId(item.proposal_id);
  };

  const handleBack = () => {
    setSelectedProposalId(null);
  };

  return (
    <div className="p-4 sm:p-8" data-testid="proposals-page">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-slate-900">
                Proposal History
              </h1>
            </div>
            <p className="text-slate-600">
              Browse, search, and reuse previously generated proposals across your
              workspace.
            </p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
            asChild
            data-testid="new-proposal-btn"
          >
            <Link href="/analytics">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate from Analysis
            </Link>
          </Button>
        </div>

        {!selectedProposalId && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Proposals"
              value={statsLoading ? "—" : stats?.total ?? 0}
              subtitle="All time"
              variant="blue"
              icon={<FileText className="w-5 h-5" />}
            />
            <StatsCard
              title="Ready to Use"
              value={statsLoading ? "—" : stats?.completed ?? 0}
              subtitle="Completed"
              variant="green"
              icon={<CheckCircle2 className="w-5 h-5" />}
            />
            <StatsCard
              title="In Progress"
              value={statsLoading ? "—" : stats?.in_progress ?? 0}
              subtitle="Generating"
              variant="yellow"
              icon={<Loader2 className="w-5 h-5" />}
            />
            <StatsCard
              title="Failed"
              value={statsLoading ? "—" : stats?.failed ?? 0}
              subtitle="Needs attention"
              variant="red"
              icon={<AlertCircle className="w-5 h-5" />}
            />
          </div>
        )}

        {selectedProposalId ? (
          <ProposalHistoryDetailView
            proposalId={selectedProposalId}
            onBack={handleBack}
          />
        ) : (
          <ProposalHistoryTable
            onSelect={handleSelect}
            selectedId={selectedProposalId}
          />
        )}
      </div>
    </div>
  );
}
