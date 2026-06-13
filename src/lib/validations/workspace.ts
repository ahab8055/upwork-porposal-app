import { z } from "zod";

export const workspaceExperienceSchema = z.object({
  industry: z.string().trim().min(1, "Company industry is required"),
  company_size: z.string().trim().min(1, "Company size is required"),
  skills: z
    .array(z.string().trim().min(1))
    .min(1, "Add at least one skill"),
});

export type WorkspaceExperienceInput = z.infer<typeof workspaceExperienceSchema>;

export const MAX_WORKSPACE_LOGO_BYTES = 5 * 1024 * 1024;
export const ALLOWED_WORKSPACE_LOGO_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
] as const;

export function validateWorkspaceLogo(file: File): string | null {
  if (file.size > MAX_WORKSPACE_LOGO_BYTES) {
    return "Logo must be less than 5MB";
  }

  if (!ALLOWED_WORKSPACE_LOGO_TYPES.includes(file.type as (typeof ALLOWED_WORKSPACE_LOGO_TYPES)[number])) {
    return "Only PNG, JPG, and WEBP images are allowed";
  }

  return null;
}
