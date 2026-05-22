import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true,

  signup: async (form) => {
    // start loading and clear previous errors
    set({
      isLoading: true,
      error: null,
    });

    try {
      // send request to backend
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(form),
      });

      // convert response to JSON
      const data = await response.json();
      console.log("BACKEND RESPONSE:", data);

      // log backend response

      // if request failed
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // update store if signup succeeds
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (error) {
      // log error
      console.log("ERROR:", error.message);

      // update store with error
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  verifyCode: async (code) => {
    set({ isLoading: true, error: null });
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
      set({ isLoading: false, isAuthenticated: true, user: data.user });

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.log(error.message);
      throw error;
    }
  },
  login: async (form) => {
    set({ isLoading: true, error: null });
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

      set({ isLoading: false, isAuthenticated: true, user: data.user });
      return data;
    } catch (error) {
      set({ isLoading: false, isAuthenticated: false, user: data.user });
      console.log(error.message);
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await fetch(`${API_URL}/check-auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      console.log("BACKEND RESPONSE:", data);
      if (data.user) {
        set({ isCheckingAuth: false, isAuthenticated: true, user: data.user });
      } else {
        set({ isCheckingAuth: false, isAuthenticated: false, user: null });
      }
      return data;
    } catch (error) {
      set({ isCheckingAuth: false, isAuthenticated: false, user: null });
      console.log(error);
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
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
      console.log(data);
      set({ isLoading: false, message: data.message });
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  },
  resetPassword: async (token, formData) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await fetch(`${API_URL}/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      set({ isLoading: false, message: data.message });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.log(error);
      throw error;
    }
  },
}));
