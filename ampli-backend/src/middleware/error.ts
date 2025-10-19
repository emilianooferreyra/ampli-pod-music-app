import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).json({
      error: "Conflict: A record with that value already exists.",
    });
  }

  res.status(500).json({ error: err.message || "Something went wrong!" });
};
