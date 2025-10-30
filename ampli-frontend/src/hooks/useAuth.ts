import type { SignInInput, SignUpInput } from "@/lib/validation/auth";
import { getClient } from "@/api/client";
import { useAuthStore, useNotificationStore } from "@/store";
import { saveToAsyncStorage, Keys } from "@/utils/asyncStorage";

export interface AuthResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export const useAuth = () => {
  const {
    setIsLoading,
    setError,
    setToken,
    setUser,
    setIsLoggedIn,
    logout,
    isLoading,
    error,
    clearError,
  } = useAuthStore();

  const { addNotification } = useNotificationStore();

  const signIn = async (data: SignInInput): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const httpClient = await getClient();

      const response = await httpClient.post("/auth/sign-in", data);
      const result = response.data;

      if (result.token) {
        await saveToAsyncStorage(Keys.AUTH_TOKEN, result.token);
        setToken(result.token);
      }

      if (result.user) {
        setUser(result.user);
      }

      setIsLoggedIn(true);
      addNotification("Iniciaste sesión correctamente", "success");

      return {
        success: true,
        message: "Iniciaste sesión correctamente",
        data: result,
      };
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Error al iniciar sesión";
      setError(message);
      addNotification(message, "error");
      return {
        success: false,
        message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpInput): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const httpClient = await getClient();
      const response = await httpClient.post("/auth/create", data);
      const result = response.data;

      if (result.user?.id) {
        await saveToAsyncStorage("PENDING_USER_ID", result.user.id);
      }

      addNotification("Cuenta creada. Por favor verifica tu email", "success");

      return {
        success: true,
        message: "Cuenta creada. Por favor verifica tu email",
        data: result,
      };
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Error al crear la cuenta";
      setError(message);
      addNotification(message, "error");
      return {
        success: false,
        message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (
    userId: string,
    token: string
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const httpClient = await getClient();
      const payload = { userId, token };
      const response = await httpClient.post("/auth/verify-email", payload);
      const result = response.data;

      addNotification("Email verificado correctamente", "success");

      return {
        success: true,
        message: "Email verificado correctamente",
        data: result,
      };
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Error al verificar el email";
      setError(message);
      addNotification(message, "error");
      return {
        success: false,
        message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      logout();
      addNotification("Sesión cerrada", "success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cerrar sesión";
      setError(message);
      addNotification(message, "error");
    }
  };

  return {
    signIn,
    signUp,
    verifyEmail,
    signOut,
    isLoading,
    error,
    clearError,
  };
};
