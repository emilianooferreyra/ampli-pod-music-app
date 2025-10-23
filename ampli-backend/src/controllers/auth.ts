import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { CreateUser, VerifyEmailRequest } from "@/types/user";
import { formatProfile, generateToken } from "@/utils/helper";
import {
  sendForgetPasswordLink,
  sendPassResetSuccessEmail,
  sendVerificationMail,
} from "@/utils/mail";
import { JWT_SECRET, PASSWORD_RESET_LINK } from "@/utils/variables";
import EmailVerificationToken from "@/models/emailVerificationToken";
import PasswordResetToken from "@/models/passwordResetToken";
import cloudinary from "@/cloud";
import User from "@/models/user";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res.status(403).json({ error: "Email is already in use!" });
  }

  const user = await User.create({ name, email, password });

  const token = generateToken();
  await EmailVerificationToken.create({
    owner: user._id,
    token,
  });

  await sendVerificationMail(token, {
    name,
    email,
    userId: user._id.toString(),
  });

  res.status(201).json({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token!" });

  const matched = await verificationToken.compareToken(token);
  if (!matched) return res.status(403).json({ error: "Invalid token!" });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });
  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Your email is verified." });
};

export const sendReVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }

  if (user.verified) {
    return res.status(422).json({ error: "Your account is already verified!" });
  }

  await EmailVerificationToken.findOneAndDelete({
    owner: userId,
  });

  const token = generateToken();

  await EmailVerificationToken.create({
    owner: userId,
    token,
  });

  await sendVerificationMail(token, {
    name: user.name,
    email: user.email,
    userId: user._id.toString(),
  });

  res.json({ message: "Please check your mail." });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    if (!user.verified) {
      return res.json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    await PasswordResetToken.findOneAndDelete({
      owner: user._id,
    });

    const token = crypto.randomBytes(36).toString("hex");

    await PasswordResetToken.create({
      owner: user._id,
      token,
    });

    const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

    await sendForgetPasswordLink({ email: user.email, link: resetLink });

    res.json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("[ERROR] Error in generateForgetPasswordLink:", error);
    res.json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  }
};

export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Unauthorized access!" });

  const matched = await user.comparePassword(password);
  if (matched)
    return res
      .status(422)
      .json({ error: "The new password must be different!" });

  user.password = password;
  await user.save();
  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  await sendPassResetSuccessEmail(user.name, user.email);
  res.json({ message: "Password reset successfully." });
};

export const signIn: RequestHandler = async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({
    email,
  });

  if (!user) return res.status(403).json({ error: "Email/Password mismatch!" });

  const matched = await user.comparePassword(password);

  if (!matched)
    return res.status(403).json({ error: "Email/Password mismatch!" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  user.tokens.push(token);

  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    },
    token,
  });
};

export const updateProfile: RequestHandler = async (req, res) => {
  const { name } = req.body;
  const avatar = req.file;

  const user = await User.findById(req.user.id);
  if (!user) throw new Error("something went wrong, user not found!");

  if (typeof name !== "string")
    return res.status(422).json({ error: "Invalid name!" });

  if (name.trim().length < 3)
    return res.status(422).json({ error: "Invalid name!" });

  user.name = name;

  if (avatar) {
    try {
      // Delete old avatar if exists
      if (user.avatar?.publicId) {
        await cloudinary.uploader.destroy(user.avatar.publicId);
      }

      const b64 = Buffer.from(avatar.buffer).toString("base64");
      const dataURI = "data:" + avatar.mimetype + ";base64," + b64;

      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      });

      user.avatar = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    } catch (error) {
      return res.status(500).json({
        error: "Failed to upload avatar to cloud storage",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  await user.save();

  res.json({ profile: formatProfile(user) });
};

export const sendProfile: RequestHandler = (req, res) => {
  res.json({ profile: req.user });
};

export const logOut: RequestHandler = async (req, res) => {
  const { fromAll } = req.query;

  const token = req.token;
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }

  const logoutFromAll = fromAll === "yes";

  if (logoutFromAll) {
    user.tokens = [];
  } else {
    user.tokens = user.tokens.filter((t) => t !== token);
  }

  await user.save();

  res.json({
    success: true,
    message: logoutFromAll
      ? "Logged out from all devices"
      : "Logged out successfully",
  });
};
