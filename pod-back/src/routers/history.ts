import { Router } from "express";
import {
  getHistories,
  getRecentlyPlayed,
  removeHistory,
  updateHistory,
} from "@/controllers/history";
import { requireAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validator";
import { UpdateHistorySchema } from "@/utils/validation-schema";

const router = Router();

router.get("/", requireAuth, getHistories);
router.get("/recently-played", requireAuth, getRecentlyPlayed);
router.post("/", requireAuth, validate(UpdateHistorySchema), updateHistory);
router.delete("/", requireAuth, removeHistory);

export default router;
