import { apiClient } from "@/lib/axios";
import type { TeamMember, InviteRequest, InviteResponse } from "@/types/team";

export const teamService = {
  getTeamMembers: async (): Promise<TeamMember[]> => {
    const response = await apiClient.get<TeamMember[]>("/team");
    return response.data;
  },

  inviteMember: async (data: InviteRequest): Promise<InviteResponse> => {
    const response = await apiClient.post<InviteResponse>("/workspace/invite", data);
    return response.data;
  },

  removeMember: async (memberId: string): Promise<void> => {
    await apiClient.delete(`/team/${memberId}`);
  },
};
