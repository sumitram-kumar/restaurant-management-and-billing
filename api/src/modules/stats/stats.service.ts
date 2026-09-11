import { prisma } from "../../lib/prisma";

export const getSalesByItem = (from: Date, to: Date) =>
  prisma.billLineItem.groupBy({
    by: ["foodNameSnapshot"],
    where: { bill: { billDate: { gte: from, lte: to } } },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });

export const getPeriodTotals = (from: Date, to: Date) =>
  prisma.bill.aggregate({
    where: { billDate: { gte: from, lte: to } },
    _sum: {
      subtotal: true,
      discountAmount: true,
      taxAmount: true,
      finalAmount: true,
    },
  });
