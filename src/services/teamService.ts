import { apiClient } from "@/lib/axios";
import type {
  TeamMember,
  InviteRequest,
  BulkInviteResponse,
  AcceptInviteRequest,
  UpdateRoleResponse,
  WorkspaceRole,
} from "@/types/team";

export const teamService = {
  getTeamMembers: async (): Promise<TeamMember[]> => {
    const response = await apiClient.get<TeamMember[]>("/team");
    return response.data;
  },

  inviteMember: async (data: InviteRequest): Promise<BulkInviteResponse> => {
    const response = await apiClient.post<BulkInviteResponse>("/team/invite", data);
    return response.data;
  },

  removeMember: async (memberId: string): Promise<void> => {
    await apiClient.delete(`/team/${memberId}`);
  },

  updateMemberRole: async (
    memberId: string,
    role: WorkspaceRole
  ): Promise<UpdateRoleResponse> => {
    const response = await apiClient.post<UpdateRoleResponse>(
      `/team/update_role/${memberId}`,
      null,
      { params: { new_role: role } }
    );
    return response.data;
  },

  acceptInvite: async (data: AcceptInviteRequest): Promise<void> => {
    await apiClient.post("/team/invite/accept", data);
  },
};
