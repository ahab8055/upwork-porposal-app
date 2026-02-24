import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/settingsService";
import {
  UpdateWorkspaceRequest,
  UpdateApiKeysRequest,
} from "@/types/settings";
import { toast } from "sonner";

// Get workspace info
export const useWorkspace = () => {
  return useQuery({
    queryKey: ["workspace"],
    queryFn: settingsService.getWorkspace,
  });
};

// Update workspace info
export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWorkspaceRequest) =>
      settingsService.updateWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
      toast.success("Workspace updated");
    },
    onError: () => {
      toast.error("Failed to update workspace");
    },
  });
};

// Get API keys status
export const useApiKeys = () => {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: settingsService.getApiKeys,
  });
};

// Update API keys
export const useUpdateApiKeys = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateApiKeysRequest) =>
      settingsService.updateApiKeys(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API keys saved successfully");
    },
    onError: () => {
      toast.error("Failed to save API keys");
    },
  });
};
