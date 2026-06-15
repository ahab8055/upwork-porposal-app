import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

export function useDashboardOverview(recentLimit: number = 5) {
  return useQuery({
    queryKey: ["dashboardOverview", recentLimit],
    queryFn: () => dashboardService.getOverview(recentLimit),
  });
}
