import { apiClient } from "@/lib/axios";
import { knowledgeBaseService } from "./knowledgeBaseService";

export interface TeamInvite {
  full_name: string;
  email: string;
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
  team_invites: TeamInvite[];
  knowledge_base_files?: KnowledgeBaseFile[];
}

export interface OnboardingCompleteResponse {
  success: boolean;
  message: string;
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
    data: OnboardingCompleteRequest
  ): Promise<OnboardingCompleteResponse> => {
    // Upload knowledge base files first (if any)
    if (data.knowledge_base_files && data.knowledge_base_files.length > 0) {
      const uploadPromises = data.knowledge_base_files.map((item) => {
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

    // Then complete onboarding
    const { knowledge_base_files, ...onboardingData } = data;
    const response = await apiClient.post<OnboardingCompleteResponse>(
      "/auth/onboarding/complete",
      onboardingData
    );
    return response.data;
  },
};
