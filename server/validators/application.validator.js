
import { z } from "zod";

// Apply Job Validation
export const applyJobSchema = z.object({
  coverLetter: z.string()
    .trim()
    .max(2000, "Cover letter cannot exceed 2000 characters")
    .optional()
}).strict();

// Update Application Status Validation
export const updateApplicationStatusSchema = z.object({
  status: z.enum([
    "reviewing",
    "shortlisted",
    "rejected"
  ], {
    error: "Invalid application status"
  })
}).strict();
