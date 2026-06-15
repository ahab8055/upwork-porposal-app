import { useQuery } from "@tanstack/react-query";
import { proposalService } from "@/services/proposalService";
import type {
  ProposalListParams,
  ProposalProcessingStatus,
} from "@/types/proposal";

const POLLING_STATUSES: ProposalProcessingStatus[] = ["pending", "processing"];

export const useProposalList = (params: ProposalListParams) => {
  return useQuery({
    queryKey: ["proposals", params],
    queryFn: () => proposalService.listProposals(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useProposalHistoryStats = () => {
  return useQuery({
    queryKey: ["proposal-history-stats"],
    queryFn: async () => {
      const [all, completed, inProgress, failed] = await Promise.all([
        proposalService.listProposals({ page: 1, page_size: 1 }),
        proposalService.listProposals({
          page: 1,
          page_size: 1,
          processing_status: "completed",
        }),
        proposalService.listProposals({
          page: 1,
          page_size: 1,
          processing_status: "processing",
        }),
        proposalService.listProposals({
          page: 1,
          page_size: 1,
          processing_status: "failed",
        }),
      ]);

      const pending = await proposalService.listProposals({
        page: 1,
        page_size: 1,
        processing_status: "pending",
      });

      return {
        total: all.total,
        completed: completed.total,
        in_progress: inProgress.total + pending.total,
        failed: failed.total,
      };
    },
  });
};

export const useProposalVersions = (proposalId: string | null) => {
  return useQuery({
    queryKey: ["proposal-versions", proposalId],
    queryFn: () => proposalService.listProposalVersions(proposalId!),
    enabled: Boolean(proposalId),
  });
};

export { useProposalDetail } from "@/hooks/useProposalGeneration";

export const useProposalDetailPolling = (proposalId: string | null) => {
  return useQuery({
    queryKey: ["proposal-detail", proposalId],
    queryFn: () => proposalService.getProposalDetail(proposalId!),
    enabled: Boolean(proposalId),
    refetchInterval: (query) => {
      const status = query.state.data?.processing_status;
      if (status && POLLING_STATUSES.includes(status)) {
        return 3000;
      }
      return false;
    },
  });
};
