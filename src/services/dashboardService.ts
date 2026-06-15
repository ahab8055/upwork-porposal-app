import { apiClient } from "@/lib/axios";
import type { DashboardOverview } from "@/types/dashboard";

export const dashboardService = {
  getOverview: async (recentLimit = 5): Promise<DashboardOverview> => {
    const response = await apiClient.get<DashboardOverview>(
      "/dashboard/overview",
      { params: { recent_limit: recentLimit } }
    );
    return response.data;
  },
};
