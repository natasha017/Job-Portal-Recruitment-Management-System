import { z } from "zod";

const rejectCompanySchema = z.object({
  reason: z.string()
    .trim()
    .min(5, "Rejection reason must be at least 5 characters")
    .max(500, "Rejection reason cannot exceed 500 characters")
}).strict();

export default rejectCompanySchema;