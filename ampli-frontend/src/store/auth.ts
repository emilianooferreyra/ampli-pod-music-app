import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isLoggedIn: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),

      logout: () =>
        set({
          user: null,
          token: null,
          isLoggedIn: false,
          error: null,
        }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-store",
      storage: {
        getItem: async (name) => {
          try {
            const value = await AsyncStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch {
            return null;
          }
        },
        setItem: async (name, value) => {
          try {
            await AsyncStorage.setItem(name, JSON.stringify(value));
          } catch {
            // Error handling if needed
          }
        },
        removeItem: async (name) => {
          try {
            await AsyncStorage.removeItem(name);
          } catch {
            // Error handling if needed
          }
        },
      },
    }
  )
);
