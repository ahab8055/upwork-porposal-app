import { apiClient } from "@/lib/axios";
import type { Proposal } from "@/types/dashboard";
import type {
  AnalyzeJobRequest,
  JobAnalysis,
  GenerateProposalRequest,
  GeneratedProposal,
  CreateProposalRequest,
  UpdateProposalRequest,
} from "@/types/proposal";

interface UpdateProposalStatusPayload {
  status: "draft" | "sent" | "won" | "lost" | "no_response" | "interviewing";
}

export const proposalService = {
  getProposals: async (statusFilter?: string): Promise<Proposal[]> => {
    const url = statusFilter && statusFilter !== "all" 
      ? `/proposals?status=${statusFilter}` 
      : "/proposals";
    const response = await apiClient.get<Proposal[]>(url);
    return response.data;
  },

  getProposalById: async (id: number): Promise<Proposal> => {
    const response = await apiClient.get<Proposal>(`/proposals/${id}`);
    return response.data;
  },

  updateProposalStatus: async (
    id: number,
    status: UpdateProposalStatusPayload["status"]
  ): Promise<Proposal> => {
    const response = await apiClient.put<Proposal>(`/proposals/${id}`, { status });
    return response.data;
  },

  deleteProposal: async (id: number): Promise<void> => {
    await apiClient.delete(`/proposals/${id}`);
  },

  analyzeJob: async (data: AnalyzeJobRequest): Promise<JobAnalysis> => {
    const response = await apiClient.post<JobAnalysis>("/analyze-job", data);
    return response.data;
  },

  generateProposal: async (data: GenerateProposalRequest): Promise<GeneratedProposal> => {
    const response = await apiClient.post<GeneratedProposal>("/proposals/generate", data);
    return response.data;
  },

  createProposal: async (data: CreateProposalRequest): Promise<Proposal> => {
    const response = await apiClient.post<Proposal>("/proposals", data);
    return response.data;
  },

  updateProposal: async (id: number, data: UpdateProposalRequest): Promise<Proposal> => {
    const response = await apiClient.put<Proposal>(`/proposals/${id}`, data);
    return response.data;
  },
};
