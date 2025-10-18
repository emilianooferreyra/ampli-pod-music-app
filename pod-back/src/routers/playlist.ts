import { Router } from "express";
import {
  createPlaylist,
  getAudios,
  getPlaylistByProfile,
  removePlaylist,
  updatePlaylist,
} from "@/controllers/playlist";
import { isVerified, requireAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validator";
import {
  NewPlaylistValidationSchema,
  OldPlaylistValidationSchema,
} from "@/utils/validation-schema";

const router = Router();

router.get("/by-profile", requireAuth, getPlaylistByProfile);
router.get("/:playlistId", requireAuth, getAudios);
router.post(
  "/create",
  requireAuth,
  isVerified,
  validate(NewPlaylistValidationSchema),
  createPlaylist
);
router.patch(
  "/",
  requireAuth,
  validate(OldPlaylistValidationSchema),
  updatePlaylist
);
router.delete("/", requireAuth, removePlaylist);

export default router;
