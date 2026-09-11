import { Request, Response } from "express";
import * as taxService from "./tax.service";

export const getCurrentTaxRate = async (_req: Request, res: Response) => {
  const rate = await taxService.getCurrentTaxRate();
  res.json(rate ?? { cgst: 0, sgst: 0, effectiveFrom: null });
};

export const createTaxRate = async (req: Request, res: Response) => {
  const { cgst, sgst } = req.body;
  const rate = await taxService.createTaxRate({
    cgst: Number(cgst),
    sgst: Number(sgst),
  });
  res.status(201).json(rate);
};
