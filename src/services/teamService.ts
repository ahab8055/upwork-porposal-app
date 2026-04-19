import { apiClient } from "@/lib/axios";
import type { TeamMember, InviteRequest, InviteResponse, AcceptInviteRequest } from "@/types/team";

export const teamService = {
  getTeamMembers: async (): Promise<TeamMember[]> => {
    const response = await apiClient.get<TeamMember[]>("/team");
    return response.data;
  },

  inviteMember: async (data: InviteRequest): Promise<InviteResponse> => {
    const response = await apiClient.post<InviteResponse>("/team/invite", data);
    return response.data;
  },

  removeMember: async (memberId: string): Promise<void> => {
    await apiClient.delete(`/team/${memberId}`);
  },

  acceptInvite: async (data: AcceptInviteRequest): Promise<void> => {
    await apiClient.post("/team/invite/accept", data);
  },
};
