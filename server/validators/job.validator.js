
import { z } from "zod";

// Create Job Validation
export const createJobSchema = z.object({
  company: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Company ID"),

  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description cannot exceed 5000 characters"),

  category: z
    .string()
    .trim()
    .min(2, "Category is required"),

  location: z
    .string()
    .trim()
    .min(2, "Location is required"),

  jobType: z.enum([
    "full-time",
    "part-time",
    "internship",
    "contract",
    "remote"
  ]),

  experience: z
    .string()
    .trim()
    .min(1, "Experience is required"),

  salary: z.object({
    min: z.number().min(0, "Minimum salary cannot be negative"),
    max: z.number().min(0, "Maximum salary cannot be negative")
  }).refine(
    data => data.max >= data.min,
    {
      message: "Maximum salary must be greater than or equal to minimum salary"
    }
  ),

  skills: z
    .array(z.string().trim().min(1))
    .optional(),

  vacancies: z
    .number()
    .int()
    .min(1, "At least one vacancy is required")
    .default(1),

  deadline: z.coerce.date()
}).strict();


// Update Job Validation
export const updateJobSchema = z.object({
  title: z.string().trim().min(3).max(100).optional(),

  description: z.string().trim().min(20).max(5000).optional(),

  category: z.string().trim().min(2).optional(),

  location: z.string().trim().min(2).optional(),

  jobType: z.enum([
    "full-time",
    "part-time",
    "internship",
    "contract",
    "remote"
  ]).optional(),

  experience: z.string().trim().min(1).optional(),

  salary: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional()
  }).refine(
    data => Object.keys(data).length > 0,
    {
      message: "Provide minimum or maximum salary"
    }
  ).optional(),

  skills: z.array(z.string().trim().min(1)).optional(),

  vacancies: z.number().int().min(1).optional(),

  deadline: z.coerce.date().optional()
}).strict().refine(
  data => Object.keys(data).length > 0,
  {
    message: "Please provide at least one field to update"
  }
);
