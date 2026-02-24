import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proposalService } from "@/services/proposalService";
import { toast } from "sonner";
import type {
  AnalyzeJobRequest,
  GenerateProposalRequest,
  CreateProposalRequest,
  UpdateProposalRequest,
} from "@/types/proposal";

export const useProposals = (statusFilter?: string) => {
  return useQuery({
    queryKey: ["proposals", statusFilter],
    queryFn: () => proposalService.getProposals(statusFilter),
  });
};

export const useProposal = (id: number) => {
  return useQuery({
    queryKey: ["proposal", id],
    queryFn: () => proposalService.getProposalById(id),
    enabled: !!id,
  });
};

export const useUpdateProposalStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: "draft" | "sent" | "won" | "lost" | "no_response" | "interviewing" }) =>
      proposalService.updateProposalStatus(id, status),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      queryClient.invalidateQueries({ queryKey: ["proposal"] });
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });
};

export const useDeleteProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => proposalService.deleteProposal(id),
    onSuccess: () => {
      toast.success("Proposal deleted");
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
    onError: () => {
      toast.error("Failed to delete proposal");
    },
  });
};

export const useAnalyzeJob = () => {
  return useMutation({
    mutationFn: (data: AnalyzeJobRequest) => proposalService.analyzeJob(data),
    onSuccess: () => {
      toast.success("Job analyzed successfully");
    },
    onError: () => {
      toast.error("Failed to analyze job");
    },
  });
};

export const useGenerateProposal = () => {
  return useMutation({
    mutationFn: (data: GenerateProposalRequest) => proposalService.generateProposal(data),
    onSuccess: () => {
      toast.success("Proposal generated!");
    },
    onError: () => {
      toast.error("Failed to generate proposal");
    },
  });
};

export const useCreateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProposalRequest) => proposalService.createProposal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
    onError: () => {
      toast.error("Failed to create proposal");
    },
  });
};

export const useUpdateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProposalRequest }) =>
      proposalService.updateProposal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      queryClient.invalidateQueries({ queryKey: ["proposal"] });
    },
    onError: () => {
      toast.error("Failed to update proposal");
    },
  });
};
