import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

interface Schemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

export const validate =
  (schemas: Schemas) => (req: Request, res: Response, next: NextFunction) => {
    if (schemas.body) req.body = schemas.body.parse(req.body);
    if (schemas.params) req.params = schemas.params.parse(req.params) as typeof req.params;
    if (schemas.query) req.query = schemas.query.parse(req.query) as typeof req.query;
    next();
  };
