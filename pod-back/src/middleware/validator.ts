import { RequestHandler } from "express";
import { ZodObject, ZodError } from "zod";

export const validate =
  (schema: ZodObject): RequestHandler =>
  (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Zod validation error:", error);
        res.status(422).json({
          error: error.message,
        });
      }
    }
  };
