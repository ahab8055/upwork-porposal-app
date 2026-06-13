export type StorageType = "database" | "s3";
export type DocumentProcessingStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface UploadDocumentResponse {
  document_id: string;
  message: string;
  processing_status?: DocumentProcessingStatus;
}

export interface Document {
  document_id: string;
  title: string;
  document_type: string;
  file_name?: string;
  file_path?: string;
  file_size?: number;
  extracted_skills?: string[];
  processing_status?: DocumentProcessingStatus;
  processing_error?: string | null;
  created_at: string;
  updated_at?: string;
  storage_type: StorageType;
  content_type?: string;
  download_url?: string;
}

export interface DocumentDownloadResponse {
  document_id: string;
  download_url: string;
  expires_in: number;
}

export interface Project {
  project_id: number;
  name: string;
  description: string;
  client_name?: string;
  industry?: string;
  technologies: string[];
  team_size?: number;
  duration_months?: number;
  budget_range?: string;
  outcome?: string;
  created_at: string;
  updated_at?: string;
}

export interface Resume {
  resume_id: number;
  name: string;
  title: string;
  email?: string;
  summary?: string;
  skills: string[];
  experience_years?: number;
  created_at: string;
  updated_at?: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  client_name?: string;
  industry?: string;
  technologies: string[];
  team_size?: number | null;
  duration_months?: number | null;
  budget_range?: string;
  outcome?: string;
}

export interface CreateResumeRequest {
  name: string;
  title: string;
  email?: string;
  summary?: string;
  skills: string[];
  experience_years?: number | null;
}
