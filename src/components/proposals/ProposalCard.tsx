"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Clock,
  User,
  Globe,
  Calendar,
  Send,
  Eye,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";
import type { Proposal } from "@/types/dashboard";

interface ProposalCardProps {
  proposal: Proposal;
  onStatusChange: (proposalId: number, status: Proposal["status"]) => void;
  onViewDetails: (proposalId: number) => void;
}

const statusConfig = {
  draft: {
    label: "Draft",
    bg: "bg-slate-100",
    text: "text-slate-700",
    icon: FileText,
  },
  sent: {
    label: "Sent",
    bg: "bg-blue-100",
    text: "text-blue-700",
    icon: Send,
  },
  won: {
    label: "Won",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: CheckCircle,
  },
  lost: {
    label: "Lost",
    bg: "bg-red-100",
    text: "text-red-700",
    icon: XCircle,
  },
  no_response: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-700",
    icon: Clock,
  },
  interviewing: {
    label: "Interviewing",
    bg: "bg-violet-100",
    text: "text-violet-700",
    icon: Eye,
  },
};

function formatProposalId(id: number): string {
  return `PROP-${String(id).padStart(3, "0")}`;
}

export function ProposalCard({
  proposal,
  onStatusChange,
  onViewDetails,
}: ProposalCardProps) {
  const status = statusConfig[proposal.status] || statusConfig.draft;
  const StatusIcon = status.icon;

  const winProbability = proposal.job_analysis?.win_probability ?? 0;

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-sm transition-all"
      data-testid={`proposal-card-${proposal.proposal_id}`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-heading font-semibold text-slate-900 truncate">
              {proposal.title}
            </h3>
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shrink-0",
                status.bg,
                status.text
              )}
            >
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            {formatProposalId(proposal.proposal_id)}
          </p>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User className="w-4 h-4 text-slate-400" />
          <span className="truncate">Client</span>
        </div>
        {proposal.platform && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="truncate">{proposal.platform}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="truncate">
            {new Date(proposal.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Send className="w-4 h-4 text-slate-400" />
          <span className="truncate">
            {proposal.status === "sent" || proposal.status === "won" || proposal.status === "lost"
              ? "Submitted"
              : "Not submitted"}
          </span>
        </div>
      </div>

      {/* Amount and Win Probability */}
      <div className="flex items-center gap-6 mb-4 pt-4 border-t border-slate-100">
        {proposal.job_analysis && (
          <>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-900">--</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Win Probability</span>
                <span className="text-xs font-medium text-slate-700">
                  {winProbability}%
                </span>
              </div>
              <Progress
                value={winProbability}
                className="h-2"
              />
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Skill Match</p>
              <p className="text-sm font-medium text-slate-700">
                {proposal.job_analysis.skill_match_score}%
              </p>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <Select
          value={proposal.status}
          onValueChange={(value) =>
            onStatusChange(proposal.proposal_id, value as Proposal["status"])
          }
        >
          <SelectTrigger className="w-40" data-testid={`status-select-${proposal.proposal_id}`}>
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(proposal.proposal_id)}
          data-testid={`view-details-${proposal.proposal_id}`}
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </Button>
      </div>
    </div>
  );
}
