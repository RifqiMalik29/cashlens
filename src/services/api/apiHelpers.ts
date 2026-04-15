import { useAuthStore } from "@stores/useAuthStore";
import { logger } from "@utils/logger";

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
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
        await reset();
        return null;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        logger.error("API", "Refresh failed: Response is not JSON");
        await reset();
        return null;
      }

      const json = (await response.json()) as Record<string, unknown>;
      const data = (json.data as Record<string, string>) || json;

      const newAccessToken =
        data.access_token || (data as Record<string, string>).accessToken;
      const newRefreshToken =
        data.refresh_token || (data as Record<string, string>).refreshToken;

      if (!newAccessToken) {
        logger.error("API", "Refresh response missing access_token", data);
        await reset();
        return null;
      }
      setTokens(newAccessToken as string, newRefreshToken as string);
      return newAccessToken as string;
    } catch {
      await reset();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export function throwApiError(response: Response, data: unknown): never {
  if (typeof data === "object" && data !== null) {
    const err = data as Record<string, unknown>;

    if (response.status === 403 && err.requires_confirmation === true) {
      const confirmError = new Error(
        (err.message as string | undefined) ?? "Email belum dikonfirmasi"
      );
      (
        confirmError as Error & {
          requiresConfirmation: boolean;
          email?: string;
        }
      ).requiresConfirmation = true;
      (
        confirmError as Error & {
          requiresConfirmation: boolean;
          email?: string;
        }
      ).email = err.email as string | undefined;
      throw confirmError;
    }

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
  }

  throw new Error(
    `HTTP ${response.status}: ${typeof data === "string" ? data : response.statusText}`
  );
}

export function unwrapResponseData<T>(data: unknown): T {
  if (typeof data === "object" && data !== null && "data" in data) {
    return (data as { data: T }).data;
  }
  return data as T;
}
