import { apiClient } from "@/lib/axios";
import type { Workspace, WorkspaceRole } from "@/types/auth";

export interface WorkspaceListResponse {
  workspaces: Array<{
    id: string;
    name: string;
    description?: string;
    owner_id: string;
    role: WorkspaceRole;
    created_at: string;
    updated_at: string;
  }>;
  default_workspace_id: string | null;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
}

export interface CreateWorkspaceResponse {
  workspace_id: string;
  name: string;
  role: WorkspaceRole;
}

export interface InviteToWorkspaceRequest {
  email: string;
  role?: WorkspaceRole;
}

export interface InviteToWorkspaceResponse {
  membership_id: string;
  email: string;
  workspace_name: string;
  role: WorkspaceRole;
}

export const workspaceService = {
  listWorkspaces: async (): Promise<WorkspaceListResponse> => {
    const response = await apiClient.get<WorkspaceListResponse>("/workspace/list");
    return response.data;
  },

  switchWorkspace: async (workspaceId: string): Promise<void> => {
    await apiClient.post("/workspace/switch", { workspace_id: workspaceId });
  },

  createWorkspace: async (data: CreateWorkspaceRequest): Promise<CreateWorkspaceResponse> => {
    const response = await apiClient.post<CreateWorkspaceResponse>("/workspace/create", data);
    return response.data;
  },

  inviteToWorkspace: async (data: InviteToWorkspaceRequest): Promise<InviteToWorkspaceResponse> => {
    const response = await apiClient.post<InviteToWorkspaceResponse>("/workspace/invite", data);
    return response.data;
  },

  getCurrentWorkspace: async (): Promise<{
    workspace_id: string;
    name: string;
    description?: string;
    owner_id: string;
    role: WorkspaceRole;
    api_keys: Record<string, string>;
    created_at: string;
    updated_at: string;
  }> => {
    const response = await apiClient.get("/workspace");
    return response.data;
  },
};
