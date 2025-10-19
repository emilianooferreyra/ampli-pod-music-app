import { Router } from "express";
import { audioFileParser } from "@/middleware/fileParser";
import {
  createAudio,
  getLatestUploads,
  updateAudio,
} from "@/controllers/audio";
import { isVerified, requireAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validator";
import { AudioValidationSchema } from "@/utils/validation-schema";

const router = Router();

router.post(
  "/create",
  requireAuth,
  isVerified,
  audioFileParser,
  validate(AudioValidationSchema),
  createAudio
);
router.patch(
  "/:audioId",
  requireAuth,
  isVerified,
  audioFileParser,
  validate(AudioValidationSchema),
  updateAudio
);
router.get("/latest", getLatestUploads);

export default router;
