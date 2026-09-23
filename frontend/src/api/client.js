import axios from "axios";

// Helper to normalize URLs (handles missing trailing slashes or missing /api/v1)
const normalizeUrl = (url) => {
  if (!url) return "";
  const cleaned = url.replace(/\/+$/, "");
  return cleaned.endsWith("/api/v1") ? cleaned : `${cleaned}/api/v1`;
};

export const PRIMARY_API = normalizeUrl(
  import.meta.env.VITE_API_BASE_URL || "http://3.109.157.65"
);

export const FALLBACK_API = normalizeUrl(
  import.meta.env.VITE_FALLBACK_API_BASE_URL ||
    "https://smablog.fastapicloud.dev/api/v1"
);

let currentBaseURL = PRIMARY_API;

const client = axios.create({
  baseURL: currentBaseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const isNetworkOrServerError = (error) => {
  // Network errors, server down, timeouts, or mixed-content blocking
  if (!error.response) return true;
  // 5xx server errors
  if (error.response.status >= 500) return true;
  return false;
};

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!original) {
      return Promise.reject(error);
    }

    // 1. Automatic failover to fallback URL on network or server errors
    if (
      isNetworkOrServerError(error) &&
      !original._fallbackRetry &&
      currentBaseURL !== FALLBACK_API
    ) {
      console.warn(
        `Primary API (${currentBaseURL}) failed. Retrying with fallback: ${FALLBACK_API}`
      );
      original._fallbackRetry = true;
      currentBaseURL = FALLBACK_API;
      client.defaults.baseURL = FALLBACK_API;
      original.baseURL = FALLBACK_API;
      return client(original);
    }

    // 2. Handle 401 Unauthorized with token refresh
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          let refreshResponse;
          try {
            refreshResponse = await axios.post(
              `${currentBaseURL}/auth/refresh`,
              { refresh_token: refreshToken },
              { timeout: 10000 }
            );
          } catch (refreshErr) {
            if (
              isNetworkOrServerError(refreshErr) &&
              currentBaseURL !== FALLBACK_API
            ) {
              currentBaseURL = FALLBACK_API;
              client.defaults.baseURL = FALLBACK_API;
              refreshResponse = await axios.post(
                `${FALLBACK_API}/auth/refresh`,
                { refresh_token: refreshToken },
                { timeout: 10000 }
              );
            } else {
              throw refreshErr;
            }
          }

          const { data } = refreshResponse;
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          original.headers.Authorization = `Bearer ${data.access_token}`;
          return client(original);
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default client;
