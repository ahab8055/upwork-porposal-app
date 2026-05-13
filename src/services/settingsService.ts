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
      data.skills.forEach((skill, index) => {
        formData.append(`skills[${index}]`, skill);
      });
    }

    const response = await apiClient.put("/workspace", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
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
