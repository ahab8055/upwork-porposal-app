export interface SkillMatch {
  skill: string;
  matched: boolean;
}

export interface SimilarProject {
  project_id: number;
  name: string;
  similarity: number;
}

export interface JobAnalysis {
  skill_match_score: number;
  experience_relevance_score: number;
  project_similarity_score: number;
  win_probability: number;
  recommendation: "strong_apply" | "consider" | "skip";
  recommendation_reasons?: string[];
  skill_matches?: SkillMatch[];
  similar_projects?: SimilarProject[];
  red_flags?: string[];
}

export interface AnalyzeJobRequest {
  job_description: string;
  platform?: string | null;
}

export interface GenerateProposalRequest {
  job_description: string;
  job_analysis: JobAnalysis;
  selected_projects?: number[];
  tone?: "professional" | "casual" | "formal";
  length?: "short" | "medium" | "long";
}

export interface GeneratedProposal {
  content: string;
}

export interface CreateProposalRequest {
  job_description: string;
  job_analysis: JobAnalysis;
  title: string;
  platform?: string;
}

export interface UpdateProposalRequest {
  content?: string;
  title?: string;
  status?: "draft" | "sent" | "won" | "lost" | "no_response" | "interviewing";
}

// --- Backend proposal generation API (analysis-driven, async) ---

export type ProposalProcessingStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface ProposalGenerateRequest {
  analysis_id: string;
  instructions?: string | null;
}

export interface ProposalGenerateResponse {
  proposal_id: string;
  version_id: string;
  status: ProposalProcessingStatus;
  message: string;
}

export interface RegenerateProposalRequest {
  instructions?: string | null;
}

export interface ProposalDetailRecord {
  id: string;
  proposal_id: string;
  workspace_id: string;
  analysis_id: string;
  user_id?: string | null;
  version_number: number;
  content: string;
  generation_instructions?: string | null;
  processing_status: ProposalProcessingStatus;
  processing_error?: string | null;
  ai_metadata?: Record<string, unknown>;
  user_edits?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  total_versions?: number;
}

export interface ProposalVersionSummary {
  id: string;
  proposal_id: string;
  workspace_id: string;
  analysis_id: string;
  user_id?: string | null;
  version_number: number;
  content_preview: string;
  generation_instructions?: string | null;
  processing_status: ProposalProcessingStatus;
  processing_error?: string | null;
  is_ai_generated?: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedProposalListResponse {
  items: ProposalVersionSummary[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface UpdateProposalVersionRequest {
  content: string;
  change_summary?: string | null;
}

export type ProposalSortField =
  | "created_at"
  | "updated_at"
  | "version_number"
  | "processing_status";

export type ProposalSortOrder = "asc" | "desc";

export interface ProposalListParams {
  page?: number;
  page_size?: number;
  search?: string;
  analysis_id?: string;
  user_id?: string;
  processing_status?: ProposalProcessingStatus;
  sort_by?: ProposalSortField;
  sort_order?: ProposalSortOrder;
}

export interface ProposalVersionListResponse {
  proposal_id: string;
  items: ProposalVersionSummary[];
  total_versions: number;
  latest_version_number: number | null;
}
