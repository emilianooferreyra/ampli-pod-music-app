import { RequestHandler } from "express";
import cloudinary from "@/cloud";

export const cloudinaryHealthCheck: RequestHandler = async (req, res) => {
  try {
    const result = await cloudinary.api.ping();

    res.json({
      status: "ok",
      service: "cloudinary",
      ping: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      service: "cloudinary",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
};
