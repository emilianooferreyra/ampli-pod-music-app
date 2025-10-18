import { Router } from "express";
import {
  getFavorites,
  getIsFavorite,
  toggleFavorite,
} from "@/controllers/favorite";
import { isVerified, requireAuth } from "@/middleware/auth";

const router = Router();

router.post("/", requireAuth, isVerified, toggleFavorite);
router.get("/", requireAuth, getFavorites);
router.get("/is-fav", requireAuth, getIsFavorite);

export default router;
