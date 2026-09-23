import axios from "axios";

export const PRIMARY_API =
  import.meta.env.VITE_API_BASE_URL || "http://13.202.151.45/api/v1";
export const FALLBACK_API =
  import.meta.env.VITE_FALLBACK_API_BASE_URL ||
  "https://smablog.fastapicloud.dev/api/v1";

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
  // Catches browser Mixed-Content blocks, offline, server down, timeouts (no response)
  if (!error.response) return true;
  // Catches 5xx server errors
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

    // 1. Retry with fallback URL if primary fails (e.g. Mixed Content block, server down, 5xx)
    if (
      isNetworkOrServerError(error) &&
      !original._fallbackRetry &&
      currentBaseURL !== FALLBACK_API
    ) {
      console.warn(
        `Primary API failed (${error.message || "Network Error"}). Retrying with fallback: ${FALLBACK_API}`
      );
      original._fallbackRetry = true;
      const previousBase = currentBaseURL;
      currentBaseURL = FALLBACK_API;
      client.defaults.baseURL = FALLBACK_API;
      original.baseURL = FALLBACK_API;

      // In case original.url had an absolute path prepended
      if (original.url && original.url.startsWith("http") && previousBase) {
        original.url = original.url.replace(previousBase, FALLBACK_API);
      }

      return client(original);
    }

    // 2. Handle 401 Unauthorized token refresh
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
