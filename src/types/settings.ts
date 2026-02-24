export interface Workspace {
  workspace_id: string;
  name: string;
  description: string;
}

export interface UpdateWorkspaceRequest {
  name: string;
  description: string;
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
