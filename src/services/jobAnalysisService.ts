import { apiClient } from "@/lib/axios";
import type {
  JobAnalysisListParams,
  JobAnalysisRecord,
  PaginatedJobAnalysisList,
  SubmitJobAnalysisRequest,
  SubmitJobAnalysisResponse,
} from "@/types/job-analysis";

export const jobAnalysisService = {
  submitAnalysis: async (
    data: SubmitJobAnalysisRequest
  ): Promise<SubmitJobAnalysisResponse> => {
    const response = await apiClient.post<SubmitJobAnalysisResponse>(
      "/job-analysis",
      data
    );
    return response.data;
  },

  getAnalysis: async (analysisId: string): Promise<JobAnalysisRecord> => {
    const response = await apiClient.get<JobAnalysisRecord>(
      `/job-analysis/${analysisId}`
    );
    return response.data;
  },

  listAnalyses: async (
    params?: JobAnalysisListParams
  ): Promise<PaginatedJobAnalysisList> => {
    const response = await apiClient.get<PaginatedJobAnalysisList>(
      "/job-analysis",
      { params }
    );
    return response.data;
  },
};
