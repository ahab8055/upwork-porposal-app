import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { teamService } from "@/services/teamService";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { InviteRequest, AcceptInviteRequest, WorkspaceRole, TeamMember } from "@/types/team";

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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      return data;
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      toast.error(error.response?.data?.detail || "Failed to send invitation");
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => teamService.removeMember(memberId),
    onMutate: async (memberId) => {
      await queryClient.cancelQueries({ queryKey: ["team"] });
      const previousMembers = queryClient.getQueryData<TeamMember[]>(["team"]);
      queryClient.setQueryData<TeamMember[]>(["team"], (old) =>
        (old ?? []).filter((member) => member.member_id !== memberId)
      );
      return { previousMembers };
    },
    onSuccess: () => {
      toast.success("Member removed");
    },
    onError: (error: AxiosError<{ detail?: string }>, _memberId, context) => {
      if (context?.previousMembers) {
        queryClient.setQueryData(["team"], context.previousMembers);
      }
      toast.error(error.response?.data?.detail || "Failed to remove member");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
};

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: string;
      role: WorkspaceRole;
    }) => teamService.updateMemberRole(memberId, role),
    onSuccess: (data) => {
      toast.success("Role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["team"] });
      return data;
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      toast.error(error.response?.data?.detail || "Failed to update role");
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
