import i18n, { normalizeLanguage } from "@services/i18n";
import { getDeviceId } from "@utils/deviceId";

import { api } from "./apiClient";

export interface BackendUser {
  id: string;
  email: string;
  name?: string;
  language?: string;
  base_currency?: string;
  subscription_tier?: "free" | "premium";
  subscription_expires_at?: string | null;
  is_founder?: boolean;
  device_id?: string | null;
  trial_status?: "inactive" | "active" | "expired" | "denied";
  trial_start_at?: string | null;
  trial_end_at?: string | null;
  telegram_chat_id?: string | number;
  created_at?: string;
  updated_at?: string;
}

interface AuthData {
  access_token: string;
  refresh_token: string;
  user: BackendUser;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthData> => {
    const device_id = await getDeviceId();
    return api.post<AuthData>(
      "/api/v1/auth/login",
      { email, password, device_id },
      { isAuth: false }
    );
  },

  register: async (
    email: string,
    password: string,
    name: string,
    base_currency?: string
  ): Promise<AuthData> => {
    const device_id = await getDeviceId();
    return api.post<AuthData>(
      "/api/v1/auth/register",
      {
        email,
        password,
        name,
        language: normalizeLanguage(i18n.language),
        base_currency: base_currency ?? "IDR",
        device_id
      },
      { isAuth: false }
    );
  },

  confirmEmail: async (email: string, otp: string): Promise<void> => {
    await api.post("/api/v1/auth/confirm", { email, otp }, { isAuth: false });
  },

  resendConfirmation: async (email: string): Promise<void> => {
    await api.post(
      "/api/v1/auth/resend-confirmation",
      { email },
      { isAuth: false }
    );
  },

  updateLanguage: async (language: string): Promise<void> => {
    await api.patch("/api/v1/auth/language", { language });
  },

  updatePushToken: async (pushToken: string): Promise<void> => {
    await api.patch("/api/v1/auth/push-token", { push_token: pushToken });
  },

  logout: async (): Promise<void> => {
    return api.post("/api/v1/auth/logout");
  },

  getMe: async (): Promise<BackendUser> => {
    return await api.get<BackendUser>("/api/v1/auth/me");
  },

  getTelegramStatus: async (): Promise<{
    is_linked: boolean;
    chat_id?: number;
  }> => {
    return await api.get<{ is_linked: boolean; chat_id?: number }>(
      "/api/v1/auth/telegram/status"
    );
  },

  unlinkTelegram: async (): Promise<void> => {
    await api.delete("/api/v1/auth/telegram/status");
  },

  loginWithGoogle: async (idToken: string): Promise<AuthData> => {
    const device_id = await getDeviceId();
    return api.post<AuthData>(
      "/api/v1/auth/google",
      { id_token: idToken, device_id },
      { isAuth: false }
    );
  },

  deleteAccount: async (): Promise<void> => {
    await api.delete("/api/v1/auth/me");
  }
};
