import { create } from "zustand";
import type { AuthResponse, User } from "@/types/auth";

const API_URL = import.meta.env.VITE_API_URL;

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginForm {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  message: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;

  clearError: () => void;
  signup: (form: SignupForm) => Promise<AuthResponse>;
  verifyCode: (code: string) => Promise<AuthResponse>;
  login: (form: LoginForm) => Promise<AuthResponse>;
  checkAuth: () => Promise<AuthResponse | undefined>;
  logout: () => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (token: string, password: string) => Promise<AuthResponse>;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  message: null,
  isAuthenticated: false,
  isCheckingAuth: true,

  clearError: () => set({ error: null }),

  // SIGNUP
  signup: async (form) => {
    set({
      isLoading: true,
      error: null,
      message: null,
    });

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data: AuthResponse = await response.json();

      console.log("BACKEND RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      set({
        user: data.user ?? null,
        isAuthenticated: true,
        isLoading: false,
      });

      return data;
    } catch (error) {
      console.log("ERROR:", errorMessage(error));

      set({
        error: errorMessage(error),
        isLoading: false,
      });

      throw error;
    }
  },

  // VERIFY EMAIL CODE
  verifyCode: async (code) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await fetch(`${API_URL}/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code }),
      });

      const data: AuthResponse = await response.json();

      console.log("BACKEND RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      set({
        isLoading: false,
        isAuthenticated: true,
        user: data.user ?? null,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: errorMessage(error),
      });

      console.log(errorMessage(error));

      throw error;
    }
  },

  // LOGIN
  login: async (form) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data: AuthResponse = await response.json();

      console.log("BACKEND RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      set({
        isLoading: false,
        isAuthenticated: true,
        user: data.user ?? null,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: errorMessage(error),
      });

      console.log(errorMessage(error));

      throw error;
    }
  },

  // CHECK AUTH
  checkAuth: async () => {
    set({
      isCheckingAuth: true,
      error: null,
    });

    try {
      const response = await fetch(`${API_URL}/check-auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data: AuthResponse = await response.json();

      // 401 means not logged in — expected on public pages, not an error.
      // Use functional setter: if login() already set isAuthenticated:true
      // while this request was in-flight, don't overwrite it.
      if (response.status === 401) {
        set((state) =>
          state.isAuthenticated
            ? { isCheckingAuth: false }
            : { isCheckingAuth: false, isAuthenticated: false, user: null }
        );
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Authentication check failed");
      }

      if (data.user) {
        set({
          isCheckingAuth: false,
          isAuthenticated: true,
          user: data.user,
        });
      } else {
        set((state) =>
          state.isAuthenticated
            ? { isCheckingAuth: false }
            : { isCheckingAuth: false, isAuthenticated: false, user: null }
        );
      }

      return data;
    } catch (error) {
      set((state) => ({
        isCheckingAuth: false,
        ...(state.isAuthenticated ? {} : { isAuthenticated: false, user: null }),
        error: errorMessage(error),
      }));

      console.log(errorMessage(error));
    }
  },

  // LOGOUT
  logout: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data: AuthResponse = await response.json();

      console.log("BACKEND RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage(error),
      });

      console.log(errorMessage(error));

      throw error;
    }
  },

  // FORGOT PASSWORD
  forgotPassword: async (email) => {
    set({
      isLoading: true,
      error: null,
      message: null,
    });

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data: AuthResponse = await response.json();

      console.log("BACKEND RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      set({
        isLoading: false,
        message: data.message ?? null,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: errorMessage(error),
      });

      console.log(errorMessage(error));

      throw error;
    }
  },

  // RESET PASSWORD
  resetPassword: async (token, password) => {
    set({
      isLoading: true,
      error: null,
      message: null,
    });

    try {
      const response = await fetch(
        `${API_URL}/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ password }),
        }
      );

      const data: AuthResponse = await response.json();

      console.log("BACKEND RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      set({
        isLoading: false,
        message: data.message ?? null,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: errorMessage(error),
      });

      console.log(errorMessage(error));

      throw error;
    }
  },
}));
