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
    const response = await apiClient.put("/workspace", data);
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
