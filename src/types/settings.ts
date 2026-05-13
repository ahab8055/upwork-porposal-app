export interface Workspace {
  workspace_id: string;
  name: string;
  description: string;
  industry?: string;
  company_size?: string;
  logo?: string;
  logo_url?: string;
  skills?: string[];
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  industry?: string;
  company_size?: string;
  skills?: string[];
  logo?: File;
}

export interface ApiKeysStatus {
  has_claude_key: boolean;
  has_openai_key: boolean;
  preferred_model: "claude" | "openai";
  claude_api_key?: string; // Masked key if exists
  openai_api_key?: string; // Masked key if exists
}

export interface UpdateApiKeysRequest {
  preferred_model: "claude" | "openai";
  claude_api_key?: string;
  openai_api_key?: string;
}
