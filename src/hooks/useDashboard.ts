import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => dashboardService.getStats(),
  });
}

export function useRecentProposals(limit: number = 5) {
  return useQuery({
    queryKey: ["recentProposals", limit],
    queryFn: () => dashboardService.getRecentProposals(limit),
  });
}

export function useProposals() {
  return useQuery({
    queryKey: ["proposals"],
    queryFn: () => dashboardService.getProposals(),
  });
}
