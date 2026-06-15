import type { ProposalProcessingStatus, ProposalVersionSummary } from "@/types/proposal";

export interface DashboardStats {
  total_proposals: number;
  proposals_this_week: number;
  completed_proposals: number;
  in_progress_proposals: number;
  failed_proposals: number;
  job_analyses: number;
  job_analyses_this_week: number;
  average_fit_score: number | null;
  total_projects: number;
  total_resumes: number;
  total_documents: number;
  feedback_count: number;
  average_feedback_rating: number | null;
  sent_count: number;
  hired_count: number;
  win_rate: number;
}

export interface DashboardOverview {
  stats: DashboardStats;
  recent_proposals: DashboardRecentProposal[];
}

export type DashboardRecentProposal = ProposalVersionSummary;

/** @deprecated Legacy dashboard proposal shape — use DashboardRecentProposal */
export interface Proposal {
  proposal_id: number;
  title: string;
  content?: string;
  job_description: string;
  created_at: string;
  status: "draft" | "sent" | "won" | "lost" | "no_response" | "interviewing";
  platform?: string;
  job_analysis?: {
    skill_match_score: number;
    win_probability: number;
  };
}

export interface ProposalStats {
  total: number;
  won: number;
  lost: number;
  pending: number;
  win_rate: number;
  lost_rate: number;
  pending_rate: number;
}

export function getProposalStatusLabel(status: ProposalProcessingStatus): string {
  switch (status) {
    case "completed":
      return "Ready";
    case "processing":
      return "Generating";
    case "pending":
      return "Queued";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

export function getProposalStatusColor(status: ProposalProcessingStatus): string {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    case "processing":
      return "bg-amber-100 text-amber-700";
    case "pending":
      return "bg-blue-100 text-blue-700";
    case "failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}
