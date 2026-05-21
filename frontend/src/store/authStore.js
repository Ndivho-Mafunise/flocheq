import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL;
export const useAuthStore = create((set) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user }),

  login: async (credentials) => {
    set({ loading: true });

    try {
      const res = await fetch("VITE_API_URL/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        set({ user: data.user });
        return { success: true };
      }

      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: "Something went wrong" };
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await fetch("VITE_API_URL/logout", {
      method: "POST",
      credentials: "include",
    });

    set({ user: null });
  },

  checkAuth: async () => {
    try {
      const res = await fetch("VITE_API_URL/check-auth", {
        credentials: "include",
      });

      if (!res.ok) {
        set({ user: null });
        return;
      }

      const data = await res.json();
      set({ user: data.user });
    } catch (err) {
      set({ user: null });
    }
  },
}));