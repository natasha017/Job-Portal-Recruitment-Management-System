
import { z } from "zod";

// Block / Unblock User Validation
export const updateUserStatusSchema = z.object({
  isBlocked: z.boolean({
    error: "isBlocked must be true or false"
  })
}).strict();
