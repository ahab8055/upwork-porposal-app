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
