import { prisma } from "../../lib/prisma";

export const getCurrentTaxRate = () =>
  prisma.taxRate.findFirst({ orderBy: { effectiveFrom: "desc" } });

export const createTaxRate = (data: { cgst: number; sgst: number }) =>
  prisma.taxRate.create({ data });
