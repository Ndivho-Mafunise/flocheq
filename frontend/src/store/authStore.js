import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create((set) => ({
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

      const data = await response.json();

      console.log("BACKEND RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return data;
    } catch (error) {
      console.log("ERROR:", error.message);

      set({
        error: error.message,
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

      const data = await response.json();

      console.log("BACKEND RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      set({
        isLoading: false,
        isAuthenticated: true,
        user: data.user,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      console.log(error.message);

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

      const data = await response.json();

      console.log("BACKEND RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      set({
        isLoading: false,
        isAuthenticated: true,
        user: data.user,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: error.message,
      });

      console.log(error.message);

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

      const data = await response.json();

      // 401 means not logged in — expected on public pages, not an error
      if (response.status === 401) {
        set({ isCheckingAuth: false, isAuthenticated: false, user: null });
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
        set({
          isCheckingAuth: false,
          isAuthenticated: false,
          user: null,
        });
      }

      return data;
    } catch (error) {
      set({
        isCheckingAuth: false,
        isAuthenticated: false,
        user: null,
        error: error.message,
      });

      console.log(error.message);
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

      const data = await response.json();

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
        error: error.message,
      });

      console.log(error.message);

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

      const data = await response.json();

      console.log("BACKEND RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      set({
        isLoading: false,
        message: data.message,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      console.log(error.message);

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

      const data = await response.json();

      console.log("BACKEND RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      set({
        isLoading: false,
        message: data.message,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      console.log(error.message);

      throw error;
    }
  },
}));