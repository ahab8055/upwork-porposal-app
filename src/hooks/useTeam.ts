import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { teamService } from "@/services/teamService";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { InviteRequest, AcceptInviteRequest } from "@/types/team";

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ["team"],
    queryFn: () => teamService.getTeamMembers(),
  });
};

export const useInviteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteRequest) => teamService.inviteMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
    onError: () => {
      toast.error("Failed to send invitation");
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => teamService.removeMember(memberId),
    onSuccess: () => {
      toast.success("Member removed");
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
    onError: () => {
      toast.error("Failed to remove member");
    },
  });
};

export const useAcceptInvite = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: AcceptInviteRequest) => teamService.acceptInvite(data),
    onSuccess: () => {
      toast.success("Invite accepted! Please log in.");
      router.push("/login");
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      toast.error(
        error.response?.data?.detail || "Invalid or expired invite link"
      );
    },
  });
};
