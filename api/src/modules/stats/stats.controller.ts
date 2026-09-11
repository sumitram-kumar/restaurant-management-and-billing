import { Request, Response } from "express";
import * as statsService from "./stats.service";

export const getStats = async (
  req: Request<unknown, unknown, unknown, { from: Date; to: Date }>,
  res: Response
) => {
  const { from, to } = req.query;

  const [salesByItem, periodTotals] = await Promise.all([
    statsService.getSalesByItem(from, to),
    statsService.getPeriodTotals(from, to),
  ]);

  res.json({
    salesByItem: salesByItem.map((row) => ({
      foodName: row.foodNameSnapshot,
      totalSales: row._sum.amount,
    })),
    totals: periodTotals._sum,
  });
};
