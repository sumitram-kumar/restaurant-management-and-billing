import { Request, Response } from "express";
import * as statsService from "./stats.service";

export const getStats = async (req: Request, res: Response) => {
  const from = new Date(String(req.query.from));
  const to = new Date(String(req.query.to));

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
