import { apiClient } from "@/lib/axios";
import { knowledgeBaseService } from "./knowledgeBaseService";
import { authService } from "./authService";
import { teamService } from "./teamService";

export interface TeamInvite {
  name: string;
  email: string;
  role?: "owner" | "admin" | "member" | "viewer";
}

export interface KnowledgeBaseFile {
  file: File;
  category: string;
}

export interface OnboardingCompleteRequest {
  company_name: string;
  industry?: string;
  company_size?: string;
  skills: string[];
  logo?: File | null;
  team_invites: TeamInvite[];
  knowledge_base_files?: KnowledgeBaseFile[];
}

export interface OnboardingCompleteResponse {
  success: boolean;
  message: string;
  workspace_id?: string;
}

// Map frontend categories to backend document types
const categoryToDocumentType: Record<string, string> = {
  "project-documents": "case_study",
  "team-resumes": "resume",
  "portfolio-items": "portfolio",
  "other-documents": "other",
};

export const onboardingService = {
  completeOnboarding: async (
    data: OnboardingCompleteRequest,
    onWorkspaceCreated?: (workspaceId: string) => void
  ): Promise<OnboardingCompleteResponse> => {
    // First complete onboarding (this creates the workspace on the backend)
    const { knowledge_base_files, team_invites, ...onboardingData } = data;
    const onboardingFormData = new FormData();
    onboardingFormData.append("company_name", onboardingData.company_name);
    if (onboardingData.industry) {
      onboardingFormData.append("industry", onboardingData.industry);
    }
    if (onboardingData.company_size) {
      onboardingFormData.append("company_size", onboardingData.company_size);
    }
    if (onboardingData.logo) {
      onboardingFormData.append("logo", onboardingData.logo);
    }
    onboardingData.skills.forEach((skill, index) => onboardingFormData.append(`skills[${index}]`, skill));
    const response = await apiClient.post<OnboardingCompleteResponse>(
      "/auth/onboarding/complete",
      onboardingFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // If onboarding returned a workspace_id, use the callback to update state
    if (response.data.workspace_id && onWorkspaceCreated) {
      onWorkspaceCreated(response.data.workspace_id);
    } else if (onWorkspaceCreated) {
      // Fetch updated user data to get the new workspace
      try {
        const user = await authService.getCurrentUser();
        const workspaceId = user.default_workspace_id || user.workspaces?.[0]?.id;
        if (workspaceId) {
          onWorkspaceCreated(workspaceId);
        }
      } catch (e) {
        console.error("Error fetching user after onboarding:", e);
      }
    }

    if (team_invites && team_invites.length > 0) {
      try {
        await teamService.inviteMember({ members: team_invites });
      } catch (e) {
        console.error("Error sending team invites:", e);
      }
    }

    // Now upload knowledge base files (workspace should exist now)
    if (knowledge_base_files && knowledge_base_files.length > 0) {
      const uploadPromises = knowledge_base_files.map((item) => {
        const documentType = categoryToDocumentType[item.category] || "other";
        return knowledgeBaseService.uploadDocument(
          item.file,
          documentType,
          item.file.name
        );
      });

      // Upload all files in parallel
      await Promise.all(uploadPromises);
    }

    return response.data;
  },
};
