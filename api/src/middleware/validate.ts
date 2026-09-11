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
    if (schemas.params) {
      Object.assign(req.params, schemas.params.parse(req.params));
    }
    if (schemas.query) {
      Object.assign(req.query, schemas.query.parse(req.query));
    }
    next();
  };
