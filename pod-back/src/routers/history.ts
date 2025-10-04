import { Router } from "express";
import {
  getHistories,
  getRecentlyPlayed,
  removeHistory,
  updateHistory,
} from "@/controllers/history";
import { mustAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validator";
import { UpdateHistorySchema } from "@/utils/validationSchema";

const router = Router();

router.get("/", mustAuth, getHistories);
router.get("/recently-played", mustAuth, getRecentlyPlayed);
router.post("/", mustAuth, validate(UpdateHistorySchema), updateHistory);
router.delete("/", mustAuth, removeHistory);

export default router;
