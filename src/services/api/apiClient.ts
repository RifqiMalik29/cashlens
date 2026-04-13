import * as Sentry from "@sentry/react-native";
import i18n from "@services/i18n";
import { useAuthStore } from "@stores/useAuthStore";
import { logger } from "@utils/logger";

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!BASE_URL) {
  logger.warn(
    "API",
    "WARNING: EXPO_PUBLIC_BACKEND_URL is missing in .env.local!"
  );
}

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method?: RequestMethod;
  body?: unknown;
  headers?: Record<string, string>;
  isAuth?: boolean;
}

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    const { refreshToken, setTokens, reset } = useAuthStore.getState();
    if (!refreshToken) {
      reset();
      return null;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      if (!response.ok) {
        logger.error("API", `Refresh failed: HTTP ${response.status}`);
        reset();
        return null;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        logger.error("API", "Refresh failed: Response is not JSON");
        reset();
        return null;
      }

      const json = (await response.json()) as Record<string, unknown>;
      const data = (json.data as Record<string, string>) || json;

      const newAccessToken =
        data.access_token || data.accessToken || data.token;
      const newRefreshToken = data.refresh_token || data.refreshToken;

      if (!newAccessToken) {
        logger.error("API", "Refresh response missing access_token", data);
        reset();
        return null;
      }
      setTokens(newAccessToken as string, newRefreshToken as string);
      return newAccessToken as string;
    } catch {
      reset();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function executeRequest<T>(
  endpoint: string,
  options: RequestOptions,
  accessToken: string | null
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;
  const url = `${BASE_URL}${endpoint}`;
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Language": i18n.language || "id",
    ...headers
  };

  if (accessToken) {
    requestHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  logger.debug("API", `${method} ${url}`);

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  const contentType = response.headers.get("content-type");
  let data: unknown;

  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    if (typeof data === "object" && data !== null) {
      const err = data as Record<string, unknown>;
      const details = err.details;
      if (details && typeof details === "object") {
        const firstDetail = Object.values(details as Record<string, string>)[0];
        if (firstDetail) throw new Error(firstDetail);
      }
      throw new Error(
        (err.message as string) ||
          (err.error as string) ||
          `HTTP ${response.status}: ${response.statusText}`
      );
    } else {
      throw new Error(
        `HTTP ${response.status}: ${typeof data === "string" ? data : response.statusText}`
      );
    }
  }

  return data as T;
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { isAuth = true } = options;

  if (!BASE_URL) {
    throw new Error("EXPO_PUBLIC_BACKEND_URL is not set");
  }

  const { accessToken } = useAuthStore.getState();

  try {
    return await executeRequest<T>(
      endpoint,
      options,
      isAuth ? accessToken : null
    );
  } catch (error) {
    const message = (error as Error).message;
    if (
      isAuth &&
      (message.startsWith("HTTP 401") ||
        message === "Unauthorized" ||
        message === "unauthorized")
    ) {
      logger.debug("API", "Access token expired, attempting refresh...");
      const newToken = await refreshAccessToken();
      if (!newToken) {
        logger.error("API", "Token refresh failed, user logged out");
        throw new Error("Sesi berakhir. Silakan login kembali.");
      }
      return await executeRequest<T>(endpoint, options, newToken);
    }

    // Suppress 404 logs for polling endpoints like telegram status
    if (!(endpoint.includes("/telegram/status") && message.includes("404"))) {
      logger.error(
        "API",
        `Error in ${options.method ?? "GET"} ${endpoint}:`,
        error as Error
      );
      Sentry.captureException(error, {
        tags: {
          endpoint,
          method: options.method ?? "GET"
        }
      });
    }
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, "method">) =>
    request<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(endpoint, { ...options, method: "POST", body }),
  put: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(endpoint, { ...options, method: "PUT", body }),
  delete: <T>(endpoint: string, options?: Omit<RequestOptions, "method">) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
  patch: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(endpoint, { ...options, method: "PATCH", body })
};
