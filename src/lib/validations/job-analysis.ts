import { z } from "zod";

export const submitJobAnalysisSchema = z.object({
  job_title: z
    .string()
    .trim()
    .min(1, "Job title is required")
    .max(500, "Job title must be 500 characters or less"),
  job_description: z
    .string()
    .trim()
    .min(20, "Job description must be at least 20 characters")
    .max(50000, "Job description must be 50,000 characters or less"),
});

export type SubmitJobAnalysisInput = z.infer<typeof submitJobAnalysisSchema>;
