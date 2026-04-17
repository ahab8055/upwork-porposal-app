export type TeamRole = "admin" | "bd" | "viewer";
export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";
export type MemberStatus = "active" | "pending" | "inactive";

export interface TeamMember {
  member_id: string;
  user_id: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  status: MemberStatus;
  is_owner: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InviteEntry {
  name: string;
  email: string;
  role?: WorkspaceRole;
}

export interface InviteRequest {
  members: InviteEntry[];
}

export interface InviteResponse {
  member_id: string;
  invite_code: string;
  invite_email: string;
  workspace_name: string;
}

export interface InviteDetails {
  email: string;
  workspace_name: string;
  invited_by: string;
  role: WorkspaceRole;
}
