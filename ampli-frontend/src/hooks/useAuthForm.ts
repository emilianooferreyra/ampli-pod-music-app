import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SignInInput, SignUpInput } from "@/lib/validation/auth";
import { signInSchema, signUpSchema } from "@/lib/validation/auth";

export const useSignInForm = () => {
  return useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });
};

export const useSignUpForm = () => {
  return useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });
};
