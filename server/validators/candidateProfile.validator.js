
import { z } from "zod";

const candidateProfileSchema = z.object({
  phone: z.string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number")
    .optional(),

  location: z.string()
    .trim()
    .max(150, "Location cannot exceed 150 characters")
    .optional(),

  headline: z.string()
    .trim()
    .max(150, "Headline cannot exceed 150 characters")
    .optional(),

  skills: z.array(
    z.string().trim().min(1, "Skill cannot be empty")
  ).optional()
}).strict();

export const updateCandidateProfileSchema = candidateProfileSchema.refine(
  data => Object.keys(data).length > 0,
  {
    message: "Please provide at least one field to update"
  }
);

export default updateCandidateProfileSchema;
