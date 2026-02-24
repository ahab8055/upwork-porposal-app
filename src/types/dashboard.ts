export interface DashboardStats {
  total_proposals: number;
  win_rate: number;
  total_projects: number;
  total_resumes: number;
}

export interface JobAnalysis {
  skill_match_score: number;
  win_probability: number;
}

export interface Proposal {
  proposal_id: number;
  title: string;
  content?: string;
  job_description: string;
  created_at: string;
  status: "draft" | "sent" | "won" | "lost" | "no_response" | "interviewing";
  platform?: string;
  job_analysis?: JobAnalysis;
}

export interface ProposalsResponse {
  proposals: Proposal[];
  total: number;
}
