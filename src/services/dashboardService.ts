import { apiClient } from "@/lib/axios";
import type { DashboardStats, Proposal } from "@/types/dashboard";

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>("/stats");
    return response.data;
  },

  getProposals: async (): Promise<Proposal[]> => {
    const response = await apiClient.get<Proposal[]>("/proposals");
    return response.data;
  },

  getRecentProposals: async (limit: number = 5): Promise<Proposal[]> => {
    const proposals = await dashboardService.getProposals();
    return proposals.slice(0, limit);
  },
};
