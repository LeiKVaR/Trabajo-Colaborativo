import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, Role } from "@/types/auth.types";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  _hasHydrated: boolean; // Flag para saber si ya se cargó del localStorage
  setUser: (user: AuthUser, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      _hasHydrated: false,

      setUser: (user, accessToken) => set({ user, accessToken }),

      logout: () => {
        set({ user: null, accessToken: null });
        localStorage.removeItem("asistly.auth"); // Limpieza explícita
      },

      setLoading: (isLoading) => set({ isLoading }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "asistly.auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);

// Helpers
export const useUser = () => useAuthStore((s) => s.user);
export const useRole = (): Role | null => useAuthStore((s) => s.user?.role ?? null);
export const useIsAdmin = () => useAuthStore((s) => s.user?.role === "ADMIN");
export const useIsEmployee = () => useAuthStore((s) => s.user?.role === "EMPLOYEE");
export const useAccessToken = () => useAuthStore((s) => s.accessToken);