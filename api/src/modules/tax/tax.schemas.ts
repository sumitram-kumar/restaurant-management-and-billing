import { z } from "zod";

// The original app claimed (in a commit message) that tax validation had
// moved from the frontend to the backend, but the backend never actually
// checked anything. These bounds are what was missing.
export const taxRateBodySchema = z.object({
  cgst: z.coerce.number().min(0).max(100),
  sgst: z.coerce.number().min(0).max(100),
});
