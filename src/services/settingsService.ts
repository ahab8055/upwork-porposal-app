import { apiClient } from "@/lib/axios";
import {
  Workspace,
  UpdateWorkspaceRequest,
  ApiKeysStatus,
  UpdateApiKeysRequest,
} from "@/types/settings";

export const settingsService = {
  // Get workspace info
  getWorkspace: async (): Promise<Workspace> => {
    const response = await apiClient.get("/workspace");
    return response.data;
  },

  // Update workspace info
  updateWorkspace: async (data: UpdateWorkspaceRequest): Promise<Workspace> => {
    const formData = new FormData();

    if (typeof data.name === "string") {
      formData.append("name", data.name);
    }

    if (typeof data.industry === "string") {
      formData.append("industry", data.industry);
    }

    if (typeof data.description === "string") {
      formData.append("description", data.description);
    }

    if (typeof data.company_size === "string") {
      formData.append("company_size", data.company_size);
    }

    if (data.logo) {
      formData.append("logo", data.logo);
    }

    if (Array.isArray(data.skills)) {
      formData.append("skills_json", JSON.stringify(data.skills));
    }

    const response = await apiClient.put("/workspace", formData);

    const body = response.data;
    if (body?.workspace) {
      return {
        workspace_id: body.workspace.id,
        name: body.workspace.name,
        description: body.workspace.description,
        industry: body.workspace.industry,
        company_size: body.workspace.company_size,
        skills: body.workspace.skills,
        logo: body.workspace.logo,
        logo_url: body.workspace.logo_url,
      };
    }

    return body;
  },

  // Get API keys status
  getApiKeys: async (): Promise<ApiKeysStatus> => {
    const response = await apiClient.get("/workspace/api-keys");
    return response.data;
  },

  // Update API keys
  updateApiKeys: async (data: UpdateApiKeysRequest): Promise<ApiKeysStatus> => {
    const response = await apiClient.put("/workspace/api-keys", data);
    return response.data;
  },
};
