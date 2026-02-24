"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useProposals,
  useUpdateProposalStatus,
  useDeleteProposal,
  useProposal,
} from "@/hooks/useProposals";
import {
  FileText,
  Plus,
  Clock,
  Copy,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import type { Proposal } from "@/types/dashboard";

export default function ProposalsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(
    null
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const { data: proposals = [], isLoading } = useProposals(statusFilter);
  const { data: selectedProposal } = useProposal(selectedProposalId!);
  const updateStatusMutation = useUpdateProposalStatus();
  const deleteProposalMutation = useDeleteProposal();

  const handleViewProposal = (proposalId: number) => {
    setSelectedProposalId(proposalId);
    setViewModalOpen(true);
  };

  const handleUpdateStatus = (
    proposalId: number,
    newStatus: Proposal["status"]
  ) => {
    updateStatusMutation.mutate({ id: proposalId, status: newStatus });
  };

  const handleDelete = (proposalId: number) => {
    deleteProposalMutation.mutate(proposalId, {
      onSuccess: () => {
        setViewModalOpen(false);
      },
    });
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

  const getStatusIcon = (status: Proposal["status"]) => {
    const icons = {
      draft: <FileText className="w-4 h-4" />,
      sent: <Send className="w-4 h-4" />,
      won: <CheckCircle className="w-4 h-4" />,
      lost: <XCircle className="w-4 h-4" />,
      no_response: <Clock className="w-4 h-4" />,
      interviewing: <Eye className="w-4 h-4" />,
    };
    return icons[status] || icons.draft;
  };

  return (
    <div className="p-8" data-testid="proposals-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">
            Proposals
          </h1>
          <p className="text-slate-600 mt-1">Track and manage your proposals</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40" data-testid="status-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Proposals</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="no_response">No Response</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
            </SelectContent>
          </Select>
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

      {/* Proposals List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-slate-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : proposals.length > 0 ? (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.proposal_id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-colors"
              data-testid={`proposal-item-${proposal.proposal_id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-slate-900 mb-1">
                      {proposal.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(proposal.created_at).toLocaleDateString()}
                      </span>
                      {proposal.platform && (
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">
                          {proposal.platform}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Select
                    value={proposal.status}
                    onValueChange={(value) =>
                      handleUpdateStatus(
                        proposal.proposal_id,
                        value as Proposal["status"]
                      )
                    }
                  >
                    <SelectTrigger
                      className={`w-32 h-8 text-xs ${getStatusColor(
                        proposal.status
                      )}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="no_response">No Response</SelectItem>
                      <SelectItem value="interviewing">Interviewing</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProposal(proposal.proposal_id)}
                    data-testid={`view-proposal-${proposal.proposal_id}`}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(proposal.proposal_id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Match scores if available */}
              {proposal.job_analysis && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Skill Match:</span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        proposal.job_analysis.skill_match_score >= 70
                          ? "bg-emerald-100 text-emerald-700"
                          : proposal.job_analysis.skill_match_score >= 40
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {proposal.job_analysis.skill_match_score}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      Win Probability:
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        proposal.job_analysis.win_probability >= 50
                          ? "bg-emerald-100 text-emerald-700"
                          : proposal.job_analysis.win_probability >= 30
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {proposal.job_analysis.win_probability}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-semibold text-slate-900 mb-2">
            No proposals yet
          </h3>
          <p className="text-slate-500 mb-6">
            Create your first proposal to get started
          </p>
          <Link href="/new-proposal">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="create-first-proposal-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Proposal
            </Button>
          </Link>
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
                  {getStatusIcon(selectedProposal.status)}
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
                    handleUpdateStatus(
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
                    <SelectItem value="no_response">No Response</SelectItem>
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
