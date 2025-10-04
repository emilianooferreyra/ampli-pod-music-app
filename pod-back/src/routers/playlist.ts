import { Router } from "express";
import {
  createPlaylist,
  getAudios,
  getPlaylistByProfile,
  removePlaylist,
  updatePlaylist,
} from "@/controllers/playlist";
import { isVerified, mustAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validator";
import {
  NewPlaylistValidationSchema,
  OldPlaylistValidationSchema,
} from "@/utils/validationSchema";

const router = Router();

router.get("/by-profile", mustAuth, getPlaylistByProfile);
router.get("/:playlistId", mustAuth, getAudios);
router.post(
  "/create",
  mustAuth,
  isVerified,
  validate(NewPlaylistValidationSchema),
  createPlaylist
);
router.patch(
  "/",
  mustAuth,
  validate(OldPlaylistValidationSchema),
  updatePlaylist
);
router.delete("/", mustAuth, removePlaylist);

export default router;
