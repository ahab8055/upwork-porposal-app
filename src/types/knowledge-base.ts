export interface Document {
  document_id: number;
  title: string;
  document_type: string;
  file_name?: string;
  file_path?: string;
  extracted_skills?: string[];
  created_at: string;
  updated_at?: string;
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
