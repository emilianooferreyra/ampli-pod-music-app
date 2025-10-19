import { Router } from "express";
import fileParser from "@/middleware/fileParser";
import {
  create,
  generateForgetPasswordLink,
  grantValid,
  logOut,
  sendProfile,
  sendReVerificationToken,
  signIn,
  updatePassword,
  updateProfile,
  verifyEmail,
} from "@/controllers/auth";
import { isValidPassResetToken, requireAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validator";
import {
  CreateUserSchema,
  SignInValidationSchema,
  TokenAndIDValidation,
  UpdatePasswordSchema,
  ReVerifyEmailSchema,
  ForgetPasswordSchema,
} from "@/utils/validation-schema";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail);
router.post(
  "/re-verify-email",
  validate(ReVerifyEmailSchema),
  sendReVerificationToken
);
router.post(
  "/forget-password",
  validate(ForgetPasswordSchema),
  generateForgetPasswordLink
);
router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIDValidation),
  isValidPassResetToken,
  grantValid
);
router.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPassResetToken,
  updatePassword
);
router.post("/sign-in", validate(SignInValidationSchema), signIn);
router.get("/is-auth", requireAuth, sendProfile);

router.post("/update-profile", requireAuth, fileParser, updateProfile);
router.post("/log-out", requireAuth, logOut);

export default router;
