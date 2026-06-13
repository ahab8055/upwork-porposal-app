import { z } from "zod";

export const teamInviteSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((value) => value.toLowerCase()),
});

export type TeamInviteInput = z.infer<typeof teamInviteSchema>;

export function validateTeamInvite(
  name: string,
  email: string
):
  | { success: true; data: TeamInviteInput }
  | { success: false; error: string } {
  const result = teamInviteSchema.safeParse({ name, email });

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    error: result.error.issues[0]?.message ?? "Invalid input",
  };
}
