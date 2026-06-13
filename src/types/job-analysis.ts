export type JobAnalysisProcessingStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type JobAnalysisRecommendation =
  | "strong_apply"
  | "consider"
  | "skip"
  | string;

export interface SubmitJobAnalysisRequest {
  job_title: string;
  job_description: string;
  metadata?: Record<string, unknown>;
}

export interface SubmitJobAnalysisResponse {
  analysis_id: string;
  status: JobAnalysisProcessingStatus;
  message: string;
}

export interface JobAnalysisRecord {
  id: string;
  workspace_id: string;
  user_id?: string | null;
  job_title?: string | null;
  job_description: string;
  metadata: Record<string, unknown>;
  analysis_results: Record<string, unknown>;
  fit_score?: number | null;
  match_score?: number | null;
  strengths: string[];
  weaknesses: string[];
  missing_skills: string[];
  risks: string[];
  recommendations: {
    decision?: string;
    reasoning?: string;
    reason?: string;
  };
  ai_metadata: Record<string, unknown>;
  processing_status: JobAnalysisProcessingStatus;
  processing_error?: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobAnalysisListItem {
  id: string;
  workspace_id: string;
  user_id?: string | null;
  job_title?: string | null;
  job_description_preview: string;
  metadata: Record<string, unknown>;
  fit_score?: number | null;
  recommendation_decision?: string | null;
  processing_status: JobAnalysisProcessingStatus;
  processing_error?: string | null;
  strengths_count: number;
  weaknesses_count: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedJobAnalysisList {
  items: JobAnalysisListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export type JobAnalysisSortField =
  | "created_at"
  | "updated_at"
  | "fit_score"
  | "job_title"
  | "processing_status";

export type JobAnalysisSortOrder = "asc" | "desc";

export interface JobAnalysisListParams {
  page?: number;
  page_size?: number;
  search?: string;
  processing_status?: JobAnalysisProcessingStatus;
  sort_by?: JobAnalysisSortField;
  sort_order?: JobAnalysisSortOrder;
}
