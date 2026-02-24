import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teamService } from "@/services/teamService";
import { toast } from "sonner";
import type { InviteRequest } from "@/types/team";

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
    mutationFn: (memberId: number) => teamService.removeMember(memberId),
    onSuccess: () => {
      toast.success("Member removed");
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
    onError: () => {
      toast.error("Failed to remove member");
    },
  });
};
