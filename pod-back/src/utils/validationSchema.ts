import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { categories } from "./audio-category";

export const CreateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name is too short!")
    .max(20, "Name is too long!"),
  email: z.string().email("Invalid email id!"),
  password: z
    .string()
    .trim()
    .min(8, "Password is too short!")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password is too simple!"
    ),
});

export const TokenAndIDValidation = z.object({
  token: z.string().trim(),
  userId: z.string().refine((val) => isValidObjectId(val), {
    message: "Invalid userId!",
  }),
});

export const UpdatePasswordSchema = z.object({
  token: z.string().trim(),
  userId: z.string().refine((val) => isValidObjectId(val), {
    message: "Invalid userId!",
  }),
  password: z
    .string()
    .trim()
    .min(8, "Password is too short!")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password is too simple!"
    ),
});

export const SignInValidationSchema = z.object({
  email: z.string().email("Invalid email id!"),
  password: z.string().trim(),
});

export const AudioValidationSchema = z.object({
  title: z.string(),
  about: z.string(),
  category: z.enum(categories, {
    errorMap: () => ({ message: "Invalid category!" }),
  }),
});

export const NewPlaylistValidationSchema = z.object({
  title: z.string(),
  resId: z.string().refine((val) => isValidObjectId(val), {
    message: "Invalid resource id!",
  }).optional(),
  visibility: z.enum(["public", "private"], {
    errorMap: () => ({ message: "Visibility must be public or private!" }),
  }),
});

export const OldPlaylistValidationSchema = z.object({
  title: z.string(),
  item: z.string().refine((val) => isValidObjectId(val), {
    message: "Invalid audio id!",
  }),
  id: z.string().refine((val) => isValidObjectId(val), {
    message: "Invalid playlist id!",
  }),
  visibility: z.enum(["public", "private"], {
    errorMap: () => ({ message: "Visibility must be public or private!" }),
  }).optional(),
});

export const UpdateHistorySchema = z.object({
  audio: z.string().refine((val) => isValidObjectId(val), {
    message: "Invalid audio id!",
  }),
  progress: z.number(),
  date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Invalid date!",
  }),
});