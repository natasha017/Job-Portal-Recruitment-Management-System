
import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().trim().min(2, "Company name is required").max(100),
  industry: z.string().trim().min(2, "Industry is required"),
  description: z.string().trim().max(2000).optional(),
  website: z.string().trim().url("Invalid website URL").optional(),
  location: z.string().trim().optional()
}).strict();

export const updateCompanySchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  industry: z.string().trim().min(2).optional(),
  description: z.string().trim().max(2000).optional(),
  website: z.string().trim().url("Invalid website URL").optional(),
  location: z.string().trim().optional()
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Please provide at least one field to update" }
);
