import { Request, Response } from "express";
import * as taxService from "./tax.service";

export const getCurrentTaxRate = async (_req: Request, res: Response) => {
  const rate = await taxService.getCurrentTaxRate();
  res.json(rate ?? { cgst: 0, sgst: 0, effectiveFrom: null });
};

export const createTaxRate = async (
  req: Request<unknown, unknown, { cgst: number; sgst: number }>,
  res: Response
) => {
  const rate = await taxService.createTaxRate(req.body);
  res.status(201).json(rate);
};
