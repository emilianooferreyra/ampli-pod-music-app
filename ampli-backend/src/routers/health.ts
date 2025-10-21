import { Router } from "express";
import { cloudinaryHealthCheck } from "@/controllers/health";

const router = Router();

router.get("/cloudinary", cloudinaryHealthCheck);

export default router;
