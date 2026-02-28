"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatsCard } from "@/components/proposals/StatsCard";
import { ProposalCard } from "@/components/proposals/ProposalCard";
import { FilterBar } from "@/components/proposals/FilterBar";
import {
  useProposals,
  useProposal,
  useUpdateProposalStatus,
  useProposalStats,
  useExportProposals,
} from "@/hooks/useProposals";
import {
  FileText,
  Plus,
  Copy,
  Trophy,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import type { Proposal } from "@/types/dashboard";

export default function ProposalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const { data: proposals = [], isLoading } = useProposals();
  const { data: statsData } = useProposalStats();
  const { data: selectedProposal } = useProposal(selectedProposalId!);
  const updateStatusMutation = useUpdateProposalStatus();
  const exportMutation = useExportProposals();

  // Calculate stats from proposals if backend doesn't provide them
  const stats = useMemo(() => {
    if (statsData) return statsData;

    const total = proposals.length;
    const won = proposals.filter((p) => p.status === "won").length;
    const lost = proposals.filter((p) => p.status === "lost").length;
    const pending = proposals.filter(
      (p) => p.status === "sent" || p.status === "no_response" || p.status === "interviewing"
    ).length;

    return {
      total,
      won,
      lost,
      pending,
      win_rate: total > 0 ? Math.round((won / total) * 100) : 0,
      lost_rate: total > 0 ? Math.round((lost / total) * 100) : 0,
      pending_rate: total > 0 ? Math.round((pending / total) * 100) : 0,
    };
  }, [proposals, statsData]);

  // Filter proposals based on search, status, and platform
  const filteredProposals = useMemo(() => {
    return proposals.filter((proposal) => {
      const matchesSearch =
        searchQuery === "" ||
        proposal.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || proposal.status === statusFilter;

      const matchesPlatform =
        platformFilter === "all" ||
        (proposal.platform && proposal.platform.toLowerCase() === platformFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesPlatform;
    });
  }, [proposals, searchQuery, statusFilter, platformFilter]);

  // Extract unique platforms from proposals
  const platforms = useMemo(() => {
    const platformSet = new Set<string>();
    proposals.forEach((p) => {
      if (p.platform) platformSet.add(p.platform);
    });
    return Array.from(platformSet);
  }, [proposals]);

  const handleViewDetails = (proposalId: number) => {
    setSelectedProposalId(proposalId);
    setViewModalOpen(true);
  };

  const handleStatusChange = (proposalId: number, newStatus: Proposal["status"]) => {
    updateStatusMutation.mutate({ id: proposalId, status: newStatus });
  };

  const handleExport = () => {
    exportMutation.mutate("csv");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getStatusColor = (status: Proposal["status"]) => {
    const colors = {
      draft: "bg-slate-100 text-slate-700",
      sent: "bg-blue-100 text-blue-700",
      won: "bg-emerald-100 text-emerald-700",
      lost: "bg-red-100 text-red-700",
      no_response: "bg-amber-100 text-amber-700",
      interviewing: "bg-violet-100 text-violet-700",
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="p-8" data-testid="proposals-page">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900">
              Proposal History
            </h1>
            <p className="text-slate-600 mt-1">
              Track all your proposals and their outcomes.
            </p>
          </div>
          <Link href="/new-proposal">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="new-proposal-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Proposal
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Proposals"
          value={stats.total}
          subtitle="All time"
          variant="blue"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatsCard
          title="Won"
          value={stats.won}
          subtitle={`${stats.win_rate}% win rate`}
          variant="green"
          icon={<Trophy className="w-5 h-5" />}
        />
        <StatsCard
          title="Lost"
          value={stats.lost}
          subtitle={`${stats.lost_rate}% lost rate`}
          variant="red"
          icon={<XCircle className="w-5 h-5" />}
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          subtitle={`${stats.pending_rate}% pending`}
          variant="yellow"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        platformFilter={platformFilter}
        onPlatformFilterChange={setPlatformFilter}
        onExport={handleExport}
        isExporting={exportMutation.isPending}
        platforms={platforms}
      />

      {/* Proposals List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-48 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredProposals.length > 0 ? (
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <ProposalCard
              key={proposal.proposal_id}
              proposal={proposal}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-semibold text-slate-900 mb-2">
            {proposals.length === 0 ? "No proposals yet" : "No matching proposals"}
          </h3>
          <p className="text-slate-500 mb-6">
            {proposals.length === 0
              ? "Create your first proposal to get started"
              : "Try adjusting your search or filters"}
          </p>
          {proposals.length === 0 && (
            <Link href="/new-proposal">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="create-first-proposal-btn"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Proposal
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* View Proposal Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProposal?.title}</DialogTitle>
          </DialogHeader>
          {selectedProposal && (
            <div className="mt-4 space-y-6">
              {/* Status & Info */}
              <div className="flex items-center gap-4 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                    selectedProposal.status
                  )}`}
                >
                  {selectedProposal.status.replace("_", " ")}
                </span>
                {selectedProposal.platform && (
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm">
                    {selectedProposal.platform}
                  </span>
                )}
                <span className="text-sm text-slate-500">
                  Created{" "}
                  {new Date(selectedProposal.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Job Analysis Scores */}
              {selectedProposal.job_analysis && (
                <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Skill Match:</span>
                    <span
                      className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                        selectedProposal.job_analysis.skill_match_score >= 70
                          ? "bg-emerald-100 text-emerald-700"
                          : selectedProposal.job_analysis.skill_match_score >= 40
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedProposal.job_analysis.skill_match_score}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Win Probability:</span>
                    <span
                      className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                        selectedProposal.job_analysis.win_probability >= 50
                          ? "bg-emerald-100 text-emerald-700"
                          : selectedProposal.job_analysis.win_probability >= 30
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedProposal.job_analysis.win_probability}%
                    </span>
                  </div>
                </div>
              )}

              {/* Proposal Content */}
              <div>
                <h4 className="font-medium text-slate-900 mb-2">
                  Proposal Content
                </h4>
                <div className="bg-slate-50 rounded-lg p-4 whitespace-pre-wrap text-sm text-slate-700">
                  {selectedProposal.content || "No content"}
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h4 className="font-medium text-slate-900 mb-2">
                  Original Job Description
                </h4>
                <div className="bg-slate-50 rounded-lg p-4 whitespace-pre-wrap text-sm text-slate-600 max-h-48 overflow-y-auto">
                  {selectedProposal.job_description}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(selectedProposal.content || "")}
                  data-testid="copy-proposal-content-btn"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Content
                </Button>
                <Select
                  value={selectedProposal.status}
                  onValueChange={(value) =>
                    handleStatusChange(
                      selectedProposal.proposal_id,
                      value as Proposal["status"]
                    )
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                    <SelectItem value="no_response">Pending</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
