import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(1, "El email es requerido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .min(1, "La contraseña es requerida"),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .min(1, "El nombre es requerido"),
    email: z
      .string()
      .email("Email inválido")
      .min(1, "El email es requerido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .min(1, "La contraseña es requerida"),
    confirmPassword: z
      .string()
      .min(1, "Debe confirmar la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
