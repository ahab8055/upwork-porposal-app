import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { settingsService } from "@/services/settingsService";
import {
  UpdateWorkspaceRequest,
  UpdateApiKeysRequest,
  Workspace,
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
    onSuccess: (updatedWorkspace) => {
      queryClient.setQueryData<Workspace>(
        ["workspace"],
        (current) => ({
          ...current,
          ...updatedWorkspace,
          workspace_id:
            updatedWorkspace.workspace_id || current?.workspace_id || "",
          name: updatedWorkspace.name ?? current?.name ?? "",
          description: updatedWorkspace.description ?? current?.description ?? "",
          skills: updatedWorkspace.skills ?? current?.skills ?? [],
          industry: updatedWorkspace.industry ?? current?.industry,
          company_size: updatedWorkspace.company_size ?? current?.company_size,
          logo: updatedWorkspace.logo ?? current?.logo,
          logo_url: updatedWorkspace.logo_url ?? current?.logo_url,
        })
      );
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
      toast.success("Workspace updated");
    },
    onError: (error: AxiosError<{ detail?: string | Array<{ msg: string }> }>) => {
      const detail = error.response?.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
            ? detail.map((item) => item.msg).join(", ")
            : "Failed to update workspace";
      toast.error(message);
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
