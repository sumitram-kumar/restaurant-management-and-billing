import { z } from "zod";

export const statsQuerySchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((value) => value.from <= value.to, {
    message: "from must be before or equal to to",
    path: ["from"],
  });
