export type TeamRole = "admin" | "bd" | "viewer";
export type MemberStatus = "active" | "pending";

export interface TeamMember {
  member_id: number;
  name: string;
  email: string;
  role: TeamRole;
  status: MemberStatus;
  is_owner: boolean;
  created_at: string;
  updated_at?: string;
}

export interface InviteRequest {
  email: string;
  role: TeamRole;
}

export interface InviteResponse {
  invite_code: string;
  invite_email: string;
  workspace_name: string;
  role: TeamRole;
}

export interface InviteDetails {
  email: string;
  workspace: string;
  role: TeamRole;
}
