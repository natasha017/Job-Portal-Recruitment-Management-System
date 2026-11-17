
import { z } from "zod";

export const updateRecruiterProfileSchema = z.object({
  phone: z.string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .optional(),

  designation: z.string()
    .trim()
    .min(2, "Designation must be at least 2 characters")
    .max(100, "Designation cannot exceed 100 characters")
    .optional(),

  bio: z.string()
    .trim()
    .max(1000, "Bio cannot exceed 1000 characters")
    .optional(),

  linkedin: z.string()
    .trim()
    .url("Please provide a valid LinkedIn URL")
    .optional(),

  website: z.string()
    .trim()
    .url("Please provide a valid website URL")
    .optional(),
})
.strict()
.refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Please provide at least one field to update",
  }
);


export default updateRecruiterProfileSchema