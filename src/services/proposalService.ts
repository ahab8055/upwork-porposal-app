import { apiClient } from "@/lib/axios";
import type { Proposal, ProposalStats } from "@/types/dashboard";
import type {
  AnalyzeJobRequest,
  JobAnalysis,
  GenerateProposalRequest,
  GeneratedProposal,
  CreateProposalRequest,
  UpdateProposalRequest,
  ProposalDetailRecord,
  ProposalGenerateRequest,
  ProposalGenerateResponse,
  RegenerateProposalRequest,
  UpdateProposalVersionRequest,
  PaginatedProposalListResponse,
  ProposalListParams,
  ProposalVersionListResponse,
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

  /** Request async proposal generation from a completed job analysis. */
  requestProposalGeneration: async (
    data: ProposalGenerateRequest
  ): Promise<ProposalGenerateResponse> => {
    const response = await apiClient.post<ProposalGenerateResponse>(
      "/proposals/generate",
      data
    );
    return response.data;
  },

  /** Request a new AI-generated version for an existing proposal. */
  regenerateProposal: async (
    proposalId: string,
    data: RegenerateProposalRequest = {}
  ): Promise<ProposalGenerateResponse> => {
    const response = await apiClient.post<ProposalGenerateResponse>(
      `/proposals/${proposalId}/regenerate`,
      data
    );
    return response.data;
  },

  /** Poll latest version of a proposal by proposal_id. */
  getProposalDetail: async (proposalId: string): Promise<ProposalDetailRecord> => {
    const response = await apiClient.get<ProposalDetailRecord>(
      `/proposals/${proposalId}`
    );
    return response.data;
  },

  /** Load a specific proposal version by version id. */
  getProposalVersion: async (versionId: string): Promise<ProposalDetailRecord> => {
    const response = await apiClient.get<ProposalDetailRecord>(
      `/proposals/versions/${versionId}`
    );
    return response.data;
  },

  /** Persist in-place edits to a proposal version. */
  saveProposalVersion: async (
    versionId: string,
    data: UpdateProposalVersionRequest
  ): Promise<ProposalDetailRecord> => {
    const response = await apiClient.put<ProposalDetailRecord>(
      `/proposals/versions/${versionId}`,
      data
    );
    return response.data;
  },

  /** Paginated proposal history for the workspace. */
  listProposals: async (
    params: ProposalListParams = {}
  ): Promise<PaginatedProposalListResponse> => {
    const response = await apiClient.get<PaginatedProposalListResponse>(
      "/proposals",
      { params }
    );
    return response.data;
  },

  /** Version history for a proposal. */
  listProposalVersions: async (
    proposalId: string
  ): Promise<ProposalVersionListResponse> => {
    const response = await apiClient.get<ProposalVersionListResponse>(
      `/proposals/${proposalId}/versions`
    );
    return response.data;
  },

  /** Load a specific proposal version by proposal id and version number. */
  getProposalVersionByNumber: async (
    proposalId: string,
    versionNumber: number
  ): Promise<ProposalDetailRecord> => {
    const response = await apiClient.get<ProposalDetailRecord>(
      `/proposals/${proposalId}/versions/${versionNumber}`
    );
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

  getProposalStats: async (): Promise<ProposalStats> => {
    const response = await apiClient.get<ProposalStats>("/proposals/stats");
    return response.data;
  },

  exportProposals: async (format: "csv" | "json" = "csv"): Promise<Blob> => {
    const response = await apiClient.get(`/proposals/export?format=${format}`, {
      responseType: "blob",
    });
    return response.data;
  },
};
