import { z } from "zod";
import { PaymentMode, QuantityType } from "@prisma/client";

// Deliberately no price/amount fields here: those are looked up and
// computed server-side (see bills.service.ts), never accepted from a client.
export const createBillBodySchema = z.object({
  paymentMode: z.enum(PaymentMode),
  discountPercent: z.coerce.number().min(0).max(100),
  lines: z
    .array(
      z.object({
        menuItemId: z.coerce.number().int().positive(),
        quantityType: z.enum(QuantityType),
        quantity: z.coerce.number().int().positive(),
      })
    )
    .min(1, "A bill needs at least one line item"),
});
