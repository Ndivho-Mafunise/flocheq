import { useAuthStore } from "@/store/authStore";

const API_URL = import.meta.env.VITE_API_URL;

let refreshPromise: Promise<boolean> | null = null;

// refresh token is single-use, so if two requests 401 around the same time
// they need to share one refresh call instead of firing it twice
function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// drop-in replacement for fetch on protected endpoints — retries once
// after a silent refresh if the access token has expired
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const res = await fetch(url, { ...options, credentials: "include" });
  if (res.status !== 401) return res;

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    useAuthStore.setState({ isAuthenticated: false, user: null });
    return res;
  }

  return fetch(url, { ...options, credentials: "include" });
}
