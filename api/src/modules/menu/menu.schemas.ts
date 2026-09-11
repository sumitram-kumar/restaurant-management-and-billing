import { z } from "zod";

export const menuItemBodySchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  category: z.string().trim().min(1, "category is required"),
  halfPrice: z.coerce.number().nonnegative(),
  fullPrice: z.coerce.number().nonnegative(),
});

export const menuItemParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
