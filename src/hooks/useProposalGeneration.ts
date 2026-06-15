import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { proposalService } from "@/services/proposalService";
import type {
  ProposalGenerateRequest,
  ProposalProcessingStatus,
  RegenerateProposalRequest,
} from "@/types/proposal";

const POLLING_STATUSES: ProposalProcessingStatus[] = ["pending", "processing"];

export const useRequestProposalGeneration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProposalGenerateRequest) =>
      proposalService.requestProposalGeneration(data),
    onSuccess: (response) => {
      toast.success(response.message || "Proposal generation started");
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const detail = error.response?.data?.detail;
      toast.error(
        typeof detail === "string" ? detail : "Failed to start proposal generation"
      );
    },
  });
};

export const useProposalDetail = (proposalId: string | null) => {
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

export const useRegenerateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      proposalId,
      data = {},
    }: {
      proposalId: string;
      data?: RegenerateProposalRequest;
    }) => proposalService.regenerateProposal(proposalId, data),
    onSuccess: (response) => {
      toast.success(response.message || "Regeneration started");
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      queryClient.invalidateQueries({
        queryKey: ["proposal-versions", response.proposal_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["proposal-detail", response.proposal_id],
      });
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const detail = error.response?.data?.detail;
      toast.error(
        typeof detail === "string" ? detail : "Failed to regenerate proposal"
      );
    },
  });
};
